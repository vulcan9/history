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
        _module.directive( 'alignCenter', alignCenter );

        /*
        _module.directive( 'left', left );
        _module.directive( 'right', right );
        _module.directive( 'top', top );
        _module.directive( 'bottom', bottom );
        */

        // 리턴
        return _module;

        ////////////////////////////////////////
        // 레이아웃
        ////////////////////////////////////////
        
        function _setPositionCSS(el){
                var position = el.css('position');
                if(position == 'static'){
                    position = 'relative';
                    el.css('position', position);
                }
                return position;
        }
        
        /*
        // sizeObject를 사용한 예 : 
        // paper_horizontalPosition, paper_verticalPosition 이 scope.$parent에서 변수명으로 사용된다.
        // 같은 부모 scape으로부터 변수명이 중첨되어 값 변경 내용이 서로 간섭받는 현상을 방지하기 위해 변수명을 직접 지정하도록 했다

        <div align-center="{horizontal:'paper_horizontalPosition', vertical:'paper_verticalPosition'}" size="size"
            
            ng-class="{transition: (paper_horizontalPosition && paper_verticalPosition)}"

            style="left:{{paper_horizontalPosition}}px; top:{{paper_verticalPosition}}px;
                width:{{size.width}}px; height:{{size.height}}px;">


        // visibleDelay 를 사용한 예
        
        <div class="loading" 
            align-center="{horizontal:'loading_horizontalPosition', vertical:'loading_verticalPosition', visibleDelay: 'loading_visible', visibleDelayTime:500}"
            ng-class="{transition: (loading_horizontalPosition && loading_verticalPosition)}"
            ng-hide="loadComplete"

            style="left:{{loading_horizontalPosition}}px; top:{{loading_verticalPosition}}px; visibility:{{loading_visible}}">
                로딩중
        </div>
        */

        function alignCenter() {

            return {
                restrict: 'A',
                scope: {
                    size:'=size',
                    // verticalPosition: '=verticalPosition', // <div vertical-center="vertical" vertical-position="verticalPosition" size="size">
                    option: '=alignCenter'
                },

                controller: function( $scope, $element, $attrs, $timeout ) {

                    // out('option : ', $scope.option);
                    _setPosition($scope, $element, $attrs);
                    
                    // if($attrs.size){
                        $scope.$watch('size', function (newValue) {
                            // out('size : ', newValue);
                            _setPosition($scope, $element, $attrs);
                        }, true);
                    // }
                    
                    // 리사이징 이벤트
                    angular.element(document).on('#window.resize', resize);

                    // 제거
                    $scope.$on("$destroy", function () {
                        if(promise) $timeout.cancel(promise);

                        angular.element(document).off('#window.resize', resize);
                        
                        var option = $scope.option;
                        if(!option) return;
                        
                        delete $scope.$parent[option.vertical];
                        delete $scope.$parent[option.horizontal];
                        delete $scope.$parent[option.visibleDelay];
                    });

                    // 시간 지연
                    var option = $scope.option;
                    if(!option) return;

                    var delayPropName = option.visibleDelay;
                    var delayTime = option.visibleDelayTime || 0;
                    if(delayPropName === undefined || delayTime == 0) return;

                    $scope.$parent[delayPropName] = 'hidden';
                    var promise = $timeout(function(){
                        $scope.$parent[delayPropName] = 'visible';
                        promise = null;
                    }, delayTime);

                    function resize(){
                        _setPosition($scope, $element, $attrs);
                    }

                    // end controller
                },

                /*
                link: function(scope){
                    // end link
                }
                */
            };

            function _setPosition($scope, $element, $attrs){
                    var option = $scope.option;

                    // vertical
                    var propName_vertical = option.vertical;
                    if(propName_vertical){
                        _verticalPosition($scope, $element, $attrs);
                    }

                    // horizontal
                    var propName_horizontal = option.horizontal;
                    if(propName_horizontal){
                        _horizontalCenter($scope, $element, $attrs);
                    }
            }

            //-----------------------------------
            // 세로 정렬 - position: absolute 인 경우 권장
            //-----------------------------------
            
            function _verticalPosition(scope, el, attrs){

                render();
                // var renderFunc = render;
                // window.requestAnimationFrame(renderFunc);

                function render(){
                    var size = scope.size;

                    var H = 0;
                    var position = _setPositionCSS(el);
                    if(position == 'fixed'){
                        H = angular.element(document).height();
                    }else{
                        var parent = el.parent();
                        if(!parent || parent.length < 1) return;
                        H = (size === undefined) ? parent.height() : size.compareHeight + size.marginV;
                    }
                    
                    var marginV = (U.toNumber(el.css('padding-top')) + U.toNumber(el.css('padding-bottom')))/2;
                    var targetH = (size === undefined) ? el.height() + marginV : size.height + size.marginV;
                    var offset = 0;//U.toNumber(attrs.verticalCenter);

                    var pos = (H-targetH)/2 + offset;
                    pos = Math.max(pos, 0);

                    // 적용
                    var option = scope.option;
                    var propName_vertical = option.vertical;
                    
                    var oldValue = scope.$parent[propName_vertical];
                    if(oldValue === pos) return;

                    scope.$evalAsync( function(){
                        // out('_verticalPosition : ', pos, H, targetH);
                        // out('------------>propName_vertical : ', scope.$parent[propName_vertical], pos);
                        scope.$parent[propName_vertical] = pos;
                    } );
                }
            }

            //-----------------------------------
            //  가로 정렬 - position: absolute 인 경우 권장
            //-----------------------------------
            
            function _horizontalCenter(scope, el, attrs){
                
                render();
                // var renderFunc = render;
                // window.requestAnimationFrame(renderFunc);

                function render(){
                    var size = scope.size;

                    var W = 0;
                    var position = _setPositionCSS(el);
                    if(position == 'fixed'){
                        W = angular.element(document).width();
                    }else{
                        var parent = el.parent();
                        if(!parent || parent.length < 1) return;
                        W = (size === undefined) ? parent.width() : size.compareWidth + size.marginH;
                    }

                    var marginH = (U.toNumber(el.css('padding-left')) + U.toNumber(el.css('padding-right')))/2;
                    var targetW = (size === undefined) ? el.width() + marginH : size.width + size.marginH;
                    var offset = 0;//U.toNumber(attrs.horizontalCenter);

                    var pos = (W-targetW)/2 + offset;
                    pos = Math.max(pos, 0);
                    
                    // 적용
                    var option = scope.option;
                    var propName_horizontal = option.horizontal;

                    var oldValue = scope.$parent[propName_horizontal];
                    if(oldValue === pos) return;

                    scope.$evalAsync( function(){
                        // out('_horizontalCenter : ', pos, W, targetW);
                        // out('------------>propName_horizontal : ', scope.$parent[propName_horizontal], pos);
                        scope.$parent[propName_horizontal] = pos;
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
