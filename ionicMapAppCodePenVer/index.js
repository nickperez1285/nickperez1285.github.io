// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var MapApp = angular.module('MapApp', ['ionic']);



/**
 * Routing table including associated controllers.
 */
MapApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('menu', {url: "/map", abstract: true, templateUrl: "menu.html"})
    .state('menu.home', {url: '/home', views: {'menuContent': {templateUrl: 'gpsView.html', controller: 'GpsCtrl'} }  })
    .state('menu.help', {url: '/help', views: {'menuContent': {templateUrl: 'helpView.html', controller: 'HelpCtrl'} }  })
  
  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/map/home');
}]);

/**
 * HEADER - handle menu toggle
 */
MapApp.controller('HeaderCtrl', function($scope) {
  // Main app controller, empty for the example
  $scope.leftButtons = [
    { 
    type: 'button-clear',
    content: '<i class="icon ion-navicon"></i>',
    tap: function(e) {
      $scope.sideMenuController.toggleLeft();
      }
    }
  ];
});
/**
 * MAIN CONTROLLER - handle inapp browser
 */
MapApp.controller('MainCtrl', ['$scope', function($scope) {
  // do something
}]);

/**
 * A google map / GPS controller.
 */
MapApp.controller('GpsCtrl', ['$scope','$ionicPlatform', '$location',
  function($scope, $ionicPlatform, $location) {

  // init gps array
    $scope.whoiswhere = [];
    $scope.sf = { lat: 37.7833, lon: 122.4167 };


    // check login code
  $ionicPlatform.ready(function() { navigator.geolocation.getCurrentPosition(function(position) {
        $scope.position=position;
          var c = position.coords;
          $scope.gotoLocation(c.latitude, c.longitude);
        $scope.$apply();
        },function(e) { console.log("Error retrieving position " + e.code + " " + e.message) });
      $scope.gotoLocation = function (lat, lon) {
          if ($scope.lat != lat || $scope.lon != lon) {
              $scope.sf = { lat: lat, lon: lon };
              if (!$scope.$$phase) $scope.$apply("sf");
        }
      };

        // some points of interest to show on the map
        // to be user as markers, objects should have "lat", "lon", and "name" properties
        $scope.whoiswhere = [
            { "name": "My Marker", "lat": $scope.sf.lat, "lon": $scope.sf.lon },
        ];

      });

}]);

/**
 * MAIN CONTROLLER - handle inapp browser
 */
MapApp.controller('HelpCtrl', ['$scope', function($scope) {
  // do something
}]);

// formats a number as a latitude (e.g. 40.46... => "40°27'44"N")
MapApp.filter('lat', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ns = input > 0 ? "N" : "S";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ns;
    }
});

// formats a number as a longitude (e.g. -80.02... => "80°1'24"W")
MapApp.filter('lon', function () {
    return function (input, decimals) {
        if (!decimals) decimals = 0;
        input = input * 1;
        var ew = input > 0 ? "E" : "W";
        input = Math.abs(input);
        var deg = Math.floor(input);
        var min = Math.floor((input - deg) * 60);
        var sec = ((input - deg - min / 60) * 3600).toFixed(decimals);
        return deg + "°" + min + "'" + sec + '"' + ew;
    }
});


/**
 * Menu item click directive - intercept, hide menu and go to new location
 */
MapApp.directive('clickMenulink', function() {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.sideMenuController.toggleLeft();
            });
        }
    }
})


/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
MapApp.directive("appMap", function ($window) {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",         // Map width in pixels.
            height: "@",        // Map height in pixels.
            zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@",    // Whether to show a pan control on the map.
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@"   // Whether to show scale control on the map.
        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var infowindow;
            var currentMarkers;
            var callbackName = 'InitMapCb';

        // callback when google maps is loaded
      $window[callbackName] = function() {
        console.log("map: init callback");
        createMap();
        updateMarkers();
        };

      if (!$window.google || !$window.google.maps ) {
        console.log("map: not available - load now gmap js");
        loadGMaps();
        }
      else
        {
        console.log("map: IS available - create only map now");
        createMap();
        }
      function loadGMaps() {
        console.log("map: start loading js gmaps");
        var script = $window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
        $window.document.body.appendChild(script);
        }

      function createMap() {
        console.log("map: create map start");
        var mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(37.78, -122.41),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: true,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          navigationControl: true,
          disableDefaultUI: true,
          overviewMapControl: true
          };
        if (!(map instanceof google.maps.Map)) {
          console.log("map: create map now as not already available ");
          map = new google.maps.Map(element[0], mapOptions);
          // EDIT Added this and it works on android now
          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener(element[0], 'mousedown', function(e) {
            e.preventDefault();
            return false;
            });
          infowindow = new google.maps.InfoWindow(); 
          }
        }

      scope.$watch('markers', function() {
        updateMarkers();
        });

      // Info window trigger function 
      function onItemClick(pin, label, datum, url) { 
        // Create content  
        var contentString = "Name: " + label + "<br />Time: " + datum;
        // Replace our Info Window's content and position
        infowindow.setContent(contentString);
        infowindow.setPosition(pin.position);
        infowindow.open(map)
        google.maps.event.addListener(infowindow, 'closeclick', function() {
          //console.log("map: info windows close listener triggered ");
          infowindow.close();
          });
        } 

      function markerCb(marker, member, location) {
          return function() {
          //console.log("map: marker listener for " + member.name);
          var href="http://maps.apple.com/?q="+member.lat+","+member.lon;
          map.setCenter(location);
          onItemClick(marker, member.name, member.date, href);
          };
        }

      // update map markers to match scope marker collection
      function updateMarkers() {
        if (map && scope.markers) {
          // create new markers
          //console.log("map: make markers ");
          currentMarkers = [];
          var markers = scope.markers;
          if (angular.isString(markers)) markers = scope.$eval(scope.markers);
          for (var i = 0; i < markers.length; i++) {
            var m = markers[i];
            var loc = new google.maps.LatLng(m.lat, m.lon);
            var mm = new google.maps.Marker({ position: loc, map: map, title: m.name });
            //console.log("map: make marker for " + m.name);
            google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
            currentMarkers.push(mm);
            }
          }
        }

      // convert current location to Google maps location
      function getLocation(loc) {
        if (loc == null) return new google.maps.LatLng(37,-122);
        if (angular.isString(loc)) loc = scope.$eval(loc);
        return new google.maps.LatLng(loc.lat, loc.lon);
        }

      } // end of link:
    }; // end of return
});
