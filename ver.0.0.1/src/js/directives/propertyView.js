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
        application.directive( 'propertyView', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',
                
                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/propertyView.html',
                replace: true,
                scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller ( $scope, $element, $attrs) {
                
                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////


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

                // $element.trigger('#view.layoutUpdate');

                // 너비 초기 설정값
                __pannelToggle(250);
                // $scope.$evalAsync( __pannelToggle );
                // $timeout(__pannelToggle, 500);

                // pannel 열기/닫기
                $scope.pannelToggle = function(scope) {
                    __pannelToggle();
                };

                function __pannelToggle(w){
                    var $dock = $element.parent('.dock');
                    if(w === undefined){
                        w = $dock.outerWidth();
                        w = (w>300) ? 250:400;
                    }
                    
                    $dock.css({
                        'min-width': w + 'px',
                        'width': w + 'px'
                    });
                    
                    $element.trigger('#view.layoutUpdate', {
                        targetCSS:{
                            width : w
                        }
                    });
                }
                
                ////////////////////////////////////////
                // End Link
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
