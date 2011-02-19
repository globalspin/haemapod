from google.appengine.ext import db
from google.appengine.api import users

class User(db.Model):
  user = db.UserProperty(required=True)
  email = db.StringProperty()
  name = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  location = db.StringProperty()
  distance = db.StringProperty(choices=set(["here", "drive", "fly", "anywhere"]))
  latitude = db.FloatProperty()
  longitude = db.FloatProperty()
  link = db.StringProperty()
  private = db.BooleanProperty()

  