var config = {};

config.API_URL = 'http://relcom.int.iknow.travel:4000/api/';

config.conversion = {};

config.conversion.from_a = "event:pin:show"
config.conversion.to_a   = "visit"
config.conversion.from_b = "event:plan:update"
config.conversion.to_b   = "event:plan:create"
config.conversion.from_c = "event:pin:show"
config.conversion.to_c   = "event:pin:create"
config.conversion.start_time = "2013-02-01"
config.conversion.end_time   = "2013-02-09"


module.exports = config;