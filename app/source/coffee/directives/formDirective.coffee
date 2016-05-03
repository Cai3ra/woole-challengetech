class formDirective
	@init:($window, $rootScope)=>
		return {
			restrict: 'AC'
			link: ($scope, $document, $rootScope) =>
				_elDirective    =   $document
				_elBt      =   $document.children().eq(3)

				$scope.toggleExpand = () ->
					angular.element(_elDirective).toggleClass "expanded"
					false         
				
				$scope.submitSearch = () ->
					$scope.$emit "request_route"
		}
module.exports = formDirective.init
