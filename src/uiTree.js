;(function(){
    angularUiTree = angular.module("angularUiTree",[]);

    angularUiTree.directive("uiTree",function($compile){
        return {
            restrict: "A",
            scope: {
                treeSource: "=uiTree"
            },
            compile: function(element, attr) {
                var $nodeTemplate = element.find("[node]").first().remove();
                var nodeName = $nodeTemplate.attr("node");

                function preLink ($scope, $element, $attr) {
                
                }

                function postLink ($scope, $element, $attr, ctrl, $transclude) {

                    var treeSourceName = $attr["uiTree"].replace(nodeName+".", "");
                    console.log(treeSourceName);

                    function postCompile(){
                        var $nodeChildrenTemplate = $nodeTemplate.find("[node-children]").first();
                        var nodeChildrenName = $nodeChildrenTemplate.attr("node-children");
                        $nodeChildrenTemplate.append($nodeTemplate.clone());
                        $nodeChildrenTemplate.attr("ui-tree", nodeChildrenName);
                        var $newNode = $($nodeTemplate[0].outerHTML);
                        $newNode.attr("ng-repeat", nodeName + " in treeSource")
                        $element.append($newNode);
                        $compile($newNode)($scope);
                    }

                    var unwatch = $scope.$watch("treeSource",function(){
                        if($scope.treeSource) {
                            postCompile();
                            unwatch();    
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