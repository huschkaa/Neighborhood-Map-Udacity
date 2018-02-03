// global marker array
var markers = [];

function initMap () {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 29.804968, lng: -95.418756},
      styles: styles,
      mapTypeControl: false,
      zoom: 16,
  });

  //Set variable for the info window to be created
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('3ad88e');
  // Create a "highlighted location" marker color for when the user mouses over
  var highlightedIcon = makeMarkerIcon('f2f287');

  // Create the markers for the entire map
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });

  //push the markers to the array
  markers.push(marker);

  //onclick event that opens the info window when clicked
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });

  // Event listeners that toggle color of marker icons when mouseover and mouseout
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });

  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
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


    // This function takes in a COLOR, and then creates a new marker icon of that color. The icon will be 21 px wide by 34 high, have an origin of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
      return markerImage;
    }
