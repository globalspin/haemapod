from google.appengine.ext import db
from google.appengine.api import users

class User(db.Model):
  user = db.UserProperty(required=True)
  created = db.DateTimeProperty(auto_now_add=True)
