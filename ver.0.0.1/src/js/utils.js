/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 정렬 관련된 유틸함수들

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [],
    function( ) {

        return {

            // 숫자화 (fallback : 숫자 변환 실패시 반환값)
            toNumber : function (numeric, fallback) {
                var num = parseFloat(numeric, 10);
                return isNaN(num) ? (fallback || 0) : num;
            }
            
            ,toArray: function (a) {
                return [].slice.call(a);
            }
            
            ////////////////////////////////////
            // UUID 생성기
            ////////////////////////////////////

            ,createUID: function (){
                var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var uid = uid.replace(/[xy]/g, function(c){
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                
                return uid;
            }

            ////////////////////////////////////
            // Getter, Setter 메서드로 속성 정의
            ////////////////////////////////////

            // name 이름의 속성을 정의한다. (get, set)
            // 이때 _name 속성이 자동으로 만들어 진다.
            
            /*
            this._num = utils.defineProperty ( this, 'num', 'readOnly', 10);
            this._num == 10; //true
            this.num == 10; //true
            this.num = 10 ; // error (readOnly)
            */
            
            ,defineProperty : function (context, name, readOnly, defaultValue) {
                Object.defineProperty( context, name, {
                    get: function() {
                        return context['_' + name];
                    },
                    set: function(value) {
                        if(readOnly === 'readOnly'){
                            throw Error('Project [ ' + name + ' ]은 읽기 전용 속성입니다.');
                            return;
                        }
                        context['_' + name] = value;
                    }
                });

                return defaultValue;
            }









            // END Utils
        };

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
