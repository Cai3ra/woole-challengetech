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


},{"./controllers":6,"./directives":8}],2:[function(require,module,exports){
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
var BaseController, MapsController,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseController = require('../BaseController');

MapsController = (function(superClass) {
  extend(MapsController, superClass);

  function MapsController($scope, $element, $window, $compile) {
    this.onResize = bind(this.onResize, this);
    this.destroy = bind(this.destroy, this);
    this.findClosest = bind(this.findClosest, this);
    this.onSearchBox = bind(this.onSearchBox, this);
    MapsController.__super__.constructor.call(this, $scope);
    this.scope = $scope;
    this.compile = $compile;
    this.scope.stores = [];
    this.map = null;
    this.markers = [];
    this.w = angular.element($window);
    this.w.bind('resize', this.onResize);
    this.directionsDisplay = null;
    this.originDirection = null;
    console.log("MapsController constructor");
  }

  MapsController.prototype.init = function() {
    console.log("MapsController init");
    return this.configureMap();
  };

  MapsController.prototype.configureMap = function() {
    var mapElement, mapOptions;
    console.log("configureMap");
    mapElement = this.querySelector('.map');
    mapOptions = {
      center: new google.maps.LatLng(-23.5874, -46.6576),
      zoom: 14,
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
    this.styles = [
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
            "color": "#d48200"
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
            "color": "#d48200"
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
            "color": "#d48200"
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
    this.map.setOptions({
      styles: this.styles
    });
  };

  MapsController.prototype.onSearchBox = function() {
    var bounds, center, places;
    places = this.searchBox.getPlaces();
    if (!places || places.length === 0) {
      return;
    }
    this.placeMarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.placeMarkers = [];
    bounds = new google.maps.LatLngBounds();
    places.forEach((function(_this) {
      return function(place) {
        var icon;
        _this.originDirection = place;
        icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        _this.placeMarkers.push(new google.maps.Marker({
          map: _this.map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));
        if (place.geometry.viewport) {
          return bounds.union(place.geometry.viewport);
        } else {
          return bounds.extend(place.geometry.location);
        }
      };
    })(this));
    this.map.fitBounds(bounds);
    center = this.map.getCenter();
    this.findClosest(center.lat(), center.lng());
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


},{"../BaseController":3}],5:[function(require,module,exports){
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
    console.log("MainController");
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
        console.log(_this.element);
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
angular.module('app').directive('mapsDirective', require('./mapsDirective')).directive('modalDirective', require('./modalDirective'));


},{"./mapsDirective":9,"./modalDirective":10}],9:[function(require,module,exports){
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
      tag.src = "https://maps.googleapis.com/maps/api/js?key=" + mapsKey + "&callback=initialize";
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


},{}],10:[function(require,module,exports){
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


},{}]},{},[1]);
