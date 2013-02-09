exports.index = (req, res) ->
  res.render "index",
    title: "iknow.dashboard"


exports.firstpage = (req, res) ->
  res.render "firstpage",
    title: "iknow.dashboard.first"

exports.secondpage = (req, res) ->
  res.render "firstpage",
    title: "iknow.dashboard.second"



exports.favorits = (req, res) ->
  res.render "favorits",
    title: "iknow.dashboard.favorits"




exports.rose = (req, res) ->
  res.render "rose",
    title: "iknow.dashboard.rose"

exports.tag_stats = (req, res) ->
  res.render "tag_stats",
    title: "iknow.dashboard.tag_stats"

exports.description = (req, res) ->
  res.render "description",
    title: "iknow.dashboard"
