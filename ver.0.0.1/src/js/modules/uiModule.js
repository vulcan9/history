/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        
    ],
    function() {
        // 모듈에 정의
        var _module = angular.module('uiModule', ['ngCollection']);

        // _module.service('UIService', _service);

        // 등록
        // _module.directive( 'uid', uid );
        // _module.directive( 'uiCanvas', uiCanvas );
        _module.directive( 'uiControl', uiControl );

        // _module.directive( 'uiSelected', uiSelected );
        // _module.directive( 'uiDraggable', uiDraggable );
        // _module.directive( 'uiResizable', uiResizable );
        // _module.directive( 'uiRotatable', uiResizable );
  
        // 리턴
        return _module;



        

        function uiControl () {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',
                templateUrl: _PATH.TEMPLATE + 'ui/uiControl.html',
                
                replace: true,
                transclude: true,
                scope: {
                    rect:'='
                },

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

                // $element.trigger('#view.layoutUpdate');

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end uiCanvas directive
         }

         // end module
    }
);
