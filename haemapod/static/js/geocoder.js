$(function () {
  $('#city').blur(function () {
    $('#geocode_loading').css({visibility: 'visible'});
    new google.maps.Geocoder().geocode({address: this.value}, function (r) {
      if (!r || !r[0] || !r[0].geometry) return;
      var lon = r[0].geometry.location.Ba;
      var lat = r[0].geometry.location.za;
      $('#lon').val(lon);
      $('#lat').val(lat);
      $('#geocode_loading').css({visibility: 'hidden'});
      $('[type=submit]').attr({disabled:false});
    });
  });
});
