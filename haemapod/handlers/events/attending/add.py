from model import Event

def post(handler, response):
  slug = handler.url_arg(0)
  if not slug:
    return handler.redirect('/events')
  event = Event.all().filter('slug =', slug).get()
  if not event:
    return handler.redirect('/events')
  user = handler.current_user()
  if user:
    user.add_event(event)
  return handler.redirect(event.permalink())
