(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('app', ['ui.router', 'ngResource', 'ngTouch', 'dibari.angular-ellipsis']).config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  return $stateProvider.state('main', {
    url: '/',
    templateUrl: '/views/main.html',
    controller: 'MainController'
  });
});

require('./controllers');

require('./directives');


},{"./controllers":6,"./directives":9}],2:[function(require,module,exports){
var ApplicationController;

ApplicationController = (function() {
  function ApplicationController($rootScope, $scope, $window) {
    $rootScope.$on('$stateChangeStart', function() {
      return $window.scrollTo(0, 0);
    });
    false;
  }

  return ApplicationController;

})();

module.exports = ApplicationController;


},{}],3:[function(require,module,exports){
var BaseController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BaseController = (function() {
  function BaseController($scope) {
    this.destroy = bind(this.destroy, this);
    this.scope = $scope;
    this._destroy(this.destroy);
  }

  BaseController.prototype.destroy = function(e) {
    return false;
  };

  BaseController.prototype._destroy = function(cb) {
    return this.scope.$on('$destroy', cb);
  };

  return BaseController;

})();

module.exports = BaseController;


},{}],4:[function(require,module,exports){
var BaseController, MapStyles, MapsController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseController = require('../BaseController');

MapStyles = require('../../utils/MapStyles');

MapsController = (function(superClass) {
  extend(MapsController, superClass);

  function MapsController($scope, $element, $window, $compile) {
    this.onResize = bind(this.onResize, this);
    this.destroy = bind(this.destroy, this);
    this.findClosest = bind(this.findClosest, this);
    this.renderPlace = bind(this.renderPlace, this);
    this.onSearchEndBox = bind(this.onSearchEndBox, this);
    this.onSearchStartBox = bind(this.onSearchStartBox, this);
    this.getRoute = bind(this.getRoute, this);
    this.onSearch = bind(this.onSearch, this);
    this.setSearchBoxes = bind(this.setSearchBoxes, this);
    this.setStopPoints = bind(this.setStopPoints, this);
    MapsController.__super__.constructor.call(this, $scope);
    this.scope = $scope;
    this.compile = $compile;
    this.scope.submitSearch = this.onSearch;
    this.map = null;
    this.markers = [];
    this.w = angular.element($window);
    this.w.bind('resize', this.onResize);
    this.geocoder = null;
    this.directionsService = null;
    this.directionsDisplay = null;
    this.originDirection = null;
    this.searchStartBox = null;
    this.searchEndBox = null;
    this.places = {
      start: null,
      dest: null
    };
  }

  MapsController.prototype.init = function() {
    return this.configureMap();
  };

  MapsController.prototype.configureMap = function() {
    var mapElement, mapOptions;
    mapElement = this.querySelector('.map');
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    mapOptions = {
      center: new google.maps.LatLng(-23.5874, -46.6576),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    };
    this.map = new google.maps.Map(mapElement, mapOptions);
    this.map.getCenter();
    this.map.setOptions({
      styles: MapStyles.woole()
    });
    this.placeMarkers = [];
    this.setStopPoints();
    this.setSearchBoxes();
  };

  MapsController.prototype.setStopPoints = function() {
    console.log("setStopPoints");
    return this.kmlLayer = new google.maps.KmlLayer({
      url: 'http://c4i3r4.co/woole-challengetech/data/stop_points.kml',
      map: this.map
    });
  };

  MapsController.prototype.setSearchBoxes = function() {
    var autocompleteEnd, autocompleteStart, completeOptions, input;
    completeOptions = {
      types: ['geocode'],
      componentRestrictions: {
        country: 'br'
      }
    };
    input = this.querySelector('.default-input.start-input');
    this.searchStartBox = new google.maps.places.SearchBox(input);
    this.searchStartBox.addListener('places_changed', this.onSearchStartBox);
    autocompleteStart = new google.maps.places.Autocomplete(input, completeOptions);
    autocompleteStart.bindTo('bounds', this.map);
    input = this.querySelector('.default-input.end-input');
    this.searchEndBox = new google.maps.places.SearchBox(input);
    this.searchEndBox.addListener('places_changed', this.onSearchEndBox);
    autocompleteEnd = new google.maps.places.Autocomplete(input, completeOptions);
    return autocompleteEnd.bindTo('bounds', this.map);
  };

  MapsController.prototype.onSearch = function() {
    if (!this.places.start || !this.places.dest) {
      return;
    }
    return this.getRoute(this.places.start[0].geometry.location, this.places.dest[0].geometry.location);
  };

  MapsController.prototype.getRoute = function(_origLatLng, _destLatLng) {
    var request, waypts;
    this.directionsDisplay.setMap(this.map);
    waypts = [];
    request = {
      origin: _origLatLng,
      destination: _destLatLng,
      travelMode: google.maps.TravelMode.BICYCLING,
      waypoints: waypts,
      optimizeWaypoints: true
    };
    return this.directionsService.route(request, (function(_this) {
      return function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response, response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text);
          return _this.directionsDisplay.setDirections(response);
        } else {
          return window.alert('Directions request failed due to ' + status);
        }
      };
    })(this));
  };

  MapsController.prototype.onSearchStartBox = function() {
    if (this.places.start !== null) {
      this.places.start = null;
    }
    this.places.start = this.searchStartBox.getPlaces();
    if (!this.places.start || this.places.start.length === 0) {
      return;
    }
    this.renderPlace();
  };

  MapsController.prototype.onSearchEndBox = function() {
    if (this.places.dest !== null) {
      this.places.dest = null;
    }
    this.places.dest = this.searchEndBox.getPlaces();
    if (!this.places.dest || this.places.dest.length === 0) {
      return;
    }
    this.renderPlace();
  };

  MapsController.prototype.renderPlace = function() {
    var bounds, center;
    this.placeMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.placeMarkers = [];
    bounds = new google.maps.LatLngBounds();
    angular.forEach(this.places, (function(_this) {
      return function(value, key) {
        var icon;
        icon = {
          url: value[0].icon,
          size: new google.maps.Size(130, 130),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        _this.placeMarkers.push(new google.maps.Marker({
          map: _this.map,
          icon: icon,
          title: value[0].name,
          position: value[0].geometry.location
        }));
        if (value[0].geometry.viewport) {
          return bounds.union(value[0].geometry.viewport);
        } else {
          return bounds.extend(value[0].geometry.location);
        }
      };
    })(this));
    this.map.fitBounds(bounds);
    return center = this.map.getCenter();
  };

  MapsController.prototype.findClosest = function(lat, lng) {
    var d, dLat, dLng, i, pos;
    i = this.scope.stores.length;
    while (i-- > 0) {
      pos = this.scope.stores[i].position;
      dLat = pos.lat - lat;
      dLng = pos.lng - lng;
      d = (dLat * dLat) + (dLng * dLng);
      this.scope.stores[i].distance = d;
      this.scope.stores[i].selected = d < 0.000001;
    }
    this.scope.stores.sort(function(a, b) {
      return a.distance - b.distance;
    });
    this.onResize();
    if (!this.scope.$$phase) {
      return this.scope.$apply();
    }
  };

  MapsController.prototype.destroy = function() {
    this.w.unbind('resize', this.onResize);
    return false;
  };

  MapsController.prototype.onResize = function() {
    return console.log("maps resize");
  };

  MapsController.prototype.querySelector = function(value) {
    return document.querySelector(value);
  };

  return MapsController;

})(BaseController);

