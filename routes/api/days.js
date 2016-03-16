var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../../db').models;
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;

module.exports = router;

router.get('/', function(req, res, next) {
  return Day.findFull()
    .then(function(days) {
      if (days.length) {
        return days;
      } else {
        return Day.create([{}]);
      }
    })
    .then(function(days) {
      res.send(days);
    }, next);
});

router.post('/', function(req, res, next) {
  return Day.create()
    .then(function(days) {
      res.send(days);
  }, next)
});

router.delete('/:id', function(req, res, next) {
  return Day.remove({_id: req.params.id })
    .then(function() {
      res.sendStatus(204);
  }, next)
});

router.delete('/:id/:category/:itemId', function(req, res, next) {
    return Day.findByIdFull(req.params.id)
      .then(function(day) {
        day[req.params.category] = day[req.params.category].filter(function(item) {
          return item.id !== req.params.itemId;
        });
        return day.save();
      })
      .then(function(day) {
        res.send(day)
      }, next)
})

router.post('/:id/:category/:itemId', function(req, res, next) {
    return Day.findById(req.params.id)
      .then(function(day) {
        day[req.params.category].push(req.params.itemId)
        return day.save();
      })
      .then(function(day) {
        return Day.findByIdFull(req.params.id)
      })
      .then(function(day) {
        res.send(day)
      }, next)
})


// router.param('day_id', function(req, res, next, day_id) {

//   if (Number.isNaN(Number(day_id))) {
//     Day.findById(day_id)
//     .then(function(day) {
//       req.day = day;
//       next();
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
//   } else {
//     Day.findOne({
//       number: Number(day_id)
//     })
//     .then(function(day) {
//       req.day = day;
//       next();
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
//   }
// });




// router.get('/restaurants', function(req, res) {
//   Restaurant.find()
//   .then(function(restaurants){
//     res.json(restaurants)
//   })
//   .catch(function(err){
//     console.log(err);
//     res.send(err);
//   })
// });

// router.get('/hotels', function(req, res) {
//   Hotel.find()
//   .then(function(hotels){
//     res.json(hotels)
//   })
//   .catch(function(err){
//     console.log(err);
//     res.send(err);
//   })
// });

// router.get('/activities', function(req, res) {
//   Activity.find()
//   .then(function(activities){
//     res.json(activities)
//   })
//   .catch(function(err){
//     console.log(err);
//     res.send(err);
//   })
// });

// router.get('/:day_id', function(req, res) {
//   res.json(req.day);
// });

// router.get('/:day_id/restaurants', function(req, res) {
//   Promise.map(req.day.Restaurants, function(restaurant_id) {
//     return Restaurant.findById(restaurant_id);
//   })
//   .then(function(restaurants) {
//     res.json(restaurants);
//   })
//   .catch(function(err) {
//     res.json(err);
//   });
// });

// router.get('/:day_id/hotel', function(req, res) {
//   Hotel.findById(req.day.Hotels)
//     .then(function(hotel) {
//       res.json(hotel);
//     });
// });

// router.get('/:day_id/activities', function(req, res) {
//   Promise.map(req.day.Activities, function(activity_id) {
//     return Activity.findById(activity_id);
//   })
//   .then(function(activities) {
//     res.json(activities);
//   })
//   .catch(function(err) {
//     res.json(err);
//   });

// });




// router.post('/add', function (req, res) {
//   // need to change to add OR return data;
//   console.log('add day: ', req.body);
//   var data = new Day(req.body);
//   data.save()
//   .then(function(day) {
//     console.log(day);
//     res.sendStatus(200);
//   })
//   .catch(function(err) {
//     console.log(err);
//     res.sendStatus(403);
//   });
// });

// router.post('/:day_id/restaurants', function(req, res) {
//   console.log('add rest: ', req.day)
//   req.day.Restaurants.push({_id:req.body.Restaurants});
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   })
// });
// // does not work from postman
// router.post('/:day_id/hotels', function(req, res) {
//   req.day.Hotels = {_id:req.body.Hotels};
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   })
// });

// router.post('/:day_id/activities', function(req, res) {
//   console.log(req.body)
//   req.day.Activities.push({_id:req.body.Activities});
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   });
// });

// router.delete('/:day_id/restaurants', function(req, res) {
//   req.day.Restaurants.pull({_id:req.body.Restaurants});
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   })
// });

// router.delete('/:day_id/hotel', function(req, res) {
//   req.day.Hotels = "";
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   })
// });

// router.delete('/:day_id/activities', function(req, res) {
//   req.day.Activities.pull({_id:req.body.Activities});
//   req.day.save()
//   .then(function(){
//     res.sendStatus(200);
//   })
//   .catch(function(err){
//     console.log(err);
//     res.sendStatus(404);
//   });
// });

// router.delete('/:day_id/remove', function (req, res) {
//   req.day.remove()
//   // data.save()
//   .then(function(day) {
//     console.log(day);
//     res.sendStatus(200);
//   })
//   .catch(function(err) {
//     console.log(err);
//     res.sendStatus(403);
//   });
// });
