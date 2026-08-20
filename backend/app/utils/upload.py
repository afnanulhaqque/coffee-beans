import os
import re
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename):
    if '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in current_app.config['ALLOWED_EXTENSIONS']

def save_uploaded_file(file, folder_name='products'):
    if not file or file.filename == '':
        return None, "No file selected"

    if not allowed_file(file.filename):
        allowed = ', '.join(current_app.config['ALLOWED_EXTENSIONS'])
        return None, f"File format not supported. Allowed: {allowed}"

    # Generate unique filename
    original_ext = file.filename.rsplit('.', 1)[1].lower()
    clean_base = secure_filename(file.filename.rsplit('.', 1)[0])
    unique_name = f"{clean_base[:20]}_{uuid.uuid4().hex[:8]}.{original_ext}"

    target_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], folder_name)
    os.makedirs(target_dir, exist_ok=True)

    file_path = os.path.join(target_dir, unique_name)
    file.save(file_path)

    # Return relative web path (e.g., /uploads/products/xyz.jpg)
    return f"/uploads/{folder_name}/{unique_name}", None

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text
