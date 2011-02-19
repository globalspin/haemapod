// Project: haemapod (hackathon)
// URI: /js/site.js
// Description: Common Site Javascript
// Version: 2011-02-18

// Main Site object
if (typeof window.Site === "undefined") {
  window.Site = {};
}

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
    $('#main').load(this.href);
  });
  $('form.async').live('submit', function (evt) {
    evt.preventDefault();
    if (this.method == 'post') {
      $.post(this.action+'?json', $(this).serialize(), function (r) {
        if (r.redirect) {
          $('#main').load(r.redirect);
        }
      }, 'json');
    } else {
      $('#main').load(this.action+'?'+$(this).serialize());
    }
  });
});
