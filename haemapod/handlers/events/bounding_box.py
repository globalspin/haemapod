from model import Event
from geo.geomodel import geotypes

def get(handler, response):
  lat1 = handler.request.get('lat1')
  lon1 = handler.request.get('lng1')
  lat2 = handler.request.get('lat2')
  lon2 = handler.request.get('lng2')
  response.events = Event.bounding_box_fetch(
    Event.all(),
    geotypes.Box(float(lat1),float(lon1),float(lat2),float(lon2)),
  )
