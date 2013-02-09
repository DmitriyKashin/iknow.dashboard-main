mongoose = require 'mongoose' 
scheme = require './dataBase'
events = scheme.eveTrack
types = require './types'
pass_old = require './bypass'
pass = require './bypass_opt'
compareTotalAndLast = (data) ->
	#Каждый элемент - доля, которую составляет последнее от общего (рост)
	all = 0
	root = 0
	grow = (x, y) ->
		if (y-x) isnt 0
			x = (x/(y-x)) 
			all+=x
			root+=(x*x)
		else
			x = 1 if y isnt 0
			x = 0 if y is 0
			all+=x
			root+=(x*x)
	pass.bypass data.olast, data.ototal, grow
	growth = 
		roots:	(Math.sqrt(root)*100).toFixed(2)
		average:	(100*all/35).toFixed(2)
		pins:	(data.olast.pin.create*100 + data.olast.pin.repin*100).toFixed(2)
		plans:	(data.olast.plan.create*100).toFixed(2)
		users:	(data.olast.user.registrationFinished*100).toFixed(2)
	growth
findTotalAndLast = (callback) ->
	last = types.eventSingle()
	total = types.eventSingle()
	findTotal = events.find({"aggr":'total'})
	findLast = events.find({"aggr":"day"}).sort({"DateTime":-1}).limit(1)
	findTotal.execFind (errT, resT) ->
		for elemT in resT
			pass.bypass total, elemT, pass.equalize
		findLast.execFind (errL, resL) ->
			for elemL in resL
				pass.bypass last, elemL, pass.equalize
			data = 
				ototal:	total
				olast:	last
			callback(data)





#Exports
exports.findTotalAndLast = findTotalAndLast
exports.compareTotalAndLast = compareTotalAndLast