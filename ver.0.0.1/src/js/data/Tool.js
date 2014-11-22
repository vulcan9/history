/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : Tool 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function(application, U) {

        out ('TODO : // 디버깅용으로 노출된 속성 비활성화 시킬것 (Tool)')
        window.Tool = Tool;
        
        // 현재 사용중인 데이터 Instance
        Tool.current = null;

        var _superClass;
        var _super;

        // 등록
        application.factory( 'Tool', _factory );

        /////////////////////////////////////
        // 생성자
        /////////////////////////////////////

        function Tool(callback){
            this.initialize(callback);
        }

        function _factory( Data, $rootScope, $timeout ){

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            _superClass = Data;
            _super = _superClass.prototype;

            //------------------------------------------
            // angular의 Injection 활용을 위해 이곳에서 Prototype을 정의한다.
            //------------------------------------------
            
            // Prototype 상속
            angular.extend( Tool.prototype,  _super, {

                eventPrefix : 'Tool',

                initialize: function(callback){

                    _super.initialize.apply(this, arguments);

                    //---------------------
                    // 속성
                    //---------------------
                    
                    // 초기화가 완료된 상태인지 체크
                    this.initialized = false;

                    // 저장 성공 여부 기록
                    // this._saveSuccessed = undefined;
                    
                    // 저장된 이후로 데이터가 변경되었는지를 체크
                    this.dataChanged = false;

                    //---------------------
                    // TOOL 속성 : tool 동작에 필요한 데이터 기록 (자동 생성)
                    //---------------------
                    
                    // 읽기 전용 TOOL 속성 생성
                    // 속성 접근 : tool (key, value);
                    this.tool = this.__createProxy ('this', 'TOOL', {

                            // progress : ProgressService,
                            // version : VersionService,

                            // 문서별 undo/redo 데이터
                            // history: {},
                            
                            // 현재 선택 문서 (uid)
                            //__SELECT_DOCUMENT: null,
                            __CURRENT: null,

                            // 메뉴 구성 정보
                            __MENU : null
                        }
                    );

                    // 현재 실행 state를 기록한다.
                    this.tool('CURRENT', {
                        document:{
                            selectUID:null
                        },
                        element:{
                            selectUID:null
                        }
                    });

                    // 데이터 로드 상태 확인
                    var removeHandler = $rootScope.$on('#Tool.changed-MENU', angular.bind(this, onDataChanged)); 
                    
                    function onDataChanged(e, data){
                        
                        out('# 필요한 모든 데이터 로드가 완료 되었는지 확인');
                        
                        out('------->TODO : $q.defer(); tnen 이용');
                        // http://blog.naver.com/youmasan/130189628570

                        if(this.TOOL.MENU){
                            this.initialized = true;
                            removeHandler();

                            // 랜더링 실행 시간을 고려하여 약간의 delay를 준다.
                            if(callback){
                                $timeout(callback, 0);
                            }
                        }
                    }
                    // end initialize
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

                _getSelectDocument: function(){
                    return Tool.current.tool('CURRENT').document.selectUID;
                },

                _setSelectDocument: function(uid){
                    Tool.current.tool('CURRENT').document.selectUID = uid;
                }

                
                

                //////////////////////////////////////////////////////////////////////////
                //
                // 데이터 조작 API
                // 
                //////////////////////////////////////////////////////////////////////////

                // end
            });

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


*/



