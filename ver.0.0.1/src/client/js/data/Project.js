/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Project 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( ['U'], function( U ) {

        // 디버깅용으로 속성 노출
        if(window.debug) window.Project = Project;
        
        // 현재 사용중인 데이터 Instance
        Project.current = null;

        var _superClass;
        var _super;



        /////////////////////////////////////
        // 생성자
        /////////////////////////////////////

        function Project (){
            _superClass.apply(this, arguments);
        }

        function _factory( Data, Tool, VersionService, $rootScope, $sce, $getScope, ELEMENT ){

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
                width:1190, 
                height:670 
            };

            // Prototype 상속
            angular.extend( 
                Project.prototype,  _super, {

                    eventPrefix : 'Project',

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

                        // this.dataChanged = false;
                    },

                    // data : tree-uid.json 파일 내용
                    openProject: function(treeData, dataMap, presentationData){
                        var projectUID = treeData.uid;
                        this.initialize(projectUID);

                        this.project( 'TREE', treeData );
                        this.project( 'DOCUMENT', {
                            items: dataMap
                        } );
                        this.project( 'PRESENTATION', presentationData );

                        // 선택 상태 표시 (Root  Document를 초기 선택 상태로 표시)
                        out('TODO : 저장된 마지막 선택 문서를 선택상태로 표시하기');

                        //var uid = this.project( 'TREE').items[0].uid;
                        var documentUID = treeData.items[0].uid;
                        this.setSelectDocument(documentUID);

                        this.dataChanged = false;
                    },
                    closeProject: function(){
                        this.setSelectDocument(null);

                        this.project( 'TREE', null );
                        this.project( 'PRESENTATION', null );
                        this.project( 'DOCUMENT', null );

                        this.dataChanged = false;
                    },

                    // 최초 첫 문서 한개를 임의로 세팅
                    __checkRootDocument: function(){
                        // if(this.PROJECT.DOCUMENT.items['overview'] !== undefined) return;
                        var treeData = this.project('TREE');
                        if(treeData.items && treeData.items.length > 0) return;

                        var documentUID = this.createDocumentUID();
                        var param = {
                            documentUID: documentUID,
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

                    initialize: function(projectUID){
                        
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
                        
                        var version = VersionService.version();
                        projectUID = projectUID || this.createProjectUID();

                        this.project('DOCUMENT', {items:{}});

                        this.project('TREE', {
                            "version": version,
                            "description": "문서간 Tree 구조(depth)를 정의, 문서 uid와 1:1 매칭 (key-value)",
                            "uid": projectUID,
                            items:[]
                        });

                        // 아직 구체적으로 구현되지 않음
                        this.project('PRESENTATION', {
                            "version": version,
                            // "uid": presentationUID,
                            items:{}
                        });

                        //this.project('SELECT_DOCUMENT', {items:{}});

                        // 저장된 이후로 Projet (TREE) 데이터가 변경되었는지를 체크
                        this.dataChanged = false;

                        // 이벤트 발송
                        var eventName = '#' + this.eventPrefix + '.initialized';
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:this};
                        $rootScope.$broadcast(eventName, args); 

                        // Root Element (Overview)
                        // this.__checkRootDocument();

                        // end initialize
                    },

                    createProjectUID: function(){
                        var projectUID = 'project-' + U.createUID();
                        return projectUID;
                    },

                    // Project.current.projectAPI().add(documentUID);
                    projectAPI: function(){

                        var self = this;
                        return {
                            /*
                            "thumbnail": {
                                width : 0,
                                height: 0,
                                src : 'base64 데이터'
                            }
                            */
                            _add: function(documentUID, param){
                                var option = param.option || {};
                                var posOption = option.position;
                                var selectUID = option.selectUID;
                                var info = self.getTreePosition(selectUID, posOption);
                                
                                var treeItem = self.getDefinitionTree(documentUID);
                                info.items.splice(info.index, 0, treeItem);

                                self.dataChanged = true;
                                Tool.current.dataChanged = true;
                            },
                            _remove: function(documentUID, param){
                                var option = param.option;
                                var info = param.position;
                                var item = info.items[info.index];

                                if(option == 'only'){
                                    // 하위 노드들이 있는지 검색 후 있으면 리스트의 depth를 한단계씩 올림

                                    // subItem을 이동시킬 index
                                    var holder = info.index;
                                    var len = item.items.length;

                                    for(var i=len-1; i>=0; --i){
                                        var subItem = item.items[i];
                                        // out('subItem : ', subItem);
                                        info.items.splice(holder, 0, subItem);
                                    }

                                    // index가 변경됨
                                    var changedIndex = holder + len;
                                    info.items.splice(changedIndex, 1);

                                }else{
                                    // option == 'all' : 하위 노드 모두 제거
                                    info.items.splice(info.index, 1);
                                }

                                self.dataChanged = true;
                                Tool.current.dataChanged = true;
                            },
                            _thumbnail: function(documentUID, thumbnail){

                                var treeItem = self.getTreePosition(documentUID);
                                var item = treeItem.items[treeItem.index];

                                var oldValue = item.thumbnail;
                                var newValue = thumbnail;
                                if(angular.equals(oldValue, newValue)) return;
                                
                                item.thumbnail = newValue;
                                self.dataChanged = true;
                                Tool.current.dataChanged = true;
                            }

                        };
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // 데이터 원형
                    // 
                    //////////////////////////////////////////////////////////////////////////
                    
                    // content --> element.outerHTML
                    getDefinitionDocument : function (documentUID){

                        var version = VersionService.version();
                        var dom = this.createDocumentContent(documentUID);
                        
                        var definition = {
                            "version": version,
                            "description": "문서 편집 내용 정의",

                            "uid": documentUID,

                            // Document 구성 정보
                            "document": {

                                "uid": documentUID,

                                "id": "",
                                "content": dom,

                                /* 
                                // 생성된 thumbnail 데이터 저장
                                // var documentItem = this.getDocument(documentUID);
                                // documentItem.thumbnail.data
                                "thumbnail": {
                                    width : 0,
                                    height: 0,
                                    src : 'base64 데이터'
                                }
                                */
                            },

                            // Document 운영 정보
                            "configuration": {

                                "uid": documentUID,

                                "id": "",
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
                                "uid": documentUID,
                                "items":{}
                            },

                            // element 관련 정보를 저장한다. (Tool)
                            "element": {
                                // 현재(마지막) 선택 상태의 element uid
                                "selectUID": "",

                                // element 설정 정보를 가진 Map (elementUID:config option 설정 내용)
                                // 모든 element가 기록된 것이 아니라 수정된 사항만 있는 element만 기록 된다.
                                
                                "map": {
                                    /*
                                    // Tool에서 설정된 개별 element 설정들
                                    "key (elementUID)": {

                                        "uid": elementUID,
                                        
                                        // element type
                                        "type": ELEMENT.TEXT,
                                        
                                        "option":{

                                            // 텍스트 outline 맞춤 옵션 (true: text에 맞춤, false: 박스에 맞춤)
                                            "display_size_toText": true
                                        },

                                    }
                                    */
                                }
                            }
                        };

                        // html String를 DOM 구조로 바꾸어 놓는다.
                        // var htmlString = definition.document.content;
                        // var dom = this.stringToHtml(htmlString);
                        // definition.document.content = dom;

                        return definition;
                    },

                    htmlToString: function(dom){
                        var html = dom.outerHTML;
                        return html;
                    },

                    stringToHtml: function(htmlString){
                        var dom = angular.element(htmlString);
                        return dom[0];
                    },

                    //---------------------
                    // document 옵션 설정
                    //---------------------
                    
                    // var api = Project.current.documentAPI(documentUID);
                    // var src = api.thumbnail('src');

                    documentAPI: function(documentUID){
                        documentUID = documentUID || this.getSelectDocument();
                        var documentItem = this.getDocument(documentUID);

                        var self = this;
                        return {
                            /*
                            "thumbnail": {
                                width : 0,
                                height: 0,
                                src : 'base64 데이터'
                            }
                            */
                            thumbnail: function(name, value){
                                var prop = documentItem.document['thumbnail'] || {};

                                //GET
                                var oldValue;
                                if(name === undefined && value === undefined){
                                    oldValue = prop;
                                    return oldValue;
                                }else{
                                    if(name != null && typeof name === 'object'){
                                        // SET
                                        oldValue = angular.copy(prop);
                                    }else{
                                        // GET
                                        oldValue = prop[name];
                                        if(value === undefined){
                                            return oldValue;
                                        }
                                    }
                                }

                                // SET
                                var newValue;
                                if(name != null && typeof name === 'object'){
                                    prop = name;
                                    newValue = prop;
                                }else{
                                    // SET
                                    prop[name] = value;
                                    newValue = value;
                                }

                                //******************************************

                                // 적용 확인
                                documentItem.document['thumbnail'] = prop;

                                // project 내용에도 업데이트
                                self.projectAPI()._thumbnail(documentUID, prop);

                                //******************************************

                                if(angular.equals(oldValue, newValue)) return;

                                // EVENT
                                var eventName = '#Project.changed-thumbnail';
                                out('# 이벤트 발생 : ', eventName);

                                var args = {newValue:newValue, oldValue:oldValue, documentUID: documentUID};
                                $rootScope.$broadcast(eventName, args); 
                            }

                        };
                    },

                    //---------------------
                    // Element 옵션 설정
                    //---------------------
                    
                    // element.map[elementUID].option 속성값
                    
                    // 미리 설정되어있지 않은 값은 default 값으로 대신 세팅해 준다.
                    // (주의) 값은 객체를 사용하지 않는다. (참조값이 되버리므로)
                    _default_element_option:{
                            // 텍스트 outline 맞춤 옵션 (true: text에 맞춤, false: 박스에 맞춤)
                            "display_size_toText": false
                    },

                    // param 지정하지 않으면 현재 선택 상태의 element에 적용됨
                    // elementAPI(documentUID, elementUID).option(name);
                    // elementAPI(documentUID, elementUID).option(name, value);
                    // elementAPI()._type(value);
                    // elementAPI().option(name, value);

                    elementAPI: function(documentUID, elementUID){
                        documentUID = documentUID || this.getSelectDocument();
                        elementUID = elementUID || this.getSelectElement(documentUID);

                        var documentItem = this.getDocument(documentUID);

                        var self = this;
                        return {
                            // map에 추가
                            _type: function(value){

                                var map = documentItem.element.map || {};
                                var key = map[elementUID] || {"uid": elementUID};
                                var typeValue = key['type'];

                                var oldValue = (typeValue === undefined) ? 'unknown' : typeValue;

                                //GET
                                if(value === undefined){
                                    return oldValue;
                                }

                                // SET
                                key['type'] = value;

                                // 적용 확인
                                map[elementUID] = key;
                                documentItem.element.map = map;
                            },

                            // map에서 제거
                            remove: function(){
                                var map = documentItem.element.map || {};
                                map[elementUID] = null;
                                delete map[elementUID];
                            },

                            // 데이터 수정
                            option: function(name, value){
                                
                                var map = documentItem.element.map || {};
                                var key = map[elementUID] || {"uid": elementUID};
                                var option = key['option'] || {};

                                var oldValue = (option[name] === undefined) ? self._default_element_option[name] : option[name];

                                //GET
                                if(value === undefined){
                                    return oldValue;
                                }

                                // SET
                                option[name] = value;

                                // 적용 확인
                                key['option'] = option;
                                map[elementUID] = key;
                                documentItem.element.map = map;

                                if(oldValue == value) return;

                                // EVENT
                                var eventName = '#Project.changed-element.option.' + name;
                                out('# 이벤트 발생 : ', eventName);

                                var args = {newValue:value, oldValue:oldValue};
                                $rootScope.$broadcast(eventName, args); 
                            }
                        };
                    },

                    // 객체 유형
                    getType : function(documentUID, elementUID){
                        
                        if(!documentUID && !elementUID){
                            // throw '지정된 uid 값이 없어 type을 알아낼 수 없습니다. (Project)';
                            return null;
                        }

                        var type;
                        if(elementUID){
                            // dom = this.getElement(documentUID, elementUID);
                            // type = angular.element(dom).attr('type');
                            type = this.elementAPI(documentUID, elementUID)._type();
                        }else{
                            // var documentItem = Project.current.getDocument(documentUID);
                            // var dom = documentItem.document.content;
                            // type = angular.element(dom).attr('type');
                            type = ELEMENT.DOCUMENT;
                        }

                        // return { type: type, dom: dom };
                        return type;
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // Tree
                    //
                    //////////////////////////////////////////////////////////////////////////

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
                            "uid" : uid,
                            /*
                            // 업데이트되면서 생성됨
                            "thumbnail": {
                                "width": "200",
                                "height":"112",
                                "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABwCAYAAABbwT+GAAAFe0lEQVR4Xu2ZS2hcdRyFO0lIBumYkiC4EAyYRUIeQzKpoiIlFF342EkRpSCi6MK6EUFcaFeCio+NCx9rFXGloqBoCG6kOgkTjY0bGWq6CYYQaH2EPDxXzEYmgTkLy/R8A8P03vzPJL/v/L/cO2npCA8IQOBAAiXYQAACBxNAEHYHBA4hgCBsDwggCHsAAh4BriAeN1IhBBAkpGjG9AggiMeNVAgBBAkpmjE9AgjicSMVQgBBQopmTI8AgnjcSIUQQJCQohnTI4AgHjdSIQQQJKRoxvQIIIjHjVQIAQQJKZoxPQII4nEjFUIAQUKKZkyPAIJ43EiFEECQkKIZ0yOAIB43UiEEECSkaMb0CCCIx41UCAEECSmaMT0CCOJxIxVCAEFCimZMjwCCeNxIhRBAkJCiGdMjgCAeN1IhBBAkpGjG9AggiMeNVAgBBAkpmjE9AgjicSMVQgBBQopmTI8AgnjcSIUQQJCQohnTI4AgHjdSIQQQJKRoxvQIIIjHjVQIAQQJKZoxPQII4nEjFUIAQUKKZkyPAIJ43EiFEECQkKIZ0yOAIB43UiEEECSkaMb0CCCIx41UCAEECSmaMT0CCOJxIxVCAEFCimZMjwCCeNxIhRBAkJCiGdMjgCAeN1IhBBAkpGjG9AggiMeNVAgBBAkpmjE9AgjicSMVQgBBQopmTI8AgnjcSIUQQJCQohnTI4AgHjdSIQQQJKRoxvQIIIjHjVQIAQQJKZoxPQII4nEjFUIAQUKKZkyPAIK0wW18fHy0t7f3yNbW1iW9Di0sLHxTq9Uerdfr7+6/jY6f1vGrw8PD11YqlXt0vtHT03Nse3u7qX9fp+yvfX19t5VKpTGte6mNb8/SK0AAQVpA1yb/VJv33unp6Y8kwf06fk/HD+r4By0/tbOzU+7u7j5aCPLfuNac0vkPx8bGBiRRZXFx8WK1Wp3o6uq6Rc/39T6bMzMzd+o9LuprP12BzvmWbRBAkDZgsTSPAIK06Fy//Y8uLy9fKr6kq8cTevlMv/kvDA0NlQcGBs7s7e19oSvAztLS0o//rrlJ56o6taEry7Zun87rlmqi0WjMKT+hbHHl4dGBBBCk9S3WO9rUj01NTVV1W3SrljxeLNvd3X1Ym/+uQhDdHjX2o1p3o87XJMjPWn99f3///MbGxh2FIIVUzWbzzw7cG/zIIoAgbAMIHEIAQVrA0Qft13R6VFeFpl4vrK+vvz44OPi9rhzrxXJ9CD+hW6c3dLynw8t6ntTaeV11nmW3XV0EEKT1Ldbz2vu3F5t/bW3todXV1T8kTV23WCd1C/WlBDmu448lxZNa95bWndHzBZ0/fXVtD6ZBEPYABLjFan8P6AoxqtTbelZ0pTiuK8WkrhB1nX9Ory/uv+Pk5OQN+mvWqv5v4xGtOa3nmtZ/p9dNPX/Rh/mvtba4FePRgQS4ghxQWiGIRDivP/n2lsvlr3R79aY2+weHday/Zj2gr/+u56bWzuu1e2Rk5NjKyso/n114dB4BBOm8zviJ/0cCCNIC9uwr5+bmnrl5dvblcyfK5d++/fypu//aP1c7+8k19bP3FVcJHgEEECSgZEb0CSCIz45kAAEECSiZEX0CCOKzIxlAAEECSmZEnwCC+OxIBhBAkICSGdEngCA+O5IBBBAkoGRG9AkgiM+OZAABBAkomRF9AgjisyMZQABBAkpmRJ8AgvjsSAYQQJCAkhnRJ4AgPjuSAQQQJKBkRvQJIIjPjmQAAQQJKJkRfQII4rMjGUAAQQJKZkSfAIL47EgGEECQgJIZ0SeAID47kgEEECSgZEb0CSCIz45kAAEECSiZEX0CCOKzIxlAAEECSmZEnwCC+OxIBhBAkICSGdEngCA+O5IBBP4GLJARgNUVzmgAAAAASUVORK5CYII="
                            },
                            */
                            "items": []
                        };

                        return definition;
                    },
                    
                    //////////////////////////////////////////////////////////////////////////
                    //
                    // Document
                    //
                    //////////////////////////////////////////////////////////////////////////
                    
                    createDocumentUID: function(){
                        var documentUID = 'document-' + U.createUID();
                        return documentUID;
                    },

                    createDocumentContent: function(uid, config){
                        var doc = '<div uid="' + uid + '"></div>';
                        var $doc = angular.element(doc);

                        out('TODO : // Document 설정값 적용 : 하위 Object들을 직접 extend 해주어야 한다.');
                        // angular.extend({}, config);

                        return $doc[0];
                    },

                    // uid : document uid
                    getDocument : function(documentUID){
                        // return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, documentUID);
                        if(documentUID === undefined){
                            throw 'documentUID 값이 없습니다. (getDocument)';
                        }

                        var propertyName = 'DOCUMENT';
                        var dataOwner = this.PROJECT.DOCUMENT;
                        if(dataOwner === undefined){
                            throw propertyName + '이 정의되지 않았습니다.';
                        }

                        if(dataOwner.items === undefined) return null;
                        return dataOwner.items[documentUID];
                    },

                    // addDocumentList: function(param){}

                    //-----------------------------------
                    // add
                    //-----------------------------------
                    
                    /*
                    var param = {
                        //document : null,
                        // documentUID: uid가 지정되지 않았으면 자동 생성됨
                        documentUID : documentUID || Project.current.createDocumentUID(),

                        option: {
                            position: position,
                            // 현재 선택 상태의 document
                            selectUID: selectUID || Project.current.getSelectDocument()
                        }
                    };
                    */
                    addDocument: function(param){
                        var documentUID = param.documentUID;
                        var documentObj = param.document || {};

                        // param으로 넘어온 값(open)을 document에 적용
                        var documentItem = this.updateDocumentVersion(documentUID, documentObj);
                        var dataOwner = this.PROJECT.DOCUMENT;
                        var propertyName = 'DOCUMENT';

                        //---------------------
                        // 이벤트 발송 : #Project.add-DOCUMENT
                        var eventName = '#' + this.eventPrefix + '.add-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // 데이터 갱신
                        if(dataOwner === undefined) throw propertyName + '이 정의되지 않았습니다.';
                        if(dataOwner.items === undefined){
                            dataOwner.items = {};
                        }
                        dataOwner.items[documentUID] = documentItem;

                        // Projet
                        this.projectAPI()._add(documentUID, param);

                        Tool.current.document(documentUID).add();

                        //---------------------
                        // 이벤트 발송 : #Project.added-DOCUMENT
                        var eventName = '#' + this.eventPrefix + '.added-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        // document 추가
                        // this.add('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);
                        // out('# 추가 된 Document : ', documentItem);

                        // 선택 표시
                        this.setSelectDocument(documentUID);
                    },

                    // 문서 내용(기능)을 최신 개발 버전으로  강제 업데이트
                    updateDocumentVersion: function(documentUID, documentObj){

                        // param으로 넘어온 값(open)을 document에 적용
                        var documentItem = this.getDefinitionDocument(documentUID);

                        // 하위 Object들을 직접 extend 해주어야 한다.
                        angular.extend(documentItem.document, documentObj.document);
                        angular.extend(documentItem.configuration, documentObj.configuration);
                        angular.extend(documentItem.todos, documentObj.todos);
                        angular.extend(documentItem.element, documentObj.element);

                        return documentItem;
                    },

                    //-----------------------------------
                    // modify
                    //-----------------------------------

                    /*
                    param = {
                        // 삽입될 문서
                        documentUID : documentUID,

                        // element 설정값
                        option: $scope.option,
                        css: $scope.css
                    };
                    */
                    
                    // Document 내용 수정
                    // Document Option값 수정은 configDocument 에서
                    modifyDocument: function(param){

                        out('modify param : ', param);
                        var documentUID = param.documentUID;
                        // var option = param.option;
                        var css = param.css;

                        if(documentUID === undefined) throw 'documentUID 값이 없습니다. (modify)';
                        var documentItem = this.getDocument(documentUID);

                        var propertyName = 'DOCUMENT';
                        var dataOwner = this.PROJECT.DOCUMENT;
                        if(dataOwner === undefined) throw propertyName + '이 정의되지 않았습니다.';
                        if(dataOwner.items === undefined){
                            dataOwner.items = {};
                        }

                        //---------------------
                        // 이벤트 발송 : #Project.modify-DOCUMENT
                        var eventName = '#' + this.eventPrefix + '.modify-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // 데이터 갱신 (css)
                        
                        // (예외) 크기 지정하지 않는다.
                        // 크기 지정시 바닥의 click 이벤트(element 선택 해지)를 가려버리게 된다.
                        css.width = 'initial';
                        css.height = 'initial';

                        var dom = documentItem.document.content;
                        angular.element(dom).css(css);

                        /*
                        //---------------------
                        // 데이터 갱신 (option)
                        // var api = Project.current.elementAPI (documentUID, elementUID);
                        for(var prop in option){
                            // api.option(prop, option[prop]);
                            var categoryName = prop;
                            var category = option[prop];

                            var apiName = 'config_' + categoryName;
                            var func = Tool.current[apiName];
                            if(!func){
                                throw '해당 메서드를 찾을 수 없습니다. : Tool.' + apiName;
                            }

                            out(' * option 업데이트 - ', prop, ' : ', option[prop]);

                            // 해당 카테고리의 값을 업데이트한다.
                            // 예) display 카테고리 :  Tool.current.config_display.config_display('snap_pixel', newValue);
                            for(var name in category){
                                var value = category[name];
                                func.apply(Tool.current, [name, value]);
                            }
                        }
                        */

                        //---------------------
                        // Document Item 데이터 갱신
                        // (명시적으로 코드에 적어두는 것임. 레퍼런스 참조이므로 데이터는 이미 업데이트됨)
                        dataOwner.items[documentUID] = documentItem;

                        Tool.current.document(documentUID).dataChanged(true);

                        //---------------------
                        // 이벤트 발송 : #Project.modified-DOCUMENT
                        var eventName = '#' + this.eventPrefix + '.modified-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        // this.modify('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);
                    },

                    //-----------------------------------
                    // remove
                    //-----------------------------------
                    
                    // removeDocumentList: function(param){}

                    /*
                    var param = {
                        uid : selectUID,
                        option : 'all' | 'only'
                    };
                    */
                    removeDocument: function(param){

                        // 삭제 대상이 되는 document UID
                        var uid = param.documentUID;

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
                                var documentUID = item.uid;

                                // 이벤트 매개변수에 전달하기 위해 변수 생성함
                                param.position = info;

                                // var documentItem = this.getDocument(uid);
                                // this.remove('DOCUMENT', this.PROJECT.DOCUMENT, documentItem, param);

                                var documentItem = this.getDocument(documentUID);
                                var dataOwner = this.PROJECT.DOCUMENT;
                                var propertyName = 'DOCUMENT';

                                //---------------------
                                // 이벤트 발송 : #Project.remove-DOCUMENT
                                var eventName = '#' + this.eventPrefix + '.remove-' + propertyName;
                                out('# 이벤트 발생 (before) : ', eventName);
                                var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                                $rootScope.$broadcast(eventName, args); 

                                //---------------------
                                // 데이터 갱신
                                if(dataOwner === undefined) throw propertyName + '이 정의되지 않았습니다.';
                                if(dataOwner.items === undefined) return;
                                dataOwner.items[documentUID] = null;
                                delete dataOwner.items[documentUID];

                                // Projet
                                this.projectAPI()._remove(documentUID, param);

                                Tool.current.document(documentUID).remove();

                                //---------------------
                                // 이벤트 발송 : #Project.removed-DOCUMENT
                                var eventName = '#' + this.eventPrefix + '.removed-' + propertyName;
                                out('# 이벤트 발생 : ', eventName);
                                var args = {data:dataOwner, item:documentItem, name:propertyName, param:param};
                                $rootScope.$broadcast(eventName, args); 
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
                                this._getTreeToArray(item.items, list, list_uid, (_depth+1));
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

                    //-----------------------------------
                    // Select Document
                    //-----------------------------------

                    getSelectDocument : function(){
                        // var documentUID = this.project('DOCUMENT').selectUID;
                        // return this.__get('DOCUMENT', this.PROJECT.DOCUMENT, documentUID);
                        return Tool.current._getSelectDocument();
                    },

                    setSelectDocument: function(documentUID){
                        if(documentUID === undefined){
                            throw 'documentUID 값이 없습니다. (document)';
                        }

                        // GET
                        var oldValue = this.getSelectDocument();
                        var newValue = documentUID;
                        if(oldValue == newValue) return;

                        //---------------------
                        // 이벤트 발송 : #Project.select-ELEMENT
                        var propertyName = 'DOCUMENT';
                        var eventName = '#' + this.eventPrefix + '.select-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {newValue:newValue, name:propertyName, oldValue:oldValue};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // SET
                        Tool.current._setSelectDocument(documentUID);

                        //---------------------
                        // 이벤트 발송 : #Project.selected-ELEMENT
                        var propertyName = 'DOCUMENT';
                        var eventName = '#' + this.eventPrefix + '.selected-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {newValue:newValue, name:propertyName, oldValue:oldValue};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // 선택 표시

                        //*******************************************************

                        // if(documentUID == null) return;

                        // 현재 선택 상태의 문서이면 Element 선택 표시
                        // var elementUID = this.getSelectElement(documentUID);
                        // this.setSelectElement(documentUID, elementUID, true);

                        //*******************************************************
                    },

                    //////////////////////////////////////////////////////////////////////////
                    //
                    // Element
                    //
                    //////////////////////////////////////////////////////////////////////////
                    
                    createElementUID: function(){
                        var elementUID = 'element-' + U.createUID();
                        return elementUID;
                    },

                    // 유형에 따라 comp 내용을 구성
                    // type : html(문서), tag(태그묶음), text(글상자)...
                    createElementContent: function(type, elementUID, option, css){
                        var comp = '<div uid="' + elementUID + '">TEXT</div>';
                        // var comp = '<textarea uid="' + elementUID + '">TEXT</textarea>';
                        var $comp = angular.element(comp);
                        if(css) $comp.css(css);

                        out('TODO : // Element 설정값 적용 : 하위 Object들을 직접 extend 해주어야 한다.');
                        // angular.extend({}, config);

                        return $comp;
                    },

                    // uid : element uid
                    getElement : function(documentUID, elementUID){
                        var documentItem = this.getDocument(documentUID)
                        var $dom = angular.element(documentItem.document.content);
                        var $element = $dom.find("[uid='" + elementUID + "']");
                        return $element[0];
                    },
                    
                    //-----------------------------------
                    // add Element
                    //-----------------------------------

                    /*
                    var param = {
                        // 삽입될 문서
                        documentUID : documentUID || Project.current.getSelectDocument(),
                        
                        // uid가 지정되지 않았으면 command에서 자동 생성됨
                        uid: elementUID || Project.current.createElementUID(),
                        type: type,

                        // element 설정값 (config)
                        option: {}
                    };
                    */

                    addElement: function(param){

                        // document에 데이터를 추가한다.
                        // out('param : ', param);

                        var elementUID = param.elementUID;
                        var documentUID = param.documentUID;
                        var type = param.type;
                        var option = param.option;
                        var css = param.css;
                        
                        // DOM
                        // param으로 넘어온 값(open)을 document에 적용
                        var documentItem = this.getDocument(documentUID);
                        var content = documentItem.document.content;
                        var $content = angular.element(content);

                        //---------------------
                        // 이벤트 발송 : #Project.add-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.add-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {data:documentItem, item:documentItem.document.content, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // DOM 추가

                        var $comp = this.createElementContent(type, elementUID, option, css);
                        $content.append($comp);

                        // 데이터 갱신 (이미 dom 차원에서 갱신되어 있지만 그냥 명시적으로 기술함)
                        documentItem.document.content = $content[0];

                        // Map에 type 추가
                        this.elementAPI(documentUID, elementUID)._type(type);

                        // option 추가
                        for(var name in option){
                            this.elementAPI(documentUID, elementUID).option(name, option[name]);
                        }
                        
                        Tool.current.document(documentUID).dataChanged(true);

                        //---------------------
                        // 이벤트 발송 : #Project.added-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.added-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:documentItem, item:documentItem.document.content, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // 선택 표시 - DOM 구조 랜더링 후로 지연시켜야할듯

                        //*******************************************************

                        // Document 선택 표시
                        // this.setSelectDocument(documentUID);

                        // 현재 선택 상태의 문서이면 Element 선택 표시
                        // this.setSelectElement(documentUID, elementUID, true);

                        //*******************************************************
                    },

                    //-----------------------------------
                    // remove Element
                    //-----------------------------------

                    // uid : element uid
                    removeElement: function(param){

                        var documentUID = param.documentUID || Project.current.getSelectDocument();
                        var elementUID = param.elementUID || Project.current.getSelectElement(documentUID);

                        // DOM
                        // param으로 넘어온 값(open)을 document에 적용
                        var documentItem = this.getDocument(documentUID);
                        var content = documentItem.document.content;
                        var $content = angular.element(content);

                        var dom = this.getElement(documentUID, elementUID);

                        //---------------------
                        // 이벤트 발송 : #Project.remove-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.remove-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {data:documentItem, item:dom, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        // 제거
                        angular.element(dom).remove();

                        // 데이터 갱신 (이미 dom 차원에서 갱신되어 있지만 그냥 명시적으로 기술함)
                        documentItem.document.content = $content[0];

                        // Map에서 제거
                        this.elementAPI(documentUID, elementUID).remove();

                        Tool.current.document(documentUID).dataChanged(true);

                        //---------------------
                        // 이벤트 발송 : #Project.removed-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.removed-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:documentItem, item:dom, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 
                    },

                    //-----------------------------------
                    // select Element
                    //-----------------------------------

                    getSelectElement: function(documentUID){
                        documentUID = documentUID || this.getSelectDocument();
                        var documentItem = this.getDocument(documentUID);
                        if(!documentItem) return null;

                        var elementUID = documentItem.element.selectUID;
                        return elementUID;
                    },

                    // uid : element uid
                    setSelectElement: function(documentUID, elementUID, forced){

                        if(documentUID === undefined){
                            throw '지정된 document의 uid 값이 없습니다. (element)';
                        }
                        
                        documentUID = documentUID || this.getSelectDocument();

                        // GET
                        var oldValue = this.getSelectElement(documentUID);
                        var newValue = elementUID;
                        if(!forced && oldValue == newValue) return;

                        //---------------------
                        // 이벤트 발송 : #Project.select-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.select-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {
                            name:propertyName, 
                            newValue:newValue, 
                            oldValue:oldValue,
                            documentUID:documentUID
                        };
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // SET
                        // Document 선택 표시
                        // this.setSelectDocument(documentUID);

                        // Element 선택 표시값 갱신
                        var documentItem = this.getDocument(documentUID);
                        documentItem.element.selectUID = elementUID;

                        // 데이터 변경됨을 기록
                        Tool.current.document(documentUID).dataChanged(true);

                        //---------------------
                        // 이벤트 발송 : #Project.selected-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.selected-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);

                        var args = {
                            name:propertyName, 
                            newValue:newValue, 
                            oldValue:oldValue,
                            documentUID:documentUID
                        };
                        $rootScope.$broadcast(eventName, args); 
                    },

                    //-----------------------------------
                    // modify Element
                    //-----------------------------------
                    /*
                    var param = {
                        // 삽입될 문서
                        documentUID : Project.current.getSelectDocument(),
                        elementUID: elementUID,
                        // element 설정값
                        option: {},
                        css: {
                            'width': e.width * (1/scale),
                            'height': e.height * (1/scale)
                        }
                    };
                    */
                    modifyElement: function(param){

                        out('modify param : ', param);
                        var elementUID = param.elementUID;
                        var documentUID = param.documentUID;
                        var option = param.option;
                        var css = param.css;

                        var documentItem = this.getDocument(documentUID);
                        var dom = this.getElement(documentUID, elementUID);

                        //---------------------
                        // 이벤트 발송 : #Project.modifiy-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.modifiy-' + propertyName;
                        out('# 이벤트 발생 (before) : ', eventName);
                        var args = {data:documentItem, item:dom, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 

                        //---------------------
                        // 데이터 갱신 (Element Type에 따른 개별 설정)
                        this.setModifyElementParameter(documentUID, elementUID, param);

                        //---------------------
                        // 데이터 갱신 (css)                        
                        if(css) angular.element(dom).css(css);

                        // 데이터 갱신 (option)
                        var api = Project.current.elementAPI (documentUID, elementUID);
                        for(var prop in option){
                            api.option(prop, option[prop]);
                        }

                        Tool.current.document(documentUID).dataChanged(true);

                        //---------------------
                        // 이벤트 발송 : #Project.modified-ELEMENT
                        var propertyName = 'ELEMENT';
                        var eventName = '#' + this.eventPrefix + '.modified-' + propertyName;
                        out('# 이벤트 발생 : ', eventName);
                        var args = {data:documentItem, item:dom, name:propertyName, param:param};
                        $rootScope.$broadcast(eventName, args); 
                    },

                    getModifyElementParameter: function(documentUID, elementUID){
                        var selector = '#hi-contentContainer [uid=' + elementUID + ']';
                        var scope = $getScope(selector, 'element');
                        return scope.getModifyElementParameter(documentUID, elementUID);
                    },

                    setModifyElementParameter: function(documentUID, elementUID, param){
                        var selector = '#hi-contentContainer [uid=' + elementUID + ']';
                        var scope = $getScope(selector, 'element');
                        return scope.setModifyElementParameter(documentUID, elementUID, param);
                    }

                    // end prototype
                }
            );

            return Project;
        }

        // 리턴
        _factory._regist = function(application){
            // 등록
            application.factory( 'Project', _factory );
        };
        return _factory;

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



