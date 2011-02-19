// Common site JS


// Project: haemapod (hackathon)
// URI: /js/site.js
// Description: Common Site Javascript
// Version: 2011-02-18
// Author: ReShun Davis

// Main Site object
if (typeof window.Site === "undefined"){window.Site = {};}


// Function prototype method
Function.prototype.bind = function() {
 var __method = this, args = Array.prototype.slice.call(arguments), object = args.shift();
 return function() {
   var local_args = args.concat(Array.prototype.slice.call(arguments));
   if (this !== window) local_args.push(this);
   return __method.apply(object, local_args);
 }
}

// Array prototype extension



// String prototype extension



// Number prototype extension


// Additional common function
