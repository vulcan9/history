/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : command 호출 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [ 'U' ], function( U ) {

        // 선언
        function _service(
            $q, $getScope, $rootScope,
            NewCommand, OpenCommand, SaveCommand, SaveAsCommand, CloseCommand, ExitCommand,
            
            AddDocumentCommand, RemoveDocumentCommand, SelectDocumentCommand, ModifyDocumentCommand, 
            ConfigurationCommand,

            AddElementCommand, RemoveElementCommand, ModifyElementCommand, SelectElementCommand,
            Project, Tool, NoticeService, ProgressService

        ) {

            out( 'Service 등록 : CommandService' );

            function CommandService() {

            }

            out( 'TODO : // 함수 호출 관리 (Command Process 관리)' );
            // this._process = new ProcessQueue();
            // processAdd, processNext, processCancel, _checkProcess

            CommandService.prototype = {

                // const
                // 싱클톤으로 사용되므로 상수도 여기에서 정의해준다
                
                // FILE
                NEW: 'NewCommand',
                OPEN: 'OpenCommand',
                SAVE: 'SaveCommand',
                SAVEAS: 'SaveAsCommand',
                CLOSE: 'CloseCommand',
                EXIT: 'ExitCommand',

                // EDIT
                UNDO: 'UndoCommand',
                REDO: 'RedoCommand',

                // Configuration Application
                CONFIGURATION: 'ConfigurationCommand',

                // DOCUMENT
                ADD_DOCUMENT: 'AddDocumentCommand',
                REMOVE_DOCUMENT: 'RemoveDocumentCommand',
                SELECT_DOCUMENT: 'SelectDocumentCommand',
                MODIFY_DOCUMENT: 'ModifyDocumentCommand',

                // ELEMENT
                ADD_ELEMENT: 'AddElementCommand',
                REMOVE_ELEMENT: 'RemoveElementCommand',
                SELECT_ELEMENT: 'SelectElementCommand',
                MODIFY_ELEMENT: 'ModifyElementCommand',
                
                /*
                CommandService._exe(CommandService.OPEN, param, function callback(isSuccess, result){
                    //
                });
                */

                exe: function (command, param, callback){
                    out('\n# [ ', command, ' ] 명령 실행');

                    if(param === undefined || param === null) param = {};
                    if(typeof param !== 'object') throw new Error('param은 Object 객체여야 합니다.');
                    param._commandState = 'call';

                    this._execute(command, param, function (isSuccess, result){
                        out('# [ ', command, ' ] 명령 실행 종료 : ', isSuccess, ' - ', result);

                        if(callback){
                            callback.apply(null, arguments);
                        }
                    });
                },

                //******************************************************************************
                //
                //
                // 메뉴 Command 실행
                //
                // 
                //******************************************************************************

                _execute: function(commandName, param, resultCallback) {

                    ProgressService.init(true);
                    //var args = U.toArray( arguments );

                    try {

                        var self = this;
                        // command 연결 함수 이름
                        var funcName = param._commandState + '_' + commandName;

                        out( '\n=================================================' );
                        out( ' Macro 생성 : ', commandName, ' --> ', funcName, '\n' );
                        // out( ' resultCallback : ', resultCallback);

                        /*
                        args = [ param ];

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

                        var macroPromise = this[ funcName ].apply( this, [ param ] );
                        if(!macroPromise){
                            out('\n# Command 실행하지 않음');
                            out( '\n=================================================' );
                            ProgressService.complete();
                            return;
                        }

                        // macro = [{command:command, param:param},.....]
                        macroPromise.then( function( macro ) {
                            
                            // Macro 실행
                            out( '\n=================================================' );
                            out('# Macro 실행 : ', arguments);

                            // 삭제 명령인 경우 미리 undoParam을 만들어 놓는다.
                            var undoParam;
                            if(commandName == self.REMOVE_ELEMENT && param._commandState == 'call'){
                                // UNDO 기능을 위해 param을 캡쳐해 놓는다.
                                var commandClass = eval(commandName);
                                if(commandClass && commandClass.getUndoParam){
                                    undoParam = commandClass.getUndoParam(angular.copy(param));
                                }
                            }

                            self._runMacro( macro, function(isSuccess, result){
                                resultCallback.apply( this, [ isSuccess, result ] );

                                if(isSuccess){
                                    // undo, redo를 위해 command 객체 저장
                                    this.registHistory (commandName, param, resultCallback, result, undoParam);
                                }
                            });

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

                _runMacro: function( macro, resultCallback ) {

                    out( '\n----------------------------//start' );
                    
                    // macro 강제 종료
                    var macroCanceled = false;

                    // macro = [{command:command, param:param},.....]
                    var item = macro.shift();
                    var command = item.command;
                    var param = item.param;

                    // args => [param]
                    var callback = angular.bind( this, function( isSuccess, result, isStopPropergation ) {

                        if ( isSuccess == false ) {
                            out( '# command 실행 취소', command );
                            if(isStopPropergation) macroCanceled = true;
                        }

                        out( '----------------------------//end\n' );

                        if ( macro.length < 1 || macroCanceled) {
                            if ( resultCallback ) {

                                out('# Macro 실행 종료');
                                out( '=================================================\n' );

                                ProgressService.complete();
                                resultCallback.apply( this, [ isSuccess, result ] );
                            }
                            return;
                        }

                        // 다음 command 실행
                        this._runMacro( macro, resultCallback );
                    } )

                    out( '# Command 호출 : ', command );
                    command.execute.apply( command, [ param, callback ] );
                },

                //******************************************************************************
                //
                //
                // Undo/Redo 를 위한 History
                //
                //
                //******************************************************************************

                // undo, redo 가능한 Command 임
                /*
                 undo_AddDocumentCommand
                 undo_RemoveDocumentCommand
                 undo_SelectDocumentCommand

                 undo_AddElementCommand
                 undo_RemoveElementCommand
                 undo_ModifyElementCommand
                 undo_SelectElementCommand
                 */

                registHistory: function (commandName, param, callback, result, undoParam){

                    var commandClass = eval(commandName);
                    if(!commandClass || !commandClass.getUndoParam) return;

                    if(param._commandState == 'call'){
                        // UNDO 기능을 위해 param을 캡쳐해 놓는다.
                        undoParam = undoParam || commandClass.getUndoParam(angular.copy(param));
                        undoParam._commandState = 'undo';

                        var redoParam = angular.copy(param);
                        redoParam._commandState = 'redo';

                        var copyedResult = angular.copy(result);

                        var historyItem = {
                            command: commandName,
                            undoParam: undoParam,
                            redoParam: redoParam,
                            callback: callback,
                            result: copyedResult
                        };
                        Tool.current.history().add(historyItem);
                    }

                    // undo, redo일때 dom data에 기록되어 있는 oldHTML은 아직 업데이트가 되지 않은 상태이다.

                    // 변경된 마지막 상태로 oldHTML 업데이트
                    var el = Project.current.getElement(param.documentUID, param.elementUID);
                    Tool.current.history(param.documentUID).setSnapshot(el);
                },

                ////////////////////////////////////////////////////////////////////////////////
                //
                // History Edit 메뉴
                //
                ////////////////////////////////////////////////////////////////////////////////

                call_UndoCommand: function() {
                    if(Tool.current == null) return;
                    var item = Tool.current.history().undo();
                    if(!item) return;

                    var commandName = item.command;
                    var param = item.undoParam;
                    var callback = item.callback;
                    out('# UNDO : ', item);

                    this._execute(commandName, param, function (isSuccess, result){
                        if(callback) callback(isSuccess, result);
                        out('# [ ', commandName, ' ] UNDO 명령 실행 종료 : ', isSuccess, ' - ', result);
                    });
                },

                call_RedoCommand: function() {
                    if(Tool.current == null) return;
                    var item = Tool.current.history().redo();
                    if(!item) return;

                    var commandName = item.command;
                    var param = item.redoParam;
                    var callback = item.callback;
                    out('# REDO : ', item);

                    this._execute(commandName, param, function (isSuccess, result){
                        if(callback) callback(isSuccess, result);
                        out('# [ ', commandName, ' ] REDO 명령 실행 종료 : ', isSuccess, ' - ', result);
                    });
                },

                //******************************************************************************
                //
                //
                // Macro 구성 Command
                //
                // 
                //******************************************************************************

                // deferred.promise를 리턴한다.
                //  then 결과값으로는 Command 배열이 리턴됨

                ////////////////////////////////////////////////////////////////////////////////
                //
                // File 메뉴
                //
                ////////////////////////////////////////////////////////////////////////////////

                call_CloseCommand: function( param ) {
                    var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 저장 체크
                    if ( Tool.current && Tool.current.dataChanged ) {

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
                                    var promise_save = self.call_SaveCommand( param );
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
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // New
                //-----------------------------------

                call_NewCommand: function( param ) {
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 닫기 과정 추가
                    var promise_close = this.call_CloseCommand( param );
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
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // Open
                //-----------------------------------

                call_OpenCommand: function( param ) {
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    if(!param || !param.uid){
                        // var uid = 'b16fea9c-d10a-413b-ba20-08344f937336';
                        // param.uid = uid;
                        $rootScope.go_dashboard();
                        throw new Error('열고자 하는 Project가 지정되지 않았습니다.');
                        return;
                    }

                    // 닫기 과정 추가
                    var promise_close = this.call_CloseCommand( param );
                    promise_close.then( function( macro_close ) {
                        // macro 추가
                        macro = macro.concat( macro_close );
                        resove();

                    }, function(result){
                        deferred.reject(result);

                    } );

                    // 저장하기 취소인 경우 -> 실행 취소
                    
                    function resove() {
                        // 프로젝트 열기
                        var command = new OpenCommand();
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                //-----------------------------------
                // Save
                //-----------------------------------

                call_SaveCommand: function( param ) {

                    if(Project.current == null) return;

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl');
                    if(scope.editableUID) {
                        scope.editableUID = '';
                    }

                    // 저장
                    var command = new SaveCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                //-----------------------------------
                // Save As
                //-----------------------------------

                call_SaveAsCommand: function( param ) {

                    if(Project.current == null) return;

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl');
                    if(scope.editableUID) {
                        scope.editableUID = '';
                    }

                    if(!param || !param.uid){
                        var uid = 'b16fea9c-d10a-413b-ba20-08344f937336';
                        param.uid = uid;
                        out( 'TODO : project 데이터 저장 경로(아이디) 세팅 : ', uid );
                    }
                    
                    // 다른 이름으로 저장
                    var command = new SaveAsCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                //-----------------------------------
                // Exit
                //-----------------------------------

                // 새로고침 또는 창닫기 이벤트에 의한 닫기는 ToolController에 구현되어 있음

                call_ExitCommand: function( param ) {
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 닫기 과정 추가
                    var promise_close = this.call_CloseCommand( param );
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
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );
                        // deferred.reject(failData);
                    }

                    return deferred.promise;
                },

                ////////////////////////////////////////////////////////////////////////////////
                //
                // Edit 메뉴
                //
                ////////////////////////////////////////////////////////////////////////////////

                ////////////////////////////////////////
                // Document
                ////////////////////////////////////////

                call_AddDocumentCommand: function( param ) {
                    
                    if(Project.current == null) return;

                    // 아이디 체크
                    if(param === undefined) param = {};
                    if(param.documentUID === undefined){
                        param.documentUID = Project.current.createDocumentUID();
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 추가
                    var command = new AddDocumentCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },
                
                /*
                var param = {
                    uid : selectUID,
                    option : 'all' | 'only'
                };
                */
                call_RemoveDocumentCommand: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.documentUID === undefined){
                        return null;
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 제거
                    var command = new RemoveDocumentCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                call_SelectDocumentCommand: function( param ) {
                    
                    if(Project.current == null) return;

                    // 아이디 체크
                    if(param === undefined) param = {};
                    if(param.documentUID === undefined){
                        throw '선택할 Document의 uid가 정해지지 않았습니다.';
                        return;
                    }

                    var documentUID = Project.current.getSelectDocument();
                    if(param.documentUID === documentUID) return null;

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    //**********************************************************

                    // 현재 편집 상태라면 먼저 편집 모드 해지하여 ModifyElementCommand를 실행시킨다.
                    var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl');
                    if(scope.editableUID){
                        // scope.editableUID = '';
                        // 여기에서 scope.editableUID 값 변경에 대한 watch코드는 발생하지 않으므로 직접 코드를 호출한다.
                        // digest loop 시간지연때문에 watch코드 실행전 DOM이 제거되기 때문인것 같다.
                        // Document 선택이 변할때 Controller가 초기 실행되면서 editableUID값도 초기화 되지만 oldValue값이 존재하지 않으므로
                        // DOM 상태는 편집모드에서 해지되지 않은 상태로 나타나는 문제가 발생하므로 여기에서 강제로 실행해 준다.

                        // modify command는 여기에서 호출하지 않고 promise로따로 실행 시킨다.
                        var elementUID = scope.editableUID;
                        scope._checkEditable('', elementUID, false);

                        var param_modify = Project.current.getModifyElementParameter (documentUID, elementUID);
                        // var promise_modify = sub_selectCommand();
                        var promise_modify = this.call_ModifyElementCommand(param_modify);
                        promise_modify.then( function( macro_modify ) {
                            // macro 추가
                            macro = macro.concat( macro_modify );
                            resove_modify();

                        }, function(result){
                            deferred.reject(result);

                        } );

                    }else{
                        resove_modify();
                    }

                    //**********************************************************
                    
                    function resove_modify(){
                        var promise = sub_selectCommand();
                        promise.then( function( macro_sub ) {
                            // macro 추가
                            macro = macro.concat( macro_sub );
                            resove_select();

                        }, function(result){
                            deferred.reject(result);

                        } );
                    }

                    function sub_selectCommand(){
                        var macro = [];
                        var deferred = $q.defer();
                        
                        var command = new SelectDocumentCommand();
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );

                        return deferred.promise;
                    }

                    /*
                    // 추가
                    var command = new SelectDocumentCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                    */

                    function resove_select() {
                        // Element 선택 macro 추가
                        var newParam = {
                            documentUID: param.documentUID,
                            elementUID: Project.current.getSelectElement(param.documentUID)
                        };
                        var command = new SelectElementCommand();
                        macro.push( {command:command, param:newParam} );

                        deferred.resolve( macro );
                    }

                    return deferred.promise;
                },

                call_ModifyDocumentCommand: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.documentUID === undefined){
                        return null;
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 수정
                    var command = new ModifyDocumentCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },
                /*
                param = {
                    // option 설정값
                    option: Tool.current.CONFIG
                };
                */
                call_ConfigurationCommand: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.option === undefined){
                        return null;
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 수정
                    var command = new ConfigurationCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },

                ////////////////////////////////////////
                // Element
                ////////////////////////////////////////
                /*
                var param = {
                    
                    // 삽입될 문서
                    documentUID : documentUID || Project.current.getSelectDocument(),
                    
                    // uid가 지정되지 않았으면 command에서 자동 생성됨
                    elementUID: elementUID || Project.current.createElementUID(),
                    type: type,

                    // element 설정값
                    option: {}

                    //----------------------
                    // copy의 경우와 같이 element HTML을 통째로 전달하는 경우 전달 값
                    html: element.outerHTML
                };
                */
                call_AddElementCommand: function( param ) {
                    
                    if(Project.current == null) return;

                    // 삽입할 type이 정해지지 않은 경우
                    if(!param || !param.type) return;

                    // 삽입할 Document
                    if(param.documentUID === undefined){
                        param.documentUID = Project.current.getSelectDocument();
                    }

                    // 아이디 체크
                    if(param.elementUID === undefined){
                        param.elementUID = Project.current.createElementUID();
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    /*
                    // 추가
                    var command = new AddElementCommand();
                    macro.push( command );

                    deferred.resolve( macro );
                    return deferred.promise;
                    */

                    function sub_command(){
                        var macro = [];
                        var deferred = $q.defer();
                        var command = new AddElementCommand();
                        macro.push( {command:command, param:param} );

                        deferred.resolve( macro );
                        return deferred.promise;
                    }

                    var promise = sub_command();

                    //---------------------
                    // 현재 선택 상태의 문서이면 Element 선택 표시
                    //---------------------
                    
                    promise.then( function( macro_sub ) {
                        // macro 추가
                        macro = macro.concat( macro_sub );
                        resove();

                    }, function(result){
                        deferred.reject(result);

                    } );

                    function resove() {
                        // Element 선택 macro 추가
                        var newParam = {
                            documentUID: param.documentUID,
                            elementUID: param.elementUID
                        };
                        var command = new SelectElementCommand();
                        macro.push( {command:command, param:newParam} );

                        deferred.resolve( macro );
                    }

                    return deferred.promise;
                },
                redo_AddElementCommand: function(param){
                    return this.call_AddElementCommand(param);
                },
                undo_AddElementCommand: function(param){
                    return this.call_RemoveElementCommand(param);
                },

                /*
                var param = {
                    documentUID: Project.current.getSelectDocument(),
                    elementUID: Project.current.getSelectElement()
                };
                */
                call_RemoveElementCommand: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.elementUID === undefined){
                        return null;
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 선택 상태이면 선택 취소 과정 추가
                    var elementUID = Project.current.getSelectElement();
                    if(param.elementUID === elementUID){

                        var promise_select = sub_command_unselect();
                        promise_select.then( function( macro_select ) {
                            // macro 추가
                            macro = macro.concat( macro_select );
                            resove();

                        }, function(result){
                            deferred.reject(result);

                        });

                    }else{
                        resove();
                    }
                    
                    function sub_command_unselect(){
                        var newMacro = [];
                        var deferred = $q.defer();

                        // Element 선택
                        var param = {
                            documentUID: Project.current.getSelectDocument(),
                            elementUID: ''
                        };
                        var command = new SelectElementCommand();
                        newMacro.push( {command:command, param:param} );

                        deferred.resolve( newMacro );
                        return deferred.promise;
                    }

                    // 취소인 경우 -> 실행 취소
                    function resove() {
                        // 제거
                        var command = new RemoveElementCommand();
                        macro.push( {command:command, param:param} );
                        deferred.resolve( macro );
                    }

                    return deferred.promise;
                },
                redo_RemoveElementCommand: function(param){
                    return this.call_RemoveElementCommand(param);
                },
                undo_RemoveElementCommand: function(param){
                    return this.call_AddElementCommand(param);
                },

                call_ModifyElementCommand: function( param ) {

                    if(Project.current == null) return;

                    // 아이디 체크
                    if(!param || param.elementUID === undefined){
                        return null;
                    }

                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // 수정
                    var command = new ModifyElementCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },
                redo_ModifyElementCommand: function(param){
                    return this.call_ModifyElementCommand(param);
                },
                undo_ModifyElementCommand: function(param){
                    return this.call_ModifyElementCommand(param);
                },
                
                /*
                var param = {
                    documentUID: Project.current.getSelectDocument(),
                    elementUID: Project.current.getSelectElement()
                };
                */
                call_SelectElementCommand: function( param ) {
                    
                    if(Project.current == null) return;

                    // 아이디 체크
                    if(param === undefined) param = {};
                    if(param.elementUID === undefined){
                        throw '선택할 Document의 uid가 정해지지 않았습니다.';
                        return;
                    }

                    var elementUID = Project.current.getSelectElement();
                    if(param.elementUID === elementUID) return null;

                    param.oldSelectUID = elementUID;

                    //**********************************************************

                    // 현재 편집 상태라면 선택해지는 시키지 않는다.
                    out('// 편집 모드만 해지 - 선택해지는 실행하지 않음');
                    var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                    if(scope.editableUID && scope.editableUID == elementUID){
                        scope.editableUID = '';
                        return null;
                    }

                    //**********************************************************
                    
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    // Element 선택
                    var command = new SelectElementCommand();
                    macro.push( {command:command, param:param} );

                    deferred.resolve( macro );
                    return deferred.promise;
                },
                redo_SelectElementCommand: function(param){
                    return this.call_SelectElementCommand(param);
                },
                undo_SelectElementCommand: function(param){
                    return this.call_SelectElementCommand(param);
                },

                ////////////////////////////////////////////////////////////////////////////////
                //
                // View 메뉴
                //
                ////////////////////////////////////////////////////////////////////////////////

                call_PlayCommand: function( param ) {
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    out('TODO : 아직 구현 안됨');

                    return deferred.promise;
                },

                call_EditCommand: function( param ) {
                    // var self = this;
                    var macro = [];
                    var deferred = $q.defer();

                    out('TODO : 아직 구현 안됨');

                    return deferred.promise;
                }

                // _service end
            };

            // 서비스 객체 리턴
            return new CommandService();
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'CommandService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);