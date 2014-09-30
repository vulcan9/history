/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : Tool 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'Utils'
    ],
    function(application, Utils) {

        out ('TODO : // 디버깅용으로 노출된 속성 비활성화 시킬것 (Tool)')
        window.Tool = Tool;
        
        // 현재 사용중인 데이터 Instance
        Tool.current = null;
        
        function Tool(){
            this.initialize();
        }

        // 등록
        application.factory( 'Tool', _factory );

        function _factory( ProgressService, $rootScope, $timeout){

            //------------------------------------------
            // angular의 Injection 활용을 위해 이곳에서 Prototype을 정의한다.
            //------------------------------------------
            
            Tool.prototype = {

                // tool 동작에 필요한 데이터 기록 (자동 생성)
                // __TOOL: null,

                // 편집 결과를 저장한 데이이터 (자동 생성)
                // __PROJECT: null,

                initialize: function(){
                    
                    //---------------------
                    // TOOL 속성
                    //---------------------
                    
                    // 읽기 전용 TOOL 속성 생성
                    // 속성 접근 : tool (key, value);
                    this.tool = this.__createProxy ('this', 'TOOL', {

                            // progress : ProgressService,
                            // version : VersionService,

                            // 문서별 undo/redo 데이터
                            // history: {},
                            
                            // 메뉴 구성 정보
                            __MENU : null
                        }
                    );

                },

                /*
                name에 해당하는 속성 NAME, __NAME이 생성됨
                getter, setter 메서드인 name 이 생성됨
                 - 메서드 : name()
                 - 속성 : NAME
                
                // set
                Tool.current.tool ('MENU', data);
                // get
                $scope.menu = Tool.current.tool('MENU');
                // 하위 속성 접근
                Tool.current.tool('menu')('uid')
                */
                
                __createProxy : function  (dataPath, name, initValue){
                    
                    // Proxy 속성 설정
                    var property = name.toUpperCase();
                    var prop = '__' + property;

                    // path에 self가 있을 수있으므로 미리 정의해 놓는다.
                    var self = this;
                    // this는 상황에 따라 context가 바뀔수 있으므로 self로 고정시켜 준다.
                    dataPath = dataPath.replace(/\bthis\./, 'self\.');
                    var owner = eval(dataPath);

                    Utils.defineProperty ( owner, property, 'readOnly' );
                    owner[prop] = initValue;

                    // Proxy 메서드 설정
                    var pathString = dataPath + '.' + name;

                    function proxy (key, value){
                        if(arguments.length < 1){
                            throw new Error('전달된 인자가 없습니다.');
                            return;
                        }

                        // out('pathString : ', pathString);

                        // GETTER
                        var data = eval(pathString);
                        if(value === undefined){
                            return data[key];
                        }
                        
                        var property = key.toUpperCase();
                        var prop = '__' + property;
                        
                        // 미리 예상된 변수만 허용하기 위해 체크함
                        if(prop in data == false){
                            throw new Error(
                                pathString + '.' + prop + ' 속성이 정의되어 있지 않습니다.\n' + 
                                prop + ' 속성값을 먼저 선언 하세요.'
                            );
                            return;
                        }

                        // SETTER
                        var methodName = key.toLowerCase();
                        data[methodName] = self.__createProxy.apply (self, [pathString, property, value]);
                        // data[key] = value;
                    }

                    return proxy;
                },

                

                /*
                setTool: function(config){
                    angular.extend(this.__TOOL, config);
                },
                */
               
                //---------------------
                // Tool 
                //---------------------
                
                /*
                getUID : function(){
                    return this.PROJECT.uid;
                },
                */
                
                /*
                setTool: function(project){
                    this.__PROJECT = project;
                },
                */
                //
                

                //////////////////////////////////////////////////////////////////////////
                //
                // 데이터 조작 API
                // 
                //////////////////////////////////////////////////////////////////////////

                // end
            };

            return Tool;
        }

        // 리턴
        return Tool;

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

    "uid": "project-b16fea9c-d10a-413b-ba20-08344f937336",

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



