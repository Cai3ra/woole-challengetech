class ValidationUtils

    @isValidEmail: (email) ->
        re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)

    @isValidPhone: (phone) ->
        re = /^\d[0-9]{10}|\d[0-9]{11}$/
        return re.test(phone)

module.exports = ValidationUtils
