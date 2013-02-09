mongoose = require 'mongoose' 
scheme = require './dataBase'
events = scheme.eveTrack
types = require './types'
pass = require './bypass_opt'
build_data = (callback) ->
  day = types.eventSingle()
  week = types.eventSingle()
  findLastDay = events.find({"aggr":"day"}).sort({"DateTime":-1}).limit(1)
  findLastDay.execFind (err, res) ->
    skip_n = 0
    for elemD in res
      pass.bypass day, elemD, pass.equalize
      skip_n = elemD.DateTime.getDay()
    findLastWeek = events.find({"aggr":"day"}).sort({"DateTime":-1}).skip(skip_n).limit(7)
    findLastWeek.execFind (err1, res1) ->
      for elemW in res1
        pass.bypass week, elemW, pass.plus
      out = 
        outDay:  day
        outWeek:  week
      callback(out)

#Exports
exports.build_data = build_data