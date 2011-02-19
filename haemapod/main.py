from google.appengine.ext.webapp import WSGIApplication
from google.appengine.ext.webapp.util import run_wsgi_app

from request_handler import RequestHandler

def application():
  return WSGIApplication([
    ('/', RequestHandler.with_page('handlers.default')),
    ('/people/add', RequestHandler.with_page('handlers.people.add')),
  ], debug=True)

def main():
  run_wsgi_app(application())

if __name__ == "__main__":
  main()
