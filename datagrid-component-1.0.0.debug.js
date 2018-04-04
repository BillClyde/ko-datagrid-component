/***********************************************
* datagrid-component JavaScript Library
* Authors: https://github.com/billclyde/datagrid-component/blob/master/README.md
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 04/04/2018 15:44:39
***********************************************/

(function (ko) {
'use strict';

/***********************************************
* FILE: ..\src\templates\datagrid-table.html
***********************************************/
var tableTemplate = function(){ return '<table data-bind="attr: { class: tableClasses }" ><thead><tr data-bind="foreach: columns"><th scope="col" data-bind="text: headerText"></th></tr></thead><tbody data-bind="foreach: currentItems"><tr data-bind="foreach: $parent.columns"><td data-bind="text: typeof rowText == \'function\' ? rowText($parent) : $parent[rowText] "></td></tr></tbody></table>';};

/***********************************************
* FILE: ..\src\components\datagrid-table.js
***********************************************/
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

/***********************************************
* FILE: ..\src\templates\datagrid-pager.html 
***********************************************/
var pagerTemplate = function(){ return '<nav aria-label="Table Page Navigation"><ul class="pagination"><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === 0 ? \'disabled\' : \'\') } "><a class="page-link" href="#" data-bind="click: previousPage ">Previous</a></li><!-- ko foreach: ko.utils.range(minRange, maxRange) --><li data-bind="attr: {class: \'page-item \' + ($data == $parent.currentPageIndex() ? \'active\' : \'\')}"><a class="page-link"href="#"data-bind="text: $data + 1,click: function() { $parent.currentPageIndex($data) }"></a></li><!-- /ko --><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === maxPageIndex() ? \'disabled\' : \'\')}"><a class="page-link" href="#" data-bind="click: nextPage ">Next</a></li></ul></nav>';};

/***********************************************
* FILE: ..\src\components\datagrid-pager.js
***********************************************/
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
})(ko);
