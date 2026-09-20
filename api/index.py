import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
candidate_paths = [
    os.path.join(current_dir, '..', 'backend'),
    os.path.join(current_dir, 'backend'),
    os.path.join('/var', 'task', 'backend'),
    os.path.join('/var', 'task'),
    os.path.abspath('backend'),
    current_dir,
    os.path.abspath('.')
]

for p in candidate_paths:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

from app import create_app

app = create_app()
