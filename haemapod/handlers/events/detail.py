from model import Event

def get(handler, response):
  slug = handler.url_arg(0)
  if not slug:
    return handler.redirect('/events')
  response.event = event = Event.all().filter('slug =', slug).get()
  if not event:
    return handler.redirect('/events')
  response.attending = list(event.attending())
  response.organizers = list(event.organizers())
  response.interested = event.interested()
  response.interested_count = sum(len(d) for d in response.interested.values())
  response.attendee_count = len(response.attending)
  response.organizers_count = len(response.organizers)
