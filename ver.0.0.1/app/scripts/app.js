define( [
        'scripts/routes.js'
    ],
    function( Router, dependencyResolverFor ) {
        var _router;
        var application = angular.module( 'application', [ 'ngRoute' ] );

        application.config(
             function($provide, $compileProvider, $controllerProvider, $filterProvider, $animateProvider, $routeProvider, $locationProvider) {

                    // 자주쓰는 등록 메서드
                    application.controller        = $controllerProvider.register;
                    application.directive         = $compileProvider.directive;
                    application.filter               = $filterProvider.register;
                    application.factory            = $provide.factory;
                    application.service           = $provide.service;

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



                    $locationProvider.html5Mode( false );
                    
                    // Route 설정
                    _router = new Router(application);
                    _router.config();

                }
        );

        return application;
    } );