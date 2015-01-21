/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 불러오기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service( Command, ProcessService, AuthService, HttpService, $q, Tool, Project, $timeout ) {

            out( 'Command 등록 : OpenCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function OpenCommand() {

                _superClass.apply( this, arguments );
                out( '# OpenCommand : ', this );

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( OpenCommand.prototype, _super, {

                _run: function( param ) {

                    // Override
                    out( '# OpenCommand Execute' );

                    var uid = param.uid;
                    if(!uid){
                        this._error.apply( this);
                        return;
                    }

                    if(!AuthService.session){
                        this._error.apply( this);
                        return;
                    }
                    
                    // var self = this;
                    var projectData;
                    var documentMap;
                    var presentationData;

                    var process = ProcessService.process();
                    process.start().then(function(){
                        // 데이터 초기화
                        Project.current = new Project();
                    });
                    
                    //---------------------
                    // 데이터 로드 상태 확인
                    //---------------------
                    
                    process.add($q.defer(), angular.bind(this, function(defer){
                        Tool.current.initialize(function(){
                            defer.resolve();
                        });
                    }));

                    // 1. 데이터 로드 : project 데이터
                    process.add($q.defer(), angular.bind(this, function(defer){
                        this._loadProject(defer, uid);
                        // defer.resolve();
                    })).then(function(data){
                        projectData = data;
                        if(data == null){
                            // 결과 리턴
                            self._error();
                        }
                    });

                    // 2. 데이터 로드 : document 리스트 로드
                    process.add($q.defer(), angular.bind(this, function(defer){
                        this._loadDocument(defer, projectData);
                        // defer.resolve();
                    })).then(function(data){
                        documentMap = data;
                    });

                    /*
                    // 3. 데이터 로드 : presentation 리스트 로드
                    process.add($q.defer(), angular.bind(this, function(defer){
                        this._loadPresentation(defer, uid);
                        // defer.resolve();
                    })).then(function(data){
                        presentationData = data;
                    });
                    */

                    //---------------------
                    // 데이터 세팅 완료
                    //---------------------

                    // 4. 데이터 적용
                    process.end().then(
                        angular.bind(this, function(){
                            // 로드 종료
                            this._loadComplete( projectData, documentMap, presentationData );
                        })
                    );

                    // END Execute
                },

                // _openProject: function(){},

                _error: function( data ) {

                    var self = this;

                    this._errorNotice( {
                            title: '불러오기 실패',
                            content: '불러오기에 실패했습니다. 불러러오기를 종료합니다.',
                            buttons: [ '예' ]
                        },
                        function( result, element, scope ) {
                            // result : -1:cancel, 1:yes, 0:no

                            /*
                            if ( result > 0 ) {
                                _super._error.apply( self, [ data ] );
                            } else {
                                // 저장 체크 변경하지 않음
                                // Tool.current.dataChanged = true;
                                _super._error.apply( self, [ data, true ] );
                            }
                            */

                            _super._error.apply( self, [ data, true ] );
                        }
                    );
                },

                ////////////////////////////////////////
                // Project  데이터 (Tree)
                ////////////////////////////////////////

                //-----------------------------------
                // Project 데이터 로드
                //-----------------------------------

                _loadProject: function (defer, uid){

                    var self = this;
                    var projectUID = uid;
                    // var projectURL = _PATH.ROOT + 'data/' + projectUID + '.json';
                    var userID = AuthService.session.id;

                    var promise = HttpService.load( {
                            method: 'GET',
                            url: '/user'+ '/' + userID + '/project',
                            params: {
                                uid: projectUID
                            }
                        } )
                        .then( 
                            angular.bind(this, success), 
                            angular.bind(this, error)
                        );
                    /*
                    result = {
                        message: 'success',
                        data: Object
                    }
                    */
                    function success(result){
                        out ('# Project 데이터 조회 완료 : ', result);

                        var data = result.data;
                        var project = angular.fromJson(data.project);
                        defer.resolve(project);
                    }

                    function error(result){
                        out ('# Project 데이터 조회 에러 : ', result);

                        // defer.reject( data );
                        defer.resolve(null);
                    }

                },

                //-----------------------------------
                // Project Tree 내용에 따라 document 내용 로드
                //-----------------------------------

                _loadDocument: function (defer, project){
                    // out(project);

                    var self = this;
                    var userID = AuthService.session.id;

                    var promiseArray = [];
                    var dataMap = {};

                    // treeData 구조가 바뀌어 모든 노드를 검사할려면 forEach를 쓸 수 없다.
                    //  모든 노드를 탐색하여 document리스트를 로드한다.
                    findItems(project, 0);

                    function findItems(node, dep){
                        
                        angular.forEach( node.items, function( value, key ) {
                            
                            var _depth = dep;
                            out( '---> ', _depth, '[', key, '] : ', value.uid );

                            var documentUID = value.uid;
                            // var documentURL = _PATH.ROOT + 'data/' + documentUID + '.json';
                            var promise = HttpService.load( {
                                    method: 'GET',
                                    url: '/user'+ '/' + userID + '/document',
                                    params: {
                                        uid: documentUID
                                    }
                                } )
                                .then( 
                                    angular.bind(this, success, documentUID), 
                                    angular.bind(this, error, documentUID)
                                );

                            promiseArray.push( promise );

                            // 재귀 호출 (depth로 진행)
                            if(value.items && value.items.length > 0){
                                findItems(value, (_depth+1));
                            }

                        }, this );
                    }
                    
                    function success(uid, result){
                        out ('# Document 데이터 조회 완료 : ', result);
                        // 로드 성공한 경우 파일의 json 객체를 리턴한다.
                        var data = result.data;
                        data.document = angular.fromJson(data.document);
                        return data;
                    }
                    function error(uid, result){
                        out ('# Document 데이터 조회 에러 : ', result);
                        return uid;
                    }

                    $q.all( promiseArray )
                        .then( function success( response ) {
                            angular.forEach( response, function( result ) {

                                if ( angular.isString( result ) ) {
                                    // 로드 실패한 경우 파일의 uid를 리턴한다.
                                    dataMap[ result ] = null;
                                } else {

                                    var documentObj = result.document;

                                    //******************************************

                                    out('# 최신 기능 지원 위해 로드된 document 데이터 구조 업데이트');
                                    documentObj = Project.current.updateDocumentVersion(documentObj.uid, documentObj);
                                    
                                    // html String를 DOM 구조로 바꾸어 놓는다.
                                    var htmlString = documentObj.document.content;
                                    var dom = Project.current.stringToHtml(htmlString);

                                    //-------------------
                                    // 호환성 일부 지원
                                    //-------------------

                                    dom = supportToolFunction(dom);
                                    
                                    //******************************************

                                    // 데이터에 적용
                                    documentObj.document.content = dom;
                                    dataMap[ documentObj.uid ] = documentObj;
                                }

                            } );

                            return dataMap;
                        } )
                        .then( function(map) {
                            defer.resolve(map);
                        } );

                    // documentLoad end
                },

                //-----------------------------------
                // Presentation 데이터 로드
                //-----------------------------------

                /*
                _loadPresentation: function (defer, uid){
                    var self = this;
                    var presentationUID = 'presentation-' + uid;
                    var url = _PATH.ROOT + 'data/' + presentationUID + '.json';

                    var promies = HttpService.load( {
                            method: 'GET',
                            url: url
                        } )
                        .then(
                            function success( data ) {

                                // 데이터 변경
                                // Project.current.project( 'PRESENTATION', data );
                                out( '# Presentation 로드 완료 : ', data );

                                return data;
                            },
                            function error( data ) {

                                // Project.current.project( 'PRESENTATION', null );
                                out( '# 로드 에러 : ', presentationUID, '\n-url : ', url, data );

                                // 결과 리턴
                                // self._error();
                                return null;
                            }
                        )
                        .then( function(data) {

                            if ( callback ) callback.apply( self, [data] );

                        } );

                    return promies;
                },
                */

                //-----------------------------------
                // 데이터 로드 종료
                //-----------------------------------

                _loadComplete: function( projectData, documentMap, presentationData ) {

                    //*****************************************
                    
                    // 데이터 저장
                    Project.current.openProject(projectData, documentMap, presentationData);
                    // out( 'documentMap : ', documentMap );

                    Tool.current.openProject();
                    
                    // 결과 리턴
                    var self = this;
                    $timeout(function(){
                        self._success( documentMap );
                    });
                    
                    //*****************************************
                }

                // END OpenCommand
            } );

            //-------------------
            // 호환성 일부 지원
            //-------------------

            // Tool에서 사용 가능한 Tag 구조로 바꾼다.
            function supportToolFunction(dom){

                // return dom;
                var $dom = angular.element(dom);
                if($dom.attr('uid') !== undefined){
                    return dom;
                }
                
                // document : uid 가 없다면 지원해 준다.
                // BUG: 
                // width의 소수점 이하 처리 문제로 인해 wordwrape 현상이 일어나는 경우가 있어서 별도로 사이즈 지정하지 않는다.
                // wrap 하더라도 따로 상즈를 설정하지 않는다. (대신 CSS로 크기, 위치 문제 해결한다.)

                // element로 기능 업데이트
                // element : 하위 모든 태그를 element 노드로 감싼다.
                var elementUID = Project.current.createElementUID();
                var $comp = Project.current.createElementContent('tag', elementUID);
                
                out('TODO : // Element 설정값 적용 : 하위 Object들을 직접 extend 해주어야 한다.');

                // DOM 구성
                $comp.html($dom);

                // document로 감싼다.
                var documentUID = Project.current.createDocumentUID();
                var docNode = Project.current.createDocumentContent(documentUID);
                angular.element(docNode).html($comp);
                return docNode;

                // return $comp;


                /*
                // width를 미리 알아내는 방법
                var $temp = angular.element('body').find('.hi-screenContainer #temp');
                $temp.css('visibility', 'hidden');

                var $document = angular.element('<div>').attr('uid', 'document-temp');
                var $element = angular.element('<div>').attr('uid', 'element-temp');

                $element.append($dom)
                $document.append($element)
                $temp.append($document);

                var display = $dom.css('display');
                $dom.css({
                    // 'fontFamily': '맑은 고딕',
                    // 'display': 'inline-block'
                });

                var borderW = U.toNumber($dom.css('border-left-width')) + U.toNumber($dom.css('border-right-width'));
                var borderH = U.toNumber($dom.css('border-top-width')) + U.toNumber($dom.css('border-bottom-width'));
                var paddingL = U.toNumber($dom.css('padding-left'));
                var paddingR = U.toNumber($dom.css('padding-right'));
                var paddingT = U.toNumber($dom.css('padding-top'));
                var paddingB = U.toNumber($dom.css('padding-bottom'));
                var marginL = U.toNumber($dom.css('margin-left'));
                var marginR = U.toNumber($dom.css('margin-right'));
                var marginT = U.toNumber($dom.css('margin-top'));
                var marginB = U.toNumber($dom.css('margin-bottom'));
                
                var w = $dom.width() + marginL + marginR + paddingL + paddingR + borderW;
                var h = $dom.height() + marginT + marginB + paddingT + paddingB + borderH;
                
                $dom.remove();

                //---------------------
                // 값 적용
                
                $dom.css({
                    // 'display': display,
                    // 'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    // 'margin': '0px',
                    // 'padding': (paddingW/2 + paddingH/2) + 'px',
                    'pointer-events': 'none'
                });

                // element로 기능 업데이트
                // element : 하위 모든 태그를 element 노드로 감싼다.
                var elementUID = Project.current.createElementUID();
                var $comp = Project.current.createElementContent('tag', elementUID, config);
                
                out('TODO : // Element 설정값 적용 : 하위 Object들을 직접 extend 해주어야 한다.');
                // angular.extend({}, config);

                //***************************************
                // BUG: 
                // (임시 처리) width의 소수점 이하 처리 문제로 인해 wordwrape 현상이 일어나는 경우가 있어서 별도로 사이즈 지정하지 않는다.
                
                // element의 가상 border 체크
                $temp.append($comp);
                
                var bL = U.toNumber($comp.css('border-left-width'));
                var bR = U.toNumber($comp.css('border-right-width'));
                var bT = U.toNumber($comp.css('border-top-width'));
                var bB = U.toNumber($comp.css('border-bottom-width'));
                $comp.remove();

                $comp.css({
                    'width': w + bL + bR,
                    'height': h + bT + bB
                });

                //***************************************

                // DOM 구성
                $comp.html($dom);

                // document로 감싼다.
                var documentUID = Project.current.createDocumentUID();
                var document = Project.current.createDocumentContent(documentUID);
                angular.element(document).html($comp);

                return document;
                */
            }

            // 서비스 객체 리턴
            return OpenCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'OpenCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);