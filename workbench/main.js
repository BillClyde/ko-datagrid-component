var app = app || {};
app.views = app.views || {};
app.views.main = (function ($, ko) {

  function mainViewModel() {
    var self = this;
    self.myData = ko.observableArray(getTestData());
    self.myCurrentPageItems = ko.observableArray([]);

  }
  function init() {
    ko.applyBindings(new mainViewModel())
  }
  return { init: init };
})($, ko);
