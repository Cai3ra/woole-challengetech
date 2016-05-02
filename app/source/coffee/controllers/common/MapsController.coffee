BaseController = require '../BaseController'

class MapsController extends BaseController
	constructor: ($scope, $element, $window, $compile) ->
		super($scope)
		@scope = $scope
		@compile = $compile
		@scope.stores = []
		@map = null
		@markers = []
		@w = angular.element($window);
		@w.bind 'resize', @onResize
		@directionsDisplay = null
		@originDirection = null
		console.log "MapsController constructor"

	init: ->
		console.log "MapsController init"
		@configureMap()
		# @directionsDisplay = new google.maps.DirectionsRenderer()

		# @scope.onSearch = @onSearchBox
		# @inputSearchText = angular.element(document.querySelectorAll(".pac-input"))
		

		# 	@map.setCenter marker.getPosition()
		# 	@map.setZoom(17)
		# 	google.maps.event.trigger(marker, 'click')

		# @scope.trace = (id) =>
		# 	idx = id
		# 	for marker in @markers
		# 		if marker.id == idx
		# 			break

		# 	if @originDirection?
		# 		@inputSearchText.toggleClass('must-require', false)
		# 		@directionsDisplay.setMap(@map)
		# 		request = {
		# 			origin: "#{@originDirection.geometry.location.lat()},#{@originDirection.geometry.location.lng()}",
		# 			destination: "#{marker.position.lat()},#{marker.position.lng()}"  ,
		# 			travelMode: google.maps.TravelMode.DRIVING
		# 		}
		# 		directionsService = new google.maps.DirectionsService()
		# 		directionsService.route request, (response, status) =>
		# 			if (status == google.maps.DirectionsStatus.OK)
		# 				@directionsDisplay.setDirections response
		# 	else
		# 		@inputSearchText.toggleClass('must-require', true)
		# 	false
				

	configureMap: () ->
		console.log "configureMap"
		mapElement = @querySelector('.map')

		mapOptions =
			center: new google.maps.LatLng(-23.5874, -46.6576)
			zoom: 14
			mapTypeId: google.maps.MapTypeId.ROADMAP
			zoomControlOptions: position: google.maps.ControlPosition.TOP_RIGHT
			panControlOptions: position: google.maps.ControlPosition.TOP_RIGHT
		@map = new google.maps.Map(mapElement, mapOptions)
		@map.getCenter()
		
		@styles = [
			{
				"featureType": "all",
				"elementType": "labels.text.fill",
				"stylers": [
					{
					"color": "#ffffff"
					}
				]
		   },
		   {
			   "featureType": "all",
			   "elementType": "labels.text.stroke",
			   "stylers": [
				   {
					   "color": "#000000"
				   },
				   {
					   "lightness": 13
				   }
			   ]
		   },
		   {
			   "featureType": "administrative",
			   "elementType": "geometry.fill",
			   "stylers": [
				   {
					   "color": "#000000"
				   }
			   ]
		   },
		   {
			   "featureType": "administrative",
			   "elementType": "geometry.stroke",
			   "stylers": [
				   {
					   "color": "#144b53"
				   },
				   {
					   "lightness": 14
				   },
				   {
					   "weight": 1.4
				   }
			   ]
		   },
		   {
			   "featureType": "landscape",
			   "elementType": "all",
			   "stylers": [
				   {
					   "color": "#08304b"
				   }
			   ]
		   },
		   {
			   "featureType": "poi",
			   "elementType": "geometry",
			   "stylers": [
				   {
					   "color": "#0c4152"
				   },
				   {
					   "lightness": 5
				   }
			   ]
		   },
		   {
			   "featureType": "road.highway",
			   "elementType": "geometry.fill",
			   "stylers": [
				   {
					   "color": "#d48200"
				   }
			   ]
		   },
		   {
			   "featureType": "road.highway",
			   "elementType": "geometry.stroke",
			   "stylers": [
				   {
					   "color": "#0b434f"
				   },
				   {
					   "lightness": 25
				   }
			   ]
		   },
		   {
			   "featureType": "road.arterial",
			   "elementType": "geometry.fill",
			   "stylers": [
				   {
					   "color": "#d48200"
				   }
			   ]
		   },
		   {
			   "featureType": "road.arterial",
			   "elementType": "geometry.stroke",
			   "stylers": [
				   {
					   "color": "#0b3d51"
				   },
				   {
					   "lightness": 16
				   }
			   ]
		   },
		   {
			   "featureType": "road.local",
			   "elementType": "geometry.fill",
			   "stylers": [
				   {
					   "color": "#000000"
				   }
			   ]
		   },
		   {
			   "featureType": "road.local",
			   "elementType": "geometry.stroke",
			   "stylers": [
				   {
					   "color": "#d48200"
				   }
			   ]
		   },
		   {
			   "featureType": "transit",
			   "elementType": "all",
			   "stylers": [
				   {
					   "color": "#146474"
				   }
			   ]
		   },
		   {
			   "featureType": "water",
			   "elementType": "all",
			   "stylers": [
				   {
					   "color": "#021019"
				   }
			   ]
		   }
			# {
			#    "featureType": "all",
			#    "elementType": "all",
			#    "stylers": [
			# 	   {
			# 		   "hue": "#ff0000"
			# 	   },
			# 	   {
			# 		   "saturation": -100
			# 	   },
			# 	   {
			# 		   "lightness": -30
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "all",
			#    "elementType": "labels.text.fill",
			#    "stylers": [
			# 	   {
			# 		   "color": "#d48200"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "all",
			#    "elementType": "labels.text.stroke",
			#    "stylers": [
			# 	   {
			# 		   "color": "#353535"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "landscape",
			#    "elementType": "geometry",
			#    "stylers": [
			# 	   {
			# 		   "color": "#656565"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "poi",
			#    "elementType": "geometry.fill",
			#    "stylers": [
			# 	   {
			# 		   "color": "#505050"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "poi",
			#    "elementType": "geometry.stroke",
			#    "stylers": [
			# 	   {
			# 		   "color": "#808080"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "road",
			#    "elementType": "geometry",
			#    "stylers": [
			# 	   {
			# 		   "color": "#d48200"
			# 	   }
			#    ]
		 #   },
		 #   {
			#    "featureType": "transit",
			#    "elementType": "labels",
			#    "stylers": [
			# 	   {
			# 		   "hue": "#000000"
			# 	   },
			# 	   {
			# 		   "saturation": 100
			# 	   },
			# 	   {
			# 		   "lightness": -40
			# 	   },
			# 	   {
			# 		   "invert_lightness": true
			# 	   },
			# 	   {
			# 		   "gamma": 1.5
			# 	   }
			#    ]
		 #   }
		]
		@map.setOptions {styles: @styles}
		# @plotMap(lojas)
		# input = @querySelector('.store-maps-view .pac-input')
		# @placeMarkers = []
		# completeOptions =
		# 	types: ['geocode']
		# 	componentRestrictions: {country: 'br'}
			
		# @searchBox = new google.maps.places.SearchBox(input)
		# @searchBox.addListener('places_changed', @onSearchBox)
		# autocomplete = new google.maps.places.Autocomplete(input,completeOptions)
		# autocomplete.bindTo('bounds', @map)

		# @map.fitBounds(bounds)
		# center = @map.getCenter()
		# @findClosest(center.lat(), center.lng())

		
		return

	onSearchBox: =>
		places = @searchBox.getPlaces()

		# console.log places

		return if !places or places.length == 0

		@placeMarkers.forEach (marker) ->
			marker.setMap(null)
			return
		@placeMarkers = []

		bounds = new google.maps.LatLngBounds()
		places.forEach (place) =>
			@originDirection = place
			icon =
				url: place.icon
				size: new google.maps.Size(71, 71)
				origin: new google.maps.Point(0, 0)
				anchor: new google.maps.Point(17, 34)
				scaledSize: new google.maps.Size(25, 25)

			@placeMarkers.push new google.maps.Marker
				map: @map
				icon: icon
				title: place.name
				position: place.geometry.location

			if (place.geometry.viewport)
				bounds.union(place.geometry.viewport)
			else
				bounds.extend(place.geometry.location)

		@map.fitBounds(bounds)
		center = @map.getCenter()
		@findClosest(center.lat(), center.lng())

		return

	findClosest: (lat, lng) =>
		i = @scope.stores.length
		while i-- > 0
			pos = @scope.stores[i].position
			dLat  = pos.lat- lat
			dLng = pos.lng-lng
			d = (dLat*dLat) + (dLng*dLng)
			@scope.stores[i].distance = d
			@scope.stores[i].selected = d < 0.000001
			
			
		@scope.stores.sort (a, b) ->
			return a.distance-b.distance
			
		@onResize()

		#workaround for apply already in progress
		if !@scope.$$phase
			@scope.$apply()

	destroy: =>
		@w.unbind 'resize', @onResize
		false

	onResize: =>
		console.log "maps resize"

	querySelector:(value) ->
		return document.querySelector(value)

module.exports = MapsController
