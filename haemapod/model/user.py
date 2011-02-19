from google.appengine.ext import db
from google.appengine.api import users
from geo.geomodel import GeoModel

class User(GeoModel):
  user = db.UserProperty(required=True)
  email = db.StringProperty()
  name = db.StringProperty()
  city = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  distance = db.StringProperty(choices=set(["here", "drive", "fly", "anywhere"]))
  latitude = db.FloatProperty()
  longitude = db.FloatProperty()
  link = db.StringProperty()
  private = db.BooleanProperty()

  