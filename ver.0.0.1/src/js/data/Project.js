/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Project 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function(application, U) {

        out ('TODO : // 디버깅용으로 노출된 속성 비활성화 시킬것 (Project)')
        window.Project = Project;
        
        // 현재 사용중인 데이터 Instance
        Project.current = null;

        var _superClass;
        var _super;

        // 등록
        application.factory( 'Project', _factory );

        /////////////////////////////////////
        // 생성자
        /////////////////////////////////////

        function Project (){
            _superClass.apply(this, arguments);
        }

        function _factory( Data, VersionService, $rootScope ){

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            _superClass = Data;
            _super = _superClass.prototype;

            //------------------------------------------
            // angular의 Injection 활용을 위해 이곳에서 Prototype을 정의한다.
            //------------------------------------------
            
            // Prototype 상속
            angular.extend( 
                Project.prototype,  _super, {

                    eventPrefix : 'Project',

                    initialize: function(){
                        
                        _super.initialize.apply(this, arguments);

                        //---------------------
                        // PROJECT 속성 : 편집 결과를 저장한 데이이터 (자동 생성)
                        //---------------------
                        
                        // 읽기 전용 PROJECT 속성 생성
                        // 속성 접근 : project (key, value);
                        this.project = this.__createProxy ('this', 'PROJECT', {

                                // project 문서 구성 정보
                                __TREE : null,

                                // project 문서 내용
                                __DOCUMENT : null,

                                // Presentation 데이터
                                __PRESENTATION : null

                                // 현재 선택 문서 (uid)
                                //__SELECT_DOCUMENT: null

                            }
                        );

                        this.project('DOCUMENT', {items:{}});
                        this.project('TREE', {items:[]});
                        this.project('PRESENTATION', {items:{}});

                        //this.project('SELECT_DOCUMENT', {items:{}});

                        // 이벤트 발송
                        var eventName = '#' + this.eventPrefix + '.initialized';
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:this.project};
                        $rootScope.$broadcast(eventName, args); 

                        // Root Element (Overview)
                        this.__checkRootDocument();

                        // end initialize
                    },

                    __checkRootDocument: function(){
                        if(this.PROJECT.DOCUMENT.items['overview'] !== undefined){
                            return;
                        }

                        var param = {
                            uid : U.createUID(),
                            document:{
                                id : 'overview'
                            }
                        }
                        this.addDocument(param);
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // 데이터 원형
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    // content --> element.outerHTML
                    getDefinitionDocument : function (uid){

                        var version = VersionService.version();
                        
                        var definition = {
                            "version": version,
                            "description": "문서 편집 내용 정의",

                            "uid": uid,

                            // Document 구성 정보
                            "document": {

                                "uid": uid,

                                "id": "overview",
                                "content": "<div id='overview' data-scale='10' data-x='0' data-y='0'></div>"

                            },

                            // Document 운영 정보
                            "configuration": {

                                "uid": uid,

                                "id": "overview",
                                "subject": "문서 제목",
                                "descripty": "문서 요약",

                                "security": {
                                    "permission": "all",
                                    "grade": "5"
                                },

                                "history": {
                                    "create": new Date(),
                                    "edits": []
                                },

                                "progress": {
                                    "start": "",
                                    "end": "",

                                    "ignore": "0",
                                    "percent": "0"
                                }
                            },

                            // Document에 포함된 todo 정보
                            "todos": {
                                "uid": uid,
                                "items":{}
                            }
                        };

                        return definition;
                    },

                    getDefinitionTree : function (uid){
                        var definition = {
                            "uid" : uid,
                            "name" : "bored-1-1",

                            "parentUID": "",
                            "parentName": "",
                            
                            "depth": "0",
                            "index": "0"
                        };

                        return definition;
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // Command 관련 API
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    // uid : element uid
                    newProject: function(){
                        this.initialize();
                        //this.project( 'TREE', null );
                    },

                    // data : tree-uid.json 파일 내용
                    openProject: function(data){
                        this.initialize();
                        this.project( 'TREE', data );
                    },
                    closeProject: function(){
                        this.project( 'TREE', null );
                        this.project( 'PRESENTATION', null );
                        this.project( 'DOCUMENT', null );
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // 데이터 조작 API
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    //---------------------
                    // Tree
                    //---------------------
                    
                    /*
                    getTree : function(uid){
                        return this.__get('TREE', this.PROJECT.TREE, uid);
                    },
                    */

                    //---------------------
                    // Document
                    //---------------------
                    
                    // uid : document uid
                    getDocument : function(uid){
                        return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, uid);
                    },
                    
                    // itemObject.uid 값이 있어야함
                    addDocument: function(param){
                        var uid = param.uid;

                        // tree에 추가
                        //var treeItem = this.getDefinitionTree(uid);
                        //this.add('TREE', this.PROJECT.TREE, treeItem);

                        out('TODO : param으로 넘어온 값(open)을 document에 적용 : ', param);

                        // document 추가
                        var documentItem = this.getDefinitionDocument(uid);
                        this.add('DOCUMENT', this.PROJECT.DOCUMENT, documentItem);
                    },

                    // itemObject.uid 값이 있어야함
                    removeDocument: function(uid){

                        // tree에 제거
                        //var treeItem = this.getDefinitionTree(uid);
                        // this.remove('TREE', this.PROJECT.TREE, treeItem);

                        out('TODO : 기능 확인 필요');

                        var documentItem = this.getDocument(uid);
                        this.remove('DOCUMENT', this.PROJECT.DOCUMENT, documentItem);
                    },

                    // itemObject.uid 값이 있어야함
                    modifyDocument: function(uid){

                        // tree에 수정
                        //var treeItem = this.getDefinitionTree(uid);
                        // this.modify('TREE', this.PROJECT.TREE, treeItem);

                        out('TODO : 기능 확인 필요');

                        var documentItem = this.getDocument(uid);
                        this.modify('DOCUMENT', this.PROJECT.DOCUMENT, documentItem);
                    },
                    
                    //---------------------
                    // Select Document
                    //---------------------

                    getSelectDocument : function(){
                        // var uid = this.project('DOCUMENT').selectUID;
                        // return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, uid);
                        return Tool.current.getSelectDocument();
                    },

                    setSelectDocument: function(uid){
                        if(uid === undefined){
                            throw 'uid 값이 없습니다. (modify)';
                        }

                        // GET
                        var oldValue = this.getSelectDocument();
                        var newValue = uid;

                        // SET
                        Tool.current.setSelectDocument(uid);

                        // 이벤트 발송
                        var propertyName = 'DOCUMENT';
                        var eventName = '#' + this.eventPrefix + '.selected-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);

                        var args = {newValue:newValue, name:propertyName, oldValue:oldValue};
                        $rootScope.$broadcast(eventName, args); 
                    },











                    //---------------------
                    // Element
                    //---------------------

                    addElement: function(el){

                    },

                    // uid : element uid
                    removeElement: function(uid){

                    },

                    // uid : element uid
                    modifyElement: function(uid){

                    },

                    // uid : element uid
                    selectElement: function(uid){

                    },

                    // end prototype
                }
            );

            return Project;
        }

        // 리턴
        return Project;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);


/*

////////////////////////////////////////
// 데이터 샘플
////////////////////////////////////////

{
    "version": "0.0.1",
    "description": "문서간 Tree 구조(depth)를 정의, 문서 uid와 1:1 매칭 (key-value)",

    "uid": "b16fea9c-d10a-413b-ba20-08344f937336",

    "items": {
        
        "document-b16fea9c-d10a-413b-ba20-08344f937337": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937337",
            "name" : "overview",
            "parentUID": "",
            "parentName": "",
            "depth": "0",
            "index": "0"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937338": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937338",
            "name" : "center1",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937337",
            "parentName": "overview",
            "depth": "1",
            "index": "0"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937339": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937339",
            "name" : "bored",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937337",
            "parentName": "overview",
            "depth": "1",
            "index": "1"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937340": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937340",
            "name" : "bored-1",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937339",
            "parentName": "bored",
            "depth": "2",
            "index": "0"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937341": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937341",
            "name" : "bored-1-1",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937340",
            "parentName": "bored-1",
            "depth": "3",
            "index": "0"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937342": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937342",
            "name" : "bored-2",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937339",
            "parentName": "bored",
            "depth": "2",
            "index": "1"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937343": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937343",
            "name" : "bored1",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937337",
            "parentName": "overview",
            "depth": "1",
            "index": "2"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937344": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937344",
            "name" : "bored1-1",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937343",
            "parentName": "bored1",
            "depth": "2",
            "index": "0"
        },

        "document-b16fea9c-d10a-413b-ba20-08344f937345": {
            "uid" : "document-b16fea9c-d10a-413b-ba20-08344f937345",
            "name" : "bored1-2",
            "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937343",
            "parentName": "bored1",
            "depth": "2",
            "index": "2"
        }

    }
}
*/



