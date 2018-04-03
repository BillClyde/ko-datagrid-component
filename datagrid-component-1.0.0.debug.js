/***********************************************
* datagrid-component JavaScript Library
* Authors: https://github.com/billclyde/datagrid-component/blob/master/README.md
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 04/03/2018 15:45:31
***********************************************/

(function (ko) {
'use strict';

/***********************************************
* FILE: ..\src\templates\datagrid-table.html 
***********************************************/
var tableTemplate = function(){ return '<table data-bind="attr: { class: tableClasses }" ><thead><tr data-bind="foreach: columns"><th scope="col" data-bind="text: headerText"></th></tr></thead><tbody data-bind="foreach: itemsOnCurrentPage"><tr data-bind="foreach: $parent.columns"><td data-bind="text: typeof rowText == \'function\' ? rowText($parent) : $parent[rowText] "></td></tr></tbody></table>';};

/***********************************************
* FILE: ..\src\components\datagrid-table.js 
***********************************************/
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

/***********************************************
* FILE: ..\src\templates\datagrid-pager.html 
***********************************************/
var pagerTemplate = function(){ return '<nav aria-label="Table Page Navigation"><ul class="pagination"><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === 0 ? \'disabled\' : \'\') } "><a class="page-link" href="#" data-bind="click: previousPage ">Previous</a></li><!-- ko foreach: ko.utils.range(minRange, maxRange) --><li data-bind="attr: {class: \'page-item \' + ($data == $parent.currentPageIndex() ? \'active\' : \'\')}"><a class="page-link"href="#"data-bind="text: $data + 1,click: function() { $parent.currentPageIndex($data) }"></a></li><!-- /ko --><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === maxPageIndex() ? \'disabled\' : \'\')}"><a class="page-link" href="#" data-bind="click: nextPage ">Next</a></li></ul></nav>';};

/***********************************************
* FILE: ..\src\components\datagrid-pager.js
***********************************************/
ko.components.register("pager" , {
  template: pagerTemplate(),
  viewModel: function (configuration) {
    this.data = configuration.data;
    this.pagerClasses = ko.observable("pagination " + (configuration.tableClasses || ""));
    this.currentPageIndex = ko.observable(0);
    this.pageSize = configuration.pageSize || 5;
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

    this.itemsOnCurrentPage = ko.pureComputed(function () {
      var startIndex = this.pageSize * this.currentPageIndex();
      return ko.unwrap(this.data).slice(startIndex, startIndex + this.pageSize);
    }, this);

    this.maxPageIndex = ko.pureComputed(function () {
      return Math.ceil(ko.unwrap(this.data).length / this.pageSize) - 1;
    }, this);
  }
});
})(ko);
