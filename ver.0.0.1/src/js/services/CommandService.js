/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : command 호출 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.service( 'CommandService', _service );

        // 선언
        function _service(
            $q,
            NewCommand, OpenCommand, SaveCommand, SaveAsCommand, CloseCommand, ExitCommand,
            AddDocumentCommand, RemoveDocumentCommand, ModifyDocumentCommand, SelectDocumentCommand,
            Tool, NoticeService, ProgressService

        ) {

            out( 'CommandService 등록 : ' );

            function CommandService() {

            }

            out( 'TODO : // 함수 호출 관리 (Command Process 관리)' );
            // this._process = new ProcessQueue();
            // processAdd, processNext, processCancel, _checkProcess

            CommandService.prototype = {


                // const
                // 싱클톤으로 사용되므로 상수도 여기에서 정의해준다
                NEW: 'new',
                OPEN: 'open',
                SAVE: 'save',
                SAVEAS: 'saveAs',
                CLOSE: 'close',
                EXIT: 'exit',

                UNDO: 'undo',
                REDO: 'redo',

                ADD_DOCUMENT: 'addDocument',
                REMOVE_DOCUMENT: 'removeDocument',
                MODIFY_DOCUMENT: 'modifyDocument',
                SELECT_DOCUMENT: 'selectDocument',

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 메뉴 Command 실행
                // 
                ////////////////////////////////////////////////////////////////////////////////

                /*
                CommandService.execute(CommandService.OPEN, param, function callback(isSuccess, result){

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
                        if(!macroPromise){
                            out('\n# Command 실행하지 않음');
                            out( '\n=================================================' );
                            ProgressService.complete();
                            return;
                        }

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
                    
                    // macro 강제 종료
                    var macroCanceled = false;

                    // args => [param]
                    var callback = angular.bind( this, function( isSuccess, result, isStopPropergation ) {

                        if ( isSuccess ) {
                            out( 'TODO : // undo, redo를 위해 command 객체 저장 : ', command );
                        } else {
                            out( '# command 실행 취소', command );
                            if(isStopPropergation) macroCanceled = true;
                        }

                        out( '----------------------------//end\n' );

                        if ( macro.length < 1 || macroCanceled) {
                            if ( resultCallback ) {
                                
                                out('TODO : 화면 랜더링 타임을 늦춘다. (데이터가 바뀌는 이벤트 시점을 명령 종료 시점으로 늦춘다.)');

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
                    // Tool.current.dataChanged = true;

                    if ( Tool.current.dataChanged ) {

                        var config = {
                            title: '저장',
                            content: '<span>저장되지 않은 데이터가 있습니다. 저장하시겠습니까?</span>',
                            // backdrop: false,
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

                    if(!param || !param.uid){
                        var uid = 'b16fea9c-d10a-413b-ba20-08344f937336';
                        param.uid = uid;
                        alert( 'TODO : project 데이터 로드 경로(아이디) 세팅 : ' + uid );
                    }

                    // 닫기 과정 추가
                    var promise_new = this.command_new( param );
                    promise_new.then( function( macro_new ) {
                        // macro 추가
                        macro = macro.concat( macro_new );
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

                    if(Project.current == null) return;

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

                    if(Project.current == null) return;

                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    if(!param || !param.uid){
                        var uid = 'b16fea9c-d10a-413b-ba20-08344f937336';
                        param.uid = uid;
                        out( 'TODO : project 데이터 저장 경로(아이디) 세팅 : ', uid );
                    }
                    
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
                },

                ////////////////////////////////////////
                // Edit 메뉴
                ////////////////////////////////////////

                command_undo: function( param ) {
                    alert('command_undo');
                    //if(Project.current == null) return;
                },

                command_redo: function( param ) {
                    alert('command_redo');
                    //if(Project.current == null) return;
                },

                //-----------------------------------
                // Document
                //-----------------------------------

                command_selectDocument: function( param ) {
                    
                    if(Project.current == null) return;

                    // 아이디 체크
                    if(param === undefined) param = {};
                    if(param.uid === undefined){
                        throw '선택할 Document의 uid가 정해지지 않았습니다.';
                        return;
                    }

                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 추가
                    var command = new SelectDocumentCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                command_addDocument: function( param ) {
                    
                    if(Project.current == null) return;

                    // 아이디 체크
                    if(param === undefined) param = {};
                    if(param.uid === undefined){
                        param.uid = U.createUID();
                    }

                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 추가
                    var command = new AddDocumentCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                command_removeDocument: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.uid === undefined){
                        return null;
                    }

                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 제거
                    var command = new RemoveDocumentCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                command_modifyDocument: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.uid === undefined){
                        return null;
                    }

                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 수정
                    var command = new ModifyDocumentCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                },











































                ////////////////////////////////////////
                // View 메뉴
                ////////////////////////////////////////

                command_play: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    out('TODO : 아직 구현 안됨');

                    return deferred.promise;
                },

                command_edit: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    out('TODO : 아직 구현 안됨');

                    return deferred.promise;
                }

            };

            // 서비스 객체 리턴
            return new CommandService();
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);