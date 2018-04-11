var app = app || {};
app.views = app.views || {};
app.views.main = (function ($, ko) {

  function mainViewModel() {
    var self = this;
    self.myData = ko.observableArray(getTestData());
    self.myCurrentPageItems = ko.observableArray([]);
    self.myColumns = [
      {headerText: 'Part Number', rowText: 'Sku', sort: self.sort},
      {headerText: 'Vendor', rowText: 'Vendor'},
      {headerText: 'Season Code', rowText: 'SeasonCode'},
      {headerText: 'Manufacturer', rowText: 'Mfg_Id'},
      {headerText: 'UPC', rowText: 'UPC'},
    ];
    self.sort = function () {
      console.log('sort called');
    }
  }
  function init() {
    ko.applyBindings(new mainViewModel())
  }
  return { init: init };
})($, ko);
