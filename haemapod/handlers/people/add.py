def post(handler, response):
  user = response.user = handler.current_user()
  if not user:
    return handler.redirect('/')
  user.name = handler.request.get('name')
  user.link = handler.request.get('link')
  user.distance = handler.request.get('distance')
  user.put()
  handler.redirect('/people/add')

def get(handler, response):
  user = response.user = handler.current_user()
  if not user:
    return handler.redirect('/')
  response.distance_choices = [
    ("stay here", "here"),
    ("drive", "drive"), 
    ("fly", "fly"),
    ("go anywhere", "anywhere"),
  ]
