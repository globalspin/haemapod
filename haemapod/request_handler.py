from model import User

import megaera

from google.appengine.api import users

from re import sub


class RequestHandler(megaera.RequestHandler):
  
  def current_user(self):
    """Returns the logged-in User object."""
    user = users.get_current_user()
    if user:
      return User.get_or_insert(key_name=user.email())
  
  def login_url(self):
    return sub('_main', '', super(RequestHandler, self).login_url());
