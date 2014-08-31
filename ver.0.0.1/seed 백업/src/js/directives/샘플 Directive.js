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
        application.directive( 'version', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',

                link: function( scope, el, attrs ) {
                    el.text( "1.0.0" );
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

/*
$compileProvider.directive.apply(null, directive);

app.directive('myCustomer', function() {
    return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
    };
});
*/