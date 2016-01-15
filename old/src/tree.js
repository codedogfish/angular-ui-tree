/*
 * tree 1.1.5
 * 修改tree compile多次的bug
 * 优化大数据量情况下的效率
 * 恢复activeNode方法
 * isLeap拼写错误，改为isLeaf
 * 重命名为dirTree
 * treeConvertor新增createRoot
 * 新增toggleNode方法、通过node的active和open属性可以设置默认选中和展开
 */
tree_v = "1.1.5";
(function () {
    var app = angular.module('angularUiTree',[]);
    app.treeViewOptions = [
        "nodeRemove",//删除 function(node){}
        "nodeAdd",//添加 function(node){}
        "nodeEdit",//添加 function(node){}
        "nodeRefresh",//刷新 function(node){}
        "nodeToggle",//展开/闭合 function(node){}
        "nodeLoad",//展开/闭合 function(node){}
        "nodeSelect",//选中/取消选中 function(node){}
        "nodeActive",//选中/取消选中 function(node){}
        "nodeActions",//自定义 [{icon:'fa-user',click:function(node){}},...]
        "nodeIcons",//节点图标 {'user':'fa-user',...}
        "nodeAll",//所有节点
        "nodeSetting"//设置 {selectMode: "advanced", expandAll: true, treeConvertorOptions: {}}
    ];
    app.treeViewOptionAbbrs = ["remove", "add", "edit", "refresh", "toggle", "load", "select", "active", "actions", "icons", "all", "setting"];
    app.treeViewDefaultSetting = {
        selectMode: "simple",//simple 简单模式 advanced 高级模式
        expandAll: false//是否全部展开
    };
    app.treeScope = {
        tree: "=dirTree"
    };
    app.treeContentScope = {
        treeContent: "=dirTreeContent"
    };
    app.treeTemplate = "jstree";
    for (var i = 0; i < app.treeViewOptions.length; i++) {
        app.treeScope[app.treeViewOptions[i]] = "=";
        app.treeContentScope[app.treeViewOptions[i]] = "=";
    }
    app.treeContentCompile = function (treeContentContainer, scope, source, prefix, $compile, addition) {
        //var treeContentContainer = $("<div tree-content='" + source + "'></div>");
        //var treeContentContainer = element.children().first();
        treeContentContainer.attr("dir-tree-content", source);
        var options = app.treeViewOptions;
        var optionAbbrs = app.treeViewOptionAbbrs;
        for (var i = 0; i < options.length; i++) {
            treeContentContainer.attr('node-' + optionAbbrs[i], prefix + options[i]);
        }
        if (addition) {
            for (var property in addition) {
                treeContentContainer.attr(property, addition[property]);
            }
        }
        $compile(treeContentContainer)(scope);
        //element.html("").append(treeContentContainer);
    };
    app.pushChildrenToList = function (list, nodes) {
        if (!nodes) {
            return;
        }
        for (var i = 0; i < nodes.length; i++) {
            list.push(nodes[i]);
            app.pushChildrenToList(list, nodes[i].children);
        }
    };
    app.directive('dirTree', ["$compile", function ($compile) {
        return {
            restrict: 'A',
            templateUrl: '../src/templates/' + app.treeTemplate + '/tree.html',
            scope: app.treeScope,
            link: function (scope, element, attrs) {

                function compile() {
                    scope.tree.list = [];
                    app.pushChildrenToList(scope.tree.list, scope.tree);
                    var treeContentContainer = element.find(".dir-tree-container");
                    app.treeContentCompile(treeContentContainer, scope, "tree", "", $compile, { "node-all": "tree" });
                    scope.tree.compiled = true;
                    scope.tree.UpdateNode = function (id, name, data) {
                        for (var j = 0; j < scope.tree.list.length; j++) {
                            var node = scope.tree.list[j];
                            if (node.id == id) {
                                node.name = name;
                                node.data = data;
                            }
                        }
                    };
                    scope.tree.RemoveNode = function (id) {
                        for (var j = 0; j < scope.tree.list.length; j++) {
                            var node = scope.tree.list[j];
                            if (node.id == id) {
                                var parentNode = node.GetParent();
                                parentNode.RemoveChild(node);
                                scope.tree.list.splice(j, 1);
                            }
                        }
                    };
                    scope.tree.AddNode = function (parentId, id, name, data) {
                        for (var j = 0; j < scope.tree.list.length; j++) {
                            var node = scope.tree.list[j];
                            if (node.id == parentId) {
                                var newNode = {
                                    id: id,
                                    parentId: parentId,
                                    name: name,
                                    data: data,
                                    isLeaf: true
                                };
                                node.AddChild(newNode);
                                scope.tree.list.push(newNode);
                            }
                        }
                    };
                }

                scope.$watch("tree", function () {
                    var toCompile = false;
                    if (scope.tree) {
                        if (scope.tree.$resolved == undefined) {
                            if (!scope.tree.compiled) {
                                toCompile = true;
                            }
                        } else {
                            if (!scope.tree.compiled && scope.tree.$resolved) {
                                toCompile = true;
                            } else if (scope.tree.compiled && !scope.tree.$resolved) {
                                scope.tree.compiled = false;
                            }
                        }
                        //todo if newlist.length not equal old compile
                        scope.tree.compile = compile;
                    }
                    if (toCompile) {
                        scope.tree.compile();
                    }
                }, true);
            },
            replace: true
        };
    }]);
    app.directive('dirTreeContent', function () {
        return {
            restrict: 'A',
            templateUrl: '../src/templates/' + app.treeTemplate + '/treeContent.html',
            scope: app.treeContentScope,
            link: function (scope, element, attrs) {
                var options = app.treeViewOptions;
                scope.options = {};
                for (var i = 0; i < options.length; i++) {
                    scope.options[options[i]] = scope[options[i]];
                }
            },
            replace: true
        };
    });
    app.directive('dirTreeNode', ["$compile", "treeConvertor", function ($compile, treeConvertor) {
        return {
            restrict: 'A',
            templateUrl: '../src/templates/' + app.treeTemplate + '/treeNode.html',
            scope: {
                treeNode: "=dirTreeNode",
                options: "=",
                isLast: "="
            },
            link: function (scope, element, attrs) {
                scope.treeNode.isLast = scope.isLast;
                scope.$watch("isLast", function () {
                    scope.treeNode.isLast = scope.isLast;
                });
                scope.treeNode.compiled = false;
                if (!scope.treeNode.isLeaf) {
                    scope.treeNode.isLeaf = false;
                }
                function complieChildren() {
                    if (scope.treeNode.children && !scope.treeNode.compiled) {
                        var treeContentContainer = element.find(".dir-tree-container");
                        app.treeContentCompile(treeContentContainer, scope, "treeNode.children", "options.", $compile);
                        scope.treeNode.compiled = true;
                        scope.treeNode.isLeaf = false;
                    } else {
                        scope.$watch("treeNode.children", function () {
                            if (scope.treeNode.children && !scope.treeNode.compiled) {
                                complieChildren();
                            }
                        });
                    }
                }

                function toggleSelectChildren(node) {
                    if (node.children) {
                        for (var i = 0; i < node.children.length; i++) {
                            node.children[i].select = node.select;
                            toggleSelectChildren(node.children[i]);
                        }
                    }
                }

                if (!scope.options) {
                    scope.options = {};
                }
                scope.settings = {};
                angular.extend(scope.settings, app.treeViewDefaultSetting);
                angular.extend(scope.settings, scope.options.nodeSetting);
                //激活节点，方便外部获得节点，并设置节点状态
                scope.treeNode.activeNode = function () {
                    for (var i = 0; i < scope.options.nodeAll.list.length; i++) {
                        scope.options.nodeAll.list[i].active = false;
                    }
                    scope.treeNode.active = true;
                };
                scope.active = function (e) {
                    e.stopPropagation();
                    doActive();
                };
                function doActive() {
                    scope.treeNode.activeNode();
                    if (scope.options.nodeActive) {
                        scope.options.nodeActive(scope.treeNode);
                    }
                }
                scope.treeNode.DoActive = doActive;
                if (scope.treeNode.active) {
                    scope.treeNode.DoActive();
                }
                //节点选中取消
                scope.select = function () {
                    if (!scope.treeNode.select) {
                        scope.treeNode.select = 'checked';
                    } else {
                        scope.treeNode.select = '';
                    }
                    if (scope.settings.selectMode == 'advanced') {
                        toggleSelectChildren(scope.treeNode);
                        if (scope.treeNode.parent) {
                            scope.treeNode.parent().checkSelect();
                        }
                    }
                    if (scope.options.nodeSelect) {
                        scope.options.nodeSelect(scope.treeNode);
                    }
                };
                //如果selectMode为advanced，则分三种状态，全选、未选、部分
                scope.treeNode.checkSelect = function () {
                    if (scope.settings.selectMode == 'advanced') {
                        if (scope.treeNode.children && scope.treeNode.children.length > 0) {
                            var allChecked = true;
                            var allUnChecked = true;
                            for (var i = 0; i < scope.treeNode.children.length; i++) {
                                if (scope.treeNode.children[i].select == 'checked') {
                                    allUnChecked = false;
                                } else if (scope.treeNode.children[i].select == 'part') {
                                    allUnChecked = false;
                                    allChecked = false;
                                } else {
                                    allChecked = false;
                                }
                            }
                            if (allChecked) {
                                scope.treeNode.select = 'checked';
                            } else if (allUnChecked) {
                                scope.treeNode.select = '';
                            } else {
                                scope.treeNode.select = 'part';
                            }
                        }
                        if (scope.treeNode.parent) {
                            scope.treeNode.parent().checkSelect();
                        }
                    }
                };
                scope.treeNode.toggleNode = function () {
                    scope.treeNode.open = !scope.treeNode.open;
                };
                function loadChildren() {
                    scope.treeChildren = scope.options.nodeLoad(scope.treeNode);
                    if (!scope.treeNode.children) {
                        scope.treeNode.children = [];
                    }

                    scope.treeNode.loading = true;
                    scope.treeNode.children.loading = true;

                    scope.treeChildren.$promise.then(function () {
                        if (scope.treeChildren.length == 0) {
                            scope.treeNode.isLeaf = true;
                            return;
                        }

                        var key = scope.settings.treeConvertorOptions.key;
                        var parentKey = scope.settings.treeConvertorOptions.parentKey;
                        var name = scope.settings.treeConvertorOptions.name;
                        var type = scope.settings.treeConvertorOptions.type;
                        var isLeaf = scope.settings.treeConvertorOptions.isLeaf;
                        //转换子节点
                        //scope.treeNode.children = treeConvertor.convert(scope.treeChildren, key, parentKey, name, type, isLeaf);
                        var children = treeConvertor.convert(scope.treeChildren, key, parentKey, name, type, isLeaf);
                        scope.treeNode.AddChildren(children);
                        app.pushChildrenToList(scope.options.nodeAll.list, scope.treeNode.children);

                        scope.treeNode.loading = false;
                        scope.treeNode.children.loading = false;

                        scope.treeNode.loaded = true;
                        scope.treeNode.children.loaded = true;
                    });
                }
                //子节点展开闭合
                scope.toggle = function (e) {
                    e.stopPropagation();
                    doToggle();
                };
                function doToggle() {
                    scope.treeNode.toggleNode();
                    if (scope.options.nodeToggle) {
                        scope.options.nodeToggle(scope.treeNode);
                    }
                    //LazyLoad模式且状态为未加载
                    if (scope.options.nodeLoad && !scope.treeNode.loaded && !scope.treeNode.isLeaf) {
                        loadChildren();
                    }
                }
                if (scope.treeNode.open) {
                    scope.treeNode.open = false;
                    doToggle();
                } else {
                    //如果设置为全部展开且不是LazyLoad
                    scope.treeNode.open = scope.settings.expandAll && !scope.options.nodeLoad;
                }
                /*scope.$watch("events", complieChildren, true);*/
                scope.BaseUrl = app.BaseUrl;
                complieChildren();
            },
            replace: true
        };
    }]);
    //树形数据结构转换器
    app.service('treeConvertor', function () {
        function treeNode(id, parentId, name, data) {
            this.id = id;
            this.parentId = parentId;
            this.name = name;
            this.data = data;
            this.AddChild = function (childNode) {
                if (!this.children) {
                    this.children = [];
                }
                this.isLeaf = false;
                this.loading = false;
                this.children.loading = false;
                this.loaded = true;
                this.children.loaded = true;
                this.children.push(childNode);
                var parentNode = this;
                childNode.GetParent = function () {
                    return parentNode;
                };
            };
            this.AddChildren = function (childrenNodes) {
                for (var k = 0; k < childrenNodes.length; k++) {
                    var childNode = childrenNodes[k];
                    this.AddChild(childNode);
                }
            };
            this.RemoveChild = function (childNode) {
                var index = this.children.indexOf(childNode);
                this.children.splice(index, 1);
                if (this.children.length == 0) {
                    this.isLeaf = true;
                }
            };
        };
        return {
            convert: function (array, key, parentKey, value, type, isLeaf) {
                //所有节点，以节点的key为索引
                var nodeDic = {};
                //节点数组，以节点的parentKey为索引
                var parentNodeDic = {};
                for (var i = 0; i < array.length; i++) {
                    var item = array[i];
                    //转换节点，原始数据保存在data中
                    var node = new treeNode(item[key], item[parentKey], item[value], item);
                    //type为可选项
                    if (type) {
                        node.type = item[type];
                    }
                    //isLeaf为可选项
                    if (isLeaf) {
                        if (!item[isLeaf]) {
                            node.children = [];
                            node.isLeaf = false;
                        } else {
                            node.isLeaf = true;
                        }
                    }
                    //加入字典
                    nodeDic[node.id] = node;
                    if (!parentNodeDic[node.parentId]) {
                        parentNodeDic[node.parentId] = [];
                    }
                    parentNodeDic[node.parentId].push(node);
                }
                if (parentKey == null) {
                    return parentNodeDic["undefined"];
                }
                var root = [];
                for (var parentId in parentNodeDic) {
                    //如果parentId在所有节点中不存在，该数组为根
                    if (!nodeDic[parentId]) {
                        root = parentNodeDic[parentId];
                    }
                }
                for (var j = 0; j < root.length; j++) {
                    //递归设置children子节点
                    setChildren(root[j]);
                }
                return root;

                function setChildren(parent) {
                    //如果存在以parentId为索引的数组，该数组给parent的children
                    if (parentNodeDic[parent.id]) {
                        //parent.children = parentNodeDic[parent.id];
                        parent.AddChildren(parentNodeDic[parent.id]);
                        for (var k = 0; k < parent.children.length; k++) {
                            /*(function (parentNode) {
                                parent.children[k].GetParent = function () {
                                    return parentNode;
                                };
                            })(parent);*/
                            setChildren(parent.children[k]);
                        }
                    }
                };
            },
            createRoot: function (rootName) {
                var root = new treeNode(null, null, rootName, null);
                root.children = [];
                root.hide = {};
                var rootTreeSource = [root];
                rootTreeSource.$resolved = true;
                return rootTreeSource;
            }
        };
    });
})();