module.exports = MapsController;


},{"../../utils/MapStyles":12,"../BaseController":3}],5:[function(require,module,exports){
var BaseController, ModalController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseController = require('../BaseController');

ModalController = (function(superClass) {
  extend(ModalController, superClass);

  function ModalController($scope) {
    this.onSend = bind(this.onSend, this);
    ModalController.__super__.constructor.call(this, $scope);
    this.scope = $scope;
    this.init();
  }

  ModalController.prototype.init = function() {
    return false;
  };

  ModalController.prototype.onSend = function() {
    return false;
  };

  return ModalController;

})(BaseController);

module.exports = ModalController;


},{"../BaseController":3}],6:[function(require,module,exports){
angular.module('app').controller('ApplicationController', require('./ApplicationController')).controller('MainController', require('./main/MainController')).controller('MapsController', require('./common/MapsController')).controller('ModalController', require('./common/ModalController'));


},{"./ApplicationController":2,"./common/MapsController":4,"./common/ModalController":5,"./main/MainController":7}],7:[function(require,module,exports){
var BaseController, MainController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseController = require('../BaseController');

MainController = (function(superClass) {
  extend(MainController, superClass);

  function MainController($scope, $rootScope, $compile, $element) {
    this.destroy = bind(this.destroy, this);
    this.scope = $scope;
    this.rootScope = $rootScope;
    this.compile = $compile;
    this.element = $element;
    this.scope.templates = [
      {
        "class": "",
        url: "views/partials/maps.html"
      }
    ];
    setTimeout((function(_this) {
      return function() {
        return _this.scope.$apply(function() {
          var el;
          el = $compile('<div class="maps-directive"></div>')(_this.scope);
          return angular.element(document.querySelector(".maps-box")).append(el);
        });
      };
    })(this), 500);
    MainController.__super__.constructor.call(this, $scope);
  }

  MainController.prototype.destroy = function() {
    return false;
  };

  return MainController;

})(BaseController);

module.exports = MainController;


},{"../BaseController":3}],8:[function(require,module,exports){
var formDirective;

formDirective = (function() {
  function formDirective() {}

  formDirective.init = function($window, $rootScope) {
    return {
      restrict: 'AC',
      link: function($scope, $document, $rootScope) {
        var _elBt, _elDirective;
        _elDirective = $document;
        _elBt = $document.children().eq(3);
        console.log(_elBt);
        return $scope.toggleExpand = function() {
          console.log("toggleExpand");
          angular.element(_elDirective).toggleClass("expanded");
          return false;
        };
      }
    };
  };

  return formDirective;

})();

module.exports = formDirective.init;


},{}],9:[function(require,module,exports){
angular.module('app').directive('mapsDirective', require('./mapsDirective')).directive('formDirective', require('./formDirective')).directive('modalDirective', require('./modalDirective'));


},{"./formDirective":8,"./mapsDirective":10,"./modalDirective":11}],10:[function(require,module,exports){
var mapsDirective;

mapsDirective = (function() {
  function mapsDirective() {}

  mapsDirective.loadScript = function($window) {
    var clusterTag, mapsKey, tag;
    if ($window.google == null) {
      clusterTag = document.createElement('script');
      clusterTag.src = 'js/libs/lazy/markerclusterer_compiled.js';
      document.body.appendChild(clusterTag);
      mapsKey = 'AIzaSyDDWLyi8QG0CjcQdC-3efc6pPTdhubCO38';
      tag = document.createElement('script');
      tag.src = "https://maps.googleapis.com/maps/api/js?key=" + mapsKey + "&language=pt_BR&libraries=places&callback=initialize";
      return document.body.appendChild(tag);
    } else {
      return $window.initialize();
    }
  };

  mapsDirective.lazyLoad = function($window, $q) {
    var deferred;
    deferred = $q.defer();
    $window.initialize = function() {
      return deferred.resolve();
    };
    mapsDirective.loadScript($window);
    return deferred.promise;
  };

  mapsDirective.create = function($window, $q) {
    return {
      restrict: 'AC',
      controller: 'MapsController',
      controllerAs: 'maps',
      templateUrl: 'views/partials/maps.html',
      link: function(controller) {
        return mapsDirective.lazyLoad($window, $q).then(function() {
          if (($window.google != null) && ($window.google.maps != null)) {
            return controller.maps.init();
          }
        }, function() {
          return console.log('promise error');
        });
      }
    };
  };

  return mapsDirective;

})();

module.exports = mapsDirective.create;


},{}],11:[function(require,module,exports){
var modalDirective;

modalDirective = (function() {
  function modalDirective() {}

  modalDirective.create = function() {
    return {
      restrict: 'AC',
      controller: 'ModalController',
      controllerAs: 'md',
      template: '<div class="modal-overlay"></div> <div class="modal-container"> <div class="modal-content entry" ng-include="_modalPath"></div> </div>',
      link: function($scope, $document, $rootScope) {
        var _elDirective, _elOverlay;
        _elDirective = $document;
        _elOverlay = $document.children().eq(0);
        $scope.showModal = function(view, msg) {
          _elDirective.addClass('shown');
          _elOverlay.addClass('fade');
          $scope._modalPath = "/views/partials/modals/" + view + ".html";
          angular.element(document.querySelectorAll("body")).css("overflow", "hidden");
          return false;
        };
        return $scope.closeModal = function() {
          _elDirective.removeClass('shown');
          _elOverlay.removeClass('fade');
          angular.element(document.querySelectorAll("body")).css("overflow", "auto");
          angular.element(document.querySelector(".modal-content")).removeClass("entry");
          angular.element(document.querySelector(".modal-btn-close")).addClass("fade");
          return false;
        };
      }
    };
  };

  return modalDirective;

})();

module.exports = modalDirective.create;


},{}],12:[function(require,module,exports){
var MapStyles;

MapStyles = (function() {
  function MapStyles() {}

  MapStyles.woole = function() {
    return [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#000000"
          }, {
            "lightness": 13
          }
        ]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#144b53"
          }, {
            "lightness": 14
          }, {
            "weight": 1.4
          }
        ]
      }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#08304b"
          }
        ]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#0c4152"
          }, {
            "lightness": 5
          }
        ]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#FF9715"
          }
        ]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#0b434f"
          }, {
            "lightness": 25
          }
        ]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#FF9715"
          }
        ]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#0b3d51"
          }, {
            "lightness": 16
          }
        ]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#FF9715"
          }
        ]
      }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "color": "#146474"
          }
        ]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#021019"
          }
        ]
      }
    ];
  };

  return MapStyles;

})();

module.exports = MapStyles;


},{}]},{},[1]);
