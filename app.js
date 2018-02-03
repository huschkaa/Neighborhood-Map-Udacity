// global marker array
var markers = [];

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 29.804968, lng: -95.418756},
      zoom: 16,
  });

  //Set variable for the info window to be created
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Create the markers for the entire map
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

  //push the markers to the array
  markers.push(marker);

//onclick event that opens the info window when clicked
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
}
  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
}

function populateInfoWindow(marker, infowindow) {
       // Check to make sure the infowindow is not already opened on this marker.
       if (infowindow.marker != marker) {
         infowindow.marker = marker;
         infowindow.setContent('<div>' + marker.title + '</div>');
         infowindow.open(map, marker);
         // Make sure the marker property is cleared if the infowindow is closed.
         infowindow.addListener('closeclick',function(){
           infowindow.setMarker = null;
         });
       }
     }
     // This function will loop through the markers array and display them all.
     function showListings() {
       var bounds = new google.maps.LatLngBounds();
       // Extend the boundaries of the map for each marker and display the marker
       for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(map);
         bounds.extend(markers[i].position);
       }
       map.fitBounds(bounds);
     }
     // This function will loop through the listings and hide them all.
     function hideListings() {
       for (var i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
       }
     }
