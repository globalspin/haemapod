import re
from google.appengine.ext import db
from geo.geomodel import GeoModel


HERE_RADIUS = 32186 # 20 miles
DRIVE_RADIUS = 241401 # 150 miles
FLY_RADIUS = 3218688 # 2000 miles

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
      permalink=self.permalink(),
    )

  def pretty_link(self):
    if self.link:
      return re.sub('twitter.com/', '@', self.link)
  
  def attending(self):
    return (ue.user for ue in self.userevent_set)
  
  def organizers(self):
    return (ue.user for ue in self.userevent_set if ue.organizer)
  
  def interested(self, query=None, max_results=100):
    from user import User
    if not query: query = User.all()
    here_users = User.proximity_fetch(
      query.filter('distance =','here'),
      self.location,
      max_results=max_results,
      max_distance=HERE_RADIUS,
    )
    drive_users = User.proximity_fetch(
      query.filter('distance =','drive'),
      self.location,
      max_results=max_results,
      max_distance=DRIVE_RADIUS,
    )
    fly_users = User.proximity_fetch(
      query.filter('distance =','fly'),
      self.location,
      max_results=max_results,
      max_distance=FLY_RADIUS,
    )
    anywhere_users = query.filter('distance =','anywhere').fetch(max_results)
    return dict(
      here_users=here_users,
      drive_users=drive_users,
      fly_users=fly_users,
      anywhere_users=anywhere_users,
    )
  
  def permalink(self):
    return '/events/%s' % self.slug
