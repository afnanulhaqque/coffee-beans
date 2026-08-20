from datetime import datetime, time
import pytz
from app.extensions import db

class Store(db.Model):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(150), unique=True, nullable=True, index=True)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False, default='Islamabad', index=True)
    province = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=False, default='Pakistan')
    phone = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    opening_hours = db.Column(db.String(200), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    google_maps_url = db.Column(db.String(500), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    features = db.Column(db.String(255), nullable=True)  # Legacy field
    
    # Store services
    delivery_available = db.Column(db.Boolean, default=True, nullable=True)
    dine_in = db.Column(db.Boolean, default=True, nullable=True)
    takeaway = db.Column(db.Boolean, default=True, nullable=True)
    drive_thru = db.Column(db.Boolean, default=False, nullable=True)
    wifi = db.Column(db.Boolean, default=True, nullable=True)
    outdoor_seating = db.Column(db.Boolean, default=False, nullable=True)
    parking = db.Column(db.Boolean, default=True, nullable=True)
    accessible = db.Column(db.Boolean, default=True, nullable=True)

    status = db.Column(db.String(50), default='Active', nullable=False)  # Active, Temporarily Closed, Renovation, Coming Soon
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    featured = db.Column(db.Boolean, default=False, nullable=False)
    source_url = db.Column(db.String(500), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    opening_hours_schedules = db.relationship(
        'StoreOpeningHours',
        backref='store',
        cascade='all, delete-orphan',
        lazy='joined',
        order_by='StoreOpeningHours.id'
    )

    def get_current_status(self):
        """
        Calculates whether store is currently Open or Closed based on Pakistan timezone (Asia/Karachi)
        """
        try:
            karachi_tz = pytz.timezone('Asia/Karachi')
            now = datetime.now(karachi_tz)
            day_name = now.strftime('%A')  # e.g. Monday
            current_time = now.time()

            # Check matching schedule
            matching_schedule = None
            for sch in self.opening_hours_schedules:
                if sch.day_of_week.lower() == day_name.lower():
                    matching_schedule = sch
                    break

            if not matching_schedule:
                return {
                    'is_open': True,
                    'status_text': 'Open Now',
                    'badge': 'Open'
                }

            if matching_schedule.is_24_hours:
                return {
                    'is_open': True,
                    'status_text': 'Open 24 Hours',
                    'badge': 'Open 24/7'
                }

            if matching_schedule.is_closed:
                return {
                    'is_open': False,
                    'status_text': 'Closed Today',
                    'badge': 'Closed'
                }

            # Parse open and close times (e.g. "08:00" and "01:00")
            def parse_t(t_str):
                parts = t_str.split(':')
                return time(int(parts[0]), int(parts[1]))

            open_t = parse_t(matching_schedule.open_time)
            close_t = parse_t(matching_schedule.close_time)

            # Check if closing time is past midnight (e.g. 01:00 AM next day)
            is_open = False
            if close_t < open_t:
                # Open spans overnight: e.g. 08:00 AM to 01:00 AM
                if current_time >= open_t or current_time < close_t:
                    is_open = True
            else:
                if open_t <= current_time < close_t:
                    is_open = True

            close_display = datetime.strptime(matching_schedule.close_time, '%H:%M').strftime('%I:%M %p').lstrip('0')
            open_display = datetime.strptime(matching_schedule.open_time, '%H:%M').strftime('%I:%M %p').lstrip('0')

            if is_open:
                return {
                    'is_open': True,
                    'status_text': f'Open until {close_display}',
                    'badge': 'Open'
                }
            else:
                return {
                    'is_open': False,
                    'status_text': f'Closed • Opens at {open_display}',
                    'badge': 'Closed'
                }
        except Exception:
            return {
                'is_open': True,
                'status_text': 'Open',
                'badge': 'Open'
            }

    def to_dict(self):
        status_info = self.get_current_status()
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug or f"{self.city.lower()}-{self.id}",
            'address': self.address,
            'city': self.city,
            'province': self.province,
            'country': self.country or 'Pakistan',
            'phone': self.phone,
            'email': self.email,
            'opening_hours': self.opening_hours,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'google_maps_url': self.google_maps_url or (
                f"https://www.google.com/maps/search/?api=1&query={self.latitude},{self.longitude}"
                if self.latitude and self.longitude
                else f"https://www.google.com/maps/search/?api=1&query={self.name}+{self.address}+{self.city}"
            ),
            'image': self.image,
            'description': self.description,
            'status': self.status,
            'is_active': self.is_active,
            'featured': self.featured,
            'delivery_available': self.delivery_available,
            'dine_in': self.dine_in,
            'takeaway': self.takeaway,
            'drive_thru': self.drive_thru,
            'wifi': self.wifi,
            'outdoor_seating': self.outdoor_seating,
            'parking': self.parking,
            'accessible': self.accessible,
            'source_url': self.source_url,
            'current_status': status_info,
            'is_open': status_info.get('is_open', True),
            'status_text': status_info.get('status_text', 'Open'),
            'schedules': [s.to_dict() for s in (self.opening_hours_schedules or [])],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class StoreOpeningHours(db.Model):
    __tablename__ = 'store_opening_hours'

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id', ondelete='CASCADE'), nullable=False)
    day_of_week = db.Column(db.String(20), nullable=False)  # Monday, Tuesday, etc.
    open_time = db.Column(db.String(10), default='08:00')
    close_time = db.Column(db.String(10), default='01:00')
    is_closed = db.Column(db.Boolean, default=False, nullable=False)
    is_24_hours = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'store_id': self.store_id,
            'day_of_week': self.day_of_week,
            'open_time': self.open_time,
            'close_time': self.close_time,
            'is_closed': self.is_closed,
            'is_24_hours': self.is_24_hours,
        }
