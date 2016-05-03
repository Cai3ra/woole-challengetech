class formDirective
	@init:($window, $rootScope)=>
		return {
			restrict: 'AC'
			link: ($scope, $document, $rootScope) =>
				_elDirective    =   $document
				_elBt      =   $document.children().eq(3)
				console.log _elBt
				$scope.toggleExpand = () ->
					console.log "toggleExpand"
					angular.element(_elDirective).toggleClass "expanded"
					false         
		}
module.exports = formDirective.init
