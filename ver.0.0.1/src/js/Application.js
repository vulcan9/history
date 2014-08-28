'use strict';

define([
        'angular',
        'Router',
        _PATH.CONTROLLER + 'ApplicationController'
    ],
    function(angular, Router, ApplicationController) {

        //-----------------------------------
        // Application 모듈 선언 : angular.module(name, [requires], [configFn]);
        //-----------------------------------
        
        var _router;

        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var application = angular.module(

            // Name, Require
            'Application', ['ngRoute'], 
            
            // Configuration Function
            function($provide, $compileProvider, $controllerProvider, $filterProvider, $animateProvider, $routeProvider, $locationProvider) {
                

                /* Service
                $provide.factory('register', function() {

                        return _service;

                        function _service(directive) {
                            console.log('directive : ', directive);
                            $compileProvider.directive.apply(null, directive);
                        };

                });
                */




            }
        );

        /* 등록 메서드는 각기 다르다.
        $provide.service()
        $provide.factory()
        $provide.value()
        $provide.constant()

        $controllerProvider.resgister()
        $animateProvider.register()
        $filterProvider.service()
        $compileProvider.service()
        */
        application.config(
            function($provide, $compileProvider, $controllerProvider, $filterProvider, $animateProvider, $routeProvider, $locationProvider) {

                // 등록 메서드 노출
                application.$provide = {
                    service :       $provide.service,
                    factory :        $provide.factory,
                    value :          $provide.value,
                    constant :     $provide.constant,
                };

                application.$compileProvider          = $compileProvider;
                application.$controllerProvider        = $controllerProvider;
                application.$filterProvider               = $filterProvider;
                application.$animateProvider          = $animateProvider;

                application.$routeProvider              = $routeProvider;
                application.$locationProvider          = $locationProvider;
                
                out('application.config');

                // Route 설정
                _router = new Router(application);
                _router.config();
            }
        );

        application.run(function($rootScope, $location) {
            
                application.$rootScope        = $rootScope;
                application.$location           = $location;

                // Route 실행
                _router.run();

                // 보이기
                showApplication();
                out('application.run');
        });
        

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