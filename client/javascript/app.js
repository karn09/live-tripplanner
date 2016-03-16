$(function() {
    var fn = function(map, marker){
      // $.get('/api/days')
      //   .then(function(days) {
      //     console.log(days);
      //     //new Tripplanner([], map, marker, attractions);
      //   })
      // $.ajax({
      //   url: '/api/days/add',
      //   method: 'POST',
      //   data: { number: 0 },
      //   dataType: 'json'
      // })
      // .done(function(data) {
      //   console.log(data);
      // })
      // .fail(function(error) {
      //   console.log(error)
      // });

    }
    initialize_gmaps(fn);
});
