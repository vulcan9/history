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

        // 디버깅용으로 속성 노출
        if(window.debug) window.Project = Project;
        
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
            
            // 용지 크기 설정
            // A4 : 842x595, 
            // MS ppt : 1193x671
            // Google docs는 화면 비율로 맞춤 - 4:3, 16:9, 16:10 (960x540)
            Project.paper = {
                width:1193, 
                height:671 
            };

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
                                __PRESENTATION : null,

                                // paper 정보
                                // __PAPER: null

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
                        // this.__checkRootDocument();

                        // end initialize
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

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // Command 관련 API
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    // uid : element uid
                    newProject: function(){
                        this.initialize();
                        //this.project( 'TREE', null );

                        // Root Element (Overview)
                        this.__checkRootDocument();

                        Tool.current.dataChanged = false;
                    },

                    // data : tree-uid.json 파일 내용
                    openProject: function(data){
                        this.initialize();
                        this.project( 'TREE', data );

                        // 선택 상태 표시 (Root  Document를 초기 선택 상태로 표시)
                        out('TODO : 저장된 마지막 선택 문서를 선택상태로 표시하기');

                        //var uid = this.project( 'TREE').items[0].uid;
                        var uid = data.items[0].uid;
                        this.setSelectDocument(uid);

                        // OpenComman에서 처리
                        // Tool.current.dataChanged = false;
                    },
                    closeProject: function(){
                        this.setSelectDocument(null);

                        this.project( 'TREE', null );
                        this.project( 'PRESENTATION', null );
                        this.project( 'DOCUMENT', null );

                        Tool.current.dataChanged = false;
                    },

                    // 최초 첫 문서 한개를 임의로 세팅
                    __checkRootDocument: function(){
                        // if(this.PROJECT.DOCUMENT.items['overview'] !== undefined) return;
                        var treeData = this.project('TREE');
                        if(treeData.items && treeData.items.length > 0) return;

                        //var documentItem = this.getDefinitionDocument(uid);
                        var uid = this.createDocumentUID();

                        var param = {
                            uid: uid,
                            /* add option
                            option: {
                                position: null,
                                selectUID: null
                            },
                            */
                            document:{
                                // Document 구성 정보
                                "document": {
                                    // "id": "undefined"
                                }
                            }
                        }

                        this.addDocument(param);
                    },

                    createDocumentUID: function(){
                        var uid = 'document-' + U.createUID();
                        return uid;
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // 데이터 조작 API
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    /////////////////////////////////////
                    //
                    // Tree
                    //
                    /////////////////////////////////////

                    // tree 관련 메서드는 treeView.js 에서 이벤트 받아 실행 시킨다.

                    //  모든 노드를 탐색하여 해당 uid를 가진 document의 tree 상 위치 정보를 찾는다
                    // selectUID : 현재 option값에 기준이 되고 있는 Tree item의 uid
                    // option : 'next', 'sub', 'prev' - selectUID에 대한 상대 위치
                    // option을 생략하면 selectUID의 정보를 리턴한다.

                    // depth는 1부터 카운팅, index는 0부터 카운팅

                    getTreePosition: function (selectUID, option){

                        out('* TREE에서 위치를 찾는 UID : (', option, ') ', selectUID);
                        var treeData = this.project('TREE');
                        
                        var pos = {
                            parent: treeData,
                            items: treeData.items,
                            depth:1, 
                            index:0
                        };

                        var isFinded = false;
                        findItems(treeData, 1, selectUID, true);
                        return pos;

                        function findItems(node, dep, uid, isRoot){

                            var _depth = dep;
                            var len = node.items.length;

                            for(var index=0; index<len; ++index)
                            {
                                if(isFinded) return;
                                var item = node.items[index];
                                // out( '---> ', _depth, '[', index, '] : ', item.uid );

                                if(item.uid === uid)
                                {
                                    var listOwner = node;
                                    var parent = isRoot ? null : node;

                                    switch(option)
                                    {
                                        // 하위 Depth에 Document 추가할때
                                        case 'sub':
                                            listOwner = item;
                                            pos = {
                                                parent: listOwner,
                                                items: listOwner.items,
                                                depth: _depth + 1, 
                                                index: 0
                                            };
                                            break;

                                        // 같은 Depth에 이전 Document 추가할때
                                        case 'prev':
                                            pos = {
                                                parent : parent,
                                                items: listOwner.items,
                                                depth: _depth, 
                                                index: Math.max(index, 0)
                                            };
                                            break;

                                        // 같은 Depth에 다음 Document 추가할때
                                        case 'next':
                                            pos = {
                                                parent : parent,
                                                items: listOwner.items,
                                                depth: _depth, 
                                                index: Math.min(index + 1, listOwner.items.length)
                                            };
                                            break;

                                        // 현재 selectUID에 대한 정보를 그냥 리턴
                                        default:
                                            pos = {
                                                parent : parent,
                                                items: listOwner.items,
                                                depth: _depth, 
                                                index: index
                                            };
                                    }

                                    // next
                                    // index: index+1, depth: _depth
                                    out('\t=> listOwner : ', listOwner.uid);
                                    out('\t=> 위치 정보 : ', pos);

                                    isFinded = true;
                                    return;
                                }

                                // 재귀 호출 (depth로 진행)
                                if(item.items && item.items.length > 0){
                                    findItems(item, (_depth+1), uid);
                                }
                            }
                        }

                        //end
                    },

                    getDefinitionTree : function (uid){
                        var definition = {
                            // "parentUID": "",
                            // "parentName": "",
                            
                            // "depth": "0",
                            // "index": "0",

                            "uid" : uid,
                            "items": []
                        };

                        return definition;
                    },
                    
                    /////////////////////////////////////
                    //
                    // Document
                    //
                    /////////////////////////////////////
                    
                    // uid : document uid
                    getDocument : function(uid){
                        return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, uid);
                    },
                    
                    // addDocumentList: function(param){}

                    //---------------------
                    // add
                    //---------------------
                    
                    addDocument: function(param){
                        Tool.current.dataChanged = true;

                        var uid = param.uid;
                        var document = param.document || {};

                        // param으로 넘어온 값(open)을 document에 적용
                        var documentItem = this.getDefinitionDocument(uid);

                        // 하위 Object들을 직접 extend 해주어야 한다.
                        angular.extend(documentItem.document, document.document);
                        angular.extend(documentItem.configuration, document.configuration);
                        angular.extend(documentItem.todos, document.todos);

                        // document 추가
                        this.add('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);
                        out('# 추가 된 Document : ', documentItem);

                        // 선택 표시
                        this.setSelectDocument(uid);
                    },

                    //---------------------
                    // remove
                    //---------------------
                    
                    // removeDocumentList: function(param){}

                    /*
                    var param = {
                        uid : selectUID,
                        option : 'all' | 'only'
                    };
                    */
                    removeDocument: function(param){
                        Tool.current.dataChanged = true;

                        // 삭제 대상이 되는 document UID
                        var uid = param.uid;

                        // 지우기 옵션 (tree 구조 지원하기 위함)
                        if(!param.option) param.option = 'all';
                        var option = param.option;
                        
                        var info = this.getTreePosition(uid);
                        var item = info.items[info.index];

                        // 제거 리스트
                        var list_info = [];
                        var list_uid = [];
                        
                        if(option == 'only'){
                            
                            // 해당 document 삭제
                            list_info.push(info);
                            list_uid.push(uid);

                        }else{
                            // option == 'all' : 하위 노드의 Document 목록 모두 제거
                            // Document 리스트 작성, 하위 노드 document 삭제
                            //setSubItems(item.items, list_info, list_uid, info.depth+1);
                            this._getTreeToArray(item.items, list_info, list_uid, info.depth+1);
                            
                            // 해당 document 삭제
                            list_info.push(info);
                            list_uid.push(uid);
                        }

                        //----------
                        // select (remove 전에 조사한다.)
                        //----------

                        // 선택노드가 제거 리스트에 있다면 선택Document를을 변경
                        var isSelectChange = false;
                        var selectUID = this.getSelectDocument();
                        var result = list_uid.indexOf(selectUID);
                        if(result > -1){
                            // uid 이전 index Document를 선택. 
                            // 삭제 uid의 index=0인 경우 상위 depth (parent)를 선택
                            // 상위 parent가 없는 경우 0
                            //var selectPosition = this.getTreePosition(uid);
                            var selectIndex = info.index;
                            var nextSelectUID;
                            if(selectIndex == 0){
                                if(info.parent){
                                    nextSelectUID = info.parent.uid;
                                }else{
                                    // root item인 경우 : 삭제 후 다시 root item을 선택
                                    // (하위노드까지 삭제할지 해당노드만 삭제할지에 따라 달라짐)
                                    //nextSelectUID = info.items[0].items[0].uid;
                                }
                            }else{
                                // 이전 item을 선택
                                nextSelectUID = info.items[selectIndex - 1].uid;
                            }
                            isSelectChange = true;
                        }

                        //----------
                        // remove
                        //----------

                        out('# 삭제될 document 리스트 : ', list_uid);
                        remove.apply(this, [list_info]);

                        // select 적용
                        if(isSelectChange){
                            if(nextSelectUID == undefined){
                                var root = this.project('TREE').items;
                                nextSelectUID = (root && root.length > 0)? root[0].uid : null;
                            }
                            out('# 선택 item을 자동 변경 : ', nextSelectUID);
                            this.setSelectDocument(nextSelectUID);
                        }

                        //----------
                        // function define
                        //----------

                        /*
                        // 역순으로 리스트 작성(하위 노드, 아래쪽 노드순서로)
                        function setSubItems(items, list, list_uid, dep){

                            var _depth = dep;
                            var len = items.length - 1;

                            for(var index=len; index>=0; --index)
                            {
                                var item = items[index];

                                // 재귀 호출 (depth로 진행)
                                if(item.items && item.items.length > 0){
                                    setSubItems(item.items, list, list_uid, (_depth+1));
                                }

                                // out( '# remove Document ---> ', _depth, '[', index, '] : ', item.uid );
                                var pos = {
                                    parent: item,
                                    items: items,
                                    depth: _depth, 
                                    index: index
                                };
                                list.push(pos);
                                list_uid.push(item.uid);
                            }
                        }
                        */

                        function remove (list){
                            var len = list.length;
                            for(var index=0; index<len; ++index)
                            {
                                var info = list[index];
                                var item = info.items[info.index];
                                var uid = item.uid;

                                // 이벤트 매개변수에 전달하기 위해 변수 생성함
                                param.position = info;

                                var documentItem = this.getDocument(uid);
                                this.remove('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);
                            }
                        }

                        //end
                    },

                    // Tree에 속한 Item들을 역순으로 리스트 작성(하위 노드, 아래쪽 노드순서로)
                    _getTreeToArray: function (items, list, list_uid, dep){

                        var _depth = dep;
                        var len = items.length - 1;

                        for(var index=len; index>=0; --index)
                        {
                            var item = items[index];

                            // 재귀 호출 (depth로 진행)
                            if(item.items && item.items.length > 0){
                                this.__getTreeToArray(item.items, list, list_uid, (_depth+1));
                            }

                            // out( '# remove Document ---> ', _depth, '[', index, '] : ', item.uid );
                            var pos = {
                                parent: item,
                                items: items,
                                depth: _depth, 
                                index: index
                            };
                            list.push(pos);
                            list_uid.push(item.uid);
                        }
                    },

                    //---------------------
                    // Select Document
                    //---------------------

                    getSelectDocument : function(){
                        // var uid = this.project('DOCUMENT').selectUID;
                        // return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, uid);
                        return Tool.current._getSelectDocument();
                    },

                    setSelectDocument: function(uid){
                        if(uid === undefined){
                            throw 'uid 값이 없습니다. (modify)';
                        }

                        // GET
                        var oldValue = this.getSelectDocument();
                        var newValue = uid;

                        // SET
                        Tool.current._setSelectDocument(uid);

                        // 이벤트 발송
                        var propertyName = 'DOCUMENT';
                        var eventName = '#' + this.eventPrefix + '.selected-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);

                        var args = {newValue:newValue, name:propertyName, oldValue:oldValue};
                        $rootScope.$broadcast(eventName, args); 
                    },

                    //---------------------
                    // modify
                    //---------------------
                    
                    // itemObject.uid 값이 있어야함
                    modifyDocument: function(uid){
                        Tool.current.dataChanged = true;

                        // tree에 수정
                        //var treeItem = this.getDefinitionTree(uid);
                        // this.modify('TREE', this.PROJECT.TREE, treeItem);

                        out('TODO : 기능 확인 필요');

                        var documentItem = this.getDocument(uid);
                        this.modify('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);
                    },
                    
                    /////////////////////////////////////
                    //
                    // Element
                    //
                    /////////////////////////////////////
                    
                    //---------------------
                    // Element
                    //---------------------

                    addElement: function(el){
                        Tool.current.dataChanged = true;

                    },

                    // uid : element uid
                    removeElement: function(uid){
                        Tool.current.dataChanged = true;

                    },

                    // uid : element uid
                    modifyElement: function(uid){
                        Tool.current.dataChanged = true;

                    },

                    // uid : element uid
                    selectElement: function(uid){
                        // Tool.current.dataChanged = true;

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



