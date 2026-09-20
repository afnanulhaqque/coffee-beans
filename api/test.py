from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        # Test importing app
        app_status = "not tested"
        import_error = None
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            for p in [current_dir, os.path.join(current_dir, '..', 'backend'), os.path.abspath('backend'), os.path.abspath('.')]:
                if os.path.exists(p) and p not in sys.path:
                    sys.path.insert(0, p)
            from app import create_app
            test_app = create_app()
            app_status = f"success: {type(test_app)}"
        except Exception as e:
            app_status = f"failed: {type(e).__name__}: {str(e)}"
            import_error = traceback.format_exc()

        data = {
            'status': 'ok',
            'python_version': sys.version,
            'cwd': os.getcwd(),
            'files_in_cwd': os.listdir('.') if os.path.exists('.') else [],
            'files_in_api': os.listdir('api') if os.path.exists('api') else [],
            'app_import_status': app_status,
            'import_error': import_error
        }
        self.wfile.write(json.dumps(data, indent=2).encode())
        return
