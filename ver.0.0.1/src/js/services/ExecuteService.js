/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : service 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.service( 'ExecuteService', _service );

        // 선언
        function _service(

            // Injection
            NewCommand, OpenCommand, SaveCommand, SaveAsCommand, CloseCommand, ExitCommand

            ) {

            out( 'ExecuteService 등록 : ' );

            function ExecuteService(){

            }

            ExecuteService.prototype = {

                ////////////////////////////////////////
                //
                // 메뉴 Command 실행
                // 
                ////////////////////////////////////////
                
                 execute : function (){

                    var args = U.toArray(arguments);
                    var commandName = args.shift();
                    var func = 'command_' + commandName;

                    out('실행 : ', commandName, ' --> ', func);
                    
                    try{
                        //$scope.$eval(func).apply();
                        // var command = eval(func).apply();
                        var command = this[func].apply(this, args);

                        out('TODO : // undo, redo를 위해 command 객체 저장 : ', command);

                    }catch(err){
                        out('TODO //실행 에러 : ', func);
                        out(err);
                    }
                },

                ////////////////////////////////////////
                // File 메뉴
                ////////////////////////////////////////
                
                command_new : function (){
                    // 닫기
                    
                    // 새 프로젝트
                    var command = new NewCommand();
                    command.execute.apply(this, arguments);

                    return command;
                },

                //-----------------------------------
                // Open
                //-----------------------------------

                command_open : function (){
                    //닫기
                    
                    // 불러오기
                    var command = new OpenCommand();
                    command.execute.apply(this, arguments);

                    return command;
                },

                command_save : function (){
                    var command = new SaveCommand();
                    command.execute.apply(this, arguments);

                    return command;
                },

                command_saveAs : function (){
                    var command = new SaveAsCommand();
                    command.execute.apply(this, arguments);

                    return command;
                },

                command_close : function (){
                    // 저장 체크
                    
                    // 닫기
                    var command = new CloseCommand();
                    command.execute.apply(this, arguments);

                    return command;
                },

                command_exit : function (){
                    // 닫기
                    
                    var command = new ExitCommand();
                    command.execute.apply(this, arguments);

                    return command;
                }

                ////////////////////////////////////////
                // Edit 메뉴
                ////////////////////////////////////////
                

                ////////////////////////////////////////
                // View 메뉴
                ////////////////////////////////////////
                
            };

            // 서비스 객체 리턴
            return new ExecuteService();
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

