BaseController = require '../BaseController'

class MapsController extends BaseController
	constructor: ($scope, $element, $window, $compile) ->
		super($scope)
		@scope = $scope
		@compile = $compile
		@scope.submitSearch = @onSearch
		@map = null
		@markers = []
		@w = angular.element($window);
		@w.bind 'resize', @onResize
		@geocoder = null
		@directionsService = null
		@directionsDisplay = null
		@originDirection = null
		@searchStartBox = null
		@searchEndBox = null
		@places = {start: null, dest: null}

	init: ->
		@configureMap()

	configureMap: () ->
		mapElement = @querySelector('.map')
		@geocoder = new google.maps.Geocoder()
		@directionsService = new google.maps.DirectionsService()
		@directionsDisplay = new google.maps.DirectionsRenderer()

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
					   "color": "#FF9715"
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
					   "color": "#FF9715"
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
					   "color": "#FF9715"
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
		]
		@map.setOptions {styles: @styles}
		@placeMarkers = []
		completeOptions =
			types: ['geocode']
			componentRestrictions: {country: 'br'}
			
		input = @querySelector('.default-input.start-input')
		@searchStartBox = new google.maps.places.SearchBox(input)
		@searchStartBox.addListener('places_changed', @onSearchStartBox)
		autocompleteStart = new google.maps.places.Autocomplete(input,completeOptions)
		autocompleteStart.bindTo('bounds', @map)

		input = @querySelector('.default-input.end-input')
		@searchEndBox = new google.maps.places.SearchBox(input)
		@searchEndBox.addListener('places_changed', @onSearchEndBox)
		autocompleteEnd = new google.maps.places.Autocomplete(input,completeOptions)
		autocompleteEnd.bindTo('bounds', @map)

		# @map.fitBounds(bounds)
		# center = @map.getCenter()
		# @findClosest(center.lat(), center.lng())

		
		return

	onSearch:()=>
		return if !@places.start or !@places.dest
		@getRoute @places.start[0].geometry.location, @places.dest[0].geometry.location

		# start = document.getElementById('start-input').value
		# end = document.getElementById('end-input').value
		# console.log "onSearch", start, end

		# @geocoder.geocode( { 'address': start}, (results, status) =>
		# 	if status is google.maps.GeocoderStatus.OK
		# 		_origLatLng = results[0].geometry.location
		# 		@geocoder.geocode( { 'address': end}, (results, status) =>
		# 			if status is google.maps.GeocoderStatus.OK
		# 				_destLatLng = results[0].geometry.location
		# 				@getRoute _origLatLng, _destLatLng
		# 			else
		# 				alert "Geocode DEST was not successful for the following reason: " + status
		# 		)
		# 	else
		# 		alert "Geocode ORIGIN was not successful for the following reason: " + status
		# )
		
	getRoute: (_origLatLng, _destLatLng)=>
		@directionsDisplay.setMap(@map)
		waypts = [

		]
		request = {
			origin: _origLatLng
			destination: _destLatLng
			travelMode: google.maps.TravelMode.BICYCLING
			waypoints: waypts
			optimizeWaypoints: true
		}
		
		@directionsService.route request, (response, status) =>
			if (status is google.maps.DirectionsStatus.OK)
				console.log response, response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text
				@directionsDisplay.setDirections response
			else
				window.alert('Directions request failed due to ' + status)


	onSearchStartBox: =>
		@places.start = null if @places.start isnt null
		@places.start = @searchStartBox.getPlaces()
		# console.log "searchStartBox:", @places
		return if !@places.start or @places.start.length is 0
		@renderPlace()
		return

	onSearchEndBox: =>
		@places.dest = null if @places.dest isnt null
		@places.dest = @searchEndBox.getPlaces()
		# console.log "searchEndBox:", @places
		return if !@places.dest or @places.dest.length is 0
		@renderPlace()
		return

	renderPlace:()=>
		@placeMarkers.forEach (marker) ->
			marker.setMap(null)
			return
		@placeMarkers = []

		bounds = new google.maps.LatLngBounds()
		# @places.forEach (place) =>
		angular.forEach @places, (value, key)=>
			icon =
				url: value[0].icon
				size: new google.maps.Size(130, 130)
				origin: new google.maps.Point(0, 0)
				anchor: new google.maps.Point(17, 34)
				scaledSize: new google.maps.Size(25, 25)

			@placeMarkers.push new google.maps.Marker
				map: @map
				icon: icon
				title: value[0].name
				position: value[0].geometry.location

			if (value[0].geometry.viewport)
				bounds.union(value[0].geometry.viewport)
			else
				bounds.extend(value[0].geometry.location)

		@map.fitBounds(bounds)
		center = @map.getCenter()
		# @findClosest(center.lat(), center.lng())

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
