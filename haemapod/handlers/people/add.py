from google.appengine.ext import db

def post(handler, response):
  user = response.user = handler.current_user()
  if not user: return
  user.name = handler.request.get('name')
  user.link = handler.request.get('link')
  user.city = handler.request.get('city')
  user.distance = handler.request.get('distance')
  user.private = bool(handler.request.get('private'))
  lat = handler.request.get('lat')
  lon = handler.request.get('lon')
  if lat and lon:
    user.location = db.GeoPt(lat, lon)
    user.update_location()
  user.put()
  response.redirect=user.permalink()
  handler.redirect(user.permalink())

def get(handler, response):
  response.user = handler.current_user()
  response.distance_choices = [
    ("stay here", "here"),
    ("drive", "drive"), 
    ("fly", "fly"),
    ("go anywhere", "anywhere"),
  ]
