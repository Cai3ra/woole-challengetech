class StringUtils

	@decimalToMoney: (_val)=>
		val = _val.toFixed(2).replace(/\./,',')
		num = val.split(',')
		decimals = num[0]
		i = decimals.length
		count = 0
		result = []
		while i-- > 0
			count++
			result.unshift(decimals.charAt(i))
			if count == 3 and decimals.length > 3
				count = 0
				result.unshift('.')
				
		return result.join().replace(/\,/g,'')+','+num[1]

	@inserbByIndex:(str, idx, rem, val)->
		return str.slice(0, idx) + val + str.slice(idx + Math.abs(rem))

	@percentToString:(_val)->
		return (_val).toString().split(".")[1]


module.exports = StringUtils