'use strict';

define([
        'angular',
        _PATH.CONTROLLER + 'ApplicationController',
        _PATH.JS + 'Router'
    ],
    function(angular, ApplicationController, Router) {

        //-----------------------------------
        // Application 모듈 선언 : angular.module(name, [requires], [configFn]);
        //-----------------------------------

        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var application = angular.module(
            // Name
            'Application', 
            // Require
            ['ngRoute'], 
            // Configuration Function
            function($provide, $compileProvider, $controllerProvider, $filterProvider) {
                

                /* Service*/
                $provide.factory('register', function() {

                        return _service;

                        function _service(directive) {
                            console.log('directive : ', directive);
                            $compileProvider.directive.apply(null, directive);
                        };

                });
                




            }
        );

        application.config(
            function($provide, $compileProvider, $controllerProvider, $filterProvider, $routeProvider, $locationProvider) {

                // Route 설정
                Router($provide, $compileProvider, $controllerProvider, $filterProvider, $routeProvider, $locationProvider);

                // 보이기
                showApplication();
            }
        );

        //-----------------------------------
        //  BODY 보이기 - App 초기화 완료 시점
        //-----------------------------------
        
        function showApplication(){
            angular.element('body').css({
                opacity: 1,
                transition:'opacity 1s'
            });
        }

        /*
        // http://vitalets.github.io/angular-xeditable/#bootstrap3
        app.run(function(editableOptions, editableThemes) {
            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
        });
        */

        ////////////////////////////////////////
        //  Service를 만든다.
        ////////////////////////////////////////


        // 



        //$compileProvider.directive.apply(null, directive);
        









        ////////////////////////////////////////
        //  Controller
        ////////////////////////////////////////

        application.controller('ApplicationController', ApplicationController);

/*
application.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

application.controller('BookController', function($scope, $routeParams) {
    $scope.name = "BookController";
    $scope.params = $routeParams;
})

application.controller('ChapterController', function($scope, $routeParams) {
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