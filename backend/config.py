import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'coffee-secret-key-super-secure-change-in-prod')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-super-secret-coffee-bean-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Serverless runtime detection (Vercel, AWS Lambda)
    IS_SERVERLESS = bool(os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'))

    # Database URL configuration
    _db_url = os.environ.get('DATABASE_URL')
    if _db_url and _db_url.startswith("postgres://"):
        _db_url = _db_url.replace("postgres://", "postgresql://", 1)

    if _db_url:
        SQLALCHEMY_DATABASE_URI = _db_url
    elif IS_SERVERLESS:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join('/tmp', 'coffee_store.db')}"
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'coffee_store.db')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configurations
    if IS_SERVERLESS:
        UPLOAD_FOLDER = os.path.join('/tmp', 'uploads')
    else:
        UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB max image upload
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'}
    
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
