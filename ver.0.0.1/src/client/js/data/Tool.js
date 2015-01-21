/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : Tool 데이터 관리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( ['U'], function( U ) {

        // 디버깅용으로 속성 노출
        if(window.debug) window.Tool = Tool;
        
        // 현재 사용중인 데이터 Instance
        Tool.current = null;

        var _superClass;
        var _super;


        /////////////////////////////////////
        // 생성자
        /////////////////////////////////////

        function Tool(callback){
            this.initialize(callback);
        }

        Tool.transition = {
            // second
            TICK : 0.2,
            SHORTEST : 0.5,
            SHORT : 1,
            LONG : 2,
            LONGEST : 0
        };

        function _factory( Data, $rootScope, $timeout, AuthService, $q, ProcessService, HttpService ){

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            _superClass = Data;
            _super = _superClass.prototype;

            //------------------------------------------
            // angular의 Injection 활용을 위해 이곳에서 Prototype을 정의한다.
            //------------------------------------------
            
            // 데이터를 한번만 로드하기 위해 임시 저장
            var _menuData, _configData;

            // Prototype 상속
            angular.extend( Tool.prototype,  _super, {

                eventPrefix : 'Tool',

                initialize: function(callback){

                    _super.initialize.apply(this, arguments);

                    //---------------------
                    // Default 데이터 정의
                    //---------------------

                    // var self = this;
                    var process = ProcessService.process();
                    process.start().then(
                        angular.bind(this, function(){
                            
                            // 초기화가 완료된 상태인지 체크
                            this.initialized = false;

                            //---------------------
                            // TOOL 속성 : tool 동작에 필요한 데이터 기록 (자동 생성)
                            //---------------------
                            
                            // 읽기 전용 TOOL 속성 생성
                            // 속성 접근 : tool (key, value);
                            this.tool = this.__createProxy ('this', 'TOOL', {

                                    // progress : ProgressService,
                                    // version : VersionService,

                                    // 문서별 undo/redo 데이터
                                    // __HISTORY: {},
                                    
                                    // 현재 Tool 실행시 중요한 state값 저장
                                    __CURRENT: null,

                                    // 메뉴 구성 정보
                                    __MENU : null,

                                    __CONFIG : null
                                }
                            );

                            // Tool 설정치
                            this._config_default_CONFIG();
                            this._config_default_CURRENT();

                        })
                    );
                    
                    //---------------------
                    // 데이터 로드 상태 확인
                    //---------------------
                    
                    process.add($q.defer(), angular.bind(this, this._load))
                    .then(function(){
                        //
                    });

                    process.add($q.defer(), angular.bind(this, this._loadMenu))
                    .then(function(){
                        //
                    });

                    //---------------------
                    // 데이터 세팅 완료
                    //---------------------

                    process.end().then(
                        angular.bind(this, function(){
                            // 저장된 이후로 데이터가 변경되었는지를 체크
                            this.dataChanged = false;

                            // 랜더링 실행 시간을 고려하여 약간의 delay를 준다.
                            if(callback){
                                $timeout(callback, 0);
                            }

                            // 이벤트 발송
                            var eventName = '#' + this.eventPrefix + '.initialized';
                            out('# 이벤트 발생 : ', eventName);
                            var args = {data:this};
                            $rootScope.$broadcast(eventName, args); 

                        })
                    );

                    // end initialize
                },
                
                newProject: function(calback){
                    var self = this;
                    this.initialize(function(){
                        if(calback) calback();
                        // self.dataChanged = false;
                        // self.tool('CONFIG').dataChanged = false;
                    });
                },

                openProject: function(){
                    this.dataChanged = false;
                    this.tool('CONFIG').dataChanged = false;
                },
                
                closeProject: function(){
                    this.dataChanged = false;
                    this.tool('CONFIG').dataChanged = false;
                },

                ////////////////////////////////////////
                // Tool  User 데이터
                ////////////////////////////////////////

                // User 로그인이 되어있는 경우 Tool 설정 로드
                _load: function (defer){

                    if(!AuthService.session){
                        defer.resolve();
                        return;
                    }
                    
                    if(_configData){
                        this.tool('CONFIG', _configData);
                        defer.resolve();
                        return;
                    }

                    out('AuthService.session  : ', AuthService.session);
                    var uid = 'Tool Configuration Data';
                    var userID = AuthService.session.id;

                    var promise = HttpService.load( {
                            method: 'GET',
                            url: '/user'+ '/' + userID + '/tool',
                            params: {
                                // user: userID
                            }
                        } )
                        .then( 
                            angular.bind(this, success), 
                            angular.bind(this, error)
                        );

                    /*
                    result = {
                        message: 'success',
                        data: (doc? doc.tool : null)
                    }
                    */
                    function success(result){
                        out ('# Tool 데이터 조회 완료 : ', result);

                        if(result.data){
                            _configData = angular.fromJson(result.data);
                            this.tool('CONFIG', _configData);
                        }

                        defer.resolve();
                    }

                    function error(result){
                        out ('# Tool 데이터 조회 에러 : ', result);

                        // defer.reject( data );
                        defer.resolve();
                    }
                },

                ////////////////////////////////////////
                // MENU
                ////////////////////////////////////////

                // MENU 데이터 로드 상태 확인
                _loadMenu: function (defer){

                    var self = this;
                    var removeHandler = $rootScope.$on('#Tool.changed-MENU', angular.bind(this, onMenuDataChanged)); 

                    // if(this.TOOL.MENU){
                    if(_menuData){
                        self.tool ('MENU', _menuData);
                        return;
                    }
                    
                    var menuURL = _PATH.ROOT + 'data/menu.json';
                    var promise = HttpService.load( {
                            method: 'GET',
                            url: menuURL
                        } )
                        .then( success, error );

                    function success(data){
                        out ('# Menu 로드 완료 : ', data);
                        // ProgressService.complete();

                        // 데이터 변경
                        _menuData = data;
                        self.tool ('MENU', data);

                        // setTimeout(function(){
                        //     self.tool ('MENU', data);
                        // }, 5000);
                    }

                    function error(){
                        out ('# Menu 로드 에러 : ', menuURL);
                        // ProgressService.complete();

                        self.tool ('MENU', null);
                    }

                    function onMenuDataChanged(e, data){
                        
                        out('# 필요한 모든 데이터 로드가 완료 되었는지 확인');
                        out('------->TODO : $q.defer(); tnen 이용');
                        // http://blog.naver.com/youmasan/130189628570

                        if(this.TOOL.MENU){
                            this.initialized = true;
                            removeHandler();
                        }else{
                            throw new Error('Menu 데이터를 설정할 수 없습니다.');
                        }

                        defer.resolve();
                    }
                },

                /*
                // 데이터 로드 상태 확인
                _setMenu: function(callback){
                    if(this.TOOL.MENU){
                        onDataChanged();
                        return;
                    }

                    //  menuView에서 로드됨
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
                */

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
                // 옵션 초기값 설정
                // 
                //////////////////////////////////////////////////////////////////////////

                _config_default_CONFIG: function(){
                    
                    this.tool('CONFIG', {
                        
                        // Tool UID
                        // uid: 'tool-' + U.createUID(),

                        // 실행시 임시로 저장되는 데이터임 (저장여부를 판단하기 위해)
                        //  저장되면 이 변수는 다시 삭제됨
                        // dataChanged : false,

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
                    
                },

                //////////////////////////////////////////////////////////////////////////
                //
                // CONFIG 옵션 설정
                // 
                //////////////////////////////////////////////////////////////////////////

                /*
                예) option 설정
                configuration({
                    "option": $scope.option
                });
                */
                // Command에서 Option값 수정
                configuration: function(param){

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
                        // 예) display 카테고리 :  Tool.current.config_display('snap_pixel', newValue);
                        for(var name in category){
                            var value = category[name];
                            func.apply(this, [name, value]);
                        }
                    }

                    // this.dataChanged = true;
                    // this.tool('CONFIG').dataChanged = true;

                    //---------------------
                    // 이벤트 발송 : #Tool.configed-TOOL.CONFIG
                    var eventName = '#' + this.eventPrefix + '.configed-' + propertyName;
                    out('# 이벤트 발생 : ', eventName);
                    var args = {data:dataOwner, param:param};
                    $rootScope.$broadcast(eventName, args); 
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

                    // SET
                    var oldValue = this.tool('CONFIG').display[name];
                    this.tool('CONFIG').display[name] = value;

                    if(oldValue == value) return;

                    this.dataChanged = true;
                    this.tool('CONFIG').dataChanged = true;

                    // EVENT
                    var eventName = '#Tool.changed-CONFIG.display.' + name;
                    out('# 이벤트 발생 : ', eventName);

                    var args = {newValue:value, oldValue:oldValue};
                    $rootScope.$broadcast(eventName, args); 
                },

                // CONFIG - thumbnail category  수정
                // var size = Tool.current.config_thumbnail ('size');
                config_thumbnail: function(name, value){
                    if(value === undefined){
                        //GET
                        return this.tool('CONFIG').thumbnail[name];
                    }

                    // SET
                    var oldValue = this.tool('CONFIG').thumbnail[name];
                    this.tool('CONFIG').thumbnail[name] = value;

                    if(oldValue == value) return;

                    this.dataChanged = true;
                    this.tool('CONFIG').dataChanged = true;

                    // EVENT
                    var eventName = '#Tool.changed-CONFIG.thumbnail.' + name;
                    out('# 이벤트 발생 : ', eventName);

                    var args = {newValue:value, oldValue:oldValue};
                    $rootScope.$broadcast(eventName, args); 
                },

                //////////////////////////////////////////////////////////////////////////
                //
                // CURRENT 옵션 설정
                // 
                //////////////////////////////////////////////////////////////////////////

                _config_default_CURRENT: function(){
                    
                    // 현재 실행 state를 기록한다.
                    this.tool('CURRENT', {
                        document:{
                            // 현재 선택 문서 (uid)
                            "selectUID": "",

                            // document 개별 설정 정보
                            // document 설정 정보를 가진 Map (documentUID:config option 설정 내용)
                            // 모든 document가 기록된 것이 아니라 수정된 사항만 있는 document만 기록 된다.

                            "map": {
                                /*
                                // Tool에서 설정된 개별 document 설정들
                                "key (documentUID)": {

                                    "uid": documentUID,

                                    // 데이터가 수정되어 저장 대상인지 여부를 기록
                                    "dataChanged": false, 
                                    
                                    // element type 사용 안함
                                    // "type": ELEMENT.DOCUMENT,
                                    // "option":{아직 사용 안함},
                                */
                            }
                        }
                    });
  
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

                // documentUID 지정하지 않으면 현재 선택 상태의 document에 적용됨
                // Tool.current.document(documentUID).value('dataChanged', true);
                // Tool.current.document().value('dataChanged', true);
                // Tool.current.document(documentUID).dataChanged(true);
                document: function(documentUID){
                    documentUID = documentUID || this._getSelectDocument();
                    var map = this.tool('CURRENT').document.map || {};
                    var self = this;
                    return {
                        add: function(){

                            var key = map[documentUID] || {"uid": documentUID};
                            // 적용 확인
                            map[documentUID] = key;
                            self.tool('CURRENT').document.map = map;

                            // self.dataChanged = true;
                            self.document(documentUID).dataChanged(true);
                        },

                        remove: function(){
                            map[documentUID] = null;
                            delete map[documentUID];

                            self.dataChanged = true;
                        },

                        dataChanged: function(value){
                            if(value){
                                self.dataChanged = true;
                            }
                            self.document(documentUID).value('dataChanged', value);
                        },

                        // GET/SET
                        value: function(name, value){
                            var key = map[documentUID] || {"uid": documentUID};
                            var oldValue = key[name];

                            //GET
                            if(value === undefined){
                                return oldValue;
                            }

                            // SET
                            key[name] = value;
                           // 적용 확인
                            map[documentUID] = key;
                            self.tool('CURRENT').document.map = map;

                            if(oldValue == value) return;

                            // EVENT
                            var eventName = '#Tool.changed-document.' + name;
                            out('# 이벤트 발생 : ', eventName);

                            var args = {newValue:value, oldValue:oldValue};
                            $rootScope.$broadcast(eventName, args); 
                        }
                    };
                },

                ////////////////////////////////////////
                // _factory end
                ////////////////////////////////////////
            });

            return Tool;
        }


        // 리턴
        _factory._regist = function(application){
            // 등록
            application.factory( 'Tool', _factory );
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


*/



