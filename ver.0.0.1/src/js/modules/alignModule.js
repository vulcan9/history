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
        
        function verticalCenter($window, $document, $rootScope) {

            return {
                restrict: 'A',
                // scope: {},

                controller: function( $scope, $element, $attrs ) {
                    $scope.$watch(function () {
                       _verticalPosition($scope, $element, $attrs, $document);
                    });
                    
                    // 리사이징 이벤트
                    $document.on('#window.resizeing',function () {
                       _verticalPosition($scope, $element, $attrs, $document);
                    }); 
                }
            };

        }

        function _verticalPosition(scope, el, attrs, $document){
                
                var H = 0;
                var position = _setPositionCSS(el);
                if(position == 'fixed'){
                    H = $document.height();
                }else{
                    var parent = el.parent();
                    H = parent.height() + (U.toNumber(parent.css('padding-top')) + U.toNumber(parent.css('padding-bottom')));
                }
                
                var h = el.height() + U.toNumber(el.css('margin-top')) + U.toNumber(el.css('margin-bottom'));
                var offset = U.toNumber(attrs.verticalCenter);

                var pos = (H-h)/2 + offset;
                pos = Math.max(pos, 0);
                el.css('top', pos);
        }

        //-----------------------------------
        //  가로 정렬 - position: absolute 인 경우 권장
        //-----------------------------------
        
        function horizontalCenter($window, $document, $rootScope) {

            return {
                restrict: 'A',
                // scope: {},

                controller: function( $scope, $element, $attrs ) {
                    $scope.$watch(function () {
                       _horizontalCenter($scope, $element, $attrs, $document);
                    });
                    
                    // 리사이징 이벤트
                    $document.on('#window.resizeing',function () {
                       _horizontalCenter($scope, $element, $attrs, $document);
                    }); 
                }

            };

        }

        function _horizontalCenter(scope, el, attrs, $document){

                var W = 0;
                var position = _setPositionCSS(el);
                if(position == 'fixed'){
                    W = $document.width();
                }else{
                    var parent = el.parent();
                    W = parent.width() + (U.toNumber(parent.css('padding-left')) + U.toNumber(parent.css('padding-right')));
                }
                
                var w = el.width() + U.toNumber(el.css('margin-left')) + U.toNumber(el.css('margin-right'));
                var offset = U.toNumber(attrs.horizontalCenter);

                var pos = (W-w)/2 + offset;
                pos = Math.max(pos, 0);
                el.css('left', pos);
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
