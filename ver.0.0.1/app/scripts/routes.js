define(
    [],
    function() {

        function Router( application ) {
            this.application = application;
        }

        Router.prototype = {

            config: function() {
                var application = this.application;
                var route = this._routes();
                var $routeProvider = application.$routeProvider;
                
                this._when(route, $routeProvider);

                /*
                var routes = this.routes;
                if ( routes !== undefined ) 
                {
                    angular.forEach( routes, function( route, path ) {
                        $routeProvider.when( path, {
                            templateUrl: route.templateUrl,
                            resolve: dependencyResolverFor( route.dependencies )
                        } );
                    } );
                }

                if ( config.defaultRoutePaths !== undefined ) {
                    $routeProvider.otherwise( {
                        redirectTo: config.defaultRoutePaths
                    } );
                }
                */
            },


            _when: function( routes, $routeProvider ) {

                var self = this;
                var application = this.application;
                var $routeProvider = application.$routeProvider;

                if ( routes !== undefined )
                {
                    angular.forEach( routes.paths, function( route, path ) {
                        
                        var templateUrl = route.templateUrl;
                        var resolver = self._dependencyResolver( templateUrl, route.dependencies );
                        //var resolver = dependencyResolverFor( route.dependencies )
                        //out('templateUrl : ', templateUrl);

                        $routeProvider.when( 
                            path, 
                            {
                                templateUrl: route.templateUrl,
                                resolve: resolver
                            }
                        );
                    } );
                }

                if ( routes.defaultPath !== undefined )
                {
                    $routeProvider.otherwise( {
                        redirectTo: routes.defaultPath
                    } );
                }
            },



            _dependencyResolver : function (templateUrl, dependencies){
                
                //if (templateUrl) dependencies.unshift('text!' + templateUrl);

                var definition = {
                    resolver: [ '$q', '$rootScope',
                        function( $q, $rootScope ) {
                            var deferred = $q.defer();

                            require( dependencies, function() {
                                out( 'LOAD : ', dependencies );
                                $rootScope.$apply( function() {
                                    deferred.resolve();
                                } );
                            } );

                            return deferred.promise;
                        }
                    ]
                }

                return definition;
            },

            _routes : function () {

                var paths = {
                    '/': {
                        templateUrl: 'views/home.html',
                        dependencies: [
                            'scripts/controllers/HomeViewController'
                        ]
                    },
                    '/about/:person': {
                        templateUrl: 'views/about.html',
                        dependencies: [
                            'scripts/controllers/AboutViewController',

                        ]
                    },
                    '/contact': {
                        templateUrl: 'views/contact.html',
                        dependencies: [
                            'scripts/controllers/ContactViewController',
                            'scripts/directives/app-color'
                        ]
                    }
                };

                var route = {
                    defaultPath : '/',
                    paths : paths
                };
                return route;
            }


        };

        return Router;


        /*
        return {
            defaultRoutePath: '/',
            routes: {
                '/': {
                    templateUrl: 'views/home.html',
                    dependencies: [
                        'scripts/controllers/HomeViewController'
                    ]
                },
                '/about/:person': {
                    templateUrl: 'views/about.html',
                    dependencies: [
                        'scripts/controllers/AboutViewController',

                    ]
                },
                '/contact': {
                    templateUrl: 'views/contact.html',
                    dependencies: [
                        'scripts/controllers/ContactViewController',
                        'scripts/directives/app-color'
                    ]
                }
            }
        };
        */

    } );