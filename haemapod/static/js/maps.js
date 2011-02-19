Site.Maps = function (oArgs) {
  oArgs = oArgs || {}
  this.zoom = oArgs.zoom || 11;
  this.initialLat = oArgs.latitude || 32.71207;
  this.initialLng = oArgs.longitude || -117.15589;
  this.mapType = oArgs.map_type || 'ROADMAP';

  $(this.setup.bind(this));
}

Site.Maps.prototype.setup = function () {
  // create the map
  this.latlng = new google.maps.LatLng(this.initialLat, this.initialLng);
  
  // set up the map options
  this.mapOptions = {
    zoom: this.zoom,
    center: this.latlng,
    mapTypeId: google.maps.MapTypeId[this.mapType]
  };
  
  this.initialize();
}

Site.Maps.prototype.initialize = function () {
  this.mapObject = new google.maps.Map(document.getElementById("map_canvas"), this.mapOptions);
}

Site.Maps.prototype.map = function () {
  if (!this.mapObject) {
    this.initialize();
  }
  
  return this.mapObject;
}

Site.oMap = new Site.Maps();
