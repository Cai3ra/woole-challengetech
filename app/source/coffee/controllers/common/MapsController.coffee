BaseController = require '../BaseController'
MapStyles = require '../../utils/MapStyles'

class MapsController extends BaseController
	constructor: ($scope, $rootScope, $element, $window, $compile) ->
		super($scope)
		@scope = $scope
		@rootScope = $rootScope
		@compile = $compile

		@map = null
		@markers = []
		@geocoder = null
		@directionsService = null
		@directionsDisplay = null
		@originDirection = null
		@searchStartBox = null
		@searchEndBox = null
		@places = {start: null, dest: null}
		@allStopPoints = []
		
		@w = angular.element($window);
		@w.bind 'resize', @onResize

	init: ->
		@configureMap()
		@rootScope.$on "request_route", @onSearch

	configureMap: () ->
		mapElement = @querySelector('.map')
		@geocoder = new google.maps.Geocoder()
		
		@directionsService = new google.maps.DirectionsService()
		@directionsDisplay = new google.maps.DirectionsRenderer()

		mapOptions =
			center: new google.maps.LatLng(-23.5874, -46.6576)
			zoom: 8
			mapTypeId: google.maps.MapTypeId.ROADMAP
			zoomControlOptions: position: google.maps.ControlPosition.TOP_RIGHT
			panControlOptions: position: google.maps.ControlPosition.TOP_RIGHT
		@map = new google.maps.Map(mapElement, mapOptions)
		@map.getCenter()
		
		@map.setOptions {styles: MapStyles.woole()}
		@placeMarkers = []

		@setStopPoints()
		@setSearchBoxes()

	setStopPoints:()=>
		_kmlUrl = 'http://c4i3r4.co/woole-challengetech/data/stop_points.kml'
		_kmlOptions = {
			afterParse: @onKmlLoaded
			map: @map
		}
		@geoParser = new geoXML3.parser _kmlOptions
		@geoParser.parse _kmlUrl

	onKmlLoaded:(doc)=>
		for place, i in doc[0].placemarks
			@allStopPoints.push {
				name: place.name
				lat: place.latlng.lat()
				lng: place.latlng.lng()
			}

	setSearchBoxes:()=>
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
		

	onSearch:()=>
		return if !@places.start or !@places.dest
		console.log "onSearch: ", @places
		@getRoute @places.start[0].geometry.location, @places.dest[0].geometry.location

		
	getRoute: (_origLatLng, _destLatLng)=>
		@directionsDisplay.setMap(@map)
		console.log "@startClosest", @startClosest
		_waypts = [
			{location: new google.maps.LatLng(@startClosest.lat, @startClosest.lng), stopover: true},
			{location: new google.maps.LatLng(@destClosest.lat, @destClosest.lng), stopover: true}
		]
		console.log "getRoute _waypts:", _waypts
		request = {
			origin: _origLatLng
			destination: _destLatLng
			travelMode: google.maps.TravelMode.BICYCLING
			waypoints: _waypts
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
		return if !@places.start or @places.start.length is 0
		@renderPlace 'start'
		return

	onSearchEndBox: =>
		@places.dest = null if @places.dest isnt null
		@places.dest = @searchEndBox.getPlaces()
		return if !@places.dest or @places.dest.length is 0
		@renderPlace 'dest'
		return

	renderPlace:(_origin)=>
		@placeMarkers.forEach (marker) ->
			marker.setMap(null)
			return
		@placeMarkers = []

		bounds = new google.maps.LatLngBounds()
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

			if _origin is "start"
				@startClosest = @findClosest value[0].geometry.location.lat(), value[0].geometry.location.lng()
			else if _origin is "dest"
				@destClosest = @findClosest value[0].geometry.location.lat(), value[0].geometry.location.lng()

		@map.fitBounds(bounds)
		center = @map.getCenter()
		# @findClosest(center.lat(), center.lng())

	findClosest: (lat, lng) =>
		i = @allStopPoints.length
		while i-- > 0
			pos = @allStopPoints[i]
			dLat  = pos.lat- lat
			dLng = pos.lng-lng
			d = (dLat*dLat) + (dLng*dLng)
			@allStopPoints[i].distance = d
			
		@allStopPoints.sort (a, b) ->
			return a.distance-b.distance
		
		console.log "findClosest: ", @allStopPoints[0]
			
		# @onResize()

		# #workaround for apply already in progress
		# if !@scope.$$phase
		# 	@scope.$apply()

		return @allStopPoints[0]

	destroy: =>
		@w.unbind 'resize', @onResize
		false

	onResize: =>
		console.log "maps resize"

	querySelector:(value) ->
		return document.querySelector(value)

module.exports = MapsController
