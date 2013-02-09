#Init
mongoose = require 'mongoose'
Schema = mongoose.Schema
#Event Storage (temp) Резервное хранилище всех событий iknow.travel
eventStorage = new Schema
	DateTime	:type	:Date, required	:yes
	eKey	:
		object_type	:type	:String, required	:yes
		event_type	:type 	:String, required	:yes
		event_subtype	:type	:String, required	:no
		event_receiver	:type	:String, required	:no
	#eBody	:
		#actor	:type	:String, required	:yes
		#pin	:type	:String, required	:no
		#plan	:type	:String, required	:no
		#extra	:type	:String, required	:yes

#Event Tracker Рабочее хранилище количественных характеристик 
eventTracker = new Schema 
	DateTime 	:type	:Date, default:	Date.now
	aggr	:type	:String, enum	:['minute', 'hour', 'day', 'month', 'year', 'total'], default	:'minute'
	pin 	:
		list	:
			popular	:type	:Number, default: 0
			new	:type	:Number, default: 0
			contest	:type	:Number, default: 0
			friends	:type	:Number, default: 0
			userpins	:type	:Number, default: 0
			userlikes	:type	:Number, default: 0
		show	:type	:Number, default: 0
		create	:type	:Number, default: 0
		update	:type	:Number, default: 0
		delete	:type	:Number, default: 0
		like	:type	:Number, default: 0
		unlike	:type	:Number, default: 0
		repin	:type	:Number, default: 0
		comment	:type	:Number, default: 0
	plan 	:
		show	:type	:Number, default: 0
		create	:type	:Number, default: 0
		update	:type	:Number, default: 0
		delete	:type	:Number, default: 0
		follow	:type	:Number, default: 0
		unfollow	:type	:Number, default: 0
	user 	:
		show	:type	:Number, default: 0
		showPlans	:type	:Number, default: 0
		showLikes	:type	:Number, default: 0
		showPlaces	:type	:Number, default: 0
		showEvents 	:type	:Number, default: 0
		showNotes	:type	:Number, default: 0
		showFollows	:type	:Number, default: 0
		showFollowers	:type	:Number, default: 0
		update	:type	:Number, default: 0
		follow 	:type	:Number, default: 0
		unfollow	:type	:Number, default: 0
		registrationFinished	:type	:Number, default: 0
		invite	:
			fb	:type	:Number, default: 0
			vk	:type	:Number, default: 0
			email	:type	:Number, default: 0



mongo = mongoose.createConnection 'mongodb://194.58.155.187/dev'
eveTrack = mongo.model 'event', eventTracker
eveStore = mongo.model 'storage', eventStorage

#Exporting everything
exports.eveTrack = eveTrack
exports.eveStore = eveStore
