/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전을 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U', 'Application'
    ],
    function( U, application ) {

        // 등록
        application.directive( 'contentIframe', _directive );

        // 선언
        function _directive( $templateCache, $sce ) {

            //out( 'content' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{content}} </span>',
                templateUrl: _PATH.TEMPLATE + 'screen/contentIframe.html',
                
                replace: false,
                transclude: true,

                // scope: {
                //     onLoadComplete: '&onLoadComplete',
                //     item: '=item',
                //     size: '=size'
                // },
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs, $timeout, $compile, Project) {

                // 제거
                $scope.$on("$destroy", function () {
                    var $contentContainer = $scope.getContentContainer();
                    $contentContainer.off('load', _onLoadIFrame);
                    // API_remove();
                });
                
                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////
                /*
                // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
                $scope.$on('#Project.selected-ELEMENT', function(e, data){
                    out('#Project.selected-ELEMENT (screen) : ', data);
                    __onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });
                
                $scope.$on('#Project.added-ELEMENT', function(e, data){
                    out('#Project.addeded-ELEMENT (screen) : ', data);
                    __onAddElement(data.item, data.param);
                });

                $scope.$on('#Project.removed-ELEMENT', function(e, data){
                    out('#Project.removed-ELEMENT (screen) : ', data);
                    __onRemoveElement(data.item, data.param);
                });
                
                $scope.$on('#Project.modified-ELEMENT', function(e, data){
                    out('#Project.modified-ELEMENT (screen) : ', data);
                    __onModifyElement(data.item, data.param);
                });
                
                function __onAddElement(item, param){
                    // IFrame에 Element 알림
                    IFRAME_onAddedElement (param);
                }

                function __onRemoveElement(item, param){
                    // IFrame에 Element 알림
                    IFRAME_onRemovedElement (param);
                }

                function __onModifyElement(item, param){
                    // IFrame에 Element 알림
                    IFRAME_onModifiedElement (param);
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
                   $scope.updateSelectUI();
                }
                */

                ////////////////////////////////////////
                // IFrame 컨텐츠 적용
                ////////////////////////////////////////

                // DOM 초기화시 호출됨 (ng-init)
                $scope.loadContent = function () {
                    // var htmlString = item.content;
                    // return $sce.trustAsHtml(htmlString);

                    // attribute에 uid값이 아직 적용되지 않은 경우일 수 있으므로 $evalAsync로 실행한다.
                    // $scope.$evalAsync(function(){
                        loadIFrame();
                    // });
                }

                //-----------------------
                // IFrame 로드
                //-----------------------
                
                function loadIFrame(){

                    // 로드 완료 이벤트 등록
                    var $contentContainer = $scope.getContentContainer();
                    $contentContainer.on('load', _onLoadIFrame);

                    // IFrame과 통신 연결
                    // http://charemza.name/blog/posts/angularjs/iframe/same-domain-iframe-communication/
                    // http://newtriks.com/2013/05/13/using-postmessage-in-an-angularjs-application/
                    createMessageInterface();

                    var url = _PATH.EDITOR + 'template/iframe.html';
                    $scope.url = $sce.trustAsResourceUrl(url);

                    /*
                    var url = 'iframe.template';
                    var htmlString = $templateCache.get(url);
                    var iframeDocument = $contentContainer[0].contentDocument;
                    iframeDocument.open('text/html', 'replace');
                    iframeDocument.write(htmlString);
                    iframeDocument.close();
                    */

                    // IFrame에 해당 내용을 로드한다.
                    // var url = 'template_iframe.html';
                    // $contentContainer.attr('src', url);
                    // $scope.url = $sce.trustAsResourceUrl(url);
                }

                //-----------------------
                // 로드 완료 리스너
                //-----------------------
                
                function _onLoadIFrame(){
                    var $contentContainer = $scope.getContentContainer();
                    $contentContainer.off('load', _onLoadIFrame);

                    //****************************************

                    // DOM Content 랜더링
                    // IFRAME_render($scope.item);

                    // APP_renderComplete 함수 콜백됨

                    //****************************************
                    
                    // Element 클릭시 선택상태로 전환
                    // createEvent();
                }

                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////
                /*
                // 로드 내용 container DOM 찾기
                this._$scope.getContentContainer = function (documentUID){
                    // var $document = $element.find('[uid=' + documentUID + ']');
                    var $iframe = $element.find('#iframe');
                    var $content = $iframe.contents();
                    return $content;
                }

                // 해당 문서의 Element DOM 찾기
                this._getContentElement = function (elementUID, documentUID){
                    var $contentContainer = this._$scope.getContentContainer(documentUID);
                    var $el = $contentContainer.find('[uid=' + elementUID + ']');
                    return $el;
                }
                */
                
                ////////////////////////////////////////////////////////////////////////////////
                // IFrame과 통신 인터페이스
                ////////////////////////////////////////////////////////////////////////////////
                
                /*
                <p><button ng-click="message()">Send --> iframe</button></p>
                <ul>
                    <li ng-repeat="message in messages track by $index">{{message}}</li>
                </ul>
                */

                function createMessageInterface(){
                    $scope.$on('#MessageInterface-iframe', function(e, message) {
                        _receiveAPI(message);
                        // $scope.$apply();
                    });
                }
            
                /*
                message = {
                    api: 'render', 
                    args: [item]
                }
                _callAPI(message);
                */
                function _callAPI(message){
                    $scope.$broadcast('#MessageInterface-application', message);
                    // $scope.$apply();
                }
                
                function _receiveAPI(message){
                    out('\n\n# _receiveAPI (from iframe) : ', message);
                    if(message === undefined || !message.api) return;

                    var apiName = message.api;
                    var args = message.args;
                    //
                    eval(apiName).apply(null, args);
                }

                ////////////////////////////////////////
                // Send API
                ////////////////////////////////////////
                
                /*
                // 최초 기존 DOM을 랜더링을 요청함
                function IFRAME_render (item){
                    var message = {
                        api: 'IFRAME_render', 
                        args: [item]
                    }
                    _callAPI(message);
                }
                
                function IFRAME_onAddedElement (param){
                    var message = {
                        api: 'IFRAME_onAddedElement', 
                        args: [param]
                    }
                    _callAPI(message);
                }

                function IFRAME_onRemovedElement (param){
                    var message = {
                        api: 'IFRAME_onRemovedElement', 
                        args: [param]
                    }
                    _callAPI(message);
                }

                function IFRAME_onModifiedElement (param){
                    var message = {
                        api: 'IFRAME_onModifiedElement', 
                        args: [param]
                    }
                    _callAPI(message);
                }
                */

                ////////////////////////////////////////
                // Receive API
                ////////////////////////////////////////
                
                /*
                // 최초 HTML 컨텐츠 렌더링이 완료된 후 호출됨
                function APP_renderComplete(){

                    // out('TODO: IFrame 시간지연 없앨것');
                    // $timeout(function(){
                        $scope.onLoadComplete(true);
                    // }, 1000);

                }

                // element 선택했을때 호출됨
                function APP_selectUI(selectUID){
                    $scope.selectElement(selectUID);
                }
                */
























                /*
                // content 랜더링
                function API_add(){
                    if(!$scope.item) return;
                    
                    var dom = $scope.item.content;
                    var $contentContainer = $scope.getContentContainer();
                    var iframeDocument = $contentContainer[0].contentDocument;
                    // angular.element(iframeDocument).find('.screenContainer').html(dom);
                    // var $parent = angular.element(iframeDocument).find('.screenContainer div[uid=' + $scope.item.uid + ']');
                    // var $parent = angular.element(iframeDocument).find('.screenContainer').find('div');
                    // $parent.html(dom);

                    // $compile($parent[0])($scope);
                    // angular.element('.ng-scope').each(function(e, t) {
                    //   console.log('>>>', t,angular.element(t).scope());
                    // });
                }

                function API_remove(){
                    if(!$scope.item) return;

                    // var $contentContainer = $scope.getContentContainer();
                    // var iframeDocument = $contentContainer[0].contentDocument;
                    // angular.element(iframeDocument).find('.screenContainer').first().remove();
                    
                    var dom = $scope.item.content;
                    angular.element(dom).remove();
                }
                */
                /*
                scope.getIframeSrc = function() {
                  // One should think about their particular case and sanitize accordingly
                  var qs = ["a", "b"].map(function(value, name) {
                      return encodeURIComponent(name) + "=" +
                             encodeURIComponent(value);
                    }).join("&");
                  // `baseUrl` isn't exposed to a user's control, so we don't have to worry about escaping it.
                  return baseUrl + "?" + qs;
                };
                */






                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            // size, loadComplete 변수는 parent scope으로부터 상속됨

            function Link ( $scope, $element, $attrs, controller) {

                // $scope.loadComplete = false;

                // $scope.$watch('item', function(newValue, oldValue) {
                //     getContent(newValue);
                // }, true);






                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);