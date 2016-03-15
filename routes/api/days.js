var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../../db').models;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;

module.exports = router;

router.get('/', function(req, res) {
  Day.find()
    .then(function(days) {
      res.json(days);
    })
    .catch(function(err) {
      res.json(err);
    });
});
router.param('day_id', function(req, res, next, day_id) {
  Day.findById(day_id)
  .then(function(day) {
    req.day = day;
    next();
  })
  .catch(function(err) {
    console.log(err);
  });
});



router.get('/restaurants', function(req, res) {
  Restaurant.find()
  .then(function(restaurants){
    res.json(restaurants)
  })
  .catch(function(err){
    console.log(err);
    res.send(err);
  })
});

router.get('/hotels', function(req, res) {
  Hotel.find()
  .then(function(hotels){
    res.json(hotels)
  })
  .catch(function(err){
    console.log(err);
    res.send(err);
  })
});

router.get('/activities', function(req, res) {
  Activity.find()
  .then(function(activities){
    res.json(activities)
  })
  .catch(function(err){
    console.log(err);
    res.send(err);
  })
});

router.get('/:day_id', function(req, res) {
  res.json(req.day);
});

router.get('/:day_id/restaurants', function(req, res) {
  Promise.map(req.day.restaurants, function(restaurant_id) {
    return Restaurant.findById(restaurant_id);
  })
  .then(function(restaurants) {
    res.json(restaurants);
  })
  .catch(function(err) {
    res.json(err);
  });
});

router.get('/:day_id/hotel', function(req, res) {
  Hotel.findById(req.day.hotel)
    .then(function(hotel) {
      res.json(hotel);
    });
});

router.get('/:day_id/activities', function(req, res) {
  Promise.map(req.day.activities, function(activity_id) {
    return Activity.findById(activity_id);
  })
  .then(function(activities) {
    res.json(activities);
  })
  .catch(function(err) {
    res.json(err);
  });

});




router.post('/add', function (req, res) {
  var data = new Day(req.body);
  data.save()
  .then(function(day) {
    console.log(day);
    res.sendStatus(200);
  })
  .catch(function(err) {
    console.log(err);
    res.sendStatus(403);
  });
});

router.post('/:day_id/restaurants', function(req, res) {
  req.day.restaurants.push({_id:req.body.restaurant});
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  })
});

router.post('/:day_id/hotel', function(req, res) {
  req.day.hotel = {_id:req.body.hotel};
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  })
});

router.post('/:day_id/activities', function(req, res) {
  req.day.activities.push({_id:req.body.activity});
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  });
});

router.delete('/:day_id/restaurants', function(req, res) {
  req.day.restaurants.pull({_id:req.body.restaurant});
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  })
});

router.delete('/:day_id/hotel', function(req, res) {
  req.day.hotel = "";
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  })
});

router.delete('/:day_id/activities', function(req, res) {
  req.day.activities.pull({_id:req.body.activity});
  req.day.save()
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    console.log(err);
    res.sendStatus(404);
  });
});

router.delete('/:day_id/remove', function (req, res) {
  req.day.remove()
  // data.save()
  .then(function(day) {
    console.log(day);
    res.sendStatus(200);
  })
  .catch(function(err) {
    console.log(err);
    res.sendStatus(403);
  });
});
