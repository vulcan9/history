/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'menu', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            var config = {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'menu.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: false,

                terminal: false,
                
                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: function( $scope, $element, $attrs, $transclude, $rootScope, $route, $routeParams, $location ) {

                    $scope.items = [
                        {label: 'Home', link:'http://localhost/history/ver.0.0.1/src', command:''},
                        {label: 'File', link:'', command:'file'},
                        {label: 'Edit', link:'', command:'edit'},
                        {label: 'View', link:'', command:'view'},

                        // url 이동 테스트
                        {label: 'admin url 테스트', link:'#admin', command:''}
                    ];

                    
                    //out('$location : ', $location);
                    //out('$scope : ', $scope);
                    
                    
                    $scope.onClick = function(item){
                        console.log(" * item : ", item);
                        
                        //console.log(" * $route : ", $route);
                        //console.log(" * routeParams : ", $routeParams);
                        //console.log(" * location : ", $location);

                        var link = item.link;
                        if(link){
                            //out('* link : ', link);
                            $location.path(link);
                            return;
                        }

                        var common = item.command;
                        var url = '/tool/user?command=' + common;
                        out('이동 : ', url);
                        $location.path(url);
                    };
                    /*
                    $rootScope.$on('$routeChangeStart', function(){
                        //out('routeChangeStart : ', arguments);
                    });

                    $rootScope.$on('$routeChangeSuccess', function(e, newRoute, oldRoute){
                        out('routeChangeSuccess : ', newRoute);
                        out('$route : ', $route);
                        out('$routeParams : ', $routeParams);

                        if ( $location.path() == element.attr( 'href' ) ) {
                            element.addClass( 'active' );
                        }
                        else {
                            element.removeClass( 'active' );
                        }
                    });

                    $rootScope.$on('$routeChangeError', function(){
                        out('routeChangeError : ', arguments);
                    });

                    $rootScope.$on('$routeUpdate', function(){
                        //out('routeUpdate : ', arguments);
                    });
                    */
                    
                }

                // end config
            };

            return config;
        }














        // 등록
        application.directive( 'link', _directive_link );

        // 선언
        function _directive_link() {

            //out( 'version' );

            var config = {

                restrict: 'A',
                template: '<a class="btn" ng-class="{active: on}" ng-click="toggle()">Toggle me!</a>',
                
                replace: true,
                transclude: true,
                scope: true,

                link: function ( scope, element, attrs ) {
                    
                    scope.on = false;
                    scope.toggle = function () {
                        scope.on = !$scope.on;
                    };
                    
                   out('link : ', element);
                },
                
                /*
                controller: function( $scope, $element, $attrs, $transclude, $rootScope, $route, $routeParams, $location ) {

                    $scope.items = [
                        {label: 'Home', link:'http://localhost/history/ver.0.0.1/src', command:''},
                        {label: 'File', link:'', command:'file'},
                        {label: 'Edit', link:'', command:'edit'},
                        {label: 'View', link:'', command:'view'},

                        // url 이동 테스트
                        {label: 'admin url 테스트', link:'#admin', command:''}
                    ];
                }
                */

                // end config
            };

            return config;
        }
















        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
