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
        application.directive( 'menu', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            var config = {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'menu.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: false,

                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: Controller

                // end config
            };

            return config;

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs, $rootScope, OpenCommand ) {
                
                // ToolController 에서 데이터 로드 후 지정해줌
                // $scope.menu = Project.current.TOOL.menu;

                /*
                $scope.$watch( 'menu', function(newValue, oldValue) {
                    out('update menu : ', arguments);
                    $scope.menu = Project.current.TOOL.menu;
                }, true);
                */
                
                $scope.onClick = function(item){
                    console.log(" * item : ", item);
                    
                    // 링크
                    var link = item.link;
                    if(link){
                        //out('* link : ', link);
                        $location.path(link);
                        return;
                    }

                    var command = item.command;
                    execute(command);
                };


                ////////////////////////////////////////
                //
                // 메뉴 Command 실행
                // 
                ////////////////////////////////////////
                
                function execute(command){

                    var func = 'command_' + command;
                    out('실행 : ', command, ' --> ', func);
                    
                    try{
                        //$scope.$eval(func).apply();
                        var command = eval(func).apply();

                        out('TODO : // undo, redo를 위해 command 객체 저장 : ', command);

                    }catch(err){
                        out('TODO //실행 에러 : ', func);
                    }
                }

                ////////////////////////////////////////
                // File 메뉴
                ////////////////////////////////////////
                
                function command_new(){
                    out('TODO : # command_new 실행');
                }

                function command_open(){
                    var command = new OpenCommand();
                    command.execute()
                    out('TODO : # command_open 실행' );

                    return command;
                }

                function command_save(){
                    out('TODO : # command_save 실행');
                }

                function command_saveAs(){
                    out('TODO : # command_saveAs 실행');
                }

                function command_close(){
                    out('TODO : # command_close 실행');
                }

                function command_exit(){
                    out('TODO : # command_exit 실행');
                }

                ////////////////////////////////////////
                // Edit 메뉴
                ////////////////////////////////////////
                

                ////////////////////////////////////////
                // View 메뉴
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