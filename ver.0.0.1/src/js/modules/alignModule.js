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

        // 모듈에 정의
        var _module = angular.module('alignModule', []);

        // 등록
        _module.directive( 'resizeEvent', resizeEvent );
        _module.directive( 'alignCenter', alignCenter );

        /*
        _module.directive( 'left', left );
        _module.directive( 'right', right );
        _module.directive( 'top', top );
        _module.directive( 'bottom', bottom );
        */

        // 리턴
        return _module;

        // resizeEvent = "이벤트 trigger delay time (millisecond)"
        function resizeEvent(){

            return {
                restrict: 'A',

                controller: function( $scope, $element, $attrs, $timeout ) {

                    var timer;

                    $scope.$watch (
                        function () {
                            return {
                                width: $element.width(),
                                height: $element.height()
                            };
                        }, 
                        function (newValue, oldValue) {
                            out('chang : ', newValue);
                            if (newValue == oldValue) return;

                            if(timer) $timeout.cancel(timer);
                            timer = null;

                            var delay = U.toNumber($attrs.resizeEvent);
                            if(delay === undefined || isNaN(delay) || delay == 0){
                                $element.triggerHandler('#element.resizeing'); 
                                return;
                            }

                            timer = $timeout(function(){
                                $element.triggerHandler('#element.resizeing'); 
                            }, delay);
                        }, 
                        true
                    );

                    // end controller
                }
            }
        }

        ////////////////////////////////////////
        // 레이아웃
        ////////////////////////////////////////
        
        /*
        // sizeObject를 사용한 예 : 
        // paper_horizontalPosition, paper_verticalPosition 이 scope.$parent에서 변수명으로 사용된다.
        // 같은 부모 scape으로부터 변수명이 중첨되어 값 변경 내용이 서로 간섭받는 현상을 방지하기 위해 변수명을 직접 지정하도록 했다

        //---------------------------
        // 설정 : align-center=
        //---------------------------

        // alignCenter 값 : 

        // alignInfo 값 : 
        alignInfo 의 값은 최종 결과값을 기술한다. 연산에 필요한 element : margin, parent : padding값이 포함된 값이다.

        var alignInfo_loading={
            
            // 가로/세로 적용 및 데이터 저장  변수명 지정 (default=both)
            // type: 'both', // horizontal | vertical | both | undefined (=both)

            // 초기 visible 설정 지연 millisecond (default=0)
            // 초기 visibleDelayTime 이후 visible로 전환되는 시점에 변경
            visibleDelayTime:500,

             // 아래 설정값은 생략 가능 
             // 생략시 현재 dom 상태 기준으로 자동 계산 되어짐
             // 따라서 transition이 적용되고 있다면 아래값들을 설정하여  최종 결과값을 알려주어야함

            parentWidth: scale.width - paddingW, // padding을 뺀값으로 설정
            parentHeight: scale.height - paddingH

            // width: scale.width + marginW, // margi을 더한값으로 설정
            // height: scale.height + marginH
        };

        var paddingW = (U.toNumber(parent.css('padding-left')) || 0) + (U.toNumber(parent.css('padding-right')) || 0);
        var paddingH = (U.toNumber(parent.css('padding-top')) || 0) + (U.toNumber(parent.css('padding-bottom')) || 0);
        var marginW = (U.toNumber($element.css('margin-left')) || 0)  + (U.toNumber($element.css('margin-right')) || 0);
        var marginH = (U.toNumber($element.css('margin-top')) || 0) + (U.toNumber($element.css('margin-bottom')) || 0);

        //---------------------------
        // 위치 연산 결과값 : align-result=
        //---------------------------

        alignLoading = {
            visible: true| false, //(default=true)
            vertical: 결과값(=0),
            horizontal: 결과값(=0)
        };

        //---------------------------
        // visibleDelay 를 사용한 예
        //---------------------------
        
            <div class="loading"

                align-center="{{alignInfo_loading}}" align-result="alignLoading"

                ng-class="{transition: alignLoading.visible};"
                
                ng-attr-style="left: {{alignLoading.horizontal}}px; top: {{alignLoading.vertical}}px; 
                    visibility: {{alignLoading.visible?'visible':'hidden'}};"

                ng-hide="loadComplete == false">
                    로딩중
            </div>
        */

        function alignCenter($timeout) {

            return {
                restrict: 'A',
                scope: {
                    setting:'@alignCenter',
                    result: '=alignResult'
                },
                
                
                link: function( $scope, $element, $attrs ) {
                    
                    var defaultInfo={
                        type: 'both',
                        visibleDelayTime: 0
                    };

                    var _timeoutPromise;
                    var _visibleDelayChecked = false;

                    // 위치 계산 결과값을 저장
                    $scope.result = {
                        visible: true
                    };

                    // setting 값 변동 감시
                    $scope.$watch(function(){
                            var option = $scope.$eval($scope.setting);
                            return angular.extend(defaultInfo, option);
                        },
                        function (newValue, oldValue) {
                        
                        // 변경된 설정값 적용
                        $scope.option = newValue;
                        // out('option : ', $scope.option);
                        // out('result : ', $scope.result);
                        
                        if(!_visibleDelayChecked && $scope.option){
                            checkDelayTime();
                        }
                        
                        // 연산
                        _setPosition($scope, $element, $attrs);

                    }, true);
                    
                    //-----------
                    // 초기에 보여질 시간 지연 체크
                    
                    function checkDelayTime(){

                        var option = $scope.option;
                        var result = $scope.result;

                        var delayTime = option.visibleDelayTime || 0;
                        if(delayTime == 0){
                            result.visible = true;
                            return;
                        }

                        // $scope.$parent[delayPropName] = 'hidden';
                        result.visible = false;
                        _timeoutPromise = $timeout(function(){
                            // $scope.$parent[delayPropName] = 'visible';
                            result.visible = true;
                            _timeoutPromise = null;
                            _visibleDelayChecked = true;
                        }, delayTime);

                    }
                    
                    //-----------
                    // 제거

                    $scope.$on("$destroy", function () {
                        if(_timeoutPromise) $timeout.cancel(_timeoutPromise);
                    });

                    // end link
                },

                /*
                controller: function(scope){
                    // end controller
                }
                */
            };

            function _setPosition($scope, $element, $attrs){
                    var option = $scope.option;

                    if(option.type == 'vertical'){
                        _verticalCenter($scope, $element, $attrs);

                    }else if(option.type == 'horizontal'){
                        _horizontalCenter($scope, $element, $attrs);

                    }else{
                        _verticalCenter($scope, $element, $attrs);
                        _horizontalCenter($scope, $element, $attrs);
                    }
            }

            //-----------------------------------
            //  가로 정렬 - position: absolute 인 경우 권장
            //-----------------------------------

            function _setPositionCSS(el){
                    var position = el.css('position');
                    if(position == 'static'){
                        position = 'relative';
                        el.css('position', position);
                    }
                    return position;
            }
            
            function _horizontalCenter(scope, el, attrs){
                
                render();
                // var renderFunc = render;
                // window.requestAnimationFrame(renderFunc);

                function render(){
                    var W = 0;
                    var position = _setPositionCSS(el);
                    var option = scope.option;

                    if(position == 'fixed'){
                        W = angular.element(document).width();
                    }else{
                        var parent = el.parent();
                        var padding = (U.toNumber(parent.css('padding-left')) || 0) + (U.toNumber(parent.css('padding-right')) || 0);
                        W = option.parentWidth || parent.width() - padding;
                    }

                    var margin = (U.toNumber(el.css('margin-left')) || 0)  + (U.toNumber(el.css('margin-right')) || 0);
                    var targetW = option.width || el.outerWidth() + margin;
                    var offset = option.offsetW || 0;

                    var pos = (W-targetW)/2 + offset;
                    pos = Math.max(pos, 0);
                    
                    var oldValue = scope.result.horizontal;
                    if(oldValue === pos) return;

                    scope.$evalAsync( function(){
                        // out('_horizontalCenter : ', pos, W, targetW);
                        // 적용
                        // var propName_horizontal = option.horizontal;
                        // scope.$parent[propName_horizontal] = pos;
                        // scope.$parent.horizontalPosition = pos;
                        // scope.option.horizontalPosition = pos;
                        // out('------------>propName_horizontal : ', scope.$parent[propName_horizontal], pos);
                        scope.result.horizontal = pos;
                    } );
                }

            }

            //-----------------------------------
            // 세로 정렬 - position: absolute 인 경우 권장
            //-----------------------------------
            
            function _verticalCenter(scope, el, attrs){
                
                render();
                // var renderFunc = render;
                // window.requestAnimationFrame(renderFunc);

                function render(){
                    var H = 0;
                    var position = _setPositionCSS(el);
                    var option = scope.option;

                    if(position == 'fixed'){
                        H = angular.element(document).height();
                    }else{
                       var parent = el.parent();
                        var padding = (U.toNumber(parent.css('padding-top')) || 0) + (U.toNumber(parent.css('padding-bottom')) || 0);
                        H = option.parentHeight || parent.height() - padding;
                    }

                    var margin = (U.toNumber(el.css('margin-top')) || 0)  + (U.toNumber(el.css('margin-bottom')) || 0);
                    var targetH = option.height || el.outerHeight() + margin;
                    var offset = option.offsetH || 0;

                    var pos = (H-targetH)/2 + offset;
                    pos = Math.max(pos, 0);
                    
                    var oldValue = scope.result.vertical;
                    if(oldValue === pos) return;

                    scope.$evalAsync( function(){
                        // out('_verticalCenter : ', pos, H, targetH);
                        // 적용
                        // var propName_vertical = option.vertical;
                        // scope.$parent[propName_vertical] = pos;
                        // scope.$parent.verticalPosition = pos;
                        // scope.option.verticalPosition = pos;
                        // out('------------>propName_vertical : ', scope.$parent[propName_vertical], pos);
                        scope.result.vertical = pos;
                    } );
                }
            }


            // END
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
