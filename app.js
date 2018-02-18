// global Variables
var map;
var infoWindow;
var bounds;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 29.804968, lng: -95.418756},
      styles: styles,
      mapTypeControl: false,
      zoom: 15,
    });
    infoWindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();

    ko.applyBindings(new ViewModel());
}

//Will handle map error and notify the user
function MapError() {
    alert('An error occurred with Google Maps!');
}

var LocationMarker = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.street = '';
    this.city = '';
    this.category = '';
    this.url = '';
    this.phone = '';

    this.visible = ko.observable(true);

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('3ad88e');

    // Create a "highlighted location" marker color for when the user mouses over
    var highlightedIcon = makeMarkerIcon('f2f287');

    // Foursquare API Client ID and Secret credentials
    var clientID = 'NRK0KBINCBSNXBJBYPP2GATZRHQ1PAQL2UWNUGBS2UXI5WPR';
    var clientSecret = 'SLVGMRUD1B3ITNUTMG4TAX4JKQRZPYTW3H2JVU3R4DAPQXQ3';

    // get JSON request of foursquare data
    var apiurl = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;

    $.getJSON(apiurl).done(function(data) {
		var results = data.response.venues[0];
        self.category = results.categories[0].shortName ? results.categories[0].shortName: 'N/A';
        self.street = results.location.address ? results.location.address: 'N/A';
        self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
        self.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
        self.url = results.url ? results.url: 'N/A';
    }).fail(function() {
        alert('We were unable to connect with FourSquare. Please attempt to refresh the page.');
    });

    // Create a marker per location, and put into markers array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
    });

    self.filterMarkers = ko.computed(function () {
        // set marker and extend bounds (showListings)
        if(self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });

    // Create an onclick even to open an indowindow at each marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.category, self.street, self.city, self.phone, self.url, infoWindow);
        toggleBounce(this);
        map.panTo(this.getPosition());
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    // show item info when selected from list
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };

    // creates bounce effect when item selected
    this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

};


var ViewModel = function(){
  var self = this;

  this.searchItem = ko.observable('');

  this.mapList = ko.observableArray([]);

  // add location markers for each location
  locations.forEach(function(location) {
      self.mapList.push( new LocationMarker(location) );
  });

  // locations viewed on map
  this.locationList = ko.computed(function() {
      var searchFilter = self.searchItem().toLowerCase();
      if (searchFilter) {
          return ko.utils.arrayFilter(self.mapList(), function(location) {
              var str = location.title.toLowerCase();
              var result = str.includes(searchFilter);
              location.visible(result);
      return result;
    });
      }
      self.mapList().forEach(function(location) {
          location.visible(true);
      });
      return self.mapList();
  }, self);
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, category, street, city, phone, url, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;

      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
      });

      var windowContent =
        '<h4>' + marker.title + '</h4>' + '<h5>' + category + '</h5>' +
        street + '<br>' + city + '<br>' + phone + '<br>' + '<a href="'+url+'" target="blank" > Website </a>'+'</p>';

      infowindow.setContent(windowContent);

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
  }
}

function toggleBounce(marker) {
if (marker.getAnimation() !== null) {
  marker.setAnimation(null);
} else {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
      marker.setAnimation(null);
  }, 1400);
}
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
  return markerImage;
}
