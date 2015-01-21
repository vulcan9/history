/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 저장 하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [
        'U',
        'text!' + _PATH.TEMPLATE + 'popup/contentTemplate.html'
    ], function(U, contentTemplate) {



        // 선언
        function _service( Command, Tool, NoticeService, HttpService, $q, $http, ProcessService, Project, AuthService ) {

            out( 'Command 등록 : SaveCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SaveCommand() {

                _superClass.apply( this, arguments );
                out( '# SaveCommand : ', this );

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SaveCommand.prototype, _super, {

                _run: function( param ) {

                    // Override
                    out( '# SaveCommand Execute' );

                    out( 'TODO : // SaveCommand 실행' );

                    var self = this;

                    // 결과 리턴
                    // _super._run.apply(this, arguments);

                    /*
                    $timeout( function() {
                        self._success.apply(self, [param]);
                        // self._error.apply(self, [param]);
                        // self._error();
                    }, 2000 );
                    */

                    //**********************************************
                    
                    // 로컬 저장 또는 서버 전송 구현
                    // if(window._SAVE_LOCAL){
                    //     this.saveLocal();
                    // }else{
                    //     this.saveServer();
                    // }

                    // 저장 대상 객체
                    // Tool.current.TOOL.CONFIG
                    // Tool.current.document().value('dataChanged') == true 인 경우 저장한 후
                    // Tool.current.document().value('dataChanged', false);로 값 변경

                    if(!AuthService.session || !AuthService.session.id){
                        throw new Error('로그인 session 정보가 없습니다.');
                        return;
                    }

                    if(Tool.current.dataChanged == false){
                        out('* 데이터 변경 검사 : 저장할 데이터 없음');
                        self._success.apply(self, [param]);
                        return;
                    }

                    out('* 데이터 변경 검사 : 저장 Process 실행');

                    var errorList = [];
                    var process = ProcessService.process();

                    process.start().then(function(){
                        out('* process started');
                    });

                    save_tool(process);
                    save_project(process);
                    save_document(process);

                    process.end().then(function(){
                        out('* process ended');
                        checkError(errorList);
                    });

                    // 에러 발생했는지 체크 후 Save 과정 종료
                    function checkError(errorList){
                        if(!errorList || errorList.length < 1){
                            self._success.apply(self, [param]);
                            return;
                        }

                        /*
                            {
                                error: status,
                                result: result,
                                uid: uid
                            }
                        */

                        var $template = angular.element(contentTemplate);
                        var content = U.getTemplate('#save_error_popup', $template);

                        // DB 저장시 error가 발생함
                        var config = {
                            title: '에러',
                            content: content,
                            isHTML: true,
                            buttons: ['확인'], //['예', '아니오', '취소'],
                        };
                        
                        var callback = {
                            opened: function( element, scope ) {
                                scope.message = '저장 도중 다음 오류가 발생 하였습니다. 에러 코드를 확인 후 다시 시도해 주세요.';
                                scope.errorList = errorList;
                            },
                            closed: function( result, element, scope ) {
                                // result : -1:cancel, 1:yes, 0:no
                                self._error.apply(self, [param]);
                            }
                        };

                        // 팝업창 띄우기
                        var popup = NoticeService.open( config, callback );
                    }

                    function callServer(defer, config, callSuccess, callError){
                        out('\n\n--------------------------------');
                        out('* 서버 요청 : ', config.request);

                        var uid = config.uid;

                        var promise = $http( config.request )
                            .success( success )
                            .error( error );

                        function success( result, status, headers, req ) {
                            //out( 'success : ', req.data );
                            out( '* success : [', status, '] ', result );
                            out ('# 저장 완료 : ', uid);

                            if(callSuccess) callSuccess(result);

                            defer.resolve({
                                success: status,
                                message: HttpService.statuscode[status],
                                result: result,
                                uid: uid
                            });
                            // return status;
                        }
                        function error( result, status, headers, req ) {
                            //out( 'error : ', req.data );
                            out( '* error : [', status, '] ', result );
                            out ('# 저장 실패 : ', uid);
                            
                            if(callError) callError(result);

                            // defer.reject( data );
                            defer.resolve({
                                error: status,
                                message: result.message || HttpService.statuscode[status],
                                result: result,
                                uid: uid
                            });
                            // return status;
                        }

                        return defer;
                    }

                    //------------------------------------------------------------
                    // Tool Config Data 저장
                    //------------------------------------------------------------
                    
                    function save_tool(){
                        
                        // Tool.current.TOOL.CONFIG
                        var config = Tool.current.TOOL.CONFIG;
                        if(!config.dataChanged){
                            // 저장 안함
                            return;
                        }
                        // 저장 후 실패시 config.dataChanged=true로 다시 설정됨
                        delete config.dataChanged;

                        // 요청
                        var defer = $q.defer();
                        process.add(defer, callServer_tool)
                        .then(function(response){
                            if ( response.error ) {
                                // 저장 실패한 경우
                                errorList.push(response);
                            } else {
                                // 저장 성공
                            }
                            out('* process added : ', response);
                            out('* --------------------------------서버 요청 끝\n\n');
                        });
                    }

                    function callServer_tool(defer){
                        var tool = Tool.current.TOOL.CONFIG;

                        // uid는 사용하지 않음
                        var uid = 'Tool Configuration Data';
                        
                        var json = angular.toJson(tool);
                        var userID = AuthService.session.id;

                        var config = {
                            uid : uid,
                            request: {
                                method: 'POST',
                                url: '/user'+ '/' + userID + '/tool',
                                data: {
                                    // user: userID,
                                    // uid: tool.uid,
                                    tool: json
                                }
                            }
                        }

                        callServer(defer, config, success, error);

                        out('- TOOL user : ', userID);
                        // out('- JSON : ', json);
                        
                        function success() {
                            // var config = Tool.current.TOOL.CONFIG;
                            // delete config.dataChanged;
                            out('# Tool 저장 성공 : ', uid);
                        }
                        function error() {
                            var config = Tool.current.TOOL.CONFIG;
                            config.dataChanged = true;
                            out('# Tool 저장 실패 : ', uid);
                        }

                        return defer;
                    }

                    //------------------------------------------------------------
                    // Project Data 저장
                    //------------------------------------------------------------

                    function save_project(process){
                        if(Project.current.dataChanged == false){
                            // 저장 안함
                            return;
                        }
                        
                        // 요청
                        var defer = $q.defer();
                        process.add(defer, callServer_project)
                        .then(function(response){
                            if ( response.error ) {
                                // 저장 실패한 경우
                                errorList.push(response);
                            } else {
                                // 저장 성공
                            }
                            out('* process added : ', response);
                            out('* --------------------------------서버 요청 끝\n\n');
                        });
                    }

                    function callServer_project(defer){
                        var project = Project.current.PROJECT.TREE;
                        var uid = project.uid;
                        var json = angular.toJson(project);
                        var userID = AuthService.session.id;

                        var config = {
                            uid : uid,
                            request: {
                                method: 'POST',
                                url: '/user'+ '/' + userID + '/project',
                                data: {
                                    user: userID,
                                    // uid: 'project-13f36f49-55b6-4fb7-92ec-2ed573ac94f5',//uid,
                                    uid: uid,
                                    project: json
                                }
                            }
                        }

                        callServer(defer, config, success, error);

                        out('- PROJECT : ', uid);
                        // out('- JSON : ', json);
                        
                        function success(result) {
                            Project.current.dataChanged = false;
                            out('# Project 저장 성공 : ', result);
                        }
                        function error(result) {
                            Project.current.dataChanged = true;
                            out('# Project 저장 실패 : ', result);
                        }

                        return defer;
                    }

                    //------------------------------------------------------------
                    // Document Data 저장
                    //------------------------------------------------------------

                    function save_document(process){
                        var map = Tool.current.TOOL.CURRENT.document.map;
                        for(var uid in map)
                        {
                            var item = map[uid];
                            // out(' - ', uid, ' : ', item.dataChanged);

                            if(item.dataChanged){
                                // 요청
                                var defer = $q.defer();
                                process.add(defer, callServer_document, uid)
                                .then(function(response){
                                    if ( response.error ) {
                                        // 저장 실패한 경우
                                        errorList.push(response);
                                    } else {
                                        // 저장 성공
                                    }
                                    out('* process added : ', response);
                                    out('* --------------------------------서버 요청 끝\n\n');
                                });
                            }
                        }
                    }

                    function callServer_document(defer, uid){

                        var documentItem = Project.current.getDocument(uid);

                        // documentItem.document.content 를 DOM 구조에서 String로 변환시킨다.
                        var content = documentItem.document.content;
                        var htmlString = content.outerHTML;

                        documentItem.document.content = htmlString;
                        var json = angular.toJson(documentItem);
                        documentItem.document.content = content;
                        
                        var userID = AuthService.session.id;
                        var config = {
                            uid : uid,
                            request: {
                                method: 'POST',
                                url: '/user'+ '/' + userID + '/document',
                                data: {
                                    // user: userID,
                                    uid: uid,
                                    document: json
                                }
                            }
                        }

                        callServer(defer, config, success, error);

                        out('- DOCUMENT : ', uid);
                        // out('- JSON : ', json);

                        function success(result) {
                            Tool.current.document(uid).dataChanged(false);
                            out('# Document 저장 성공 : ', result);
                        }
                        function error(result) {
                            Tool.current.document(uid).dataChanged(true);
                            out('# Document 저장 실패 : ', result);
                        }

                        return defer;
                    }

                },

                _success: function( data ) {
                    
                    // 저장 체크 변경
                    Tool.current.dataChanged = false;

                    // 콜백 호출
                    _super._success.apply( this, arguments );
                },

                _error: function( data ) {
                    var self = this;
                    this._errorNotice( {
                            title: '저장 실패',
                            content: '저장하기에 실패했습니다. 계속 진행 하시겠습니까?'
                        },
                        function( result, element, scope ) {
                            // result : -1:cancel, 1:yes, 0:no
                            if ( result > 0 ) {
                                _super._error.apply( self, [ data ] );
                            } else {
                                // 저장 체크 변경하지 않음
                                // Tool.current.dataChanged = true;
                                _super._error.apply( self, [ data, true ] );
                            }
                        }
                    );
                }
            } );

            // 서비스 객체 리턴
            return SaveCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'SaveCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);