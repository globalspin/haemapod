function geocode(city, lat_id, long_id){
  $('#geocode_loading').html('Loooking up geo from city...');

  new google.maps.Geocoder().geocode({address: city}, function (data) {
      var long = arguments[0][0].geometry.location.Ba;
      var lat = arguments[0][0].geometry.location.za;

      $('#'+long_id).val(long);
      $('#'+lat_id).val(lat);
      $('#geocode_loading').html('');
      $('[type=submit]').show();
    });
}
