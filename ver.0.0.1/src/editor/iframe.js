/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';




window.out = window.parent.out || function(){
    alert('out 함수가 정해지지 않음');
};

(function(){

    ////////////////////////////////////////
    // Application
    ////////////////////////////////////////

    var app = angular.module('documentPaper', []);

    // contentIframe.js scope에 접근
    app.factory('$parentScope', function($window) {
        return $window.parent.angular.element($window.frameElement).scope();
    });

    
    app.directive( 'background', Background );
    app.directive( 'container', Container );
    app.directive( 'element', Element );
    app.controller('PaperController', PaperController);

    function PaperController($scope, $element, $attrs, $parentScope, $compile){

            // IFrame과 통신 연결
            // http://charemza.name/blog/posts/angularjs/iframe/same-domain-iframe-communication/
            // http://newtriks.com/2013/05/13/using-postmessage-in-an-angularjs-application/

            // createMessageInterface();
            
            ////////////////////////////////////////
            // Parent Window 통신 인터페이스
            ////////////////////////////////////////
            
            /*
            <button ng-click="message()">Send --> parent</button>
            <ul>
                <li ng-repeat="message in messages track by $index">{{message}}</li>
            </ul>
            
            function createMessageInterface(){
                $parentScope.$on('#MessageInterface-application', function(e, message) {
                    _receiveAPI(message);
                    // $scope.$apply();
                });
            }
            */

            /*
            message = {
                api: 'render', 
                args: [item]
            }
            $scope.callAPI(message);
            
            $scope.callAPI = function (message){
                // $scope.$broadcast('#MessageInterface-application', arguments);
                $parentScope.$emit('#MessageInterface-iframe', message);
                // $parentScope.$apply();
            }

            function _receiveAPI(message){
                out('\n\n# _receiveAPI (from application) : ', message);
                if(message === undefined || !message.api) return;

                var apiName = message.api;
                var args = message.args;
                //
                eval(apiName).apply(null, args);
            }
            */

            ////////////////////////////////////////
            // Receive API
            ////////////////////////////////////////
            
            /*
            function IFRAME_setFocus(){
                var $doc = angular.element('.screenContainer');
                $doc.focus();
            }

            function IFRAME_render(item){
                $scope.item = item;
                if(!item) return;

                // dom : document node
                var $dom = angular.element(item.content);

                // $scope.$evalAsync(function(){
                
                //-------------------------
                // element directive 활성화
                //-------------------------

                // var $elements = $dom.find("[uid^='element-']");
                // $elements.attr('element', true);

                // $compile($dom)($scope);
                // $scope.$digest();

                //-------------------------
                // 컨텐츠 적용 완료를 알림
                //-------------------------
                    
                    var $screenContainer = $element.find('.screenContainer');
                    $screenContainer.html($dom);

                    // createElementEvent();

                    APP_renderComplete();
                // });
            }

            ////////////////////////////////////////
            // Send API
            ////////////////////////////////////////
            
            function APP_renderComplete(){
                var message = {
                    api: 'APP_renderComplete'
                }
                $scope.callAPI(message);
            }
            */

            ////////////////////////////////////////////////////////////////////////////////
            // Element
            ////////////////////////////////////////////////////////////////////////////////

            // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
            $parentScope.$on('#Project.selected-ELEMENT', function(e, data){
                out('#Project.selected-ELEMENT (screen) : ', data);
                __onSelectElement(data.newValue, data.oldValue, data.documentUID);
            });

            $parentScope.$on('#Project.added-ELEMENT', function(e, data){
                out('#Project.addeded-ELEMENT (screen) : ', data);
                __onAddElement(data.item, data.param);
            });

            $parentScope.$on('#Project.removed-ELEMENT', function(e, data){
                out('#Project.removed-ELEMENT (screen) : ', data);
                __onRemoveElement(data.item, data.param);
            });
            
            $parentScope.$on('#Project.modified-ELEMENT', function(e, data){
                out('#Project.modified-ELEMENT (screen) : ', data);
                __onModifyElement(data.item, data.param);
            });

            /*
            param = {
                documentUID: "document-3ade4983-0a2b-48de-a524-b264378c1409", 
                elementUID: "element-405e3d09-41ea-4157-a6d4-70095966ee3f", 
                type: "text", 
                option: Object
            }
            */
            function __onAddElement(item, param){
                
                //-------------------------
                // element directive 활성화
                //-------------------------
                // 이미 제작되어 있는 컨텐츠에 대해 directive를 생성
                var elementUID = param.elementUID;
                // var $screenContainer = $element.find('.screenContainer');
                var $screenContainer = angular.element(item);
                var $elements = $screenContainer.find("[uid='" + elementUID + "']");
                
                $elements.attr('element', true);
                $compile($elements)($scope);
                /*
                if(!$scope.$$phase){
                    // $scope.$digest();
                    $scope.$apply();
                }
                */
            }

            function __onRemoveElement(item, param){
                //
            }

            function __onModifyElement(item, param){
                //
            }

            function __onSelectElement(newValue, oldValue, documentUID){
                out(' - oldValue (element) : ', oldValue);
                out(' - newValue (element) : ', newValue);

                // 해당 문서에 선택 표시

                // addElement 후 바로 선택되는 경우 $element에 아직 렌더링 되지 않은 상황일 수 있다.
                // var $el_old = this._getContentElement(oldValue, documentUID)
                // $el_old.removeClass('selectedElement');

                // var $el_new = this._getContentElement(newValue, documentUID)
                // $el_new.addClass('selectedElement');

                // UI 크기 업데이트 (selectInfo 값이 변경됨)
               $parentScope.updateSelectUI();
            }

            // end controller
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    // Container
    //
    ////////////////////////////////////////////////////////////////////////////////
    
    function Container ($parentScope, $compile) {

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

            //--------------
            // End Controller
        }

        ////////////////////////////////////////
        // Link
        ////////////////////////////////////////
        
        function Link ( $scope, $element, $attrs) {

            contentRender();

            function contentRender(){

                // out('parent : ', $parentScope);

                var item = $parentScope.item;
                // dom : document node
                var $dom = angular.element(item.content);

                // $scope.$evalAsync(function(){

                    //-------------------------
                    // element directive 활성화
                    //-------------------------

                    // 이미 제작되어 있는 컨텐츠에 대해 directive를 생성
                    var $elements = $dom.find("[uid^='element-']");
                    $elements.attr('element', true);
                    $compile($dom)($scope);
                    /*
                    if(!$scope.$$phase){
                        // $scope.$digest();
                        $scope.$apply();
                    }
                    */

                    //-------------------------
                    // 컨텐츠 적용 완료를 알림
                    //-------------------------

                    $element.html($dom);

                    // createElementEvent();

                    // APP_renderComplete();

                    // 랜더링 완료를 알림
                    // out('TODO: IFrame 시간지연 없앨것');
                    // $timeout(function(){
                        $parentScope.onLoadComplete(true);
                    // }, 1000);

                // });
            }

            /*
            // 랜더링 완료를 알림
            function APP_renderComplete(){
                var message = {
                    api: 'APP_renderComplete'
                }
                $scope.callAPI(message);
            }
            */

            //--------------
            // End Link
        }

        // end directive
    }


    ////////////////////////////////////////////////////////////////////////////////
    //
    // Background
    //
    ////////////////////////////////////////////////////////////////////////////////

    function Background ($parentScope) {

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
            
            //--------------------------------------
            // 바닥 클릭시 선택상태 해지
            //--------------------------------------

            $element.on('mousedown', angular.bind(this, onMousedown));
            // $element.on('mousedown', onMousedown);

            function onMousedown(e){
                // out('down : ', this);
                // out('down : ', arguments);
                // out('scope : ', $scope);
                // out('parent : ', $parentScope);

                // APP_selectUI('');
                $parentScope.selectElement('');
            }
            /*
            function APP_selectUI(selectUID){
                var message = {
                    api: 'APP_selectUI',
                    args: [selectUID]
                }
                $scope.callAPI(message);
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

    ////////////////////////////////////////////////////////////////////////////////
    //
    // Element
    //
    ////////////////////////////////////////////////////////////////////////////////

    function Element ($parentScope) {

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
            
            // element 클릭시 선택상태로 변경
            $element.on('mousedown', angular.bind(this, onMousedown));
            // $element.on('mousedown', onMousedown);

            function onMousedown(e){
                
                // out('down : ', this);
                // out('down : ', arguments);
                // out('scope : ', $scope);
                // out('parent : ', $parentScope);

                var selectUID = $element.attr('uid');
                // APP_selectUI(selectUID);
                $parentScope.selectElement(selectUID);
            }

            /*
            function APP_selectUI(selectUID){
                var message = {
                    api: 'APP_selectUI',
                    args: [selectUID]
                }
                $scope.callAPI(message);
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















})();




// function onMouseOver(){
//     out('onMouseOver');
//     angular.element('body').focus();
// }


