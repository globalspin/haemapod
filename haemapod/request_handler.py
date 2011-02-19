from model import User

import megaera

from google.appengine.api import users


class RequestHandler(megaera.RequestHandler):
  
  def current_user(self):
    """Returns the logged-in User object."""
    user = users.get_current_user()
    if user:
      return User.get_or_insert(key_name=user.email(), user=user)
  
  def login_url(self, uri=None):
    return users.create_login_url(uri or self.request.uri)
