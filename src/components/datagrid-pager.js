ko.components.register("pager" , {
  template: pagerTemplate(),
  viewModel: function (param) {
    var self = this;
/* Parameters *******************************/
    self.data = param.data;
    self.tableClasses = param.tableClasses;
    self.pageSize = param.pageSize || ko.observable(5);
    self.pageSizes = param.pageSizes || ko.observableArray([5, 10, 15]);
/********************************************/
    self.pagerClasses = ko.observable("pagination " + (self.tableClasses || ""));
    self.pageItems = ko.observableArray([]);
    self.currentPageIndex = ko.observable(0);
    self.previousPage = function () {
      var currIndex = self.currentPageIndex() - 1;
      self.currentPageIndex(currIndex);
      self.pageItems(self.itemsOnCurrentPage());
    }
    self.currentPageIndex.subscribe(function (newIdx) {
      self.pageItems(self.itemsOnCurrentPage());
    });
    self.nextPage = function () {
      var currIndex = self.currentPageIndex() + 1;
      self.currentPageIndex(currIndex);
      self.pageItems(self.itemsOnCurrentPage());
    }
    self.setPageSize = function (data) {
      self.pageSize(data);
      self.pageItems(self.itemsOnCurrentPage());
    };
    self.minRange = ko.pureComputed(function () {
      return (self.currentPageIndex() - 2) < 0 ? 0 : (self.currentPageIndex() - 2);
    });

    self.maxRange = ko.pureComputed(function () {
      return self.minRange() + 4;
    });

    self.itemsOnCurrentPage = function () {
      var startIndex = self.pageSize() * self.currentPageIndex();
      return ko.unwrap(self.data).slice(startIndex, startIndex + self.pageSize());
    };

    self.maxPageIndex = ko.pureComputed(function () {
      return Math.ceil(ko.unwrap(self.data).length / self.pageSize()) - 1;
    });

    self.atFirstIndex = ko.pureComputed(function () { 
      return self.minRange() >= 1;
    });

    self.atSecondIndex = ko.pureComputed(function () { 
      return self.minRange() >= 2;
    });

    self.atLastIndex = ko.pureComputed(function () {
      return self.maxRange === self.maxPageIndex;
    });

    self.pageItems(self.itemsOnCurrentPage());
  }
});
