Site.Maps = function (oArgs) {
  oArgs = oArgs || {}
  this.zoom = oArgs.zoom || 4;
  this.initialLat = oArgs.latitude || 38;
  this.initialLng = oArgs.longitude || -110;
  this.mapType = oArgs.map_type || 'ROADMAP';
  this.aMarkers = [];
  this.aCircles = [];
  this.aEvents = {};
  this.aUsers = {};
  this.aPolylines = [];
  this.bRendering = false;
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
  
  // this.eventInfoWindow = new GM.InfoWindow({ 
  //   content: "Copy goes here",
  //   size: new GM.Size(50,50)
  // });

  // set up the map options
  this.mapOptions = {
    zoom: this.zoom,
    center: this.latlng,
    mapTypeId: GM.MapTypeId[this.mapType],
    backgroundColor: '#AEAEAE',
    disableDefaultUI: 1,
    // draggable: false,
    scrollwheel: false
  };
  
  this.initialize();
}

Site.Maps.prototype.initialize = function () {
  this.map = new GM.Map($('#map_canvas').get(0), this.mapOptions);
  
  // listen for tiles loaded
  GM.event.addListener(this.map, 'tilesloaded', this.listUsers.bind(this));
  GM.event.addListener(this.map, 'tilesloaded', this.listEvents.bind(this));
  
  GM.event.addListener(this.map, 'tilesloaded', function () {
    load_page_data(document.location.href);
  });
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
  
  for (var i = oItems.length - 1; i >= 0; i--){
    item = oItems[i];
    var latLng = new GM.LatLng(item.lat, item.lng);
    var marker = new GM.Marker({
      position: latLng,
      map: this.map,
      icon: this.markerImage,
      title: item.name
    });
    
    GM.event.addListener(marker, 'click', this.openEventInfo.bind(this));

    marker['key'] = item.key;
    this.aMarkers.push(marker);
    this.aEvents[item.key] = item;
  }
  
  
  // $.each(oItems, function(_, oItem){
  // }.bind(this));
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
      clickable: true
    });
    
    GM.event.addListener(circle, 'click', this.openUserInfo.bind(this));
    
    circle['key'] = oItem.key;
    this.aCircles.push(circle);
    this.aUsers[oItem.key] = oItem;
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
  this.aUsers[user.key] = user;
}

Site.Maps.prototype.newEventAdded = function (event) {
  var latLng = new GM.LatLng(event.lat, event.lng);
  var marker = new GM.Marker({
    position: latLng,
    map: this.map,
    icon: this.markerImage,
    title: event.name
  });
  marker['key'] = event.key;
  this.aMarkers.push(marker);
  this.aEvents[event.key] = event;
}

Site.Maps.prototype.highlightUser = function (user, events) {
  var user = user || this.aUsers[4];
  var events = events || this.aCircles;
  var activeEventsKeys = []
  var activeCircle;
  if (!user) return;

  this.resetMap();
  
  for (var i = events.length - 1; i >= 0; i--){
    activeEventsKeys[events[i].key] = 1;
  };

  for (var i = this.aCircles.length - 1; i >= 0; i--){
    item = this.aCircles[i];
    if (item.key == user.key) {
      item.setOptions({
        radius: 65000,
        fillOpacity: 1,
        fillColor: '#3A2FF9',
        strokeColor: '#C42816',
        strokeWeight: 3,
        strokeOpacity: 1,
        zIndex: 100
      });
      activeCircle = item;
    } else {
      item.setMap(null);
      // this.resetUser(item);
    }
  }

  if (!this.aPolylines) this.aPolylines = [];
  for (var i = this.aMarkers.length - 1; i >= 0; i--){
    var item = this.aMarkers[i];
    if (activeEventsKeys[item.key]) {
      var line = new GM.Polyline({
        map: this.map,
        path: [item.getPosition(), activeCircle.getCenter()],
        strokeColor: '#3A2FF9',
        strokeOpacity: 1,
        strokeWeight: 2,
        zIndex: 1
      });
      this.aPolylines.push(line);
    } else {
      item.setMap(null);
    }
    
  };
  
  this.bRendering = false;
}

Site.Maps.prototype.highlightEvent = function (event, users) {
  var event = event || this.aEvents[4];
  var users = users || this.aUsers;
  var activeUserKeys = [];
  var activeMarker;
  for (var i = users.length - 1; i >= 0; i--){
    activeUserKeys[users[i].key] = users[i];
  };

  this.resetMap();
  
  for (var i = this.aMarkers.length - 1; i >= 0; i--){
    item = this.aMarkers[i]
    if (item.key != event.key) {
      item.setMap(null);
    } else {
      activeMarker = item;
    }
  };
  
  if (!this.aPolylines) this.aPolylines = [];
  for (var i = this.aCircles.length - 1; i >= 0; i--){
    item = this.aCircles[i]
    if (!activeUserKeys[item.key]) {
      item.setMap(null);
    } else {
      if (activeUserKeys[item.key].interested) {
        item.setOptions({
          fillOpacity: 1,
          fillColor: '#C42816',
          strokeColor: '#C42816',
          strokeWeight: 3,
          strokeOpacity: 1,
          zIndex: 100
        });
      } else {
        var line = new GM.Polyline({
          map: this.map,
          path: [item.getCenter(), activeMarker.getPosition()],
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
    }
  }
  this.bRendering = false;
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
  for (var i = this.aCircles.length - 1; i >= 0; i--){
    item = this.aCircles[i];
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
}

Site.Maps.prototype.resetEvents = function () {
  for (var i = this.aMarkers.length - 1; i >= 0; i--){
    this.aMarkers[i].setMap(this.map);
  };
  // this.showUsers();
  this.bRendering = false;
}

Site.Maps.prototype.removePolylines = function () {
  if (!this.aPolylines) return;
  for (var i = this.aPolylines.length - 1; i >= 0; i--){
    this.aPolylines[i].setMap(null); // hide them
  };

  this.aPolylines = null;
}

Site.Maps.prototype.resetMap = function () {
  if (this.bRendering) return;
  this.bRendering = true;
  
  this.removePolylines();
  this.resetUsers();
  this.resetEvents();
}

Site.Maps.prototype.showUsers = function () {
  for (var i = this.aCircles.length - 1; i >= 0; i--){
    this.aCircles[i].setMap(this.map);
  };
}

Site.Maps.prototype.hideUsers = function () {
  for (var i = this.aCircles.length - 1; i >= 0; i--){
    this.aCircles[i].setMap(null);
  };
}

Site.Maps.prototype.openUserInfo = function (latlng, circle) {
  if (document.location.href == this.aUsers[circle.key].permalink) return;
  state(this.aUsers[circle.key].permalink);
}

Site.Maps.prototype.openEventInfo = function (evt, marker) {
  if (document.location.href == this.aEvents[marker.key].permalink) return;
  state(this.aEvents[marker.key].permalink);
  // this.eventInfoWindow.open(this.map, circle);
}

var oMap = new Site.Maps();
