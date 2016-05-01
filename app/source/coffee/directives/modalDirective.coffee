class modalDirective
    @create: =>
        return {
            restrict: 'AC'
            controller: 'ModalController'
            controllerAs: 'md'
            template: '
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-content entry" ng-include="_modalPath"></div>
            </div>'
            link: ($scope, $document, $rootScope) =>
                _elDirective    =   $document
                _elOverlay      =   $document.children().eq(0)
                
                $scope.showModal = (view, msg) ->
                    # $scope.$emit "modal_reset"
                   
                    _elDirective.addClass('shown')
                    _elOverlay.addClass('fade')
                    $scope._modalPath = "/views/partials/modals/#{view}.html"
                    angular.element(document.querySelectorAll("body")).css "overflow", "hidden"

                    # setTimeout =>
                    #     angular.element(document.querySelector(".modal-content")).addClass "entry"
                    #     angular.element(document.querySelector(".modal-btn-close")).removeClass "fade"
                    # , 700

                    false

                $scope.closeModal = () ->
                    _elDirective.removeClass('shown')
                    _elOverlay.removeClass('fade')
                    angular.element(document.querySelectorAll("body")).css "overflow", "auto"
                    angular.element(document.querySelector(".modal-content")).removeClass "entry"
                    angular.element(document.querySelector(".modal-btn-close")).addClass "fade"
                    false         
        }
module.exports = modalDirective.create
