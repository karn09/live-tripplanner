var Promise = require('bluebird');
var mongoose = require('mongoose');

var placeSchema = mongoose.Schema({
  address: String,
  city: String,
  state: String,
  phone: String,
  location: [Number]
});

placeSchema.methods.sayHi = function() {
  return this.address;
};

var Place = mongoose.model('place', placeSchema);

var hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  num_stars: Number,
  amenities: String,
  place: placeSchema,
  category: { type: String, default: 'Hotels'}
});

var Hotel = mongoose.model('hotel', hotelSchema);

var restaurantSchema = mongoose.Schema({
  name: String,
  cuisine: String,
  price: Number,
  place: placeSchema,
  category: { type: String, default: 'Restaurants'}
});

var Restaurant = mongoose.model('restaurant', restaurantSchema);

var activitySchema = mongoose.Schema({
  name: String,
  age_range: String,
  place: placeSchema,
  category: { type: String, default: 'Activities'}

});

var Activity = mongoose.model('activity', activitySchema);


var daySchema = mongoose.Schema({
  Hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hotel'
  }],
  Restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant'
  }],
  Activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'activity'
  }],
  idx: {
    type: Number
  }
});

daySchema.statics.findFull = function() {
  return this.find()
    .populate('Hotels Restaurants Activities');
};

daySchema.statics.findByIdFull = function(id) {
  return this.findById(id)
    .populate('Hotels Restaurants Activities');
};
daySchema.pre('save', function(next) {
  var that = this;
  Day.findOne()
    .sort('-idx')
    .then(function(day) {
      that.idx = !day ? 1 : day.idx + 1;
      next();
    });
});

var Day = mongoose.model('day', daySchema);


var models = {
  Hotel: Hotel,
  Place: Place,
  Restaurant: Restaurant,
  Activity: Activity,
  Day: Day
};

var _conn;

function connect() {
  if (_conn)
    return _conn;
  _conn = new Promise(function(resolve, reject) {
    mongoose.connect(process.env.CONN, function(err) {
      if (err)
        return reject('make sure mongo is running and connection string is set');
      resolve(mongoose.connection);
    });
  });
  return _conn;
}

function disconnect() {
  return new Promise(function(resolve, reject) {
    mongoose.disconnect(function() {
      _conn = null;
      resolve();
    });
  });
}

module.exports = {
  models: models,
  connect: connect,
  disconnect: disconnect
};
