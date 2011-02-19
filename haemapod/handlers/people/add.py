def post(handler, response):
  user = response.user = handler.current_user()
  if not user:
    return handler.redirect('/')
  user.name = handler.request.get('name')
  user.link = handler.request.get('link')
  user.put()
  handler.redirect('/people/add')

def get(handler, response):
  user = response.user = handler.current_user()
  if not user:
    return handler.redirect('/')
