ko.components.register("pager" , {
  template: pagerTemplate(),
  viewModel: function (param) {
    var self = this;
/* Parameters *******************************/
    self.data = param.data;
    self.pageItems = param.pageItems;
    self.tableClasses = param.tableClasses;
/********************************************/
    self.pagerClasses = ko.observable("pagination " + (self.tableClasses || ""));
    self.currentPageIndex = ko.observable(0);
    self.pageSize = param.pageSize || 5;
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
    self.minRange = ko.pureComputed(function () {
      return (this.currentPageIndex() - 2) < 0 ? 0 : (this.currentPageIndex() - 2);
    }, this);

    this.maxRange = ko.pureComputed(function () {
      return (this.currentPageIndex() + 2) > this.maxPageIndex() ? this.maxPageIndex() : this.currentPageIndex() + 2;
    }, this);

    self.itemsOnCurrentPage = function () {
      var startIndex = self.pageSize * self.currentPageIndex();
      return ko.unwrap(self.data).slice(startIndex, startIndex + self.pageSize);
    };

    this.maxPageIndex = ko.pureComputed(function () {
      return Math.ceil(ko.unwrap(this.data).length / this.pageSize) - 1;
    }, this);

    self.pageItems(self.itemsOnCurrentPage());
  }
});
