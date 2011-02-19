from model import Event
from google.appengine.ext import db

def post(handler, response):
  key = handler.request.get('key')
  response.event = event = Event.get(key) if key else Event()
  event.name = handler.request.get('name')
  event.link = handler.request.get('link')
  event.city = handler.request.get('city')
  event.date = handler.request.get('date')
  event.slug = handler.request.get('slug')
  lat = handler.request.get('lat')
  lon = handler.request.get('lon')
  if lat and lon:
    event.location = db.GeoPt(lat, lon)
    event.update_location()
  event.put()
  handler.redirect(event.permalink())

def get(handler, response):
  key = handler.request.get('key')
  response.event = Event.get(key) if key else Event()
