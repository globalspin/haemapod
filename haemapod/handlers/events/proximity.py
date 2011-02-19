from model import Event
from geo.geomodel import geotypes

def get(handler, response):
  lat = handler.request.get('lat')
  lon = handler.request.get('lon')
  response.events = Event.proximity_fetch(
    Event.all(),
    geotypes.Point(float(lat),float(lon)),
  )
