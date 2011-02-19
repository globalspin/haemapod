from model import Event

def get(handler, response):
  response.state = handler.request.get('state')
  if response.state == '/people/add':
    response.user = handler.current_user()
  if response.state == '/events/add':
    response.event = Event()
