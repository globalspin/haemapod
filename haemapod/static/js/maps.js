Site.Maps = function (oArgs) {
  oArgs = oArgs || {}
  this.zoom = oArgs.zoom || 3;
  this.initialLat = oArgs.latitude || 38;
  this.initialLng = oArgs.longitude || -97;
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
  this.map = new google.maps.Map($('#map_canvas').get(0), this.mapOptions);
  
  // listen for tiles loaded
  google.maps.event.addListener(this.map, 'tilesloaded', oMap.listUsers.bind(this));
}

Site.Maps.prototype.getBoundingBoxCords = function (forReq) {
  var oBounds = this.map.getBounds();
  
  if (forReq) {
    var topLeft = oBounds.getSouthWest();
    var bottomRight = oBounds.getNorthEast();
    return {
      lat1:topLeft.lat(),
      lng1:topLeft.lng(),
      lat2:bottomRight.lat(),
      lng2:bottomRight.lng()
    };
  } else {
    return oBounds;
  }
}

Site.Maps.prototype.getCenterCords = function (forReq) {
  var center = this.map.getCenter();
  if (forReq) {
    return {
      lat:center.lat(),
      lng:center.lng()
    };
  } else {
    return center;
  }
}

Site.Maps.prototype.queryServer = function (sUrl, oArgs, sCallback) {
  sCallback = sCallback || 'listenServerServerResponse';
  oArgs['json'] = 1;
  $.getJSON(sUrl,oArgs).done(this[sCallback].bind(this));
}

Site.Maps.prototype.listenServerServerResponse = function (oResponse) {
  console.log('nothing to report');
}

Site.Maps.prototype.listUsers = function () {
  // load people
  this.queryServer('/people/bounding_box', this.getBoundingBoxCords('forReq'), 'addUserCircle');
}

Site.Maps.prototype.addUserMarkers = function (oResponse) {
  $.each(oResponse.users, function(_, user){
    var latLng = new google.maps.LatLng(user.lat, user.lng);
    var marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: user.name
    });
  }.bind(this));
}

Site.Maps.prototype.addUserCircle = function (oResponse) {
  $.each(oResponse.users, function(_, user){
    var latLng = new google.maps.LatLng(user.lat, user.lng);
    var marker = new google.maps.Circle({
      center: latLng,
      map: this.map,
      radius: 100000,
      fillOpacity: 0.8,
      fillColor: '#C42816',
      strokeWeight: 1,
      strokeColor: '#000',
      strokeOpacity: 0.65
    });
  }.bind(this));
}

Site.Maps.prototype.getPeopleNearPoint = function (oCords) {
  console.log(oCords);
}

var oMap = new Site.Maps();
