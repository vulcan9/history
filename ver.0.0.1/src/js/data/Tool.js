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

        // 디버깅용으로 속성 노출
        if(window.debug) window.Tool = Tool;
        
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
                            
                            // 현재 Tool 실행시 중요한 state값 저장
                            __CURRENT: null,

                            // 메뉴 구성 정보
                            __MENU : null,

                            __CONFIG : null
                        }
                    );

                    // Tool 설정치
                    this._config_default();

                    // 데이터 로드 상태 확인
                    this._setMenu(callback);

                    // end initialize
                },
                
                ////////////////////////////////////////
                // MENU
                ////////////////////////////////////////
                
                // 데이터 로드 상태 확인
                _setMenu: function(callback){

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
                },

                //---------------------
                // Element 
                //---------------------
                /*
                _getSelectElement: function(){
                    return this.tool('CURRENT').element.selectUID;
                },

                _setSelectElement: function(uid){
                    this.tool('CURRENT').element.selectUID = uid;
                    this.dataChanged = true;
                }
                */
                
                //////////////////////////////////////////////////////////////////////////
                //
                // 옵션 설정
                // 
                //////////////////////////////////////////////////////////////////////////

                _config_default: function(){
                    
                    this.tool('CONFIG', {

                        transition : {
                            // second
                            TICK : 0.2,
                            SHORTEST : 0.5,
                            SHORT : 1,
                            LONG : 2,
                            LONGEST : 0
                        },

                        display : {
                            
                            //마지막 설정된 스케일 값 저장
                            // display_scale: 1,

                            // 텍스트 outline 맞춤 옵션 (true: text에 맞춤, false: 박스에 맞춤)
                            // display_size_toText: false,

                            // snap 크기 (pixel >= 1)
                            snap_pixel: 10,
                            // grid 보이기
                            show_grid: true,
                            // guide 라인 보이기
                            // show_guide: true,
                            // ruler 보이기
                            // show_ruler: true
                        },

                        thumbnail : {
                            // 가로 너비, 세로 너비(px)는 Paper의 가로/세로 비율에 맞추어 size를 넘지 않는 범위에서 자동 설정됨
                            // 이 값은 thumbnail을 캡쳐할때 생성되는 이미지의 크기 계산에 사용됨
                            // 캡쳐된 thumbnail 이미지 정보는 Project.current.getDocument(documentUID).thumbnail.data 로 접근
                            size: 200
                        }
                    });

                    // 현재 실행 state를 기록한다.
                    this.tool('CURRENT', {
                        document:{
                            // 현재 선택 문서 (uid)
                            selectUID:null,

                            /* 
                            // 현재 사용안함
                            // document 설정 정보를 가진 Map (documentUID:config option 설정 내용)
                            "map": {
                                // Tool에서 설정된 개별 document 설정들
                                "key (documentUID)": {

                                    "uid": documentUID,
                                    
                                    // element type
                                    // "type": ELEMENT.DOCUMENT,
                                    
                                    "option":{
                                        display : {
                                            snap_pixel: 10,
                                            show_grid: true
                                        }
                                    },

                                }
                            }
                            */
                        }
                    });
  
                },

                // Command에서 Option값 수정
                configuration: function(param){
                    this.dataChanged = true;

                    out('config param : ', param);
                    var option = param.option;

                    var propertyName = 'TOOL.CONFIG';
                    var dataOwner = this.TOOL.CONFIG;
                    if(dataOwner === undefined) throw propertyName + '이 정의되지 않았습니다.';

                    //---------------------
                    // 이벤트 발송 : #Tool.config-TOOL.CONFIG
                    var eventName = '#' + this.eventPrefix + '.config-' + propertyName;
                    out('# 이벤트 발생 (before) : ', eventName);
                    var args = {data:dataOwner, param:param};
                    $rootScope.$broadcast(eventName, args); 

                    //---------------------
                    // 데이터 갱신 (option)
                    for(var prop in option){
                        // api.option(prop, option[prop]);
                        var categoryName = prop;
                        var category = option[prop];

                        var apiName = 'config_' + categoryName;
                        var func = this[apiName];
                        if(!func){
                            throw '해당 메서드를 찾을 수 없습니다. : Tool.' + apiName;
                        }

                        out(' * option 업데이트 - ', prop, ' : ', option[prop]);

                        // 해당 카테고리의 값을 업데이트한다.
                        // 예) display 카테고리 :  Tool.current.config_display.config_display('snap_pixel', newValue);
                        for(var name in category){
                            var value = category[name];
                            func.apply(this, [name, value]);
                        }
                    }

                    //---------------------
                    // 이벤트 발송 : #Tool.configed-TOOL.CONFIG
                    var eventName = '#' + this.eventPrefix + '.configed-' + propertyName;
                    out('# 이벤트 발생 : ', eventName);
                    var args = {data:dataOwner, param:param};
                    $rootScope.$broadcast(eventName, args); 
                },

                //---------------------
                // Tool CURRENT 값 수정
                //---------------------
                
                _getSelectDocument: function(){
                    return this.tool('CURRENT').document.selectUID;
                },

                _setSelectDocument: function(uid){
                    this.tool('CURRENT').document.selectUID = uid;
                    this.dataChanged = true;
                },

                //---------------------
                // Tool CONFIG 값 수정
                //---------------------
                
                // CONFIG - display category  수정
                // Tool.current.config_display (name);
                config_display: function(name, value){
                    if(value === undefined){
                        //GET
                        return this.tool('CONFIG').display[name];
                    }

                    // this.dataChanged = true;

                    // SET
                    var oldValue = this.tool('CONFIG').display[name];
                    this.tool('CONFIG').display[name] = value;

                    if(oldValue == value) return;

                    // EVENT
                    var eventName = '#Tool.changed-CONFIG.display.' + name;
                    out('# 이벤트 발생 : ', eventName);

                    var args = {newValue:value, oldValue:oldValue};
                    $rootScope.$broadcast(eventName, args); 
                },

                // CONFIG - thumbnail category  수정
                // Tool.current.config_thumbnail ('width');
                config_thumbnail: function(name, value){
                    if(value === undefined){
                        //GET
                        return this.tool('CONFIG').thumbnail[name];
                    }

                    // this.dataChanged = true;

                    // SET
                    var oldValue = this.tool('CONFIG').thumbnail[name];
                    this.tool('CONFIG').thumbnail[name] = value;

                    if(oldValue == value) return;

                    // EVENT
                    var eventName = '#Tool.changed-CONFIG.thumbnail.' + name;
                    out('# 이벤트 발생 : ', eventName);

                    var args = {newValue:value, oldValue:oldValue};
                    $rootScope.$broadcast(eventName, args); 
                }

                ////////////////////////////////////////
                // _factory end
                ////////////////////////////////////////
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



