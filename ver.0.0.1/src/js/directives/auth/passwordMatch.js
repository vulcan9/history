/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define([], function( ) {

        // 선언
        function _directive() {

            return {
                require: 'ngModel',
                scope: {
                    otherModelValue: '=passwordMatch'
                },
                link: function(scope, element, attributes, ngModel) {
                    ngModel.$validators.compareTo = function(modelValue) {
                        out('* Password Match : ', modelValue, ' / ', scope.otherModelValue);
                        return modelValue === scope.otherModelValue;
                    };
                    scope.$watch('otherModelValue', function() {
                        ngModel.$validate();
                    });
                }
            };

            // end directive
        }

        // 리턴
        _directive._regist = function(application){
            // 등록
            application.directive( 'passwordMatch', _directive );
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);