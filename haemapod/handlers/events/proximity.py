from model import Event
from geo.geomodel import geotypes

def get(handler, response):
  lat = handler.request.get('lat')
  lon = handler.request.get('lng')
  response.events = Event.proximity_fetch(
    Event.all(),
    geotypes.Point(float(lat),float(lon)),
  )
