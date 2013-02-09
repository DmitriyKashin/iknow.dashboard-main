mongoose = require 'mongoose' 
scheme = require './dataBase'
events = scheme.eveTrack

build_data = (data) ->
  first_metric = []
  change = []
  for hCu in data.ho
    first_metric.push hCu
  for mCu in data.min
    first_metric.push mCu
  for hPre in data.ho2
    change.push hPre
  for mPre in data.min2
    change.push mPre
  {first_metric, change}

getInitData = (callback) ->
  hour= []
  minute= []
  minute2 = []
  hour2 = []
  findMinCurr = events.find({"aggr":"minute"}).sort({"DateTime":-1}).limit(60)
  findHourCurr = events.find({"aggr":"hour"}).sort({"DateTime":-1}).limit(7)
  findMinPrev = events.find({"aggr":"minute"}).sort({"DateTime":-1}).skip(60).limit(60)
  findHourPrev = events.find({"aggr":"hour"}).sort({"DateTime":-1}).skip(7).limit(7)
  #----------------------------------------------------------------------------------Текущие последние 60 минут
  findMinCurr.execFind (errMin, resMin) ->
    for recMin in resMin
      minute.push recMin
    #--------------------------------------------------------------------------------Текущие последние 7 часов
    findHourCurr.execFind (errH, resH) ->
      for recH in resH
        hour.push recH
      #------------------------------------------------------------------------Предыдущие последние 60 минут
      findMinPrev.execFind (errMinP, resMinP) ->
        for recMinP in resMinP
          minute2.push recMinP
        #----------------------------------------------------------------------Предыдущие последние 7 часов
        findHourPrev.execFind (errHP, resHP) ->
          for recHP in resHP
            hour2.push recHP
          #--------------------------------------------------------------------Callback
          for_call = 
            min:  minute
            ho: hour
            min2: minute2
            ho2:  hour2
          callback(for_call)

#Exports
exports.getInitData = getInitData
exports.build_data = build_data
