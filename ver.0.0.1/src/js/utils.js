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











            // END Utils
        };

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
