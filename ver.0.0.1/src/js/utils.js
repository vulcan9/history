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

        };

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
