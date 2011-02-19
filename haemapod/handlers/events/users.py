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
  response.here_users = User.proximity_fetch(
    User.all().filter('distance =','here'),
    event.location,
    max_results=MAX_RESULTS,
    max_distance=HERE_RADIUS,
  )
  response.drive_users = User.proximity_fetch(
    User.all().filter('distance =','drive'),
    event.location,
    max_results=MAX_RESULTS,
    max_distance=DRIVE_RADIUS,
  )
  response.fly_users = User.proximity_fetch(
    User.all().filter('distance =','fly'),
    event.location,
    max_results=MAX_RESULTS,
    max_distance=FLY_RADIUS,
  )
  response.anywhere_users = User.all().filter('distance =','anywhere').fetch(MAX_RESULTS)
