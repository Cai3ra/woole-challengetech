angular
.module 'app', ['ui.router', 'ngResource', 'ngTouch', 'dibari.angular-ellipsis']
.config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) ->
	$httpProvider.interceptors.push 'httpInterceptor'
	# $locationProvider.html5Mode(true)
	$urlRouterProvider.otherwise '/'
	
	$stateProvider
	
	#route for the main
	.state 'main',
		url: '/'
		templateUrl: '/views/main.html'
		controller: 'MainController'

require './controllers'
require './directives'


