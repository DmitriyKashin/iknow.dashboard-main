mongoose = require 'mongoose' 
scheme = require './dataBase'
events = scheme.eveTrack
types = require './types'
pass = require './bypass'
pass2 = require './bypass_opt'
#Функция regress() получает из базы данных последние 60 минут и 7 часов
#и записывает информацию удобным для обработки объектом		

build_data = (for_predict, data) ->
	predict = types.eventSet()
	pass.bypass(for_predict, for_predict, data, "predict", null, predict)
	predict          
prepareData = (firstMetric) ->
	for_predict = types.eventSet()
	for elem in firstMetric
		pass.bypass(for_predict, for_predict, elem, "push", null, null)
	for_predict
calcCoeff = (data) ->
	data.det = 0
	data.summ_x = 0
	data.summ_x_2 = 0
	data.summ_y = 0
	data.summ_xy = 0
	data.len = data.outSetH.DateTime.length
	for el1 in data.outSetH.DateTime
		data.summ_x += el1.getHours()
		data.summ_x_2 +=(el1.getHours()*el1.getHours())
	pass.bypass(data.outSetH, data.outSetH, data, "coeffH", null, null)
	data.det = 0
	data.summ_x = 0
	data.summ_x_2 = 0
	data.summ_y = 0
	data.summ_xy = 0
	data.len = data.outSet.DateTime.length
	for el in data.outSet.DateTime
		data.summ_x += el.getMinutes()
		data.summ_x_2 +=(el.getMinutes()*el.getMinutes())
	pass.bypass(data.outSet, data.outSet, data, "coeffM", null, null)
	data	
getInitData = (callback) ->
	poliSet = types.eventSet()
#Объект, в который помещаются количественные характеристики последних 7 часов (каждый из аттрибутов - массив из 7 элементов)
	poliSetH = types.eventSet()
	#Значение коэффициента а0 для каждлго из событий (минуты) (свободный член)
	a0 = types.eventSingle()
	#Значение коэффициента а1 для каждлго из событий (минуты) (коэффициент при х)
	a1 = types.eventSingle()
	#Значение коэффициента а0 для каждлго из событий (часы) (свободный член)
	a0H = types.eventSingle()
	#Значение коэффициента а1 для каждлго из событий (часы) (коэффициент при х)
	a1H = types.eventSingle()
	findLast = events.find({"aggr":"minute"}).sort({$natural:-1}).skip(60).limit(180)
	findLastH = events.find({"aggr":"hour"}).sort({$natural:-1}).skip(7).limit(21)
	findLast.execFind (err, res) ->
		for elem in res
			pass.bypass(poliSet, poliSet, elem, "push", null, null)
		findLastH.execFind (err1, res1) ->
			for elem1 in res1
				pass.bypass(poliSetH, poliSetH, elem1, "push", null, null)
			for_call = 
				outSet:	poliSet
				outSetH:	poliSetH
				outA0:	a0
				outA1:	a1
				outA0H:	a0H
				outA1H:	a1H
				det: 	0
				summ_x:	0
				summ_x_2:	0
				summ_y:	0
				summ_xy:	0
				len:	0
			callback(for_call)
			
#Exports
exports.getInitData = getInitData
exports.calcCoeff = calcCoeff
exports.prepareData = prepareData
exports.build_data = build_data