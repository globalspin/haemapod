import re
import urllib, hashlib
from google.appengine.ext import db
from google.appengine.api import users
from geo.geomodel import GeoModel
from google.appengine.ext import search

from re import sub

from event import Event

class User(GeoModel, search.SearchableModel):
  name = db.StringProperty()
  city = db.StringProperty()
  created = db.DateTimeProperty(auto_now_add=True)
  distance = db.StringProperty(choices=set(["here", "drive", "fly", "anywhere"]))
  link = db.StringProperty()
  private = db.BooleanProperty()
  
  email = property(fget=lambda self: self.key().name())

  def preferred_name(self):
    if self.name:
      return self.name
    return sub('@.*$', '', self.email) # obscure domain
  
  def sanitize(self):
    return dict(
      name=self.preferred_name(),
      lat=self.location.lat if self.location else None,
      lng=self.location.lon if self.location else None,
      permalink=self.permalink(),
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
  
  def is_attending(self, event):
    if not event: return
    for ue in self.userevent_set:
      if ue.event.key() == event.key():
        return True
  
  def permalink(self):
    return '/people/%s' % self.key()
  
  def pretty_link(self):
    if self.link:
      return re.sub('twitter.com/', '@', self.link)
  
  def gravatar(self):
    default = "http://0.gravatar.com/avatar/1a33e7a69df4f675fcd799edca088ac2?s=40&d=identicon"
    size = 40

    gravatar_url = "http://www.gravatar.com/avatar/" + hashlib.md5(self.email.lower()).hexdigest() + "?"
    gravatar_url += urllib.urlencode({'d':default, 's':str(size)})
    return gravatar_url

class UserEvent(db.Model):
  user = db.ReferenceProperty(User)
  event = db.ReferenceProperty(Event)
  organizer = db.BooleanProperty(default=False)
