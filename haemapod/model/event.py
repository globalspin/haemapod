import re
from google.appengine.ext import db
from geo.geomodel import GeoModel

class Event(GeoModel):
  name = db.StringProperty()
  slug = db.StringProperty()
  city = db.StringProperty()
  date = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  link = db.StringProperty()
  
  def sanitize(self):
    return dict(
      name=self.name,
      lat=self.location.lat if self.location else None,
      lng=self.location.lon if self.location else None,
    )

  def pretty_link(self):
    if self.link:
      return re.sub('twitter.com/', '@', self.link)
  
  def attending(self):
    return (ue.user for ue in self.userevent_set)
  
  def organizers(self):
    return (ue.user for ue in self.userevent_set if ue.organizer)
