/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Data : HI-STORY (https://github.com/vulcan9/history)
 * Description : Data 데이터 관리 추상 클래스

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {



        /////////////////////////////////////
        // 생성자
        /////////////////////////////////////

        function Data() {
            //this.initialize();
        }

        function _factory($rootScope) {

            /////////////////////////////////////
            // Prototype
            /////////////////////////////////////

            //------------------------------------------
            // angular의 Injection 활용을 위해 이곳에서 Prototype을 정의한다.
            //------------------------------------------

            Data.prototype = {

                eventPrefix: 'Data',

                initialize: function () {

                    // Override 해서 사용

                    /*
                     //---------------------
                     // 속성 생성 예
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
                     */
                },

                /*
                 name에 해당하는 속성 NAME, __NAME이 생성됨
                 getter, setter 메서드인 name 이 생성됨
                 - 메서드 : name()
                 - 속성 : NAME

                 // set
                 Data.current.tool ('MENU', data);
                 // get
                 $scope.menu = Data.current.tool('MENU');
                 // 하위 속성 접근
                 Data.current.tool('menu')('uid')
                 */

                __createProxy: function (ownerPath, name, initValue) {

                    // Proxy 속성 설정
                    var property = name.toUpperCase();
                    var prop = '__' + property;

                    // path에 self가 있을 수있으므로 미리 정의해 놓는다.
                    var self = this;
                    // this는 상황에 따라 context가 바뀔수 있으므로 self로 고정시켜 준다.
                    ownerPath = ownerPath.replace(/\bthis\./, 'self\.');
                    var owner = eval(ownerPath);

                    // 값 적용
                    U.defineProperty(owner, property, 'readOnly');
                    owner[prop] = initValue;

                    //----------------------
                    // Proxy 메서드 설정
                    //----------------------

                    var pathString = ownerPath + '.' + name;

                    function proxy(key, value) {
                        if (arguments.length < 1) {
                            throw new Error('전달된 인자가 없습니다.');
                            return;
                        }

                        // out('pathString : ', pathString);

                        //-----------
                        // GETTER
                        //-----------

                        var data = eval(pathString);
                        if (value === undefined) {
                            return data[key];
                        }

                        var property = key.toUpperCase();
                        var prop = '__' + property;

                        // 미리 예상된 변수만 허용하기 위해 체크함
                        if (prop in data == false) {
                            throw new Error(
                                pathString + '.' + prop + ' 속성이 정의되어 있지 않습니다.\n' +
                                prop + ' 속성값을 먼저 선언 하세요.'
                            );
                            return;
                        }

                        //-----------
                        // SETTER
                        //-----------

                        var oldValue = data[property];
                        var changed = !angular.equals(oldValue, value);

                        if (oldValue === undefined) {
                            var methodName = key.toLowerCase();
                            data[methodName] = self.__createProxy.apply(self, [pathString, property, value]);
                        } else {
                            data[prop] = value;
                            // data[key] = value;
                        }

                        // 이벤트 발송
                        if (changed) {
                            var eventName = '#' + self.eventPrefix + '.changed-' + property;
                            out('# 이벤트 발생 : ', eventName);

                            var args = {newValue: value, oldValue: oldValue, name: property};
                            $rootScope.$broadcast(eventName, args);
                        }


                    }

                    return proxy;
                },

                //////////////////////////////////////////////////////////////////////////
                //
                // 데이터 조작 API
                // 
                //////////////////////////////////////////////////////////////////////////

                // dataObject을 가진 데이터에 값을 추가한다.
                // propertyName : __createProxy로 생성된 property 이름

                /*
                 add: function(propertyName, dataOwner, itemObject, param){

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.add-' + propertyName;
                 out('# 이벤트 발생 (before) : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);

                 // Override 내용 구현
                 this.__add(propertyName, dataOwner, itemObject);

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.added-' + propertyName;
                 out('# 이벤트 발생 : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);
                 },

                 remove: function(propertyName, dataOwner, itemObject, param){

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.remove-' + propertyName;
                 out('# 이벤트 발생 (before) : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);

                 // Override 내용 구현
                 this.__remove(propertyName, dataOwner, itemObject);

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.removed-' + propertyName;
                 out('# 이벤트 발생 : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);
                 },

                 modify: function(propertyName, dataOwner, itemObject, param){

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.modify-' + propertyName;
                 out('# 이벤트 발생 (before) : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);

                 // Override 내용 구현
                 this.__modify(propertyName, dataOwner, itemObject);

                 // 이벤트 발송
                 var eventName = '#' + this.eventPrefix + '.modified-' + propertyName;
                 out('# 이벤트 발생 : ', eventName);
                 var args = {data:dataOwner, item:itemObject, name:propertyName, param:param};
                 $rootScope.$broadcast(eventName, args);
                 },

                 //---------------------
                 // Override 내용 구현
                 //---------------------

                 __add: function(propertyName, dataOwner, itemObject){
                 var uid = itemObject.uid;
                 if(uid === undefined){
                 throw 'uid 값이 없습니다. (add)';
                 }

                 if(dataOwner === undefined){
                 throw propertyName + '이 정의되지 않았습니다.';
                 }
                 if(dataOwner.items === undefined){
                 dataOwner.items = {};
                 }
                 dataOwner.items[uid] = itemObject;
                 },

                 __remove: function(propertyName, dataOwner, itemObject){
                 var uid = itemObject.uid;
                 if(uid === undefined){
                 throw 'uid 값이 없습니다. (remove)';
                 }

                 if(dataOwner === undefined){
                 throw propertyName + '이 정의되지 않았습니다.';
                 }
                 if(dataOwner.items === undefined) return;
                 dataOwner.items[uid] = null;
                 delete dataOwner.items[uid];
                 },

                 __modify: function(propertyName, dataOwner, itemObject){
                 var uid = itemObject.uid;
                 if(uid === undefined){
                 throw 'uid 값이 없습니다. (modify)';
                 }

                 if(dataOwner === undefined){
                 throw propertyName + '이 정의되지 않았습니다.';
                 }
                 if(dataOwner.items === undefined){
                 dataOwner.items = {};
                 }
                 dataOwner.items[uid] = itemObject;
                 },

                 __get: function(propertyName, dataOwner, uid){
                 if(uid === undefined){
                 throw 'uid 값이 없습니다. (get)';
                 }

                 if(dataOwner === undefined){
                 throw propertyName + '이 정의되지 않았습니다.';
                 }
                 if(dataOwner.items === undefined) return null;
                 return dataOwner.items[uid];
                 }
                 */

                // end
            };

            return Data;
        }

        // 리턴
        _factory._regist = function (application) {
            // 등록
            application.factory('Data', _factory);
        };
        return _factory;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
