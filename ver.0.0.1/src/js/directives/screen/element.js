/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.directive( 'element', _directive );

        function _directive () {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{background}} </span>',

                // templateUrl: _PATH.TEMPLATE + 'ui/element.html',
                // replace: true,
                // transclude: true,
                
                // scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {
                
                // 제거
                $scope.$on("$destroy", function () {

                    // 마우스 이벤트 제거됨
                    // $element.off('mousedown', angular.bind(this, onMousedown));
                    $element.off('click', angular.bind(this, onClick));

                    // 편집 모드 더블클릭 허용
                    // $element.off('dblclick', angular.bind(this, onDoubleClick));
                });

                // element 클릭시 선택상태로 변경
                // $element.on('mousedown', angular.bind(this, onMousedown));
                $element.on('click', angular.bind(this, onClick));

                // 편집 모드 더블클릭 허용
                // $element.on('dblclick', angular.bind(this, onDoubleClick));

                /*
                function onMousedown(e){
                    $scope.$apply(function(){
                        var selectUID = $element.attr('uid');
                        $scope.selectElement(selectUID);
                    });
                }
                */
                
                function onClick(){
                    var selectUID = $element.attr('uid');
                    
                    $scope.$apply(function(){
                        $scope.selectElement(selectUID);
                    });
                    /*
                    // 편집 모드
                    $scope.$evalAsync(function(){
                        var scope = U.getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                        if(scope.editableUID == selectUID) return;
                        scope.editableUID = selectUID;
                    });
                    */
                }

                /*
                // 편집모드로 진행
                function onDoubleClick(){
                    alert('onDoubleClick - 편집모드로 진행');
                    var selectUID = $element.attr('uid');
                    
                    $scope.$apply(function(){
                        $scope.selectElement(selectUID);
                    });
                    
                    $scope.$evalAsync(function(){
                        // 편집 모드
                        var scope = U.getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                        if(scope.editableUID == selectUID) return;
                        scope.editableUID = selectUID;
                    });
                }
                */

                //--------------
                // End Controller
            }

            ////////////////////////////////////////
            // Link
            ////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

                // alert('uid : ' + $attrs.uid);


                //--------------
                // End Link
            }

            // end directive
        }

        // 리턴
        return _directive;
    }
);
