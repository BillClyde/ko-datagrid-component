/***********************************************
* datagrid-component JavaScript Library
* Authors: https://github.com/billclyde/datagrid-component/blob/master/README.md
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 04/16/2018 16:54:56
***********************************************/

(function (ko) {
'use strict';

/***********************************************
* FILE: ..\src\templates\datagrid-table.html
***********************************************/
var tableTemplate = function(){ return '<table data-bind="attr: { class: tableClasses }" ><thead><tr data-bind="foreach: columns"><!-- ko if: $data.sort --><th scope="col" data-bind="click: $parent.sort.bind(rowText)"style="cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;"><div class="row text-nowrap"><div class="col text-left" data-bind="text: headerText" ></div><!-- ko if: $data.unsorted --><div class="col text-right">&uarr;&darr;</div><!-- /ko --><!-- ko if: $data.sortedUp --><div class="col text-right">&nbsp;&uarr;</div><!-- /ko --><!-- ko if: $data.sortedDown --><div class="col text-right">&nbsp;&darr;</div><!-- /ko --></div></th><!-- /ko --><!-- ko ifnot: $data.sort --><th scope="col" data-bind="text: headerText"></th><!-- /ko --></tr></thead><tbody data-bind="foreach: data"><tr data-bind="foreach: $parent.columns"><td data-bind="text: typeof rowText == \'function\' ? rowText($parent) : $parent[rowText] "></td></tr></tbody></table>';};

/***********************************************
* FILE: ..\src\components\datagrid-table.js
***********************************************/
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

/***********************************************
* FILE: ..\src\templates\datagrid-pager.html
***********************************************/
var pagerTemplate = function(){ return '<!-- ko template: {nodes: $componentTemplateNodes} --><!-- /ko --><div class="row"><div class="col"><nav aria-label="Table Page Navigation"><ul class="pagination"><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === 0 ? \'disabled\' : \'\') } "><a class="page-link" href="#" data-bind="click: previousPage ">Prev</a></li><li data-bind="visible: atFirstIndex"><a href="#"class="page-link"data-bind="click: function () { currentPageIndex(0) }, text: \'1\'"></a></li><li data-bind="visible: atSecondIndex"><button type="button" class="btn btn-default" disabled data-bind="text: \'&hellip;\'"></button></li><!-- ko foreach: ko.utils.range(minRange, maxRange) --><li data-bind="attr: {class: \'page-item \' + ($data == $parent.currentPageIndex() ? \'active\' : \'\')}"><a class="page-link"href="#"data-bind="text: $data + 1,click: function() { $parent.currentPageIndex($data) }"></a></li><!-- /ko --><li data-bind="visible: atLastIndex"><button type="button" class="btn btn-default" disabled data-bind="text: \'&hellip;\'"></button></li><li data-bind="visible: atSecondLastIndex"><a href="#"class="page-link"data-bind="text: maxPageIndex() + 1,click: function(){currentPageIndex(maxPageIndex())}"></a></li><li data-bind="attr: {class: \'page-item \'+ (currentPageIndex() === maxPageIndex() ? \'disabled\' : \'\')}"><a class="page-link" href="#" data-bind="click: nextPage ">Next</a></li></ul></nav></div><div class="col"><div class="btn-group float-right" role="group" data-bind="foreach: pageSizes"><button type="button" class ="btn btn-default" data-bind="click: function() { $parent.setPageSize($data) }, text: $data"></button></div></div></div>';};

/***********************************************
* FILE: ..\src\components\datagrid-pager.js
***********************************************/
ko.components.register("pager" , {
  template: pagerTemplate(),
  viewModel: function (param) {
    var self = this;
/* Parameters *******************************/
    self.data = param.data;
    self.pagerClasses = param.pagerClasses;
    self.pageSize = param.pageSize || ko.observable(5);
    self.pageSizes = param.pageSizes || ko.observableArray([5, 10, 15]);
/********************************************/
    self.pagerClasses = ko.observable("pagination " + (self.pagerClasses || ""));
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

    self.setPageSize = function (size) {
      self.pageSize(size);
      self.pageItems(self.itemsOnCurrentPage());
      if (self.currentPageIndex() > self.maxPageIndex()){
        self.currentPageIndex(self.maxPageIndex());
      }
    }

    self.minRange = ko.pureComputed(function () {
      var min;
      if (self.currentPageIndex() >= self.maxPageIndex() - 3) {
        min = self.maxPageIndex() - 4
      } else {
        min = (self.currentPageIndex() - 2) < 0 ? 0 : (self.currentPageIndex() - 2);
      }
      return min
    });

    self.maxRange = ko.pureComputed(function () {
      var max;
      if (self.currentPageIndex() >= self.maxPageIndex() - 4){
        max = self.currentPageIndex() === self.maxPageIndex() - 4 ? self.maxPageIndex() - 2 : self.maxPageIndex();
      } else {
        max = self.currentPageIndex() === 3 ? self.minRange() + 3 : self.minRange() + 4;
      }
      return max;
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
      return self.maxRange() <= self.maxPageIndex() - 1;
    });

    self.atSecondLastIndex = ko.pureComputed(function () {
      return self.maxRange() <= self.maxPageIndex() - 2;
    });

    self.data.subscribe(function (d) {
      self.pageItems(self.itemsOnCurrentPage());
    });

    self.pageItems(self.itemsOnCurrentPage());
  }
});

/***********************************************
* FILE: ..\src\templates\datagrid-filter.html
***********************************************/
var filterTemplate = function(){ return '<input class="form-control" id="searchInput" data-bind="textInput: filterValue" type="text" placeholder="Search&hellip;" /><!-- ko template: {nodes: $componentTemplateNodes} --><!-- /ko -->';};

/***********************************************
* FILE: ..\src\components\datagrid-filter.js
***********************************************/
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
})(ko);
