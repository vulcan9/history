/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전을 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'background', _directive );

        // 선언
        function _directive() {

            //out( 'background' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{background}} </span>',
                templateUrl: _PATH.TEMPLATE + 'ui/background.html',
                
                replace: true,
                transclude: true,
                scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {
                $scope.ratio = 1;
                $scope.stroke = 1;



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

                // $timeout (function() {
                //     $element.trigger('#view.layoutUpdate');
                // }, 100);

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);