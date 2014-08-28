'use strict';

//requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define([
        'angular', //앵귤러 모듈을 사용하기 위해 임포트
        'RouteConfig', //registers에 각 프로바이더를 제공하기 위해 임포트 (RouteConfig.js)
        _PATH.CONTROLLER + 'AppController'
    ],
    
    //디펜던시 로드뒤 콜백함수
    function (angular, RouteConfig, AppController) {
        
        //-----------------------------------
        // App 모듈 선언 : angular.module(name, [requires], [configFn]);
        //-----------------------------------
        
        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var application = angular.module('App', [], function ($provide, $compileProvider, $controllerProvider, $filterProvider, $routeProvider, $locationProvider) {
            
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
                //application.$animateProvider          = $animateProvider;

                application.$routeProvider              = $routeProvider;
                application.$locationProvider          = $locationProvider;
                
                console.log('application.config');

            var route = new RouteConfig(application);

            /*
            //부트스트랩 과정에서만 가져올 수 있는 프로바이더들을 각 registers와 연계될 수 있도록
            route.setProvide($provide); //for services
            route.setCompileProvider($compileProvider);  //for directives
            route.setControllerProvider($controllerProvider); //for controllers
            route.setFilterProvider($filterProvider); //for filters
            */
            route.config();

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
        
        application.controller('AppController', AppController);
        
        //-----------------------------------
        //  BODY 보이기 - App 초기화 완료 시점
        //-----------------------------------
        
        $('body').css({
            opacity: 1,
            transition:'opacity 1s'
        });

        return application; 
    }
);
