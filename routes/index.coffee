exports.index = (req, res) ->
  res.render "index",
    title: "iknow.dashboard"


exports.constant_display = (req, res) ->
  res.render "constant_display",
    title: "iknow.dashboard.constant_display"

exports.tag_stats = (req, res) ->
  res.render "tag_stats",
    title: "iknow.dashboard.tag_stats"


