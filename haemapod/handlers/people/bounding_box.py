from model import User
from geo.geomodel import geotypes

def get(handler, response):
  lat1 = handler.request.get('lat1')
  lon1 = handler.request.get('lgn1')
  lat2 = handler.request.get('lat2')
  lon2 = handler.request.get('lgn2')
  response.users = User.bounding_box_fetch(
    User.all(),
    geotypes.Box(float(lat1),float(lon1),float(lat2),float(lon2)),
  )
