from model import Event
from google.appengine.ext import db

MAX_RESULTS = 10

def get(handler, response):
  response.events = Event.all().fetch(MAX_RESULTS)
