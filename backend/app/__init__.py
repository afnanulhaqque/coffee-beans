import os
from flask import Flask, send_from_directory, jsonify
from config import Config
from app.extensions import db, migrate, jwt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

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

    # Health check endpoint
    @app.route('/api/health')
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

    # Determine dist folder for serving React Frontend
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dist_dir = os.path.abspath(os.path.join(base_dir, '..', 'dist'))
    if not os.path.exists(dist_dir):
        dist_dir = os.path.abspath(os.path.join(base_dir, '..', '..', 'frontend', 'dist'))

    # Serve assets folder
    @app.route('/assets/<path:filename>')
    def serve_assets(filename):
        assets_dir = os.path.join(dist_dir, 'assets')
        if os.path.exists(os.path.join(assets_dir, filename)):
            return send_from_directory(assets_dir, filename)
        return jsonify({'error': 'Asset not found'}), 404

    # Serve React Frontend SPA for all other web routes
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path):
        if path.startswith('api') or path.startswith('uploads'):
            return jsonify({'error': 'The requested resource was not found'}), 404

        # Check if direct static file exists (e.g. vite.svg, favicon.ico, logo.png)
        target_file = os.path.join(dist_dir, path)
        if path and os.path.exists(target_file) and not os.path.isdir(target_file):
            return send_from_directory(dist_dir, path)

        # Serve index.html for SPA routing
        index_file = os.path.join(dist_dir, 'index.html')
        if os.path.exists(index_file):
            return send_from_directory(dist_dir, 'index.html')

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

    # Global error handlers
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error'}), 500

    return app
