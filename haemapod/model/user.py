from google.appengine.ext import db
from google.appengine.api import users
from geo.geomodel import GeoModel

class User(GeoModel):
  user = db.UserProperty(required=True)
  name = db.StringProperty()
  city = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  distance = db.StringProperty(choices=set(["here", "drive", "fly", "anywhere"]))
  link = db.StringProperty()
  private = db.BooleanProperty()

  def preferred_name(self):
    if self.name:
      return self.name
    if self.user.nickname():
      return self.user.nickname()
  
  def sanitize(self):
    return dict(
      name=self.preferred_name(),
      lat=self.location.lat if self.location else None,
      lon=self.location.lon if self.location else None,
    )
