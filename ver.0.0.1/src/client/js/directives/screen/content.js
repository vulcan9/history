/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : 버전을 표시

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {


        // 선언
        function _directive($compile, CommandService, Project, ELEMENT) {

            //out( 'content' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                // template: '<div id="hi-contentContainer" class="content" ng-init="loadContent()"></div>',
                templateUrl: _PATH.TEMPLATE + 'screen/content.html',

                replace: false,
                transclude: false,

                // scope: {
                //     onLoadComplete: '&onLoadComplete',
                //     size: '=size',
                //     item: '=item'
                // },

                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller($scope, $element, $attrs) {

                // 제거
                $scope.$on("$destroy", function () {
                    // var $contentContainer = $scope.getContentContainer();
                    // $contentContainer.off('load', _onLoadIFrame);
                });

                // 바닥 클릭시 선택 해지
                $scope.onClick_bg = function () {

                    /*
                     // 현재 편집 상태라면 선택해지는 시키지 않는다.
                     // 편집 모드만 해지
                     var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                     if(scope.editableUID){
                     scope.editableUID = '';
                     return;
                     }
                     */

                    $scope.selectElement('');
                }

                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////

                // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
                $scope.$on('#Project.selected-ELEMENT', function (e, data) {
                    out('#Project.selected-ELEMENT (screen) : ', data);
                    __onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });

                $scope.$on('#Project.added-ELEMENT', function (e, data) {
                    out('#Project.added-ELEMENT (screen) : ', data);
                    __onAddElement(data.item, data.param);
                });

                $scope.$on('#Project.removed-ELEMENT', function (e, data) {
                    out('#Project.removed-ELEMENT (screen) : ', data);
                    __onRemoveElement(data.item, data.param);
                });

                $scope.$on('#Project.modified-ELEMENT', function (e, data) {
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
                function __onAddElement(documentItem, param) {

                    // 이미 제작되어 있는 컨텐츠에 대해 directive를 생성
                    var elementUID = param.elementUID;
                    // var $screenContainer = $element.find('.hi-screenContainer');
                    var $screenContainer = angular.element(documentItem);
                    var $elements = $screenContainer.find("[uid='" + elementUID + "']");
                    var type = param.type;
                    var html = param.html;

                    if(!html)
                    {

                        //-------------------------
                        // element directive 활성화
                        //-------------------------

                        // element는 Directive로 정의해야 함
                        $elements.attr('element', type);
                        $elements.addClass('hiElement').addClass(type);
                        // 초기 최소 사이즈 지정(나중에 remove 됨)
                        $elements.addClass('hiMinSize');
                        //$elements.attr('ng-class', '{hiElement:true,' + param.type + ':true}');

                        //-------------------------
                        // Type별 설정
                        //-------------------------

                        // COPY 가 아닌 새로 새로 생성인 경우에만 설정함
                        if(type == ELEMENT.TEXT){
                            $elements.text('TEXT');
                        }else if(type == ELEMENT.IMAGE){
                            $elements.addClass('noImage');
                        }
                    }

                    //-------------------------
                    // css prefix 적용 지원 (prefix directive 활성화)
                    //-------------------------

                    // prefix는 element Directive에 기능 정의됨
                    // 오리지널 style 데이터
                    //$elements.attr('style-string', "{{styleString}}");
                    // prefix 포함된 style 적용
                    //$elements.attr('ng-style', "styles");

                    var styleString = $elements.attr('style-string') || '{}';
                    var obj = angular.fromJson(styleString);
                    if(!obj.width) obj.width = $elements.outerWidth();
                    if(!obj.height) obj.height = $elements.outerHeight();
                    $elements.attr('style-string', angular.toJson(obj));

                    //-------------------------
                    // 적용
                    //-------------------------
                    $compile($elements)($scope);
                    /*
                     if(!$scope.$$phase){
                     // $scope.$digest();
                     $scope.$apply();
                     }
                     */
                    $scope.updateThumbnail();
                }

                function __onRemoveElement(item, param) {
                    //
                    $scope.updateThumbnail();
                }

                function __onModifyElement(item, param) {
                    // 현재 선택상태이면 UI를 업데이트 한다.

                    // UI 크기 업데이트 (selectInfo 값이 변경됨)
                    // $scope.updateSelectUI();

                    $scope.updateThumbnail();
                }

                function __onSelectElement(newValue, oldValue, documentUID) {
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

                /*
                 $scope.selectElement = function (selectUID){

                 var elementUID = Project.current.getSelectElement();
                 if(elementUID === selectUID) return null;

                 var command = CommandService.SELECT_ELEMENT;
                 var param = {
                 documentUID: Project.current.getSelectDocument(),
                 elementUID: selectUID
                 };
                 CommandService.exe(command, param);
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
                    loadIContent();
                    // });
                }

                //-----------------------
                // HTML Content 바인딩
                //-----------------------

                function _getContentContainer(documentUID) {
                    var $contentContainer = $element.find('#hi-contentContainer');
                    return $contentContainer;
                    // return $element;
                }

                function _getMouseCatcher(documentUID) {
                    var $contentContainer = $element.find('#mouseCatcher');
                    return $contentContainer;
                    // return $element;
                }

                function loadIContent() {
                    var item = $scope.item;
                    var documentUID = item.uid

                    var dom = item.content;
                    var $dom = angular.element(dom);

                    var $contentContainer = _getContentContainer();
                    // $contentContainer.html(dom);
                    $contentContainer.append(dom);

                    //-------------------------
                    // element directive 활성화
                    //-------------------------

                    // 이미 제작되어 있는 컨텐츠에 대해 directive를 생성
                    var $elements = $dom.find("[uid^='element-']");
                    if($elements.attr('element') === undefined) $elements.attr('element', 'unknown');
                    $compile(dom)($scope);

                    //****************************************

                    $scope.$evalAsync(function () {
                        // 랜더링 까지 완료되었음을 알림
                        $scope.onLoadComplete({
                            success: true
                        });
                    });

                    //****************************************
                }

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

            function Link($scope, $element, $attrs, controller) {

                // $scope.loadComplete = false;

                // $scope.$watch('size', function(newValue, oldValue) {
                //     $scope.alignInfo_content = getAlignInfo_content(newValue);
                // }, true);

                // $scope.$watch('loadComplete', function(newValue, oldValue) {
                //     $scope.complete = $scope.$eval(newValue);
                // });


                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function (application) {
            // 등록
            application.directive('content', _directive);
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);