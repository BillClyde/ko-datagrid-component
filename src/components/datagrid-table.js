ko.components.register("datagrid", {
  template: tableTemplate(),
  viewModel: function (params) {
    var self = this;
    self.data = params.data;
    self.tableClasses = ko.observable("table " + (params.tableClasses || ""));
    self.unsorted = ko.observable(true);
    self.sortedUp = ko.observable(false);
    self.sortedDown = ko.observable(false);
    self.data.subscribe(function (newValue) {
      console.log('Data Updated');
    });

    var getColumnsForScaffolding = function (data) {
      if ((typeof data.length !== 'number') || data.length === 0) {
        return [];
      }
      var columns = [];
      for (var propertyName in data[0]) {
        columns.push({ headerText: propertyName, rowText: propertyName });
      }
      return columns;
    }

    var addSorting = function (data) {
      for (var column in data){
        if (data[column].sort){
          data[column].unsorted = ko.observable(true);
          data[column].sortedUp = ko.observable(false);
          data[column].sortedDown = ko.observable(false);
          console.log(data[column].rowText);
        }
      }
      return data;
    }

    self.sort = function (data) {
      if(data.sort){
        data.unsorted(false);
        if (data.sortedUp()){
          data.sortedUp(false);
          data.sortedDown(true);
          data.sort(data.rowText, 'DESC');
        } else {
          data.sortedUp(true);
          data.sortedDown(false);
          data.sort(data.rowText, 'ASC');
        }
      }
    }

    self.columns = ko.observableArray(addSorting(params.columns || getColumnsForScaffolding(ko.unwrap(self.data))));
    // If you don't specify columns params, we'll use scaffolding
    // self.columns = params.columns || self.getColumnsForScaffolding(ko.unwrap(self.data));
  }
});
