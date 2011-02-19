from model import User, Event
from geo.geomodel import geotypes

HERE_RADIUS = 32186 # 20 miles
DRIVE_RADIUS = 241401 # 150 miles
FLY_RADIUS = 3218688 # 2000 miles

MAX_RESULTS = 10

def get(handler, response):
  key = handler.request.get('key')
  response.event = event = Event.get(key)
  if not event and event.location: return
  interested = event.interested()
  handler.response_dict(**interested)
