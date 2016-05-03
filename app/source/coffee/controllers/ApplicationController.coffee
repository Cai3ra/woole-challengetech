class ApplicationController
    constructor: ($rootScope, $scope, $window,$http) ->

        $rootScope.$on '$stateChangeStart', ->
            $window.scrollTo(0,0)
        false

        # $scope.$watch (->
        #     $http.pendingRequests.length > 0
        # ), ((newVal, oldVal) ->
        #     if newVal
        #         document.querySelector(".loading-container").style.display = "block"
        #     else  
        #         document.querySelector(".loading-container").style.opacity = "0"
        #         setTimeout =>
        #             document.querySelector(".loading-container").style.display = "none"
        #         , 300
        # ), true

module.exports = ApplicationController
