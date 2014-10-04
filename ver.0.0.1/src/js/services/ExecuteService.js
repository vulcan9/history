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
            $q,
            NewCommand, OpenCommand, SaveCommand, SaveAsCommand, CloseCommand, ExitCommand,
            Tool, NoticeService, ProgressService

        ) {

            out( 'ExecuteService 등록 : ' );

            function ExecuteService() {

            }

            out( 'TODO : // 함수 호출 관리 (Command Process 관리)' );
            // this._process = new ProcessQueue();
            // processAdd, processNext, processCancel, _checkProcess

            ExecuteService.prototype = {


                // const
                // 싱클톤으로 사용되므로 상수도 여기에서 정의해준다
                NEW: 'new',
                OPEN: 'open',
                SAVE: 'save',
                SAVEAS: 'saveAs',
                CLOSE: 'close',
                EXIT: 'exit',

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 메뉴 Command 실행
                // 
                ////////////////////////////////////////////////////////////////////////////////

                /*
                ExecuteService.execute(ExecuteService.OPEN, param, function callback(isSuccess, result){

                });
                */

                execute: function() {

                    ProgressService.init(true);

                    var args = U.toArray( arguments );

                    // command 연결 함수 이름
                    var commandName = args.shift();
                    var funcName = 'command_' + commandName;

                    // 결과 콜백 함수
                    var param = args.shift();
                    var resultCallback = args.shift();

                    try {

                        out( '\n=================================================' );
                        out( ' Macro 생성 : ', commandName, ' --> ', funcName, '\n' );

                        args = [ param ];

                        /*
                        1차 개발 완료 : [동기 코드]
                        // args.push(angular.bind(this, commandCallback));
                        var macro = this[ funcName ].apply( this, [ param ] );
                        // macro를 콜백함수 체인으로 연결하여 실행
                        // command.execute.apply(command, args);
                        this._runMacro( macro, param, resultCallback );
                        */

                        /*
                        // 2차 defer 개발 : [비동기 코드]
                        // defer간 순서가 뒤바뀔수도 있는거 같아 기존 callback 로직을 이용하기로 함
                        // macro : Command 계열 클래스 Array
                        var commandMacro = [];
                        angular.forEach(macro, function(command) {
                            // out('==> ', command);
                            var callback = angular.bind( this, function( isSuccess, result ) {
                                out( '----------------------------//end\n' );
                                return true;
                            });

                            var commandPromise = command.execute.apply( command, [ param, callback ] );
                            commandMacro.push(commandPromise);
                        });

                        $q.all(commandMacro).then( function(macro) {
                            out( 'deferred last : ', arguments );
                            out( '=================================================\n' );
                        } );
                        */
                        
                        var self = this;
                        var macroPromise = this[ funcName ].apply( this, [ param ] );
                        macroPromise.then( function( macro ) {
                            
                            // Macro 실행
                            out( '\n=================================================' );
                            out('# Macro 실행 : ', arguments);

                            self._runMacro( macro, param, resultCallback );

                        }, function(){

                            out('\n# Macro 실행 취소 : ', arguments);
                            out( '\n=================================================' );
                            ProgressService.complete();

                        } );

                    } catch ( err ) {

                        out( '# 실행 에러 : [', funcName, ']', err );
                        ProgressService.complete();
                        resultCallback( false, err );
                    }
                },

                _runMacro: function( macro, param, resultCallback ) {

                    out( '\n----------------------------//start' );

                    // args => [param]
                    var callback = angular.bind( this, function( isSuccess, result ) {

                        if ( isSuccess ) {
                            out( 'TODO : // undo, redo를 위해 command 객체 저장 : ', command );
                        } else {
                            out( 'TODO : // command 실행 취소', command );
                        }

                        out( '----------------------------//end\n' );

                        if ( macro.length < 1 ) {
                            if ( resultCallback ) {
                                
                                out('# Macro 실행 종료');
                                out( '=================================================\n' );

                                ProgressService.complete();
                                resultCallback.apply( this, [ isSuccess, result ] );
                            }
                            return;
                        }

                        // 다음 command 실행
                        this._runMacro( macro, param, resultCallback );
                    } )

                    var command = macro.shift();
                    out( '# Command 호출 : ', command );
                    command.execute.apply( command, [ param, callback ] );
                },

                ////////////////////////////////////////////////////////////////////////////////
                //
                // Macro 구성 Command
                // 
                ////////////////////////////////////////////////////////////////////////////////

                // deferred.promise를 리턴한다.
                //  then 결과값으로는 Command 배열이 리턴됨

                ////////////////////////////////////////
                // File 메뉴
                ////////////////////////////////////////

                command_close: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 저장 체크
                    Tool.current.dataChanged = true;

                    if ( Tool.current.dataChanged ) {

                        var config = {
                            title: '저장',
                            content: '<span>저장되지 않은 데이터가 있습니다. 저장하시겠습니까?</span>',
                            buttons: ['예', '아니오', '취소']
                            // templateUrl: _PATH.TEMPLATE + 'popup/notice.html'
                        };
                        var callback = {
                            closed: function( result, element, scope ) {
                                // result : -1:cancel, 1:yes, 0:no
                                if ( result > 0 ) {
                                    // 저장 과정 추가
                                    var promise_save = self.command_save( param );
                                    promise_save.then( function( macro_save ) {
                                        // macro 추가
                                        macro = macro.concat( macro_save );
                                        resove();
                                    } );

                                }else if(result < 0){
                                    deferred.reject(result);

                                }else{
                                    resove();
                                }
                            }
                        };
                        NoticeService.open( config, callback );

                    } else {

                        resove();
                    }

                    function resove() {
                        // 닫기
                        var command = new CloseCommand();
                        macro.push( command );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // New
                //-----------------------------------

                command_new: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 닫기 과정 추가
                    var promise_close = this.command_close( param );
                    promise_close.then( function( macro_close ) {
                        // macro 추가
                        macro = macro.concat( macro_close );
                        resove();

                    }, function(result){
                        deferred.reject(result);

                    } );

                    // 저장하기 취소인 경우 -> 실행 취소

                    function resove() {
                        // 새 프로젝트
                        var command = new NewCommand();
                        macro.push( command );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // Open
                //-----------------------------------

                command_open: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 닫기 과정 추가
                    var promise_close = this.command_close( param );
                    promise_close.then( function( macro_close ) {
                        // macro 추가
                        macro = macro.concat( macro_close );
                        resove();

                    }, function(result){
                        deferred.reject(result);

                    } );

                    // 저장하기 취소인 경우 -> 실행 취소

                    function resove() {
                        // 새 프로젝트
                        var command = new OpenCommand();
                        macro.push( command );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // Save
                //-----------------------------------

                command_save: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 저장
                    var command = new SaveCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                //-----------------------------------
                // Save As
                //-----------------------------------

                command_saveAs: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 다른 이름으로 저장
                    var command = new SaveAsCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                //-----------------------------------
                // Exit
                //-----------------------------------

                // 새로고침 또는 창닫기 이벤트에 의한 닫기는 ToolController에 구현되어 있음

                command_exit: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 닫기 과정 추가
                    var promise_close = this.command_close( param );
                    promise_close.then( function( macro_close ) {
                        // macro 추가
                        macro = macro.concat( macro_close );
                        resove();

                    }, function(result){
                        deferred.reject(result);

                    } );

                    // 저장하기 취소인 경우 -> 실행 취소

                    function resove() {
                        // 종료
                        var command = new ExitCommand();
                        macro.push( command );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
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