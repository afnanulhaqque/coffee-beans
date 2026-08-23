import os
import requests
from config import Config

SUPABASE_URL = Config.SUPABASE_URL
SUPABASE_SECRET_KEY = Config.SUPABASE_SECRET_KEY
SUPABASE_PUBLISHABLE_KEY = Config.SUPABASE_PUBLISHABLE_KEY

class SupabaseServerClient:
    def __init__(self, url=SUPABASE_URL, key=SUPABASE_SECRET_KEY):
        self.base_url = url.rstrip('/') + '/rest/v1'
        self.auth_url = url.rstrip('/') + '/auth/v1'
        self.headers = {
            'apikey': key,
            'Authorization': f'Bearer {key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }

    def table(self, table_name):
        return SupabaseTableQuery(f"{self.base_url}/{table_name}", self.headers)

class SupabaseTableQuery:
    def __init__(self, endpoint, headers):
        self.endpoint = endpoint
        self.headers = headers

    def select(self, columns="*", params=None):
        query_params = {'select': columns}
        if params:
            query_params.update(params)
        res = requests.get(self.endpoint, headers=self.headers, params=query_params)
        return res.json() if res.status_code < 400 else []

    def insert(self, data):
        res = requests.post(self.endpoint, headers=self.headers, json=data)
        return res.json() if res.status_code < 400 else None

    def update(self, match_col, match_val, data):
        url = f"{self.endpoint}?{match_col}=eq.{match_val}"
        res = requests.patch(url, headers=self.headers, json=data)
        return res.json() if res.status_code < 400 else None

    def delete(self, match_col, match_val):
        url = f"{self.endpoint}?{match_col}=eq.{match_val}"
        res = requests.delete(url, headers=self.headers)
        return res.status_code < 400

supabase_server = SupabaseServerClient()
