
angular.module("app", [])

.filter('nativesort', function(){
    return function (input, option){
        return input.sort();
    };
})

.controller('TodoController', function ($scope){

    $scope.totalTodos = 4;

    // 가상 데이터
    $scope.todos = [
        {text:'Learn You', done:false},
        {text:'Build SPA', done:true}
    ];

    // 전체 목록수 반환
    $scope.getTotalTodos = function(){
        return $scope.todos.length;
    };
    
    
    $scope.addTodo = function(){
        var text = $scope.formTodoText;
        //console.log('text : ', text);
        $scope.todos.push(
            {text:text, done:false}
        );
        $scope.formTodoText = '';
    };

    // Underscore.js 를 이용하여 done=false 인 것만 배열로 뽑아낸다
    $scope.clearComplated = function (){
        $scope.todos = _.filter($scope.todos, function(todo){
            return !todo.done;
        });
    };
});

























