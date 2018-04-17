# ko-datagrid-component
Ko Datagrid is a component that was inspired by KoGrid. Since KoGrid hasn't been updated in a few years and KnockoutJS now has a component API, a new data grid was needed. The initial component will have a Bootstrap dependency, this may be made optional in the future so any css framework can be used.
## Dependencies
* Knockout 3.2
* Bootstrap 4
## Installation
Download the debug file and reference it in the  index.html file. For ASP.NET MVC users put a reference to the file in your bundle config.
## Usage
```html
<pager params='data:myData'>
  <datagrid params='data:$component.pageItems, columns:$parent.myColumns'></datagrid>
</pager>
```
$component.pageItems is the output of the pager. 

myData and $parent.myColumns exist in the parent view model.
## Roadmap
* Datagrid (done)
* Pager (done)
* Sorting (done)
* Filtering (in progress)
* Column Selection
* Row Select
* Customizations
## Contributors
[Bill Clyde](https://github.com/billclyde/ko-datagrid-component)
