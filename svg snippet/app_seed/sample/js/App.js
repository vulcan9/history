'use strict';

//requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define([
        'angular', //앵귤러 모듈을 사용하기 위해 임포트
        'RouteConfig', //registers에 각 프로바이더를 제공하기 위해 임포트 (RouteConfig.js)
        _PATH.CONTROLLER + 'AppController'
    ],
    
    //디펜던시 로드뒤 콜백함수
    function (angular, RouteConfig, AppController) {

        console.log("# Version 0.0.0");


        //모듈 선언 : angular.module(name, [requires], [configFn]);
        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var app = angular.module('App', [], function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
        
            //부트스트랩 과정에서만 가져올 수 있는 프로바이더들을 각 registers와 연계될 수 있도록
            RouteConfig.setProvide($provide); //for services
            RouteConfig.setCompileProvider($compileProvider);  //for directives
            RouteConfig.setControllerProvider($controllerProvider); //for controllers
            RouteConfig.setFilterProvider($filterProvider); //for filters

        });
        
    
        /*
        //공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
        app.controller('AppController', function($scope) {
        
            //스타일시트 업데이트
             $scope.$on('updateCSS', function(event, args) {
             
                //파라메터로 받아온 스타일 시트 반영
                $scope.stylesheets = args;
            });  
        }); 
        */
        
        //  CommonController를 파일로 분리시킴
        app.controller('AppController', AppController);

        return app; 
    }
);