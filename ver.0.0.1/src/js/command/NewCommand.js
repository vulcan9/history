/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'NewCommand', _service );

        // 선언
        function _service(Command, ProgressService, Tool, DataService, $timeout) {

            out( 'Command 등록 : NewCommand' );

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function NewCommand() {

                _superClass.apply(this, arguments);
                out( '# NewCommand : ', this);

            }

            // Prototype 상속
            angular.extend( NewCommand.prototype,  Command.prototype, {

                /*
                config = {
                    scope : $scope, 
                    element : $element, 
                    attrs : $attrs,
                    ...............
                }
                */
               
                execute : function ( config, successCallback, errorCallback ) {

                    _super.execute.apply(this, arguments);

                    // Override
                    out( '# NewCommand Execute' );

                    // ProgressService.init (true);
                    //ProgressService.init(null);
                    //ProgressService.update(60);
                    
                    
                    alert('tool 관련 데이터는 ToolController에서 처음 한번만 생성하는걸로.....');
                    if(!Tool.current){
                        Tool.current = new Tool();
                    }


                    Project.current = new Project();


                    

                    ////////////////////////////////////////
                    // 메뉴 설정 데이터 로드
                    ////////////////////////////////////////
                    
                    var menuURL = _PATH.ROOT + 'data/menu.json';
                    DataService(
                        {
                            method : 'GET', 
                            url : menuURL
                        },

                        function success(data){

                            Tool.current.tool ('MENU', data);

                            out ('# Menu 로드 완료 : ', data);
                            // ProgressService.complete();
                            
                            var $scope = config.scope;
                            $scope.menu = Tool.current.tool('MENU');

                            /*
                            // 갱신
                            $timeout(function() {
                                $scope.$apply(function(){
                                    
                                    // out('menu callLater', Tool.current.tool('MENU'));
                                    // out('menu callLater', Tool.current.tool('menu')('items'));

                                    $scope.menu = Tool.current.tool('MENU');
                                    // out('project callLater', $scope);
                                });
                            }, 0);
                            */
                           
                        },

                        function error(){

                            Tool.current.tool ('menu', null);

                            // preventDefault
                            //return false;
                            
                            out ('# Menu 로드 에러 : ', menuURL);
                            // ProgressService.complete();
                        }
                    );












                    // END Execute
                }
            });







            // 서비스 객체 리턴
            return NewCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
