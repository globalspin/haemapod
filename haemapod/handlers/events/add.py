from model import Event

def post(handler, response):
  key = handler.request.get('key')
  event = Event.get(key) if key else Event()
  event.name = handler.request.get('name')
  event.link = handler.request.get('link')
  event.city = handler.request.get('city')
  lat = handler.request.get('lat')
  lon = handler.request.get('lon')
  if lat and lon:
    event.location = db.GeoPt(lat, lon)
    event.update_location()
  event.put()
  handler.redirect('/events/add?key='+str(event.key()))

def get(handler, response):
  key = handler.request.get('key')
  response.event = Event.get(key) if key else Event()
