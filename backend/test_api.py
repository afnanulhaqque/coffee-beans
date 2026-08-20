import unittest
import json
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.store import Store

class CoffeeAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'ok')

    def test_02_admin_login(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'admin@coffeebean.com',
            'password': 'admin123'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('token', data)
        self.assertEqual(data['user']['role'], 'admin')

    def test_03_products_listing_and_filtering(self):
        res = self.client.get('/api/products?category=coffee&limit=10')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(len(data['products']) > 0)

        p_slug = data['products'][0]['slug']
        res_single = self.client.get(f'/api/products/{p_slug}')
        self.assertEqual(res_single.status_code, 200)
        p_data = res_single.get_json()
        self.assertEqual(p_data['product']['slug'], p_slug)

    def test_04_guest_delivery_order(self):
        product = Product.query.filter(Product.is_active == True, Product.stock_quantity >= 2).first()
        if not product:
            product = Product.query.filter_by(is_active=True).first()
            product.stock_quantity = 25
            db.session.commit()

        initial_stock = product.stock_quantity

        # Place Guest Delivery Order
        order_payload = {
            'customer_name': 'Afnan Ul Haq',
            'customer_email': 'afnan@example.com',
            'customer_phone': '0300 1234567',
            'order_type': 'delivery',
            'delivery_address': 'House 10, Street 5, Sector F-6/2',
            'city': 'Islamabad',
            'area': 'Sector F-6/2',
            'payment_method': 'Cash on Delivery (COD)',
            'items': [
                {'product_id': product.id, 'quantity': 2}
            ]
        }

        res = self.client.post('/api/orders', json=order_payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        order_obj = data['order']
        self.assertTrue(order_obj['order_number'].startswith('CBP-'))
        self.assertEqual(order_obj['order_type'], 'delivery')
        self.assertEqual(order_obj['order_status'], 'Pending')

        db.session.refresh(product)
        self.assertEqual(product.stock_quantity, initial_stock - 2)

    def test_05_guest_pickup_order(self):
        product = Product.query.filter(Product.is_active == True, Product.stock_quantity >= 1).first()
        if not product:
            product = Product.query.filter_by(is_active=True).first()
            product.stock_quantity = 25
            db.session.commit()

        # Place Guest Pickup Order (Free delivery fee)
        order_payload = {
            'customer_name': 'Sara Khan',
            'customer_email': 'sara@example.com',
            'customer_phone': '0302 5455448',
            'order_type': 'pickup',
            'store_name': 'Beverly Centre, F-6 Islamabad',
            'payment_method': 'Cash on Pickup',
            'items': [
                {'product_id': product.id, 'quantity': 1}
            ]
        }

        res = self.client.post('/api/orders', json=order_payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        order_obj = data['order']
        self.assertTrue(order_obj['order_number'].startswith('CBP-'))
        self.assertEqual(order_obj['order_type'], 'pickup')
        self.assertEqual(order_obj['delivery_fee'], 0.0)

    def test_06_admin_dashboard_metrics(self):
        res_login = self.client.post('/api/auth/login', json={
            'email': 'admin@coffeebean.com',
            'password': 'admin123'
        })
        token = res_login.get_json()['token']

        res_dash = self.client.get('/api/admin/dashboard', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(res_dash.status_code, 200)
        dash_data = res_dash.get_json()
        self.assertIn('metrics', dash_data)
        self.assertIn('total_sales', dash_data['metrics'])
        self.assertIn('total_orders', dash_data['metrics'])

    def test_07_admin_order_status_update(self):
        res_login = self.client.post('/api/auth/login', json={
            'email': 'admin@coffeebean.com',
            'password': 'admin123'
        })
        token = res_login.get_json()['token']

        order = Order.query.first()
        if order:
            res_up = self.client.put(f'/api/orders/{order.id}/status', headers={
                'Authorization': f'Bearer {token}'
            }, json={'order_status': 'Preparing'})
            self.assertEqual(res_up.status_code, 200)
            self.assertEqual(res_up.get_json()['order']['order_status'], 'Preparing')

if __name__ == '__main__':
    unittest.main()
