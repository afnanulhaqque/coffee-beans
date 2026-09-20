import os
import sys
import shutil
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'coffee-secret-key-super-secure-change-in-prod')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-coffee-bean-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # Serverless runtime detection (Vercel, AWS Lambda)
    IS_SERVERLESS = bool(
        os.environ.get('VERCEL') or
        os.environ.get('VERCEL_ENV') or
        os.environ.get('VERCEL_REGION') or
        os.environ.get('AWS_LAMBDA_FUNCTION_NAME') or
        os.environ.get('LAMBDA_TASK_ROOT') or
        os.path.exists('/var/task')
    )

    # Pure SQLite Database Configuration
    if IS_SERVERLESS:
        tmp_db = os.path.join('/tmp', 'coffee_store.db')

        # Check all potential bundled database locations on Vercel / Lambda
        candidate_dbs = [
            os.path.join(BASE_DIR, 'coffee_store.db'),
            os.path.join(ROOT_DIR, 'backend', 'coffee_store.db'),
            os.path.join(ROOT_DIR, 'api', 'coffee_store.db'),
            os.path.join(ROOT_DIR, 'coffee_store.db'),
            os.path.join('/var', 'task', 'backend', 'coffee_store.db'),
            os.path.join('/var', 'task', 'api', 'coffee_store.db'),
            os.path.join('/var', 'task', 'coffee_store.db'),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'api', 'coffee_store.db'),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'coffee_store.db'),
            os.path.abspath('coffee_store.db'),
            os.path.abspath(os.path.join('backend', 'coffee_store.db')),
            os.path.abspath(os.path.join('api', 'coffee_store.db')),
        ]

        src_db = None
        for cand in candidate_dbs:
            try:
                if os.path.exists(cand) and os.path.getsize(cand) > 1000:
                    src_db = cand
                    break
            except Exception:
                continue

        # Recursive search if not found in standard paths
        if not src_db:
            search_dirs = ['/var/task', ROOT_DIR, BASE_DIR, '.']
            for s_dir in search_dirs:
                if os.path.exists(s_dir):
                    for root, _, files in os.walk(s_dir):
                        if 'coffee_store.db' in files:
                            cand = os.path.join(root, 'coffee_store.db')
                            try:
                                if os.path.getsize(cand) > 1000:
                                    src_db = cand
                                    break
                            except Exception:
                                pass
                if src_db:
                    break

        if src_db:
            try:
                # Copy to /tmp if not exists or if size is smaller
                if not os.path.exists(tmp_db) or os.path.getsize(tmp_db) < 1000:
                    shutil.copy2(src_db, tmp_db)
                    print(f"[Serverless DB] Successfully copied {src_db} ({os.path.getsize(src_db)} bytes) to {tmp_db}")
            except Exception as e:
                print(f"[Serverless DB Error] Copy failed: {e}")
        else:
            print("[Serverless DB Warning] No pre-seeded coffee_store.db found in bundle search paths.")

        SQLALCHEMY_DATABASE_URI = f"sqlite:///{tmp_db}"
    else:
        # Local development database in backend folder
        local_db_path = os.path.join(BASE_DIR, 'coffee_store.db')
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{local_db_path}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'connect_args': {
            'check_same_thread': False,
            'timeout': 30
        }
    }

    # Upload configurations
    if IS_SERVERLESS:
        UPLOAD_FOLDER = os.path.join('/tmp', 'uploads')
    else:
        UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max image upload
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'}

    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
