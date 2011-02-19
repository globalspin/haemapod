from model import User
from geo.geomodel import geotypes

def get(handler, response):
  lat = handler.request.get('lat')
  lon = handler.request.get('lng')
  response.users = User.proximity_fetch(
    User.all(),
    geotypes.Point(float(lat),float(lon)),
  )
