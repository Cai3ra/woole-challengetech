class BaseController
    constructor: ($scope) ->
        @scope = $scope
        @_destroy(@destroy)

    destroy: (e)=>
        false

    #private
    _destroy: (cb)->
        @scope.$on '$destroy', cb

module.exports = BaseController
