;(function(){
    angularUiTree = angular.module("angularUiTree",[]);

    angularUiTree.directive("uiTree",function($compile){
        return {
            restrict: "A",
            scope: {
                treeSource: "=uiTree",
                parent: "=nodeParent"
            },
            compile: function(element, attr) {
                var nodeStr = element.find("[node]").first()[0].outerHTML;
                element.find("[node]").first().hide();

                function preLink ($scope, $element, $attr) {

                }

                function postLink ($scope, $element, $attr) {
                    var $originNode = $element.find("[node]").first();
                    var $nodeTemplate = $(nodeStr);
                    var $newNode = $(nodeStr);
                    var nodeName = $originNode.attr("node");

                    var treeId = "ui_tree_" + Math.floor((Math.random() * 999999999) + 1);

                    function postCompile(){
                        $newNode.find("[node-children]").first().append($nodeTemplate);
                        $newNode.attr("ng-repeat", nodeName + " in " + treeId);
                        $newNode.attr("ui-tree-node", nodeName);
                        $originNode.replaceWith($newNode);
                        $newNode.show();
                        $compile($newNode)($scope);
                    }

                    var unwatch = $scope.$watch("treeSource",function(){
                        if($scope.treeSource && !$scope.$isCompiled) {
                            $scope[treeId] = $scope.treeSource;
                            postCompile();
                            unwatch();
                            $scope.$isCompiled = true;
                            $scope.__proto__ = $scope.$parent;
                        }
                    })
                }

                return {
                    pre: preLink,
                    post: postLink
                }
            }
        };
    });

    angularUiTree.directive("uiTreeNode",function($compile){
        return {
            restrict: "A",
            scope: {
                nodeSource: "=uiTreeNode"
            },
            compile: function(element, attr) {
                var nodeChildrenStr = element.find("[node-children]").first()[0].outerHTML;

                function preLink ($scope, $element, $attr) {

                }

                function postLink ($scope, $element, $attr) {
                    var $originNodeChildren = $element.find("[node-children]").first();
                    var $newNodeChildren = $(nodeChildrenStr);

                    var nodeChildrenName = $originNodeChildren.attr("node-children");
                    var nodeId = "ui_tree_node_" + Math.floor((Math.random() * 999999999) + 1);
                    var nodeName = $attr["node"];
                    var treeSourceName = nodeChildrenName.replace(nodeName, nodeId);

                    function postCompile(){
                        $newNodeChildren.attr("ui-tree", treeSourceName);
                        $newNodeChildren.attr("node-parent", nodeId);
                        $originNodeChildren.replaceWith($newNodeChildren);
                        $compile($newNodeChildren)($scope);
                    }

                    var unwatch = $scope.$watch("nodeSource",function(){
                        if($scope.nodeSource && !$scope.$isCompiled) {
                            $scope[nodeId] = $scope.nodeSource;
                            postCompile();
                            unwatch();
                            $scope.$isCompiled = true
                            $scope.__proto__ = $scope.$parent;
                        }
                    })
                }

                return {
                    pre: preLink,
                    post: postLink
                }
            }
        };
    });
})();