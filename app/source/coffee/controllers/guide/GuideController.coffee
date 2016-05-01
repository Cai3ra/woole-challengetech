BaseController = require '../BaseController'

class GuideController extends BaseController
    constructor: ($scope, $stateParams)->
        @scope = $scope
        super($scope)

        $scope.message = 'guide'
        $scope.slug = $stateParams.slug
		
		console.log "GuideController", @scope

	destroy: =>
        console.log '---> destroys', @

module.exports = GuideController
