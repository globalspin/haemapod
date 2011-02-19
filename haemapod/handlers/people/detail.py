from model import Event
from model import User
from google.appengine.ext import db

MAX_RESULTS = 10

def get(handler, response):
  key = handler.request.get('key')
  response.user = User.get(key) if key else User()
  response.organizing = response.user.organizing()
  response.attending = response.user.events()
