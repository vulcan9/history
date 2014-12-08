/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U'
    ],
    function(U) {

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
                    selectInfo: '@selectInfo',
                    // boundary: '@boundary',
                    rendered: '@rendered', //DOM 렌더링이 완료됬는지 여부
                    getBoundary: '&getBoundary' // boundary 가죠오는 메서드
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
                // $scope.version = VersionService;
                // $element.trigger('#view.layoutUpdate');



                /*
                $scope.$evalAsync( function(){
                    // $element.trigger('#view.layoutUpdate');
                } );
                */
                out('---------------------------------------------->', $scope.selectInfo);

                var self = this;
                var _infoChanged = false;
                var _rendered = false;
                
                
                // boundary
                $scope.$watch('selectInfo',  function (newValue, oldValue){
                    $scope.info = $scope.$eval(newValue);
                }, true);
                
                $scope.$watch('info', function (newValue, oldValue){
                    _infoChanged = true;
                    if(_infoChanged && _rendered){
                        _infoChanged = false;
                        self.__updateBoundary();
                    }
                });

                $scope.$watch('rendered',  function (newValue, oldValue){
                    
                    _rendered = $scope.$eval(newValue);
                    out('change rendered : ', _rendered);

                    if(_infoChanged && _rendered){
                        _infoChanged = false;
                        self.__updateBoundary();
                    }
                });

                /*
                <div ng-class="{ 'wire': true, 'ui-draggable': draggable, 'ui-resizable': resizable, 'ui-rotatable': rotatable, 'ui-selected': selected }" 
                    ng-attr-style="top: {{result.y}}px; left: {{result.x}}px; width: {{result.width}}px; height: {{result.height}}px; 
                    background-color:rgba(255,255,0,0.5);">
                */
                this.__updateBoundary = function (){

                    out('* change selectUID : ', $scope.info);
                    var info = $scope.info;
                    var selectUID = info.uid;

                    // 해당 문서의 Element DOM 찾기
                    var content = $scope.$parent.item.content;
                    var $content = angular.element(content);
                    var $select = (selectUID) ? $content.find('[uid=' + selectUID + ']') : null;

                    // var $parent = $element.parent();
                    // var $contentContainer = $parent.find('#contentContainer');
                    // var $select = (selectUID) ? $contentContainer.find('[uid=' + selectUID + ']') : null;
                    // out('$contentContainer : ', $contentContainer);

                    // out('$select : ', $scope.rendered, $select);
                    if($select == null){
                        $scope.selected = false;
                        $scope.result = null;
                        return;
                    }

                    // // 편집 UI를 구성한다.
                    var boundary = {
                        x: U.toNumber($select.css('left')),
                        y: U.toNumber($select.css('top')),
                        
                        width: $select.outerWidth(),
                        height: $select.outerHeight()
                    };
                    // boundary = $scope.getBoundary({uid:selectUID});

                    // scale 적용
                    var scale = info.scale;
                    var result = {
                        elementUID: selectUID,
                        scale: scale,

                        width: Math.ceil(boundary.width * scale),
                        height: Math.ceil(boundary.height * scale),
                        x: Math.ceil(boundary.x * scale),
                        y: Math.ceil(boundary.y * scale)
                        // width: boundary.width * scale,
                        // height: boundary.height * scale,
                        // x: boundary.x * scale,
                        // y: boundary.y * scale
                    }

                    $scope.result = result;
                    $scope.selected = true;

                    $scope.draggable = true;
                    $scope.resizable = true;
                    $scope.rotatable = true;
                }

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
                out('boundary : ', $scope.boundary);

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end uiCanvas directive
         }

         // end module
    }
);
