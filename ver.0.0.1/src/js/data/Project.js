/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Project 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function(application) {

        // 등록
        application.factory( 'Project', _factory );

        function Project(data){
            
            this.initialize();
            this._setProject(data);
        }

        function _factory(VersionService, ProgressService, $rootScope, $timeout){

            //---------------------
            // Project Instance Function
            //---------------------
            
            // 현재 사용중인 데이터 Instance
            Project.current = null;

            Project.prototype = {

                // tool 동작에 필요한 데이터 기록
                TOOL: null,

                // 편집 결과를 저장한 데이이터
                PROJECT: null,

                initialize: function(){
                    this.TOOL = {

                        // progress : ProgressService,
                        // version : VersionService,

                        // 문서별 undo/redo 데이터
                        // history: {},
                        
                        // 메뉴 구성 정보
                        menu : {}
                    };
                },

                setTool: function(config){
                    angular.extend(this.TOOL, config);
                    /*
                    $timeout(function() {
                        out('callLater', $rootScope);
                        $rootScope.$apply(function(){
                            //$scope.menu = $rootScope.DATA.TOOL.menu;
                        });
                    }, 0);
                    */
                },

                //---------------------
                // Project 
                //---------------------
            
                getUID : function(){
                    return this.PROJECT.uid;
                },

                getProject : function(){
                    return this.PROJECT.items;
                },
                _setProject: function(project){
                    this.PROJECT = project;
                },

                //---------------------
                // Document
                //---------------------
                
                // uid : document uid
                getDocument : function(uid){
                    return this.PROJECT.items[uid];
                },

                addDocument: function(docElement){

                },

                // uid : document uid
                removeDocument: function(uid){

                },

                // uid : document uid
                modifyDocument: function(uid){

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




                // end
            };

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



