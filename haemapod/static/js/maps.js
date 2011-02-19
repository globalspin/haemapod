Site.Maps = function (oArgs) {
  oArgs = oArgs || {}
  this.zoom = oArgs.zoom || 4;
  this.initialLat = oArgs.latitude || 38;
  this.initialLng = oArgs.longitude || -97;
  this.mapType = oArgs.map_type || 'ROADMAP';
  this.aMarkers = [];
  this.aCircles = [];
  this.aEvents = [];
  this.aUsers = [];
  this.aPolylines = [];
  this.activeUserIds = []
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
  GM.event.addListener(this.map, 'tilesloaded', this.listUsers.bind(this));
  GM.event.addListener(this.map, 'tilesloaded', this.listEvents.bind(this));
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
  this.queryServer('/people/bounding_box', this.getBoundingBoxCords('forReq'), 'addItemUser');
}

Site.Maps.prototype.listEvents = function () {
  // load people
  this.queryServer('/events/bounding_box', this.getBoundingBoxCords('forReq'), 'addItemEvent');
}

Site.Maps.prototype.addItemEvent = function (oResponse) {
  var oItems = oResponse.users || oResponse.events;
  $.each(oItems, function(_, oItem){
    var latLng = new GM.LatLng(oItem.lat, oItem.lng);
    var marker = new GM.Marker({
      position: latLng,
      map: this.map,
      icon: this.markerImage,
      title: oItem.name
    });
    marker['permalink'] = oItem.permalink;
    this.aMarkers.push(marker);
    this.aEvents.push(oItem);
  }.bind(this));
}

Site.Maps.prototype.addItemUser = function (oResponse) {
  var oItems = oResponse.users || oResponse.events;
  $.each(oItems, function(_, oItem){
    var latLng = new GM.LatLng(oItem.lat, oItem.lng);
    var circle = new GM.Circle({
      center: latLng,
      map: this.map,
      radius: 50000,
      fillOpacity: 0.8,
      fillColor: '#C42816',
      strokeWeight: 1,
      strokeColor: '#000',
      strokeOpacity: 0.65,
    });
    circle['permalink'] = oItem.permalink;
    this.aCircles.push(circle);
    this.aUsers.push(oItem);
  }.bind(this));
}

Site.Maps.prototype.newUserAdded = function (user) {
  var latLng = new GM.LatLng(user.lat, user.lng);
  var circle = new GM.Circle({
    center: latLng,
    map: this.map,
    radius: 50000,
    fillOpacity: 0.8,
    fillColor: '#C42816',
    strokeWeight: 1,
    strokeColor: '#000',
    strokeOpacity: 0.65,
  });
  this.aCircles.push(circle);
  this.aUsers.push(user);
  
  // $.each(this.aCircles, function(_, item) {
  //   item.setMap(this.map);
  // }.bind(this));
}

Site.Maps.prototype.newEventAdded = function (event) {
  console.log(event);
  var latLng = new GM.LatLng(event.lat, event.lng);
  var marker = new GM.Marker({
    position: latLng,
    map: this.map,
    icon: this.markerImage,
    title: event.name
  });
  marker['permalink'] = event.permalink;
  this.aMarkers.push(marker);
  this.aEvents.push(event);
}

Site.Maps.prototype.highlightUser = function (user, events) {
  var user = user || this.aUsers[4];
  var events = events || this.aCircles;
  
  $.each(this.aCircles, function(_, item) {
    if (item.permalink == user.permalink) {
      item.setOptions({
        radius: 65000,
        fillOpacity: 1,
        fillColor: '#3A2FF9',
        strokeColor: '#C42816',
        strokeWeight: 3,
        strokeOpacity: 1,
        zIndex: 100
      });
    } else {
      this.resetUser(item);
    }
  }.bind(this));
}

Site.Maps.prototype.highlightEvent = function (event, users) {
  var event = event || this.aEvents[4];
  var users = users || this.aUsers;
  $.each(users, function() {
    this.activeUserIds[users.permalink] = 1;
  }.bind(this));
  console.log(this.activeUserIds);
  console.log(users);
  // return;
  // console.log(event);
  // console.log(this.activeUserIds);
  
  this.resetMap();
  
  $.each(this.aMarkers, function(_, item) {
    if (item.permalink != event.permalink) {
      item.setMap(null);
    } else {
      this.activeMarker = item;
    }
  }.bind(this));
  
  $.each(this.aCircles, function(_, item) {
    console.log(this.activeUserIds[item.permalink]);
    if (!this.activeUserIds[item.permalink]) {
      item.setMap(null);
    } else {
      var line = new GM.Polyline({
        map: this.map,
        path: [item.getCenter(),this.activeMarker.getPosition()],
        strokeColor: '#3A2FF9',
        strokeOpacity: 1,
        strokeWeight: 2,
        zIndex: 1
      });

      item.setOptions({
        fillOpacity: 1,
        fillColor: '#3A2FF9',
        strokeColor: '#3A2FF9',
        strokeWeight: 3,
        strokeOpacity: 1,
        zIndex: 100
      });

      this.aPolylines.push(line);
    }
  }.bind(this));
}

Site.Maps.prototype.resetUser = function (item) {
  item.setOptions({
    radius: 50000,
    fillOpacity: 0.8,
    fillColor: '#C42816',
    strokeWeight: 1,
    strokeColor: '#000',
    strokeOpacity: 0.65,
    zIndex: 10
  });
  item.setMap(this.map); // Show the user
}

Site.Maps.prototype.resetUsers = function () {
  $.each(this.aCircles, function(_, item) {
    item.setOptions({
      radius: 50000,
      fillOpacity: 0.8,
      fillColor: '#C42816',
      strokeWeight: 1,
      strokeColor: '#000',
      strokeOpacity: 0.65,
      zIndex: 10
    });
    item.setMap(this.map); // Show the user
  }.bind(this));
}

Site.Maps.prototype.resetEvents = function () {
  $.each(this.aMarkers, function(_, item) {
    item.setMap(this.map); // Show the event
  }.bind(this));
  
  this.showUsers();
}

Site.Maps.prototype.removePolylines = function () {
  $.each(this.aPolylines, function(_, item) {
    item.setMap(null); // Show the event
  }.bind(this));
  
  this.aPolylines = [];
}

Site.Maps.prototype.resetMap = function () {
  this.resetUsers();
  this.resetEvents();
  this.removePolylines();
}

Site.Maps.prototype.showUsers = function () {
  $.each(this.aCircles, function(_, item) {
    item.setMap(this.map);
  }.bind(this));
}

Site.Maps.prototype.hideUsers = function () {
  $.each(this.aCircles, function(_, item) {
    item.setMap(null);
  }.bind(this));
}

var oMap = new Site.Maps();
