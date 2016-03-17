/* globals $,Mapper */

function Tripplanner(days, map, perm) {
  this.currentIdx = 0;
  this.mapper = new Mapper(map, perm);
  this.days = days;
  this.init();
  this.renderDayPicker(0);
}

Tripplanner.prototype.addDay = function() {
  console.log('addDay: ', this);
  this.days.push({
    Hotels: [],
    Restaurants: [],
    Activities: []
  });

  return this.days.length - 1;
};


Tripplanner.prototype.init = function() {
  var that = this;
  $('#dayPicker').on('click', 'li', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    that.currentIdx = $(this).index();
    that.renderDay();
  });

  this.dayListIterator(function(list) {
    var that = this;
    list.on('click', 'li', function() {
      var id = $(this).attr('data-id');
      var category = $(this).attr('data-category');
      var item = that.currentDay()[category].filter(function(item) {
        return item._id === id;
      })[0];
      var elem = this;
      $.ajax({
        method: "DELETE",
        url: "/api/days/" + that.currentDay()._id + "/" + category + "/" + id,
        success: function(day) {
          that.days[that.currentIdx] = day;
          that.removeItemFromDay(elem, item);
        }
      });
      // var item = that.findItemByIdAndCategory(id, category);
      // $(this).remove();
      // that.removeItemFromDay(item);
    });
  });

  this.categoryIterator(function(category) {
    var btn = $('#' + category + 'Add');
    var that = this;

    btn.click(function() {
      var selector = that.getChooser(category);
      if (that.days.length === 0 || !selector.val())
        return;

      if (category === 'Hotels' && that.currentDay().Hotels.length === 1) {
        return alert("You already have a hotel");
      }
      console.log(selector.val())
      $.post('/api/days/' + that.currentDay()._id + '/' + category + '/' + selector.val())
        .then(function(day) {
          console.log(day)
          var item = day[category].filter(function(item) {
            console.log(item)
            console.log(selector.val())
            return item._id === selector.val();
          })[0];
          that.days[that.currentIdx] = day;
          console.log(item);
          that.renderItem(item);
        });
    });
  });

  $('#dayAdder').click(function() {
    $.post('/api/days')
      .then(function(day) {
        that.days.push(day);
        that.currentIdx = that.days.length - 1;
        that.renderDayPicker();
      });
  });

  $('#dayRemover').click(function() {
    if (that.days.length === 1) {
      return alert('Cannot remove day 1');
    }
    $.ajax({
      method: "DELETE",
      url: '/api/days/' + that.currentDay()._id,
      success: function() {
        that.days.splice(that.currentIdx, 1);
        that.currentIdx = 0;
        that.renderDayPicker();
      }
    });
  });
};
Tripplanner.prototype.currentDay = function () {
  return this.days[this.currentIdx];
};

Tripplanner.prototype.findItemByIdAndCategory = function(id, category) {
  return this.attractions[category].filter(function(_item) {
    return _item._id == id;
  })[0];
};

Tripplanner.prototype.categoryIterator = function(fn) {
  fn = fn.bind(this);
  ['Hotels', 'Restaurants', 'Activities'].forEach(fn);
};

Tripplanner.prototype.getChooser = function(category) {
  return $('#' + category + 'Chooser');
};

Tripplanner.prototype.chooserIterator = function(fn) {
  this.categoryIterator(function(cat) {
    fn(this.getChooser(cat));
  });
};

Tripplanner.prototype.getDayList = function(category) {
  return $('#dayList' + category);
};

Tripplanner.prototype.dayListIterator = function(fn) {
  fn = fn.bind(this);
  this.categoryIterator(function(cat) {
    fn(this.getDayList(cat));
  });
};

Tripplanner.prototype.resetLists = function() {
  this.dayListIterator(function(dayList) {
    dayList.empty();
  });

  this.chooserIterator(function(chooser) {
    chooser.children().removeClass('hidden').show();
  });
  this.mapper.reset();
};

Tripplanner.prototype.hideItemInChooser = function(item) {
  var chooser = this.getChooser(item.category);
  var option = $('[value=' + item._id + ']', chooser);
  option.hide().addClass('hidden');
  var sibs = option.siblings(':not(.hidden)');
  if (sibs.length)
    chooser.val(sibs[0].value);
  else
    chooser.val(null);
};

Tripplanner.prototype.showItemInChooser = function(item) {
  var chooser = this.getChooser(item.category);
  var option = $('[value=' + item._id + ']', chooser);
  option.show().removeClass('hidden');
};


Tripplanner.prototype.removeItemFromDay = function(elem, item) {
  var that = this;
  $(elem).hide('slow', function() {
    $(elem).remove();
    that.showItemInChooser(item);
    that.mapper.removeMarker(item);
  });
  // var collection = this.days[this.currentIdx][item.category];
  // var idx = collection.indexOf(item._id);
  // collection.splice(idx, 1);
};

Tripplanner.prototype.renderDayPicker = function() {

  $('#dayPicker').empty();
  this.days.forEach(function(day, index) {
    var link = $('<a />').html(index + 1);
    var li = $('<li />').append(link);
    if (day === this.currentDay())
      li.addClass('active');
    $('#dayPicker').append(li);
  }, this);
  this.renderDay();
};

Tripplanner.prototype.currentDay = function() {
  return this.days[this.currentIdx];
};

Tripplanner.prototype.renderDay = function() {
  this.resetLists();
  // on ajax req, check whether day exists in db or locally.
  // if it exists in the db, request the id, and then render the obj by id.

  // [0, 1, 2, ..n ]
  // hit a route, that by day#, will return the day_id, which will return the information
  var that = this;
  if (this.currentIdx === null)
    return;

  var day = this.days[this.currentIdx];
  this.categoryIterator(function(category){
    var items = day[category];
    items.forEach(function(item){
      console.log(item)
      this.renderItem(item);
    }, this);
  });
};

Tripplanner.prototype.renderItem = function(item) {
  var list = this.getDayList(item.category);
  var li = $('<li />').addClass('list-group-item');
  li.attr('data-id', item._id);
  li.attr('data-category', item.category);
  li.html(item.name);
  list.append(li);
  this.hideItemInChooser(item);
  this.mapper.addMarker(item);
};
