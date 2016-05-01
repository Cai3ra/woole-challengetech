BaseController = require '../BaseController'

class MainController extends BaseController
	constructor: ($scope) ->
		console.log "MainController"
		@scope = $scope
		@scope.templates = [
			{ class: "", url: "views/partials/maps.html" }
		]
		super($scope)

	destroy: =>
		false

module.exports = MainController
