/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : status bar 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _directive( $timeout ) {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',
                templateUrl: _PATH.TEMPLATE + 'view/statusView.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: {},

                terminal: false,

                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: Controller,

                link: Link
                
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {
                //$scope.version = VersionService;
                // $element.trigger('#view.layoutUpdate');



                /*
                $scope.$evalAsync( function(){
                    // $element.trigger('#view.layoutUpdate');
                } );
                
                $scope.$watch(function(){
                    // $element.trigger('#view.layoutUpdate'); 
                });
                */

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

                $timeout (function() {
                    $element.trigger('#view.layoutUpdate');
                }, 100);

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function(application){
            // 등록
            application.directive( 'statusView', _directive );
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);