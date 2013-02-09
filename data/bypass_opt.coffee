types = require './types'

bypass = (data1, data2, iterator, array_iterator = iterator)->
	if Array.isArray data1
		data1 = array_iterator data1, data2
	else if typeof data1 is 'object'
		for key of data1
			data1[key] = bypass data1[key], data2?[key], iterator
		data1
	else
		data1 = iterator data1, data2
bypass_DB = (data1, data2, iterator, array_iterator = iterator) ->
	if Array.isArray data2
		data2 = array_iterator data1, data2
	else if typeof data2 is 'object'
		for key of data2
			data1[key] = bypass_DB data1[key], data2?[key], iterator
		data2
	else 
		data1 = iterator data1, data2

equalize = (x, y) -> x=y
plus = (x, y) -> x+=y
#propSumm = (x, y, z)
exports.equalize = equalize
exports.plus = plus
exports.bypass = bypass
exports.bypass_DB = bypass_DB