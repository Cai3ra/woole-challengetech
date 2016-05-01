BaseController = require '../BaseController'

class ModalController extends BaseController
    constructor: ($scope) ->
        super($scope)
        @scope = $scope
        @init()

    init: ->
        false

    onSend: =>
        false

module.exports = ModalController
