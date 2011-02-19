Site.Maps = function (oArgs) {
  oArgs = oArgs || {}
  this.zoom = oArgs.zoom || 4;
  this.initialLat = oArgs.latitude || 38;
  this.initialLng = oArgs.longitude || -97;
  this.mapType = oArgs.map_type || 'ROADMAP';
  $(this.setup.bind(this));
}

Site.Maps.prototype.setup = function () {
  // create the map
  this.latlng = new GM.LatLng(this.initialLat, this.initialLng);
  
  this.markerImage = new GM.MarkerImage('/images/spaceup-pin-18x30.png',
    new GM.Size(18, 30),  // size
    new GM.Point(0,0),    // origin
    new GM.Point(9, 30)   // anchor
  );
  
  // set up the map options
  this.mapOptions = {
    zoom: this.zoom,
    center: this.latlng,
    mapTypeId: GM.MapTypeId[this.mapType],
    backgroundColor: '#AEAEAE',
    disableDefaultUI: 1,
    draggable: false,
    scrollwheel: false
  };
  
  this.initialize();
}

Site.Maps.prototype.initialize = function () {
  this.map = new GM.Map($('#map_canvas').get(0), this.mapOptions);
  
  // listen for tiles loaded
  GM.event.addListener(this.map, 'tilesloaded', oMap.listUsers.bind(this));
  GM.event.addListener(this.map, 'tilesloaded', oMap.listEvents.bind(this));
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
  this.queryServer('/people/bounding_box', this.getBoundingBoxCords('forReq'), 'addItemCircle');
}

Site.Maps.prototype.listEvents = function () {
  // load people
  this.queryServer('/events/bounding_box', this.getBoundingBoxCords('forReq'), 'addItemMarkers');
}

Site.Maps.prototype.addItemMarkers = function (oResponse) {
  var oItems = oResponse.users || oResponse.events;
  $.each(oItems, function(_, oItem){
    var latLng = new GM.LatLng(oItem.lat, oItem.lng);
    var marker = new GM.Marker({
      position: latLng,
      map: this.map,
      icon: this.markerImage,
      title: oItem.name
    });
  }.bind(this));
}

Site.Maps.prototype.addItemCircle = function (oResponse) {
  var oItems = oResponse.users || oResponse.events;
  $.each(oItems, function(_, oItem){
    var latLng = new GM.LatLng(oItem.lat, oItem.lng);
    var marker = new GM.Circle({
      center: latLng,
      map: this.map,
      radius: 50000,
      fillOpacity: 0.8,
      fillColor: '#C42816',
      strokeWeight: 1,
      strokeColor: '#000',
      strokeOpacity: 0.65,
    });
  }.bind(this));
}

Site.Maps.prototype.getPeopleNearPoint = function (oCords) {
  console.log(oCords);
}

var oMap = new Site.Maps();
