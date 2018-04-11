ko.components.register("datagrid", {
  template: tableTemplate(),
  viewModel: function (params) {
    var self = this;
    self.data = params.data;
    self.tableClasses = ko.observable("table " + (params.tableClasses || ""));
    self.getColumnsForScaffolding = function (data) {
      if ((typeof data.length !== 'number') || data.length === 0) {
        return [];
      }
      var columns = [];
      for (var propertyName in data[0]) {
        columns.push({ headerText: propertyName, rowText: propertyName });
      }
      return columns;
    }
    self.sort = function () {
    }
    self.columns = ko.observableArray(params.columns || self.getColumnsForScaffolding(ko.unwrap(self.data)));
    // If you don't specify columns params, we'll use scaffolding
    // self.columns = params.columns || self.getColumnsForScaffolding(ko.unwrap(self.data));
  }
});
