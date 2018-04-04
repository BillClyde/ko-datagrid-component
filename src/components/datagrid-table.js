ko.components.register("datagrid", {
  template: tableTemplate(),
  viewModel: function (params) {
    var self = this;
    self.data = params.data;
    self.tableClasses = ko.observable("table " + (params.tableClasses || ""));
    self.columns = ko.observableArray([]);
    self.currentItems = ko.pureComputed(function () {
      return ko.unwrap(this.data);
    }, this);
    self.data.subscribe(function (newData) {
      var c = params.columns || self.getColumnsForScaffolding(ko.unwrap(self.data))
      self.columns(c);
    });
    this.getColumnsForScaffolding = function (data) {
      if ((typeof data.length !== 'number') || data.length === 0) {
        return [];
      }
      var columns = [];
      for (var propertyName in data[0]) {
        columns.push({ headerText: propertyName, rowText: propertyName });
      }
      return columns;
    }
    // If you don't specify columns params, we'll use scaffolding
    // self.columns = params.columns || self.getColumnsForScaffolding(ko.unwrap(self.data));
  }
});
