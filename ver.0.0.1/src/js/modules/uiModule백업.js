/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 정렬 관련된 유틸함수들

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U'
    ],
    function(U) {

        // ui 관련 데이터
        var _data;

        // 모듈에 정의
        var _module = angular.module('uiModule', ['ngCollection']);
        _module.factory('$uiControl', _uiControl);

        // 등록
        _module.directive( 'uid', uid );
        _module.directive( 'uiCanvas', uiCanvas );
        _module.directive( 'uiController', uiController );

        _module.directive( 'uiSelected', uiSelected );
        _module.directive( 'uiDraggable', uiDraggable );
        _module.directive( 'uiResizable', uiResizable );
        _module.directive( 'uiRotatable', uiResizable );
  
        // 리턴
        return _module;

        ////////////////////////////////////////
        // UI 컨트롤 데이터
        ////////////////////////////////////////

        function _uiControl($window){

            function uiControl(){

            }

            return uiControl;
        }

        ////////////////////////////////////////
        // UI 컨트롤을 위한 기능 구현
        ////////////////////////////////////////

         function uiCanvas($window, $document) {
            return {
                restrict: 'EA',
                scope: false,

                
                link: function( scope, el, attrs, controller, transclude ) {

                },
                
                controller: function ($scope, $element, $attrs, $collection){
                    
                    // 초기화 체크
                    if(!$scope.TOOL.ui) _initialize($scope, $collection);

                    // 페이지가 변경됨
                    $scope.$watch('TOOL.ui.currentPaper', function (newValue, oldValue) {
                        
                        out('old paper : ', oldValue);
                        out('new paper : ', newValue);
                        out('currentPaper : ', $scope.TOOL.ui.currentPaper);
                        out('TODO : // 이전 paper의 ui-controller를 초기화 한다.');
                        //_updateUI();

                        // 초기화 시킨다.
                        _data.selectedItems._reset();

                    });
                    
                }
               
            };
         }

        // 사용 : 
        // <div class="wire ui-draggable ui-resizable ui-selected" style="top: 140px; left: 40px; width: 240px; height: 160px;">

        function _initialize($scope, $collection){

            //var $collection = $injector.get('$collection');
            var items = $collection.getInstance();

            _data = {
               currentPaper: null,
               selectedItems: items
            };

            $scope.TOOL.ui = _data;

            //--------------------------
            // paper 마다 uiController가 생성되므로 현재 작업중인 uiController를 지정해 주어야 함

            alert('현재 인스턴스마다 호출됨');
            setTimeout(function(){
                    
                    var $element = angular.element('.paper')[0];
                    out('TODO : // currentPaper 값이 변경되는 지점을 편집 모드로 전환하는 곳으로 옮긴다.');
                    out('$element',$element);
                    _data.currentPaper = $element;
                    $scope.$apply();


                    setTimeout(function(){
                    
                            var $element = angular.element('.paper')[1];
                            out('TODO : // currentPaper 값이 변경되는 지점을 편집 모드로 전환하는 곳으로 옮긴다.');
                            out('$element',$element);
                            _data.currentPaper = $element;
                            $scope.$apply();

                    }, 1000);

            }, 1000);

            //--------------------------
        }

        ////////////////////////////////////////
        // UI 컨트롤 기능이 필요한 객체의 기능 구현 (target)
        ////////////////////////////////////////

        // UID 가 설정된 태그에 ui-selected 기능을 변경할 수 있도록 한다.
        function uid($window, $document, $collection) {

            return {

                restrict: 'A',
                
                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    
                    // uid 체크
                    if(!$attrs.uid){ return;}

                    $element.on('click', function(){
                        _selectToggle($scope, $element, $attrs);
                        $scope.$apply();
                    });

                }

                // end definition
            };
        }

        // 선택 상태(토글) 기록
        function _selectToggle($scope, $element, $attrs){

            var uid = $attrs.uid;

            var selectedData = _data.selectedItems.get(uid);
            if(selectedData){
                _data.selectedItems.remove(selectedData);
                // attribute에서 제거
                // $attrs.$set('ui-selected', null);
            }else{
                
                // BUG : 2014.09.25
                // $element를 데이터에 넣을 수 없다. $watch 실행중 오류가 발생한다.
                // 이때는 $watchCollection을 사용한다.
                
                _data.selectedItems.add({id:uid, element:$element});
                // attribute에서 추가
                // $attrs.$set('ui-selected', "");
            }

            out('get : ', uid, $scope.TOOL.ui.selectedItems.get(uid));
        }
        
        // 아래 선택표시 객체와 기능이 적용될 대상 객체는 같은 좌표 영역에 존재해야 합니다.
        // position : absolute
        
        /*

            <div class="content">

                <!-- 선택 상태로 표시될 객체 샘플 -->
                <div style="position: absolute;
                top: 140px; left: 40px; width: 240px; height: 160px;
                border: 1px solid rgb(68, 68, 68);
                background-color: rgba(150, 250, 0, 0.2);
                transform:rotateX(0deg) rotateY(0deg) rotateZ(-45deg)"
                uid='uid001'></div>
                
            </div>

            <!--선택 표시 핸들러 컨테이너-->
            <div class="content" ui-controller>

                <!--선택 표시 템플릿-->
                <div class="wire ui-draggable ui-resizable ui-rotatable ui-selected" 
                style="top: 140px; left: 40px; width: 240px; height: 160px;">

                    <div class="ui-resizable-handle ui-resizable-n"></div>
                    <div class="ui-resizable-handle ui-resizable-e"></div>
                    <div class="ui-resizable-handle ui-resizable-s"></div>
                    <div class="ui-resizable-handle ui-resizable-w"></div>
                    <div class="ui-resizable-handle ui-resizable-se"></div>
                    <div class="ui-resizable-handle ui-resizable-sw"></div>
                    <div class="ui-resizable-handle ui-resizable-ne"></div>
                    <div class="ui-resizable-handle ui-resizable-nw"></div>

                    <div class="ui-rotate-handle"></div>
                </div>
            
            </div>
        */
         
         function uiController() {
            return {
                restrict: 'EA',
                scope: false,
                templateUrl: _PATH.TEMPLATE + 'uiController.html',
                replace: false,

                link: function( scope, el, attrs, controller, transclude ) {
                    
                    // 선택 상태가 변경됨
                    scope.$watchCollection('TOOL.ui.selectedItems', function (newValue, oldValue) {
                        _updateUI();
                    }, true);

                },

                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    
                }

            };
         }

        // 선택상자 갱신
        function _updateUI(){
            out('_updateUI');
            _updateSelectedBoundary();
            _updateEvent();
        }

        // 선택 영역의 크기를 계산한다.
        function _updateSelectedBoundary(){
            
            var el = _data.currentPaper;
            if(!el || el.length < 1) return;

            if(_data.selectedItems.length <1){
                // 선택된 객체 없음
                el.find('.wire').removeClass('ui-selected');
                return;
            }

            if(_data.selectedItems.length == 1){
                // 단일 객체 선택
                el.find('.wire').addClass('ui-resizable');
                el.find('.wire').addClass('ui-rotatable');
                el.find('.wire').addClass('ui-selected');
                return;
            }

            // 다중 선택
            el.find('.wire').removeClass('ui-resizable');
            el.find('.wire').removeClass('ui-rotatable');
            el.find('.wire').addClass('ui-selected');
        }

        // 선택상자 갱신
        function _updateEvent(){
            out('_updateEvent');
        }

        //-----------------------------------
        // 선택 상태
        //-----------------------------------
        
        function uiSelected() {

            return {
                restrict: 'CA',
                scope: false,

                /*
                link: function( scope, el, attrs, controller, transclude ) {
                    //
                },
                */
                
                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    //
                }

            };

        }
        
        //-----------------------------------
        // 드래그 기능
        //-----------------------------------
        
        function uiDraggable() {

            return {
                restrict: 'C',
                scope: false,

                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    out('uiDraggable : ', $scope);
                }

            };

        }

        //-----------------------------------
        // 리사이징 기능
        //-----------------------------------
        
        function uiResizable() {

            return {
                restrict: 'C',
                scope: false,

                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    out('uiResizable : ', $scope);
                }

            };

        }

        //-----------------------------------
        // 회전 기능
        //-----------------------------------
        
        function uiRotatable() {

            return {
                restrict: 'C',
                scope: false,

                controller: function ($scope, $element, $attrs, $transclude, $rootScope){
                    out('uiRotatable : ', $scope);
                }

            };

        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
