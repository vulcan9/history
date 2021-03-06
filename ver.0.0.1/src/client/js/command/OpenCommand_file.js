/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 불러오기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service( Command, HttpService, $q, Tool, Project, $timeout ) {

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

                    // 데이터 로드 : Presentation - PT 관련 데이터
                    var self = this;

                    // 데이터 로드 : project 데이터
                    self.treeLoad( uid, function( treeData ) {

                        // 데이터 로드 : document 리스트 로드
                        self.documentLoad( treeData, function( dataMap ) {

                            self.presentationLoad( uid, function(presentationData) {

                                // 로드 종료
                                self._loadComplete( treeData, dataMap, presentationData );

                                // end presentation load
                            } );

                            // end document load
                        } );

                        // end project load
                    } );

                    // END Execute
                },

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

                //-----------------------------------
                // Project 데이터 로드
                //-----------------------------------

                treeLoad: function( uid, callback ) {

                    var self = this;
                    var treeUID = 'tree-' + uid;
                    var treeURL = _PATH.ROOT + 'data/' + treeUID + '.json';

                    var promies = HttpService.load( {
                            method: 'GET',
                            url: treeURL
                        } )
                        .then(
                            function success( data ) {
                                out( '# Project 로드 완료 : ', data );
                                out( 'TODO : // OpenCommand 실행' );

                                //*****************************************
                                
                                // 데이터 변경
                                Project.current = new Project();
                                // Project.current.openProject(data);

                                //*****************************************
                                
                                // if ( callback ) callback.apply( self, [ data ] );

                                // document 리스트 로드
                                // self.documentLoad( data );

                                // 결과 리턴
                                // self._success({tree:data});
                                return data;
                            },
                            function error( data ) {

                                out( '# 로드 에러 : ', treeUID, '\n-url : ', treeURL, data );

                                // 데이터 변경
                                Project.current = new Project();
                                // Project.current.openProject(null);

                                return null;
                            }
                        )
                        .then(function(data){
                            if(data == null){
                                // 결과 리턴
                                self._error();
                            }else{
                                if ( callback ) callback.apply( self, [ data ] );
                            }
                        });

                    return promies;
                },

                //-----------------------------------
                // Project Tree 내용에 따라 document 내용 로드
                //-----------------------------------

                documentLoad: function( treeData, callback ) {
                    var self = this;
                    var promiseArray = [];
                    var dataMap = {};

                    // treeData 구조가 바뀌어 모든 노드를 검사할려면 forEach를 쓸 수 없다.
                    //  모든 노드를 탐색하여 document리스트를 로드한다.
                    findItems(treeData, 0);

                    function findItems(node, dep){
                        
                        angular.forEach( node.items, function( value, key ) {
                            
                            var _depth = dep;
                            out( '---> ', _depth, '[', key, '] : ', value.uid );

                            var documentURL = _PATH.ROOT + 'data/' + value.uid + '.json';
                            var promise = HttpService.load( {
                                    method: 'GET',
                                    url: documentURL
                                } )
                                .then( function success( result ) {
                                    // out('success : ', result);
                                    // 로드 성공한 경우 파일의 json 객체를 리턴한다.
                                    return result;
                                }, function fail( result ) {
                                    // out('fail : ', result);
                                    // 로드 실패한 경우 파일의 uid를 리턴한다.
                                    return value.uid;
                                } );
                            promiseArray.push( promise );

                            // 재귀 호출 (depth로 진행)
                            if(value.items && value.items.length > 0){
                                findItems(value, (_depth+1));
                            }

                        }, this );
                    }

                    /*
                    // out("treeData", treeData.items);
                    angular.forEach( treeData.items, function( value, key ) {
                        // out( key, ' : ', value.uid );
                        var documentURL = _PATH.ROOT + 'data/' + value.uid + '.json';

                        var promise = HttpService.load( {
                                method: 'GET',
                                url: documentURL
                            } )
                            .then( function success( result ) {
                                // out('success : ', result);
                                // 로드 성공한 경우 파일의 json 객체를 리턴한다.
                                return result;
                            }, function fail( result ) {
                                // out('fail : ', result);
                                // 로드 실패한 경우 파일의 uid를 리턴한다.
                                return value.uid;
                            } );

                        promiseArray.push( promise );

                    }, this );
                    */

                    $q.all( promiseArray )
                        .then( function success( result ) {
                            angular.forEach( result, function( response ) {

                                if ( angular.isString( response ) ) {
                                    // 로드 실패한 경우 파일의 uid를 리턴한다.
                                    dataMap[ response ] = null;
                                } else {

                                    //******************************************

                                    out('# 최신 기능 지원 위해 로드된 document 데이터 구조 업데이트');
                                    response = Project.current.updateDocumentVersion(response.uid, response);
                                    
                                    // html String를 DOM 구조로 바꾸어 놓는다.
                                    var htmlString = response.document.content;
                                    var dom = Project.current.stringToHtml(htmlString);

                                    //-------------------
                                    // 호환성 일부 지원
                                    //-------------------

                                    dom = supportToolFunction(dom);
                                    
                                    //******************************************

                                    // 데이터에 적용
                                    response.document.content = dom;
                                    dataMap[ response.uid ] = response;
                                }

                            } );

                            return dataMap;
                        } )
                        .then( function(data) {

                            // self._loadComplete( dataMap );
                            if ( callback ) callback.apply( self, [ data ] );

                        } );

                    // documentLoad end
                },

                //-----------------------------------
                // Presentation 데이터 로드
                //-----------------------------------

                presentationLoad: function( uid, callback ) {

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

                //-----------------------------------
                // 데이터 로드 종료
                //-----------------------------------

                _loadComplete: function( treeData, documentMap, presentationData ) {

                    //*****************************************
                    
                    // 데이터 저장
                    Project.current.openProject(treeData, documentMap, presentationData);
                    // out( 'documentMap : ', documentMap );

                    // 결과 리턴
                    var self = this;
                    $timeout(function(){
                        self._success( documentMap );

                        // 저장 체크 변경
                        Tool.current.dataChanged = false;
                    });
                    
                    //*****************************************
                    
                }

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