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
        _module.directive( 'verticalCenter', verticalCenter );
        _module.directive( 'horizontalCenter', horizontalCenter );

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
        
        //-----------------------------------
        // 세로 정렬 - position: absolute 인 경우 권장
        //-----------------------------------
        
        // 이전값 기록
        var __lastVertical = 0;
        var __lastHorizontal = 0;

        function verticalCenter($window, $document, $rootScope) {

            return {
                restrict: 'A',
                // scope: {},

                link: function( $scope, $element, $attrs ) {
                    
                    $scope.verticalCenter = __lastVertical;

                    $scope.$watch('verticalCenter', function (newValue, oldValue) {
                        // out('verticalCenter : ', newValue, oldValue);
                        if(newValue === undefined) return;
                        __lastVertical = newValue;
                       $element.css('top', newValue + 'px');
                    });
                    
                    /*
                    $attrs.$observe('positionInfo', function (newValue) {
                        out('positionInfo H : ', newValue, newValue.width);
                        _verticalPosition($scope, $element, $attrs, $document);
                    });
                    */

                    $scope.$watch($attrs.positionInfo, function (newValue) {
                        // out('positionInfo watch : ', newValue);
                        // out('positionInfo watch V : ', $scope.$eval($attrs.positionInfo));
                        _verticalPosition($scope, $element, $attrs, $document);
                    }, true);

                    // 리사이징 이벤트
                    $document.on('#window.resize',function () {
                       _verticalPosition($scope, $element, $attrs, $document);
                    }); 
                }
            };

        }

        function _verticalPosition(scope, el, attrs, $document){
            
            var renderFunc = render;
            window.requestAnimationFrame(renderFunc);

            function render(){
                var size = scope.$eval(attrs.positionInfo);

                var H = 0;
                var position = _setPositionCSS(el);
                if(position == 'fixed'){
                    H = $document.height();
                }else{
                    var parent = el.parent();
                    if(!parent || parent.length < 1) return;
                    H = (size === undefined) ? parent.height() : size.compareHeight + size.marginV;
                }
                
                var targetH = (size === undefined) ? el.height() : size.height + size.marginV;
                var offset = U.toNumber(attrs.verticalCenter);

                var pos = (H-targetH)/2 + offset;
                pos = Math.max(pos, 0);
                // el.css('top', pos);

                scope.$evalAsync( function(){
                    // out('_verticalPosition : ', pos, H, targetH);
                    scope.verticalCenter = pos;
                } );
            }
        }

        //-----------------------------------
        //  가로 정렬 - position: absolute 인 경우 권장
        //-----------------------------------
        
        function horizontalCenter($window, $document, $rootScope) {

            return {
                restrict: 'A',
                // scope: {},

                link: function( $scope, $element, $attrs ) {

                    $scope.horizontalCenter = __lastHorizontal;

                    $scope.$watch('horizontalCenter', function (newValue) {
                       // out('horizontalCenter : ', newValue);
                       if(newValue === undefined) return;
                       __lastHorizontal = newValue;
                       $element.css('left', newValue + 'px');
                    });
                    
                    /*
                    $attrs.$observe('positionInfo', function (newValue) {
                        out('positionInfo W : ', newValue);
                        _horizontalCenter($scope, $element, $attrs, $document);
                    });
                    */

                    $scope.$watch($attrs.positionInfo, function (newValue) {
                        _horizontalCenter($scope, $element, $attrs, $document);
                    }, true);

                    // 리사이징 이벤트
                    $document.on('#window.resize',function () {
                       _horizontalCenter($scope, $element, $attrs, $document);
                    }); 
                }
            };

        }

        function _horizontalCenter(scope, el, attrs, $document){
            
            var renderFunc = render;
            window.requestAnimationFrame(renderFunc);

            function render(){
                var size = scope.$eval(attrs.positionInfo);

                var W = 0;
                var position = _setPositionCSS(el);
                if(position == 'fixed'){
                    W = $document.width();
                }else{
                    var parent = el.parent();
                    if(!parent || parent.length < 1) return;
                    W = (size === undefined) ? parent.width() : size.compareWidth + size.marginH;
                }

                var targetW = (size === undefined) ? el.width() : size.width + size.marginH;
                var offset = U.toNumber(attrs.horizontalCenter);

                var pos = (W-targetW)/2 + offset;
                pos = Math.max(pos, 0);
                // el.css('left', pos);
                
                scope.$evalAsync( function(){
                    // out('_horizontalCenter : ', pos, W, targetW);
                    scope.horizontalCenter = pos;
                } );
            }

        }
        
        /*
        var _stepEnterTimeout;
        function delayExecute(func, context, argArray){

            if(func) func.apply(context, argArray);
            return;

            window.clearTimeout(_stepEnterTimeout);
            _stepEnterTimeout = setTimeout(function () {
                
                if(func) func.apply(context, argArray);
                _stepEnterTimeout = null;

            }, 10);
        }
        */
        
        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
