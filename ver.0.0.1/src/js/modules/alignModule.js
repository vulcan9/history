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
       
       
        _module.directive( 'dockOwner', dockOwner );
        _module.directive( 'dockLeft', dockLeft );
        _module.directive( 'dockRight', dockRight );
        _module.directive( 'dockTop', dockTop );
        _module.directive( 'dockBottom', dockBottom );
        _module.directive( 'dockCenter', dockCenter );

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
                    $rootScope.$on('#ApplicationController.resizeing',function () {
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
                       _verticalPosition($scope, $element, $attrs, $document);
                    });
                    
                    // 리사이징 이벤트
                    $rootScope.$on('#ApplicationController.resizeing',function () {
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
                el.css('left', pos);
        }

        ////////////////////////////////////////
        // Dock
        ////////////////////////////////////////

        function dockOwner($window, $document, $rootScope) {

            return {
                restrict: 'A',
                //scope: {},

                controller: function( $scope, $element, $attrs) {
                    
                    $scope.dock = {};

                    // dock member instance
                    this.addDockFrame = function(key, el){
                        $scope.dock[key] = el;
                        _dock_layout($scope.dock);
                    };

                    $element.addClass('dockOwner');
                    this.addDockFrame('owner', $element);
                    
                    // 리사이징 이벤트
                    $rootScope.$on('#ApplicationController.resizeing',function () {
                       _dock_layout($scope.dock);
                    }); 
                }

            };

        }

        function dockTop($window, $document) {

            return {
                restrict: 'A',
                scope: false,
                require: '^dockOwner',

                link: function( scope, element, attrs, ownerController) {
                    // console.log('top : ', scope.dock.owner);
                    element.addClass('dock');
                    element.addClass('top');
                    ownerController.addDockFrame('top', element);
                }

            };

        }

        function dockLeft($window, $document) {

            return {
                restrict: 'A',
                scope: false,
                require: '^dockOwner',

                link: function( scope, element, attrs, ownerController) {
                    // console.log('left : ', scope.dock.owner);
                    element.addClass('dock');
                    element.addClass('left');
                    ownerController.addDockFrame('left', element);
                }

            };

        }

        function dockCenter($window, $document) {

            return {
                restrict: 'A',
                scope: false,
                require: '^dockOwner',

                link: function( scope, element, attrs, ownerController) {
                    // console.log('center : ', scope.dock.owner);
                    element.addClass('dock');
                    element.addClass('center');
                    ownerController.addDockFrame('center', element);
                }

            };

        }

        function dockRight($window, $document) {

            return {
                restrict: 'A',
                scope: false,
                require: '^dockOwner',

                link: function( scope, element, attrs, ownerController) {
                    // console.log('right : ', scope.dock.owner);
                    element.addClass('dock');
                    element.addClass('right');
                    ownerController.addDockFrame('right', element);
                }

            };

        }

        function dockBottom($window, $document) {

            return {
                restrict: 'A',
                scope: false,
                require: '^dockOwner',

                link: function( scope, element, attrs, ownerController) {
                    // console.log('bottom : ', scope.dock.owner);
                    element.addClass('dock');
                    element.addClass('bottom');
                    ownerController.addDockFrame('bottom', element);
                }

            };

        }

        /*
        var dockTop = el.find('.dockTop');
        var dockLeft = el.find('.menuContainer');
        var dockCenter = el.find('.progressContainer');
        var dockRight = el.find('.screenContainer');
        var dockBottom = el.find('.statusContainer');
        */

        function _dock_layout(dock){

                // 각각의 dock Frame에 대하여 크기를 설정한다.
                var owner = dock['owner'];
                if(owner === undefined) return;

                var top = dock['top'];
                var left = dock['left'];
                var center = dock['center'];
                var right = dock['right'];
                var bottom = dock['bottom'];

                var topH = (top) ? top.height() : 0;
                var bottomH = (bottom) ? bottom.height() : 0;

                var leftW = (left)? left.width() : 0;
                var rightW = (right)? right.width() : 0;

                var centerH = owner.innerHeight() - (topH + bottomH);
                var centerW = owner.innerWidth() - (leftW + rightW);

                if(left){
                    left.width(leftW);
                    left.height(centerH);
                }

                if(right){
                    right.width(rightW);
                    right.height(centerH);
                }

                if(center){
                    center.width(centerW);
                    center.height(centerH);
                }
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
