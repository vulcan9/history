/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.directive( 'iconView', _directive );

        // 선언
        function _directive() {

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
                controller: Controller

                // end config
            };

            return config;

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs, $location, CommandService, Tool, HttpService, $timeout ) {

                //------------------
                // 데이터 변경 감지 순서
                //------------------

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Tool.changed-MENU', function(e, data){
                    if(data.name == 'MENU'){
                        out(data.name, '#Tool.changed-MENU : ', arguments);
                        //self.updateMenu();

                        if (Tool.current.TOOL.MENU == undefined){
                            out('TODO : MENU 버튼 비활성화');
                        }else{
                            out('TODO : MENU 버튼 활성화');
                        }
                    }
                });
                
                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.callAPI = function(){
                    
                    var arg = U.toArray(arguments);
                    var funcName = arg.shift();
                    out(' * MENU item : ', funcName);

                    if(funcName){
                        eval(funcName).apply(null, arg);
                    }

                };

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 메뉴 명령 실행
                //
                ////////////////////////////////////////////////////////////////////////////////

                ////////////////////////////////////////
                // Project
                ////////////////////////////////////////

                function newProject (){
                    CommandService.exe(CommandService.NEW, {});
                }

                function openProject (){
                    CommandService.exe(CommandService.OPEN, {});
                }

                function saveProject (){
                    CommandService.exe(CommandService.SAVE, {});
                }

                ////////////////////////////////////////
                // 편집
                ////////////////////////////////////////

                function undo(){
                    CommandService.exe(CommandService.UNDO, {});
                }

                function redo(){
                    CommandService.exe(CommandService.REDO, {});
                }

                ////////////////////////////////////////
                // Document
                ////////////////////////////////////////

                // Document 추가 
                // option : 'next', 'sub', 'prev'
                function addDocument (option, uid){

                    if(Project.current == null) return;
                    
                    // command 호출
                    var param = {
                        //document : null,
                        option: {
                            position: option,
                            selectUID: uid || Project.current.getSelectDocument()
                        }
                    };

                    CommandService.exe(CommandService.ADD_DOCUMENT, param);
                }

                ////////////////////////////////////////
                // Element
                ////////////////////////////////////////
                
                function addElement (type){

                    if(Project.current == null) return;
                    /*
                    switch(type){
                        case 'text':
                        break;

                        case 'image':
                        break;
                    }
                    */
                    var param = {
                        //document : null,
                        option: {
                            // uid: uid,
                            type: type
                        }
                    };
                    CommandService.exe(CommandService.ADD_ELEMENT, param);
                }

                ////////////////////////////////////////
                // Presentation
                ////////////////////////////////////////

                function play(){
                    alert('play 구현안됨');
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

