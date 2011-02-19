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
  interested = event.interested()
  response.interested = sum(len(d) for d in interested)
  response.attendee_count = len(response.attending)
  response.organizers_count = len(response.organizers)
