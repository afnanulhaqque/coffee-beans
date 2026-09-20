import os
from flask import Flask, send_from_directory, render_template, jsonify, request
from config import Config
from app.extensions import db, migrate, jwt, cors

def create_app(config_class=Config):
    # Determine dist folder for serving React Frontend
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.abspath(os.path.join(base_dir, '..', '..', 'dist'))
    if not os.path.exists(dist_dir):
        dist_dir = os.path.abspath(os.path.join(base_dir, '..', 'dist'))

    assets_dir = os.path.join(dist_dir, 'assets')

    # Initialize Flask with Jinja2 template caching & static asset delivery
    app = Flask(
        __name__,
        template_folder=dist_dir,
        static_folder=assets_dir if os.path.exists(assets_dir) else None,
        static_url_path='/assets'
    )
    app.config.from_object(config_class)

    # Jinja2 Performance Optimization: enable template caching and bytecode compilation
    app.jinja_env.auto_reload = False
    app.jinja_env.cache = {}
    app.jinja_env.trim_blocks = True
    app.jinja_env.lstrip_blocks = True

    # Ensure upload directory exists (safe for read-only / serverless environments)
    try:
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'products'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'categories'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'banners'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'stores'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'cafe'), exist_ok=True)
    except OSError:
        pass

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}, r"/uploads/*": {"origins": "*"}})

    # Performance & Cache-Control Headers Middleware
    @app.after_request
    def add_performance_headers(response):
        path = request.path
        if path.startswith('/assets/'):
            # 1-year immutable caching for fingerprinted static assets
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        elif path.startswith('/api/'):
            # Prevent stale JSON responses for dynamic API requests
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        elif path.startswith('/uploads/'):
            # Cache uploaded images for 1 week
            response.headers['Cache-Control'] = 'public, max-age=604800'
        else:
            # HTML SPA shell: fast validation cache
            response.headers['Cache-Control'] = 'public, max-age=0, must-revalidate'

        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    # JWT Error Handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({'error': 'Missing or invalid authentication token'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Authentication token has expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({'error': 'Invalid token verification'}), 401

    # Serve static uploaded media files
    @app.route('/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.categories import categories_bp
    from app.routes.orders import orders_bp
    from app.routes.admin import admin_bp
    from app.routes.stores import stores_bp
    from app.routes.banners import banners_bp
    from app.routes.cafe_menu import cafe_bp
    from app.routes.settings import settings_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(stores_bp)
    app.register_blueprint(banners_bp)
    app.register_blueprint(cafe_bp)
    app.register_blueprint(settings_bp)

    # Also register with alternative prefixes in case Vercel rewrites strip /api
    app.register_blueprint(auth_bp, name='auth_alt', url_prefix='/auth')
    app.register_blueprint(products_bp, name='products_alt', url_prefix='')
    app.register_blueprint(categories_bp, name='categories_alt', url_prefix='/categories')
    app.register_blueprint(orders_bp, name='orders_alt', url_prefix='/orders')
    app.register_blueprint(admin_bp, name='admin_alt', url_prefix='/admin')
    app.register_blueprint(stores_bp, name='stores_alt', url_prefix='/stores')
    app.register_blueprint(banners_bp, name='banners_alt', url_prefix='/banners')
    app.register_blueprint(cafe_bp, name='cafe_alt', url_prefix='/cafe-menu')
    app.register_blueprint(settings_bp, name='settings_alt', url_prefix='/settings')

    # Health check endpoint (matches both /api/health and /health)
    @app.route('/api/health')
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'ok', 'service': 'Coffee Bean & Tea API', 'version': '1.0.0'}), 200

    # Auto-initialize database tables and seed if empty safely
    with app.app_context():
        try:
            db.create_all()
            from app.utils.seeder import seed_data
            seed_data(db.session)
        except Exception as e:
            app.logger.warning(f"Database auto-creation/seed warning: {e}")

    # Serve assets folder
    @app.route('/assets/<path:filename>')
    def serve_assets(filename):
        if os.path.exists(os.path.join(assets_dir, filename)):
            return send_from_directory(assets_dir, filename)
        return jsonify({'error': 'Asset not found'}), 404

    # Serve React Frontend SPA only in non-serverless local environments
    if not Config.IS_SERVERLESS:
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_spa(path):
            if path.startswith('api') or path.startswith('uploads'):
                return jsonify({'error': 'The requested resource was not found'}), 404

            # Check if direct static file exists (e.g. vite.svg, favicon.ico, logo.png)
            target_file = os.path.join(dist_dir, path)
            if path and os.path.exists(target_file) and not os.path.isdir(target_file):
                return send_from_directory(dist_dir, path)

            # High-speed pre-compiled Jinja2 template rendering
            index_file = os.path.join(dist_dir, 'index.html')
            if os.path.exists(index_file):
                return render_template('index.html')

            return jsonify({
                'service': 'The Coffee Bean & Tea Leaf API',
                'status': 'online',
                'endpoints': {
                    'health': '/api/health',
                    'products': '/api/products',
                    'categories': '/api/categories',
                    'stores': '/api/stores',
                    'cafe_menu': '/api/cafe-menu',
                    'banners': '/api/banners',
                    'settings': '/api/settings'
                }
            }), 200
    else:
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def api_catchall(path):
            return jsonify({
                'service': 'The Coffee Bean & Tea Leaf API',
                'status': 'online',
                'received_path': path,
                'request_path': request.path,
                'headers': {k: v for k, v in request.headers.items() if 'auth' not in k.lower() and 'cookie' not in k.lower()},
                'args': dict(request.args)
            }), 200

    # Global error handlers
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app
