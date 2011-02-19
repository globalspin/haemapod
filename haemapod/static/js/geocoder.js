function geocode(city, lat_id, long_id){
  $('#geocode_loading').html('Loooking up geo from city...');
  var url = 'http://maps.google.com/maps/geo?output=json&oe=utf-8&q=' + city + '&mapclient=jsapi&hl=en&callback=?';
  $.getJSON(url, 
    null,
    function(data) {
      console.debug(data.Placemark[0].Point.coordinates);
      $('#'+long_id).val(data.Placemark[0].Point.coordinates[0]);
      $('#'+lat_id).val(data.Placemark[0].Point.coordinates[1]);
      $('#geocode_loading').html('');
      $('#submit_button').show();
    });
}
