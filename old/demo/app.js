angular.module('angularUiTreeApp', ['angularUiTree'])
    .controller('MainCtrl', function($scope, treeConvertor){

        $scope.nodeActions = {
            move: {
                icon: "fa-arrows",
                click: function (item) {
                    event.cancelBubble = true;
                    //jstree-node状态设为in-move
                    $(event.target).parentsUntil('ul', '.jstree-node').addClass('move-source');
                    //树的状态设为in-move
                    $(".jstree").addClass("in-move");
                }
            },
            sortUp: {
                icon: "fa-arrow-up",
                click: function (item) {
                }
            },
            sortDown: {
                icon: "fa-arrow-down",
                click: function (item) {
                }
            }
        };

        $scope.ActiveNode = function (item) {
            //in-move状态下选中：选中目标
            if ($(".jstree").hasClass("in-move")) {

                //清除所有in-move状态
                $('.move-source').removeClass('move-source');
                $('.in-move').removeClass('in-move');

            }
        }

        var depts = [
            { id: 1, parentId: null, name: '节点1', isLeaf: false },
            { id: 2, parentId: null, name: '节点2', isLeaf: false,
                children: [
                    { id: 3, parentId: 1, name: ' 子节点1', isLeaf: true }
                ]
            },
        ];
        $scope.departmentsTreeSource = depts;
        $scope.departmentsTreeSource[0].hide = {
            move: true,
            sortUp: true,
            sortDown: true
        };
        $scope.departmentsTreeSource[0].active = true;
        $scope.departmentsTreeSource[0].open = true;

        $scope.treeSetting = {
            treeConvertorOptions: {
                key: "id",
                parentKey: "pid",
                name: "name",
                type: null,
                isLeaf: "isLeaf"
            }
        };
    });
