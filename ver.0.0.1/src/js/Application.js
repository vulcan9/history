'use strict';

//requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define([
        'angular', //앵귤러 모듈을 사용하기 위해 임포트
        //_PATH.CONTROLLER + 'AppController'
    ],

    //디펜던시 로드뒤 콜백함수
    function(angular) {

        //-----------------------------------
        // App 모듈 선언 : angular.module(name, [requires], [configFn]);
        //-----------------------------------

        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var application = angular.module('Application', ['ngRoute'], function($provide, $compileProvider, $controllerProvider, $filterProvider) {
            //
        });

        
        /*
        // http://vitalets.github.io/angular-xeditable/#bootstrap3
        app.run(function(editableOptions, editableThemes) {
            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
        });
        */

        //-----------------------------------
        //  AppController를 파일로 분리시킴
        //-----------------------------------

        //app.controller('AppController', AppController);

        //-----------------------------------
        //  BODY 보이기 - App 초기화 완료 시점
        //-----------------------------------
        /*
        $('body').css({
            opacity: 1,
            transition:'opacity 1s'
        });
*/


application.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});



application.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/Book/:bookId', {
            templateUrl: 'templates/application.html',
            //controller: 'BookController',
            resolve: {
                // I will cause a 1 second delay
                delay: function($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(delay.resolve, 1000);
                    return delay.promise;
                }
            }
        })
        .when('/Book/:bookId/ch/:chapterId', {
            templateUrl: 'templates/menu.html',
            //controller: 'ChapterController'
        });

    //-----------------------------------
    // DEFAULT
    //-----------------------------------

    // 기본 경로 설정
    $routeProvider.otherwise({redirectTo:'/'});

    // configure html5 to get links working on jsfiddle
    // $locationProvider.html5Mode(true);
});



/*




.controller('BookController', function($scope, $routeParams) {
    $scope.name = "BookController";
    $scope.params = $routeParams;
})

.controller('ChapterController', function($scope, $routeParams) {
    $scope.name = "ChapterController";
    $scope.params = $routeParams;
})






*/





        ////////////////////////////////////////
        // END
        ////////////////////////////////////////

        return application;
    }
);