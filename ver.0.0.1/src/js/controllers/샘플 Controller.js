/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.controller( 'NameController', _controller );

        // 선언
        function _controller( $scope, $route, $routeParams, $location, $rootScope ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'SampleController';


            /*
            $rootScope.$route = $route;
            $rootScope.$location = $location;
            $rootScope.$routeParams = $routeParams;

            out( '$route : ', $route );
            out( '$location : ', $location );
            out( '$routeParams : ', $routeParams );

            <pre>$location.path() = {{$location.path()}}</pre>
            <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
            <pre>$route.current.params = {{$route.current.params}}</pre>
            <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
            <pre>$routeParams = {{$routeParams}}</pre>
            */


            out( 'SampleController loaded' );
        }
        
        // 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);


/*
$controllerProvider.register('name', _controller);

application.controller('myCustomer', function($scope) {
    //
});
*/