from google.appengine.ext import db
from google.appengine.api import users
from geo.geomodel import GeoModel

from re import sub

class User(GeoModel):
  name = db.StringProperty()
  city = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  distance = db.StringProperty(choices=set(["here", "drive", "fly", "anywhere"]))
  link = db.StringProperty()
  private = db.BooleanProperty()

  def preferred_name(self):
    if self.name:
      return self.name
    key_name = self.key().name()
    key_name = sub('@.*$', '', key_name) # obscure domain
    return key_name
  
  def sanitize(self):
    return dict(
      name=self.preferred_name(),
      lat=self.location.lat if self.location else None,
      lng=self.location.lon if self.location else None,
    )
