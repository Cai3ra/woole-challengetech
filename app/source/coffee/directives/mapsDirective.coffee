class mapsDirective
    @loadScript: ($window)=>
        if !$window.google?
            # clusterTag = document.createElement('script')
            # clusterTag.src = 'assets/js/libs/lazy/markerclusterer_compiled.js'
            # document.body.appendChild(clusterTag)
            
            mapsKey = 'AIzaSyDDWLyi8QG0CjcQdC-3efc6pPTdhubCO38'
            tag = document.createElement('script')
            tag.src = "https://maps.googleapis.com/maps/api/js?key=#{mapsKey}&language=pt_BR&libraries=places&callback=initialize"
            document.body.appendChild(tag)
        else
            $window.initialize()

    @lazyLoad: ($window, $q) =>
        deferred = $q.defer()
        $window.initialize = ->
            deferred.resolve()
        @loadScript($window)

        return deferred.promise

    @create: ($window, $q) =>
        return {
            restrict: 'AC'
            controller: 'MapsController'
            controllerAs: 'maps'
            templateUrl: 'views/partials/maps.html'
            link: (controller) =>
                console.log "mapsDirective create"
                @lazyLoad($window, $q).then ->
                    if $window.google? && $window.google.maps?
                        controller.maps.init()
                , ->
                    console.log 'promise error'

        }
module.exports = mapsDirective.create
