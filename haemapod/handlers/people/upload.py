import yaml
import re

from model import User

from google.appengine.ext import db

def post(handler, response):
  people_yaml = handler.request.get('people')
  import logging
  people = yaml.load(people_yaml)
  for person in people:
    user = User.get_or_insert(key_name=person.get('email') or person['name'])
    user.name = person['name']
    user.link = person.get('link')
    user.private = bool(person['private'])
    user.city = person['city']
    user.distance = person['distance']
    if 'location' in person:
      match = re.match('^(.*), (.*)$', person['location'])
      if match:
        (lat, lon) = match.groups()
        user.location = db.GeoPt(lat, lon)
        user.update_location()
    user.put()

def get(handler, response):
  pass
