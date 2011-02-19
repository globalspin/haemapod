from google.appengine.ext import db
from geo.geomodel import GeoModel

class Event(GeoModel):
  name = db.StringProperty()
  slug = db.StringProperty()
  city = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  link = db.StringProperty()
  
  def sanitize(self):
    return dict(
      name=self.name,
      lat=self.location.lat if self.location else None,
      lgn=self.location.lon if self.location else None,
    )
