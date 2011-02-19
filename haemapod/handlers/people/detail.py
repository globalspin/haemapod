from model import Event
from model import User
from google.appengine.ext import db

MAX_RESULTS = 10

def get(handler, response):
  key = handler.url_arg(0)
  if not key:
    return handler.redirect('/people')
  response.user = User.get(key)
  if not response.user:
    return handler.redirect('/people')
  response.organizing = response.user.organizing()
  response.attending = response.user.events()
