// global Variables
var markers = [];
var map;


function populateInfoWindow(marker, infowindow) {
   // Check to make sure the infowindow is not already opened on this marker.
   if (infowindow.marker != marker) {
     infowindow.setContent('');
     infowindow.marker = marker;
     // Foursquare API Client ID and Secret credentials
     clientID = "NRK0KBINCBSNXBJBYPP2GATZRHQ1PAQL2UWNUGBS2UXI5WPR";
     clientSecret = "SLVGMRUD1B3ITNUTMG4TAX4JKQRZPYTW3H2JVU3R4DAPQXQ3";
     // URL used to make request from foursquare
     var apiurl = 'https://api.foursquare.com/v2/venues/search?ll=' + 29.804320 + ',' + -95.427390 + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&query=' + marker.title +'&v=20171230' + '&m=foursquare';
     // Foursquare API call and data to return
     $.getJSON(apiurl).done(function(marker) {
         var response = marker.response.venues[0];
         self.street = response.location.address;
         self.city = response.location.formattedAddress[1];
         self.category = response.categories[0].shortName;
         self.URL = response.url;

         self.htmlContentFoursquare = '<h5>(' + self.category +')</h5>' + '<div>' +
             '<h6> Address: </h6>' + '<p>' + self.street + '</p>' + '<p>' + self.city + '</p>' + + '<div>' + self.URL + '</div>' + '</div>' + '</div>';

         infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
         }).fail(function() {
             alert("There was an issue loading the Foursquare API. Please refresh your page to try again.");
         });

         this.htmlContent = '<div>' + '<h4>' + marker.title +'</h4>';

     infowindow.open(map, marker);

     // Make sure the marker property is cleared if the infowindow is closed.
     infowindow.addListener('closeclick',function(){
       infowindow.setMarker = null;
     });
   }
 };

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

//create the google map with styles.js
this.initMap = function() {
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
          this.position = locations[i].location;
          this.title = locations[i].title;

          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: this.position,
            title: this.title,
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

        //event listener to show/hide listening on click
        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', hideListings);
};

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

function ViewModel() {
  var self = this;
  this.markers = [];

    //Make text typed in search box observable
    this.searchOption = ko.observable("");

    // Data bind for locations to filter through list of locations
    this.locationsearch = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

function initMap() {
    ko.applyBindings(new ViewModel());
}
