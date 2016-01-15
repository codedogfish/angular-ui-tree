angularUiTreeDemo = angular.module("angularUiTreeDemo",["angularUiTree"]);
angularUiTreeDemo.controller("MainCtrl",function($scope){
    $scope.treeSource = [
        {
            id: 1,
            name: 'jack'
        },
        {
            id: 2,
            name: 'ivan',
            children: [
                {
                    id: 3,
                    name: 'ivan`s son',
                    children: [
                        {
                            id: 4,
                            name: 'ivan`s grandson'
                        }
                    ]
                }
            ]
        }
    ];
    $scope.alert = function(item) {
        console.log(item.id);
    };
    $scope.toggle = function(item) {
        console.log(item);
        item.isOpen = !item.isOpen;
    };
});
