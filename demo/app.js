angularUiTreeDemo = angular.module("angularUiTreeDemo",["angularUiTree"]);
angularUiTreeDemo.controller("MainCtrl",function($scope){
    var test = [];
    test.abc = 123;
    $scope.treeSource = [
        {
            id: 1,
            name: 'jack',
            isOpen: true,
        },
        {
            id: 2,
            name: 'ivan',
            isOpen: true,
            children: [
                {
                    id: 3,
                    name: 'ivan`s son',
                    isOpen: true,
                    children: [
                        {
                            id: 4,
                            name: 'ivan`s grandson',
                            isOpen: true,
                            children: test
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
