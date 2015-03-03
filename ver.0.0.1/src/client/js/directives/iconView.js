/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : directive 정의, 등록

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {

        // 선언
        function _directive(CommandService, Tool, ELEMENT, $getScope, TalkService, $rootScope) {

            //out( 'version' );

            var config = {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/iconView.html',

                replace: true,
                priority: 0,
                transclude: true,
                scope: {},

                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: Controller,

                link: Link

                // end config
            };

            return config;

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Link($scope, $element, $attrs) {
                //
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller($scope, $element, $attrs) {

                //------------------
                // 데이터 변경 감지 순서
                //------------------

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Tool.changed-MENU', function (e, data) {
                    out(data.name, '#Tool.changed-MENU : ', arguments);
                    //self.updateMenu();

                    if (Tool.current.TOOL.MENU == undefined) {
                        out('TODO : MENU 버튼 비활성화');
                    } else {
                        out('TODO : MENU 버튼 활성화');
                    }
                });

                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.callAPI = function () {

                    var arg = U.toArray(arguments);
                    var funcName = arg.shift();
                    out(' * ICON MENU item : ', funcName);

                    if (funcName) {
                        eval(funcName).apply(null, arg);
                    }

                };

                ////////////////////////////////////////////////////////////////////////////////
                // 메뉴 명령 실행
                ////////////////////////////////////////////////////////////////////////////////

                ////////////////////////////////////////
                // Project
                ////////////////////////////////////////

                function newProject() {
                    // CommandService.exe(CommandService.NEW, {});
                    $rootScope.go_tool();
                }

                function openProject() {
                    // CommandService.exe(CommandService.OPEN, {});
                    // var uid = 'uid를 선택할 수 있는 창을 띄운다.';
                    // $rootScope.go_tool(uid);
                    $rootScope.go_dashboard();
                }

                function saveProject() {
                    CommandService.exe(CommandService.SAVE, {});
                }

                ////////////////////////////////////////
                // 편집
                ////////////////////////////////////////

                function undo() {
                    CommandService.exe(CommandService.UNDO, {});
                }

                function redo() {
                    CommandService.exe(CommandService.REDO, {});
                }

                ////////////////////////////////////////
                // Copy & Paste
                ////////////////////////////////////////

                function copy() {
                    if (Project.current == null) return;

                    // 현재 선택상태에 있는 Element를 복사
                    var documentUID = Project.current.getSelectDocument();
                    var elementUID = Project.current.getSelectElement();
                    var element = Project.current.getElement (documentUID, elementUID);
                    if(!element){
                        Tool.current.current_document('copy', '');
                        return;
                    }

                    //var cloneElement = angular.element(element).clone();
                    Tool.current.current_document('copy', element.outerHTML);
                    //CommandService.exe(CommandService.COPY, {});
                }

                function paste() {
                    if (Project.current == null) return;

                    var copyedData = Tool.current.current_document('copy');
                    if(!copyedData) return;

                    var $cloneElement = angular.element(copyedData);
                    var elementUID = Project.current.createElementUID();
                    $cloneElement.attr('uid', elementUID);

                    var type = $cloneElement.attr('element');
                    var elementHTML = $cloneElement[0].outerHTML;
                    out('paste : ', elementHTML);

                    var param = {
                        documentUID: Project.current.getSelectDocument(),
                        elementUID: elementUID,
                        type: type,
                        html: elementHTML
                    };

                    CommandService.exe(CommandService.ADD_ELEMENT, param);
                }

                function pasteExecute(callback){
                    // 복사되어 있는 Element 객체가 있다면 붙이기(현재 Document에 삽입)

                    var $cloneElement = angular.element(copyedData);

                    var documentUID = Project.current.getSelectDocument();
                    var elementUID = Project.current.createElementUID();
                    $cloneElement.attr('uid', elementUID);

                    var type;
                    var option;

                    function add(element) {

                        var css = {
                            'left': element.offsetLeft + e.offsetX, //e.offsetX,
                            'top': element.offsetTop + e.offsetY  //e.offsetY,
                        };
                        var param = {
                            // 삽입될 문서
                            documentUID: documentUID,
                            elementUID: elementUID,
                            type: type,

                            // element 설정값
                            option: option,
                            css: css
                        };
                        CommandService.exe(CommandService.ADD_ELEMENT, param);
                    }
                }

                ////////////////////////////////////////
                // Document
                ////////////////////////////////////////

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.select-DOCUMENT', function (e, data) {
                    out('#Project.select-DOCUMENT (iconView)');
                    _removeMousePointEvent();
                });

                // Document 추가 
                // position : 'next', 'sub', 'prev'
                function addDocument(position, documentUID, selectUID) {

                    if (Project.current == null) return;

                    // command 호출
                    var param = {
                        //document : null,
                        // documentUID: uid가 지정되지 않았으면 자동 생성됨
                        documentUID: documentUID || Project.current.createDocumentUID(),

                        option: {
                            position: position,
                            // 현재 선택 상태의 document
                            selectUID: selectUID || Project.current.getSelectDocument()
                        }
                    };

                    CommandService.exe(CommandService.ADD_DOCUMENT, param);
                }

                ////////////////////////////////////////
                // Element
                ////////////////////////////////////////

                // 등록된 마우스 이벤트
                var __lastHandler = null;
                var __oldCursor;
                var __messageObj;

                function addElement(type, elementUID, documentUID) {

                    if (Project.current == null) return;

                    //------------------
                    // 안내 문구 띄우기
                    //------------------

                    var msgExist = TalkService.has(__messageObj);
                    if (msgExist < 0) {
                        __messageObj = TalkService.open('문서에서 추가할 ' + type + '의 위치를 클릭하세요.', {
                            delayTime: TalkService.NONE,
                            type: 'info', //normal | success | info | warning | danger
                            closeCallback: function () {
                                __messageObj = null;
                            }
                        });
                    } else {
                        __messageObj = TalkService.delay(__messageObj, TalkService.NONE);
                    }

                    //------------------
                    // 핸들러 등록
                    //------------------

                    _addMousePointEvent(add);

                    //------------------
                    // 마우스 위치 결정
                    //------------------

                    function add(e) {

                        _removeMousePointEvent();

                        var css = {
                            'left': e.target.offsetLeft + e.offsetX, //e.offsetX,
                            'top': e.target.offsetTop + e.offsetY  //e.offsetY,
                        };
                        var param = {
                            // 삽입될 문서
                            documentUID: documentUID || Project.current.getSelectDocument(),

                            // uid가 지정되지 않았으면 command에서 자동 생성됨
                            elementUID: elementUID || Project.current.createElementUID(),
                            type: type,

                            // element 설정값
                            option: {},
                            css: css
                        };
                        CommandService.exe(CommandService.ADD_ELEMENT, param);
                    }

                    // end
                }

                // Element를 추가할 위치 찾기
                function _addMousePointEvent(listener) {
                    var scope = $getScope('#hi-contentContainer', 'screenView');
                    var $container = scope.getScreenEventTarget();
                    var eventName = 'mousedown';

                    // 이전 핸들러 해지
                    if (__lastHandler) {
                        _removeMousePointEvent(true);
                    }
                    // 이벤트 새로 등록
                    __lastHandler = angular.bind(this, listener);
                    $container.one(eventName, __lastHandler);

                    // 커서 설정(최초 한번만)
                    if (__oldCursor == null) {
                        __oldCursor = scope.setCursor('cell');
                    }
                }

                function _removeMousePointEvent(keepMessage) {
                    if (!__lastHandler) return;

                    var scope = $getScope('#hi-contentContainer', 'screenView');
                    var $container = scope.getScreenEventTarget();
                    var eventName = 'mousedown';

                    // 커서 되돌림
                    scope.setCursor(__oldCursor);
                    __oldCursor = null;

                    // 이벤트 제거
                    $container.off(eventName, __lastHandler);
                    __lastHandler = null;

                    // 메세지 제거
                    if (__messageObj && !keepMessage) {
                        TalkService.close(__messageObj);
                    }
                }

                ////////////////////////////////////////
                // Presentation
                ////////////////////////////////////////

                function play() {
                    alert('play 구현안됨');
                }

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end _directive
        }


        // 리턴
        _directive._regist = function (application) {
            // 등록
            application.directive('iconView', _directive);
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

