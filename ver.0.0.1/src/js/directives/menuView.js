/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'menuView', _directive );

        // 선언
        function _directive(HttpService, $location, CommandService, Tool) {

            //out( 'version' );

            var config = {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/menuView.html',
                
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
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs ) {
                
                //------------------
                // 데이터 변경 감지 순서
                //------------------

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Tool.changed-MENU', function(e, data){
                    out(data.name, '#Tool.changed-MENU : ', arguments);
                    self.updateMenu();
                });

                // 2. 변경 내용을 scope에 적용한다.
                this.updateMenu = function(){
                    $scope.menu = Tool.current.tool('MENU');
                }
                
                /*
                // 3. scope이 변경되었음을 감지한다.
                // 메뉴 설정 : 데이터가 있으면 다시 로드하지 않음
                $scope.$watch('menu', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('#menu changed : ', $scope.menu);
                }, true);
                */

                ////////////////////////////////////////
                // 메뉴 설정 데이터 로드
                ////////////////////////////////////////
                
                this.setMenu = function (){

                    var menuURL = _PATH.ROOT + 'data/menu.json';
                    

                    var promise = HttpService.load( {
                            method: 'GET',
                            url: menuURL
                        } )
                        .then( success, error );

                    function success(data){

                        out ('# Menu 로드 완료 : ', data);
                        // ProgressService.complete();
                        
                        // 데이터 변경
                        Tool.current.tool ('MENU', data);
                    }

                    function error(){

                        Tool.current.tool ('MENU', null);

                        // preventDefault
                        //return false;
                        
                        out ('# Menu 로드 에러 : ', menuURL);
                        // ProgressService.complete();
                    }

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
            
            function Link( $scope, $element, $attrs, controller) {

                // 데이터 로드
                if (Tool.current.TOOL.MENU == undefined){
                    controller.setMenu();
                }

                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.onClick = function(item){
                    out(' * MENU item : ', item);
                    
                    // 링크
                    var link = item.link;
                    if(link){
                        //out('* link : ', link);
                        $location.path(link);
                        return;
                    }

                    // 메뉴 클릭 이벤트 처리
                    var command = item.command;
                    var param = {};
                    CommandService.exe(command, param);
                    
                };

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end _directive
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);


/*
데이터 샘플
{
    "version": "0.0.1",
    "description": "생성된 프리젠테이션 리스트 (기존 문서로 여러개의 프레젠테이션을 구성할 수 있다.)",
    
    "items": [

        {
            "label": "Home", 
            "link":"http://localhost/history/ver.0.0.1/src", 
            "command":""
        },

        {
            "label": "File", 
            "link":"", "command":"file",
            "menus":[
                {"label": "New", "link":"", "command":"new"},
                {"label": "Open", "link":"", "command":"open"},
                {"label": "Save", "link":"", "command":"save"},
                {"label": "Save As", "link":"", "command":"saveAs"},
                {"label": "Close", "link":"", "command":"close"},
                {"label": "Exit", "link":"", "command":"exit"}
            ]
        },
        {
            "label": "Edit", 
            "link":"", "command":"edit",
            "menus":[
                {"label": "undo", "link":"", "command":"undo"},
                {"label": "redo", "link":"", "command":"redo"},
                {"label": "copy", "link":"", "command":"copy"},
                {"label": "cut", "link":"", "command":"cut"},
                {"label": "paste", "link":"", "command":"paste"},

                {"class":"divider"},

                {"class":"dropdown-header", "label": "Document"},
                {"label": "(임시) addDocument", "link":"", "command":"addDocument"},
                {"label": "(임시) removeDocument", "link":"", "command":"removeDocument"}

            ]
        },
        {
            "label": "View", 
            "link":"", "command":"view",
            "menus":[
                {"label": "List", "link":"", "command":"list"},
                {"label": "Property", "link":"", "command":"prooperty"},
                {"label": "Timeline", "link":"", "command":"timeline"},
                {"label": "Activity", "link":"", "command":"activity"},
                {"label": "Item", "link":"", "command":"item"},
                {"label": "Schedule", "link":"", "command":"schedule"}
            ]
        },


        
        {
            "label": "admin url 테스트", 
            "link":"#admin", 
            "command":""
        }

    ]

}
*/
