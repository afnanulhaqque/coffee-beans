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

try:
    from app import create_app
    app = create_app()
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

