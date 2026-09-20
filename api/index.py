import os
import sys
import traceback

current_dir = os.path.dirname(os.path.abspath(__file__))

# Ensure current directory (api/) and candidate backend locations are in sys.path
candidate_paths = [
    current_dir,
    os.path.abspath(os.path.join(current_dir, '..')),
    os.path.join(current_dir, '..', 'backend'),
    os.path.join(current_dir, 'backend'),
    os.path.join('/var', 'task', 'api'),
    os.path.join('/var', 'task', 'backend'),
    os.path.join('/var', 'task'),
    os.path.abspath('backend'),
    os.path.abspath('.')
]

for p in candidate_paths:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

import urllib.parse

class VercelPathMiddleware:
    """Reconstruct PATH_INFO from __path__ query parameter forwarded by Vercel rewrites."""
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        qs = environ.get('QUERY_STRING', '')
        if '__path__=' in qs:
            params = urllib.parse.parse_qs(qs, keep_blank_values=True)
            if '__path__' in params:
                raw_path = params['__path__'][0] if params['__path__'] else ''
                p = raw_path.lstrip('/')
                if p:
                    environ['PATH_INFO'] = f'/api/{p}' if not p.startswith('api/') else f'/{p}'
                else:
                    environ['PATH_INFO'] = '/api'
                del params['__path__']
                environ['QUERY_STRING'] = urllib.parse.urlencode(params, doseq=True)
        return self.wsgi_app(environ, start_response)

try:
    from app import create_app
    app = create_app()
    app.wsgi_app = VercelPathMiddleware(app.wsgi_app)
except Exception as e:
    from flask import Flask, jsonify
    err_tb = traceback.format_exc()
    app = Flask(__name__)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all_error(path):
        return jsonify({
            'status': 'error',
            'error_type': type(e).__name__,
            'error': str(e),
            'traceback': err_tb,
            'sys_path': sys.path,
            'cwd': os.getcwd(),
            'current_dir': current_dir,
            'current_dir_contents': os.listdir(current_dir) if os.path.exists(current_dir) else []
        }), 500

