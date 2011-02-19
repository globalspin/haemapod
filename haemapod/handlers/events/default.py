from model import Event
from google.appengine.ext import db

MAX_RESULTS = 10

def get(handler, response):
  next = handler.request.get('next')
  if next:
    event = Event.get(next)
    if not event: return
    events = Event.all()\
      .filter('name >=', event.name)\
      .order('name')\
      .fetch(MAX_RESULTS+1)
  else:
    events = Event.all()\
      .order('name')\
      .fetch(MAX_RESULTS+1)
  response.events = events[:MAX_RESULTS]
  if len(events) > MAX_RESULTS:
    response.next = events[-1]
