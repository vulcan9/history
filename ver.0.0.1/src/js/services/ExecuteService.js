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

            out('TODO : // 함수 호출 관리 (Command Process 관리)');
            // this._process = new ProcessQueue();
            // processAdd, processNext, processCancel, _checkProcess

            ExecuteService.prototype = {

                
                // const
                // 싱클톤으로 사용되므로 상수도 여기에서 정의해준다
                NEW : 'new',
                OPEN : 'open',
                SAVE : 'save',
                SAVEAS : 'saveAs',
                CLOSE : 'close',
                EXIT : 'exit',

                ////////////////////////////////////////
                //
                // 메뉴 Command 실행
                // 
                ////////////////////////////////////////
                
                /*
                ExecuteService.execute(ExecuteService.OPEN, param, function callback(isSuccess, result){

                });
                */

                execute : function (){

                    var args = U.toArray(arguments);

                    // command 연결 함수 이름
                    var commandName = args.shift();
                    var funcName = 'command_' + commandName;

                    // 결과 콜백 함수
                    var param = args.shift();
                    var resultCallback = args.shift();

                    try{

                        out('\n=================================================');
                        out(' Macro 생성 : ', commandName, ' --> ', funcName);
                        
                        args = [ param ];
                        // args.push(angular.bind(this, commandCallback));
                        var macro = this[funcName].apply(this, [param]);

                        // macro를 콜백함수 체인으로 연결하여 실행
                        // command.execute.apply(command, args);
                        
                        this._runMacro(macro, param, resultCallback);

                    }
                    catch(err){

                        out('TODO //실행 에러 : [', funcName, ']', err);
                        resultCallback(false, err);
                    }
                },

                _runMacro : function(macro, param, resultCallback){
                        
                        out('\n----------------------------//start');

                        // args => [param]
                        var callback = angular.bind(this, function (isSuccess, result){

                            if(isSuccess){
                                out('TODO : // undo, redo를 위해 command 객체 저장 : ', command);
                            }else{
                                out('TODO : // command 실행 취소', command);
                            }

                            out('----------------------------//end\n');

                            if(macro.length < 1){
                                if(resultCallback){
                                    resultCallback.apply(this, [isSuccess, result]);
                                    out('=================================================\n');
                                }
                                return;
                            }

                            // 다음 command 실행
                            this._runMacro(macro, param, resultCallback);
                        })
                        
                        var command = macro.shift();
                        out('# 실행 : ', command);
                        command.execute.apply(command, [param, callback]);
                },

                ////////////////////////////////////////
                // File 메뉴
                ////////////////////////////////////////
                
                command_close : function (param){
                    var macro = [];

                    // 저장 체크
                    
                    // 닫기
                    var command = new CloseCommand();
                    macro.push(command);

                    return macro;
                },

                command_new : function (param){

                    // 닫기
                    var macro = this.command_close(param);
                    
                    // 새 프로젝트
                    var command = new NewCommand();
                    macro.push(command);

                    return macro;
                },

                //-----------------------------------
                // Open
                //-----------------------------------

                command_open : function (param){

                    //닫기
                    var macro = this.command_close(param);

                    // 불러오기
                    var command = new OpenCommand();
                    macro.push(command);

                    return macro;
                },

                command_save : function (param){
                    var macro = [];
                    
                    // 저장
                    var command = new SaveCommand();
                    macro.push(command);

                    return macro;
                },

                command_saveAs : function (param){
                    var macro = [];
                    
                    // 다른 이름으로 저장
                    var command = new SaveAsCommand();
                    macro.push(command);

                    return macro;
                },

                command_exit : function (param){
                    
                    // 닫기
                    var macro = this.command_close(param);
                    
                    // 종료
                    var command = new ExitCommand();
                    macro.push(command);

                    return macro;
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

