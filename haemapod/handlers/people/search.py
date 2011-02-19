from model import Event
from model import User
from google.appengine.ext import db

MAX_RESULTS = 10

def get(handler, response):
  response.query = handler.request.get('q')
  if response.query:
    response.users = User.all().search(response.query).fetch(MAX_RESULTS)
