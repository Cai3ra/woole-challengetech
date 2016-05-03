BaseController = require '../BaseController'

class MainController extends BaseController
	constructor: ($scope, $rootScope, $compile, $element) ->
		# console.log "MainController"
		@scope = $scope
		@rootScope = $rootScope
		@compile = $compile
		@element = $element
		@scope.templates = [
			{ class: "", url: "woole-challengetech/views/partials/maps.html" }
		]

		angular.element(document).ready =>
			document.querySelector(".loading-container").style.display = "none"
			@scope.$apply =>
				el = $compile('<div class="maps-directive"></div>')(@scope)
				angular.element(document.querySelector(".maps-box")).append el
				angular.element(document.getElementById("content-page")).css "height", window.innerHeight + "px"

		super($scope)

	destroy: =>
		false

module.exports = MainController
