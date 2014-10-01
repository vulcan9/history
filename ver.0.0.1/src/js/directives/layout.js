/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 위치 설정

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'layout', _directive );

        // 선언
        function _directive($rootScope, $window, $document) {

            return {
                restrict: 'A',
                scope: {},

                link: function( scope, el, attrs, controller, transclude ) {

                    // 사이즈 변경 적용
                    el.ready(function () {  
                        
                        scope.$watch(function () {
                           setLlayout (scope, el);
                        });

                    });

                    // 마우스 드래그 막음
                    protectMouseSelect($document);

                    // Window 리사이징 이벤트 전파
                    createResizeDispatcher($rootScope, $window);
                }

            };

        }

        // 리턴
        return _directive;

        //-----------------------------------
        // 마우스 드래그 막음
        //-----------------------------------
        
        function protectMouseSelect($document){
            
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
        
        function createResizeDispatcher($rootScope, $window){

            var _resizing = false;
            var _watchResizingID = -1;

            angular.element($window).bind( 'resize' , function() {

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
                    $rootScope.$broadcast('#ApplicationController.resize'); 

                    // DOM 갱신
                    //$rootScope.$apply();

                }, 500);

                // DOM 갱신
                $rootScope.$apply();

            });
        }

        ////////////////////////////////////////
        // 레이아웃
        ////////////////////////////////////////
        
        //alert("dom 아직 생성안됨");
        // http://jsfiddle.net/zbjLh/506/
        // http://blog.brunoscopelliti.com/run-a-directive-after-the-dom-has-finished-rendering
        // https://groups.google.com/forum/#!topic/angular/SCc45uVhTt8
        
        function setLlayout (scope, el) {

            //out('# render : ', el.height(), el);

            /*
            $rootScope.$watch('size',function(newVal, oldVal){
                out('size::::::::::::::', newVal);
                layout(el);
            });
            */

            // 컨테이너 크기
            var view = el.parent();
            var w = view.width();
            var h = view.height();

            var toolContainer = el.find('.toolContainer');
            var menuContainer = el.find('.menuContainer');
            var progressContainer = el.find('.progressContainer');
            var screenContainer = el.find('.screenContainer');
            var statusContainer = el.find('.statusContainer');

            var screenH = h - (menuContainer.height() + progressContainer.height() + statusContainer.height());
            screenContainer.height(screenH);

            // var treeContainer = el.find('.treeContainer');
            //var timeline = el.find('.timeline');
            //var property = el.find('.property');
            
            // out('menuContainer : ', menuContainer.height());
            // out('progressContainer : ', progressContainer.height());
            // out('screenContainer : ', screenContainer.height());
            // out('statusContainer : ', statusContainer.height());
            
        }

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
