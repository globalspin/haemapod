def get(handler, response):
  response.user = handler.current_user()
