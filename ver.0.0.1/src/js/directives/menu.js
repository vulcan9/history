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
        application.directive( 'menu', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            var config = {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'menu.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: false,

                terminal: false,

                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: function( $scope, $element, $attrs, $transclude, $rootScope ) {

                    $scope.items = [
                        {label: 'File'},
                        {label: 'Edit'},
                        {label: 'View'}
                    ];

                },

                link: function (scope, el, attrs, controller) {
                    
                    scope.click = function(){
                        console.log(" * item에 해당하는 command를 호출! : ", this.item);
                    };

                }

                // end config
            };

            return config;
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
