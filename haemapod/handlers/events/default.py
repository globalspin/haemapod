from model import Event
from google.appengine.ext import db

def get(handler, response):
  response.event = Event.get(key) if key else Event()
