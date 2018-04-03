ko.components.register("datagrid", {
  template: tableTemplate(),
  viewModel: function (configuration) {
    this.data = configuration.data;
    this.tableClasses = ko.observable("table " + (configuration.tableClasses || ""));
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
    // If you don't specify columns configuration, we'll use scaffolding
    this.columns = configuration.columns || this.getColumnsForScaffolding(ko.unwrap(this.data));
  }
});
