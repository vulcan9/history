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
        var _module = angular.module('dockModule', []);
       
        _module.directive( 'dockOwner', dockOwner );
        _module.directive( 'dockLeft', dockLeft );
        _module.directive( 'dockRight', dockRight );
        _module.directive( 'dockTop', dockTop );
        _module.directive( 'dockBottom', dockBottom );
        _module.directive( 'dockCenter', dockCenter );

        // 사이즈 변경 적용
        // 마우스 드래그 막음
        protectMouseSelect();

        // Window 리사이징 이벤트 전파
        createResizeDispatcher();

        // 리턴
        return _module;

        //-----------------------------------
        // 마우스 드래그 막음
        //-----------------------------------
        
        function protectMouseSelect(){
            
            var $document = angular.element(document);
            var body = $document.find("body");
            body.on("focusin", function(e){e.preventDefault();return false;});
            body.on("contextmenu", function(e){e.preventDefault();return false;});
            body.on("selectstart", function(e){e.preventDefault();return false;});
            body.on("dragstart", function(e){e.preventDefault();return false;});
            //$("body").attr("scroll", "no");
            
        }

        //-----------------------------------
        // Window 리사이징 이벤트 전파
        //-----------------------------------
        
        function createResizeDispatcher(){

            var _resizing = false;
            var _watchResizingID = -1;

            var $document = angular.element(document);
            angular.element(window).bind( 'resize' , function() {

                $document.trigger('#window.resizeing'); 

                if(_watchResizingID != -1){
                    clearTimeout(_watchResizingID);
                    _watchResizingID = -1;
                }
                
                _watchResizingID = setTimeout(function(){
                    clearTimeout(_watchResizingID);
                    _watchResizingID = -1;
                    
                    // fixed : "resize" 이름으로 이벤트를 trigger하면
                    // resize 이벤트가 계속해서 dispatch 됨
                    // (resize 이벤트가 버블링 되는것 같음)
                    
                    // resize 이벤트 발송
                    //$rootScope.$emit('#ToolController.resize', {width:0, height:0});
                    $document.trigger('#window.resize'); 

                    // DOM 갱신
                    //$rootScope.$apply();

                }, 500);

                // DOM 갱신
                //$rootScope.$apply();

            });
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
                    
                    /*
                    // 리사이징 이벤트
                    $rootScope.$on('#window.resizeing',function () {
                       _dock_layout($scope.dock);
                    });
                    */
                    
                    $document.on('#window.resizeing', function(){
                       _dock_layout($scope.dock); 
                        // DOM 갱신
                        //$rootScope.$apply();
                    }); 
                    
                    /*
                    $document.ready(function () {  
                        _dock_layout($scope.dock);
                    });
                   
                    $document.on('#tool.complete', function(){
                        _dock_layout($scope.dock);
                    }); 
                    */
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

                    element.on('#view.layoutUpdate', function(){
                        _dock_layout(scope.dock);
                    }); 
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

                    element.on('#view.layoutUpdate', function(){
                        _dock_layout(scope.dock);
                    }); 
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

                    element.on('#view.layoutUpdate', function(){
                        _dock_layout(scope.dock);
                    }); 
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

                    element.on('#view.layoutUpdate', function(){
                        _dock_layout(scope.dock);
                    }); 
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

                    element.on('#view.layoutUpdate', function(){
                        _dock_layout(scope.dock);
                    }); 
                }

            };

        }

        ////////////////////////////////////////
        // 레이아웃
        ////////////////////////////////////////
        
        /*
        var dockTop = el.find('.dockTop');
        var dockLeft = el.find('.menuContainer');
        var dockCenter = el.find('.progressContainer');
        var dockRight = el.find('.screenContainer');
        var dockBottom = el.find('.statusContainer');
        */

        function _dock_layout(dock){

            window.requestAnimationFrame(watchRender);

            function watchRender(){

                // 각각의 dock Frame에 대하여 크기를 설정한다.
                var owner = dock['owner'];
                if(owner === undefined) return;

                var top = dock['top'];
                var left = dock['left'];
                var center = dock['center'];
                var right = dock['right'];
                var bottom = dock['bottom'];

                var maxH = owner.innerHeight() || 0;
                var maxW = owner.innerWidth() || 0;

                var topH = (top) ? top.height() : 0;
                var bottomH = (bottom) ? bottom.height() : 0;

                var leftW = (left)? left.width() : 0;
                var rightW = (right)? right.width() : 0;

                var centerH = maxH - (topH + bottomH);
                var centerW = maxW - (leftW + rightW)-4; // border : 4

                var $document = angular.element(window.document);
                var data = {
                    top : {width:maxW, height:topH},
                    left : {width:leftW, height:centerH},
                    right : {width:rightW, height:centerH},
                    center : {width:centerW, height:centerH},
                    bottom : {width:maxW, height:bottomH}
                };
                $document.trigger('#dock.layoutUpdating', data);

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

                out('_dock_layout : ', data);
                // var $document = angular.element(window.document);
                // $document.trigger('#window.layoutUpdated');
                $document.trigger('#dock.layoutUpdated');
            }
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
