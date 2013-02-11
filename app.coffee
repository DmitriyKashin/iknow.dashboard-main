express = require("express")
expose  = require("express-expose")
http = require("http")
routes = require("./routes")
config = require('./config')
console.log config.conversion
app = express()
app.configure -> 

  app.set "port", process.env.PORT or 3000
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.favicon() 
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride() 
  app.expose API_URL: config.API_URL
  app.expose conversion: config.conversion
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.errorHandler() 

app.get "/",                 routes.index
app.get "/tag_stats",        routes.tag_stats       
app.get "/constant_display", routes.constant_display
  
http.createServer(app).listen app.get("port"), ->
  console.log "Express server listening on port " + app.get("port")







