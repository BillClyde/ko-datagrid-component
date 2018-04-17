ko.components.register("filter", {
  template: filterTemplate(),
  viewModel: function(param) {
    var self = this;
    /* Parameters *************************/
    self.data = param.data;
    /**************************************/
    self.filterValue = ko.observable();
    self.filteredData =ko.observableArray(self.data());
    self.filterValue.subscribe(function (newValue) {
      self.filteredData(self.dataFilter(newValue));
    });

    self.dataFilter = function (searchTerm) {
      var resultList = [];
      var found = [];
      searchTerm = (searchTerm || '').toLowerCase();
      for (var item in self.data()){
        for(var idx in self.data()[item]){
          if((self.data()[item][idx] || '').toLowerCase().search(searchTerm)>-1 && found.indexOf(item) === -1){
            resultList.push(self.data()[item]);
            found.push(item);
          }
        }
      }
      return resultList;
    }
  }
});
