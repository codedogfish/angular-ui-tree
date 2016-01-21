# Angular-UI-Tree

## use your own data struct

This uiTree not require you to convert your data to some specific struct.

## two way data-binding

"Native" directive of tree mean the ui and data is directly two way binding. Not like others are based on jQuery tree plugins.

## dom customize

You can customize the presenation of tree ui, just create your own dom and add three attributes to make a uiTree.


### 简介

1. `ui-tree="treeSource"` 
	用于指定 tree 的容器以及数据源
2. `node="item"` 
	用于指定被 ng-repeat 的元素，item 则表示 node 的变量名，相当于 `ng-repeat="item in treeSource"`
3. `node-children="item.children"` 
	用于指定 sub-tree 的容器，item.children 则表示子树的数据源

与另一个版本的 [angular-ui-tree](https://github.com/angular-ui-tree/angular-ui-tree) 相比更简洁，只提供最基础的按照数据递归渲染 DOM 的功能，方便开发者定制自己的 DOM 结构和功能

### 示例：

1、开发可展开闭合的树

```
<ul ui-tree="treeSource">
    <li node="item" id="{{item.id}}">
        <span>{{item.name}}</span>
        <button ng-show="item.children" ng-click="toggle(item);">open</button>
        <ul node-children="item.children" ng-show="item.isOpen"></ul>
    </li>
</ul>
```

```
// you control your own data struct
// that mean if there is a 'x' field in you model
// you can just use {{your_variable_name.x}} in the dom
$scope.treeSource = [
    { id: 1, name: 'jack' },
    { id: 2, name: 'ivan', children: [ { id: 3, name: 'ivan`s son' }, { id: 4, name: 'ivan`s daughter' } ] }
];

$scope.toggle = function(item) {
    item.isOpen = !item.isOpen;
};
```
