import yaml
import re

from model import Event

from google.appengine.ext import db

def post(handler, response):
  events_yaml = handler.request.get('events')
  import logging
  events = yaml.load(events_yaml)
  for event in events:
    obj = Event.all().filter('slug =', event['slug']).get() or Event()
    obj.name = event['name']
    obj.link = event.get('link')
    obj.city = event['city']
    obj.date = event['date']
    obj.slug = event['slug']
    if 'location' in event:
      match = re.match('^(.*), (.*)$', event['location'])
      if match:
        (lat, lon) = match.groups()
        obj.location = db.GeoPt(lat, lon)
        obj.update_location()
    obj.put()

def get(handler, response):
  pass
