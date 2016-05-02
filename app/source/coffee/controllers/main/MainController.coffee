BaseController = require '../BaseController'

class MainController extends BaseController
	constructor: ($scope, $rootScope, $compile, $element) ->
		console.log "MainController"
		@scope = $scope
		@rootScope = $rootScope
		@compile = $compile
		@element = $element
		@scope.templates = [
			{ class: "", url: "views/partials/maps.html" }
		]



		setTimeout =>
			console.log @element
			@scope.$apply =>
				el = $compile('<div class="maps-directive"></div>')(@scope)
				angular.element(document.querySelector(".maps-box")).append el

			# @scope.$apply =>
			# 	@compile
	  #     		angular.element(document.querySelector(".maps-container")).append('<div class="maps-directive"></div>')
	      
		, 500
		super($scope)

	destroy: =>
		false

module.exports = MainController
