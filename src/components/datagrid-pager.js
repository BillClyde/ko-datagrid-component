ko.components.register("pager" , {
  template: pagerTemplate(),
  viewModel: function (param) {
/* Parameters *******************************/
    this.data = param.data;
    this.pageItems = param.pageItems;
    this.tableClasses = param.tableClasses;
/********************************************/
    this.pagerClasses = ko.observable("pagination " + (this.tableClasses || ""));
    this.currentPageIndex = ko.observable(0);
    this.pageSize = param.pageSize || 5;
    this.previousPage = function () {
      var currIndex = this.currentPageIndex() - 1;
      this.currentPageIndex(currIndex);
      this.pageItems(this.itemsOnCurrentPage());
    }
    this.nextPage = function () {
      var currIndex = this.currentPageIndex() + 1;
      this.currentPageIndex(currIndex);
      this.pageItems(this.itemsOnCurrentPage());
    }
    this.minRange = ko.pureComputed(function () {
      return (this.currentPageIndex() - 2) < 0 ? 0 : (this.currentPageIndex() - 2);
    }, this);

    this.maxRange = ko.pureComputed(function () {
      return (this.currentPageIndex() + 2) > this.maxPageIndex() ? this.maxPageIndex() : this.currentPageIndex() + 2;
    }, this);

    this.itemsOnCurrentPage = function () {
      var startIndex = this.pageSize * this.currentPageIndex();
      return ko.unwrap(this.data).slice(startIndex, startIndex + this.pageSize);
    };

    this.maxPageIndex = ko.pureComputed(function () {
      return Math.ceil(ko.unwrap(this.data).length / this.pageSize) - 1;
    }, this);
  }
});
