ko.components.register("datagrid", {
  template: tableTemplate(),
  viewModel: function (configuration) {
    this.data = configuration.data;
    this.tableClasses = ko.observable("table " + (configuration.tableClasses || ""));
    this.currentPageIndex = ko.observable(0);
    this.pageSize = configuration.pageSize || 5;
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
    this.previousPage = function () {
      var currIndex = this.currentPageIndex() - 1;
      this.currentPageIndex(currIndex);
    }
    this.nextPage = function () {
      var currIndex = this.currentPageIndex() + 1;
      this.currentPageIndex(currIndex);
    }
    this.minRange = ko.pureComputed(function () {
      return (this.currentPageIndex() - 2) < 0 ? 0 : (this.currentPageIndex() - 2);
    }, this);

    this.maxRange = ko.pureComputed(function () {
      return (this.currentPageIndex() + 2) > this.maxPageIndex() ? this.maxPageIndex() : this.currentPageIndex() + 2;
    }, this);

    // If you don't specify columns configuration, we'll use scaffolding
    this.columns = configuration.columns || this.getColumnsForScaffolding(ko.unwrap(this.data));

    this.itemsOnCurrentPage = ko.computed(function () {
      var startIndex = this.pageSize * this.currentPageIndex();
      return ko.unwrap(this.data).slice(startIndex, startIndex + this.pageSize);
    }, this);

    this.maxPageIndex = ko.computed(function () {
      return Math.ceil(ko.unwrap(this.data).length / this.pageSize) - 1;
    }, this);
  }
});
