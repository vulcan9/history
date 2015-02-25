/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Application 모듈 정의
    *     

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'angular',
        'PreInitialize'
    ],
    function( angular, PreInitialize ) {

        /////////////////////////////////////
        // Application 모듈 선언 : angular.module(name, [requires], [configFn]);
        /////////////////////////////////////

        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데 여기서는 App이라는 앵귤러 모듈을 리턴한다.
        var application = angular.module(

            // '모듈 Name'
            'Application', 
            // ['Require 모듈']
            [ 
                'ngRoute', 'ngAnimate', 'ngMessages', 
                'dockModule', 'alignModule', 
                'ui.bootstrap', 'ui.tree', 'ui.slider', 'colorpicker.module',
                'satellizer' 
            ],
            // Configuration Function
            // function( $provide, $compileProvider, $controllerProvider, $filterProvider, $animateProvider, $routeProvider, $locationProvider ) {
            function($authProvider, $httpProvider) {

                $authProvider.google({
                    clientId: '548886548436-3u60ikf74am2qlg4l95it8su0l14noge.apps.googleusercontent.com'
                });

                $authProvider.facebook({
                    clientId: '1550481181857963'
                });
                
                /*
                $authProvider.twitter({
                    url: '/auth/twitter'
                });

                $authProvider.live({
                    clientId: '000000004C12E68D'
                });

                $authProvider.github({
                    clientId: '0ba2600b1dbdb756688b'
                });

                $authProvider.linkedin({
                    clientId: '77cw786yignpzj'
                });

                $authProvider.yahoo({
                    clientId: 'dj0yJmk9SDVkM2RhNWJSc2ZBJmQ9WVdrOWIzVlFRMWxzTXpZbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yYw--'
                });

                $authProvider.oauth2({
                    name: 'foursquare',
                    url: '/auth/foursquare',
                    clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
                    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
                    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
                });
                */
            }
        );

        /////////////////////////////////////
        // Application 상수
        /////////////////////////////////////

        // Element type 상수
        application.constant( 'ELEMENT', {

            DOCUMENT: 'document',
            TEXT: 'text',
            IMAGE: 'image'
        });

        //-------------------------------------
        // Pattern
        //-------------------------------------

        // $scope.onlyNumbers = /^[0-9]+$/;

        /////////////////////////////////////
        // Application 유틸
        /////////////////////////////////////

        /*
        // IFrame에서 parent window의 scope 찾기
        app.factory('$parentScope', function($window) {
            return $window.parent.angular.element($window.frameElement).scope();
        });
        */

        // 디렉티브의 scope 설정이 false로 설정되었다면 아래와 같이 접근 가능하다.
        // 디렉티브의 scope 설정이 scope={} 로 설정된 경우에는 scop 하위에 새로운 child scpoe에서 찾아야 한다.
        
        // 예 : 
        // var scope = $getScope('.hi-screenContainer', 'screenView');

        application.service('$getScope', function($document) {

            function getScope(selector, directiveName) {
                var $document = angular.element(document);
                var $container = $document.find(selector);
                if($container.length < 1){
                    throw 'selector에 대한 scope을 찾을  수 없습니다. (' + selector + ')';
                }

                var $element = angular.element(selector);
                var $scope = $container.scope(directiveName);
                return $scope;
            }

            return getScope;
        });
        
        // 디렉티브에 정의된 controller 찾기
        application.service('$getController', function() {
            function getController(selector, directiveName){
                var $element = angular.element(selector);
                var controller = $element.controller(directiveName);
                return controller;
            }

            return getController;
        });

        /////////////////////////////////////
        // Application 모듈 설정
        /////////////////////////////////////

        application.config (
            function( $provide, $compileProvider, $controllerProvider, $filterProvider, $animateProvider, $routeProvider, $locationProvider ) {

                out( '# Application CONFIG.' );

                //-----------------------------------
                // 자주쓰는 등록 메서드
                //-----------------------------------
                
                application.controller      = $controllerProvider.register;
                application.directive       = $compileProvider.directive;
                application.filter             = $filterProvider.register;
                application.factory          = $provide.factory;
                application.service         = $provide.service;

                /*
                application.$provide = {
                    service: $provide.service,
                    factory: $provide.factory,
                    value: $provide.value,
                    constant: $provide.constant,
                };

                application.$compileProvider = $compileProvider;
                application.$controllerProvider = $controllerProvider;
                application.$filterProvider = $filterProvider;
                */

                application.$animateProvider = $animateProvider;
                application.$routeProvider = $routeProvider;
                application.$locationProvider = $locationProvider;
                
                //-----------------------------------
                // 공통 기능 먼저 로드 후 등록
                //-----------------------------------

                PreInitialize(application);
            }
        );

        /////////////////////////////////////
        // Application 모듈 초기화
        /////////////////////////////////////

        application.run( function( $rootScope, $location, $rootElement, RouterService ) {

            application.$rootScope = $rootScope;
            application.$location = $location;

            //-----------------------------------
            // Route 설정
            //-----------------------------------

            RouterService.config(application, function(){
                out( '# Application 초기화 종료' );
            });

            // Route 실행
            RouterService.run();
            
            // 보이기
            showApplication();

            out( '# Application RUN.' );
        } );

        //-----------------------------------
        //  BODY 보이기 - App 초기화 완료 시점
        //-----------------------------------

        function showApplication() {
            angular.element( '.hi-applicationContainer' ).css( {
                // opacity: 1
                visibility: 'visible'
            } );
        }

        /*
        // http://vitalets.github.io/angular-xeditable/#bootstrap3
        app.run(function(editableOptions, editableThemes) {
            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
        });
        */

        //-----------------------------------
        //  Service를 만든다.
        //-----------------------------------

        //$compileProvider.directive.apply(null, directive);

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////

        return application;
    }
);