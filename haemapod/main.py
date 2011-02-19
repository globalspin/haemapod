from google.appengine.ext.webapp import WSGIApplication
from google.appengine.ext.webapp.util import run_wsgi_app

from request_handler import RequestHandler

def application():
  return WSGIApplication([
    ('/', RequestHandler.with_page('handlers.default')),
    ('/people/add', RequestHandler.with_page('handlers.people.add')),
    ('/people/proximity', RequestHandler.with_page('handlers.people.proximity')),
    ('/people/bounding_box', RequestHandler.with_page('handlers.people.bounding_box')),
    ('/people/upload', RequestHandler.with_page('handlers.people.upload')),
    ('/events/add', RequestHandler.with_page('handlers.events.add')),
    ('/events/proximity', RequestHandler.with_page('handlers.events.proximity')),
    ('/events/bounding_box', RequestHandler.with_page('handlers.events.bounding_box')),
    ('/events/users', RequestHandler.with_page('handlers.events.users')),
  ], debug=True)

def main():
  run_wsgi_app(application())

if __name__ == "__main__":
  main()
