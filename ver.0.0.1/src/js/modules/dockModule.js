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
            // body.on("focusin", function(e){e.preventDefault();return false;});
            // body.on("selectstart", function(e){e.preventDefault();return false;});
            // body.on("dragstart", function(e){e.preventDefault();return false;});
            body.on("contextmenu", function(e){
                e.preventDefault();
                alert('context menu!');
                return false;
            });

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
                        _dock_layout($scope);
                    };

                    $element.addClass('dockOwner');
                    this.addDockFrame('owner', $element);
                    
                    /*
                    // 리사이징 이벤트
                    $rootScope.$on('#window.resizeing',function () {
                       _dock_layout($scope.dock);
                    });
                    */
                    
                    $document.on('#window.resizeing', call_dock_layout); 
                    
                    function call_dock_layout(){
                       _dock_layout($scope);
                       $scope.$apply();
                    }

                    /*
                    $document.ready(function () {  
                        _dock_layout($scope.dock);
                    });
                   
                    $document.on('#tool.complete', function(){
                        _dock_layout($scope.dock);
                    }); 
                    */

                    // 제거
                    $scope.$on("$destroy", function () {
                        $document.off('#window.resizeing', call_dock_layout); 
                    });

                    // end controller
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

                    element.on('#view.layoutUpdate', function(e, data){
                        _dock_layout(scope, 'top');
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

                    element.on('#view.layoutUpdate', function(e, data){
                        _dock_layout(scope, 'left', data);
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

                    element.on('#view.layoutUpdate', function(e, data){
                        _dock_layout(scope, 'center');
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

                    element.on('#view.layoutUpdate', function(e, data){
                        _dock_layout(scope, 'right', data);
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

                    element.on('#view.layoutUpdate', function(e, data){
                        _dock_layout(scope, 'bottom');
                    }); 
                }

            };

        }

        ////////////////////////////////////////
        // 레이아웃
        ////////////////////////////////////////
    
        // millisecond 후에 최종 호출되는 function을 실행시킨다.
        // millisecond안에 중복 호출되는 function은 무시된다.
        var __stepEnterTimeout;

        function __delayExecute (millisecond, func, context, argArray){

                window.clearTimeout(__stepEnterTimeout);
                
                __stepEnterTimeout = setTimeout(function () {
                    
                    if(func) func.apply(context, argArray);
                    __stepEnterTimeout = null;

                }, millisecond);
        }

        function _dock_layout(scope, key, data){

            var renderFunc = render();
            window.requestAnimationFrame(renderFunc);
            // window.requestAnimationFrame(watchRender);
            
            // 종료 시점에 transition 기능 적용
            __delayExecute (100, function(){
                var transitionTime = Tool.current.tool('CONFIG').transition.TICK;
                angular.element(window.document).find('.dock').css({
                    'transition': 'all ' + transitionTime + 's ease 0s'
                });
            }, null);

            function render(){
                var dock = scope.dock;
                var targetCSS = (data) ? data.targetCSS : {};

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
                
                var targetW = (targetCSS && 'width' in targetCSS) ? targetCSS.width : undefined;
                // var targetH = (targetCSS && 'height' in targetCSS) ? targetCSS.height : undefined;

                // left
                var leftW = (left)? left.width() : 0;
                if (key == 'left' && targetW !== undefined) leftW = targetW;
                // if (key == 'left' && targetH !== undefined) leftH = targetH;

                // right
                var rightW = (right)? ((key == 'right') ? targetCSS.width : right.width()) : 0;
                if (key == 'right' && targetW !== undefined) rightW = targetW;
                // if (key == 'right' && targetH !== undefined) rightH = targetH;

                // center
                var centerH = maxH - (topH + bottomH);
                var centerW = maxW - (leftW + rightW) - 4; // border : 4

                // 최종값
                var topRect = { 
                    x:0, 
                    y:0, 
                    width: maxW, 
                    height: topH 
                };
                var bottomRect = { 
                    x:0, 
                    y: maxH - bottomH, 
                    width: maxW, 
                    height: bottomH 
                };
                var leftRect = { 
                    x: 0, 
                    y: topH, 
                    width: leftW, 
                    height: centerH 
                };
                var rightRect = { 
                    x: maxW - rightW, 
                    y: topH, 
                    width: rightW, 
                    height: centerH 
                };
                var centerRect = { 
                    x: leftW, 
                    y: topH, 
                    width: centerW, 
                    height: centerH 
                };
                
                // 연산 최종 결정값
                var $document = angular.element(window.document);
                var resultData = {
                    top : topRect,
                    left : leftRect,
                    right : rightRect,
                    center : centerRect,
                    bottom : bottomRect
                };

                

                return watchRender;

                function watchRender(){

                    $document.trigger('#dock.layoutUpdating', resultData);

                    // 적용
                    if(top){
                        top.css({
                            // width: topRect.width, height: topRect.height,
                            // left: topRect.x, top: topRect.y
                            left: 0, top: 0,
                            position: 'relative'
                        });
                    }
                    if(bottom){
                        bottom.css({
                            // width: bottomRect.width, height: bottomRect.height,
                            // left: bottomRect.x, top: bottomRect.y
                            left: 0, top: 0,
                            position: 'relative'
                        });
                    }
                    if(left){
                        left.css({
                            width: leftRect.width, height: leftRect.height,
                            // left: leftRect.x, top: leftRect.y,
                            left: 0, top: 0,
                            position: 'relative'
                        });
                    }
                    if(right){
                        right.css({
                            width: rightRect.width, height: rightRect.height,
                            left: rightRect.x, top: rightRect.y,
                            position: 'absolute'
                        });
                    }
                    if(center){
                        center.css({
                            width: centerRect.width, height: centerRect.height,
                            left: centerRect.x, top: centerRect.y,
                            // left: 0, top: 0,
                            position: 'absolute'
                        });
                    }

                    out('_dock_layout : ', resultData);
                    // var $document = angular.element(window.document);
                    $document.trigger('#dock.layoutUpdated');
                }
            }

            // end
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
