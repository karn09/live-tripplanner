$(function() {
    var fn = function(map, marker){
      $.get('/api/days')
        .then(function(days) {
          new Tripplanner(days, map, marker);
        });
    };
    initialize_gmaps(fn);
});
