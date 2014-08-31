/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'screen', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',
                
                link: function( scope, el, attrs ) {
                    el.text( "screen" );
                }

            };

        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);


// 드래그 예제
// https://code.angularjs.org/1.2.23/docs/guide/compiler