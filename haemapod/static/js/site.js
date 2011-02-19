// Project: haemapod (hackathon)
// URI: /js/site.js
// Description: Common Site Javascript
// Version: 2011-02-18

// Main Site object
if (typeof window.Site === "undefined") {
  window.Site = {};
}

// Google maps alias
GM = google.maps;

// Function prototype method
Function.prototype.bind = function() {
 var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
 return function() {
   var local_args = args.concat(Array.prototype.slice.call(arguments));
   if (this !== window) local_args.push(this);
   return __method.apply(object, local_args);
 }
}

Function.prototype.later = function (msec)
{
  var fn = this,
     args = Array.prototype.slice.call(arguments,1);
  return window.setTimeout(
    function(){fn.apply(this,args)},
    msec
  );
}

// Array prototype extension



// String prototype extension



// Number prototype extension


// Additional common function


// User Interface
$(function() {
  $('a.async').live('click', function (evt) {
    evt.preventDefault();
    state(this.href);
  });
  $('form.async').live('submit', function (evt) {
    evt.preventDefault();
    if (this.method == 'post') {
      var action = this.action;
      $.post(action+'?json', $(this).serialize(), function (r) {
        if (/\/people\/add/.test(action) && r.user) {
          oMap.newUserAdded(r.user);
        }
        if (/\/events\/add/.test(action) && r.event) {
          oMap.newEventAdded(r.event);
        }
        if (r.redirect) {
          state(r.redirect);
        }
      }, 'json');
    } else {
      state(this.action+'?'+$(this).serialize());
    }
  });
});

// History & State Management
function state (url, no_push) {
  $('#main').load(url+(url.indexOf('?')>0?'&':'?')+'_main');
  if (no_push !== 'no push') {
    history.pushState({}, undefined, url);
  }
}

var had_first_pop;
window.onpopstate = function (evt) {
  // skip the first pop
  if (had_first_pop) {
    state(document.location.href, 'no push');
  }
  had_first_pop = true;
}
