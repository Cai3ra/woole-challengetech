class httpInterceptor
	constructor: ($q, $location, $injector) ->
		return {
			"request": (config) ->
				# console.log "request", config
				document.querySelector(".loading-container").style.display = "block"
				return config

			"response": (response) ->
				# console.log "response"
				document.querySelector(".loading-container").style.opacity = "0"
				setTimeout =>
				    document.querySelector(".loading-container").style.display = "none"
				, 300
				response

			"responseError": (response) ->
				# do something on error
				# slug = $location.path().split("/")[1]
				# if response.status > 400
				# 	$location.path(slug+"/").replace();
					# $location.path(slug+"/home").replace();
				# $q.reject response
		}
	
module.exports = httpInterceptor