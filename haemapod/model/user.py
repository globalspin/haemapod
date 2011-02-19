from google.appengine.ext import db
from google.appengine.api import users
from geo.geomodel import GeoModel

from re import sub

from event import Event

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
  
  def events(self):
    return (ue.event for ue in self.userevent_set)
  
  def organizing(self):
    return (ue.event for ue in self.userevent_set if ue.organizer)
  
  def add_event(self, event, organizer=False):
    ue = None
    # look for existing record
    for ue2 in self.userevent_set:
      if ue2.event.key() == event.key():
        ue = ue2
        break
    if ue:
      ue.organizer = organizer
      return ue.put()
    else:
      return UserEvent(user=self, event=event, organizer=organizer).put()

class UserEvent(db.Model):
  user = db.ReferenceProperty(User)
  event = db.ReferenceProperty(Event)
  organizer = db.BooleanProperty(default=False)
