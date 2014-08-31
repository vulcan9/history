/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : service 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'jsonService', _service );

        // 선언
        function _service( $http ) {

            out( 'Service 등록 : ' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////

            function singleton( ) {
                
                out('# 서비스 실행 : [ args ] ', arguments);

                //-----------------------------------
                // 서비스 실행 내용
                //-----------------------------------


                // singleton End
            };

            // 서비스 객체 리턴
            return singleton;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

/*
// https://code.angularjs.org/1.2.23/docs/guide/services
// https://code.angularjs.org/1.2.23/docs/guide/providers

function UnicornLauncher(apiToken) {
  this.launchedCount = 0;
  this.launch = function() {
    // make a request to the remote api and include the apiToken
    ...
    this.launchedCount++;
  }
}

// factory 를 이용하는 경우 new 연산자에 의한 의존관계와 매개변수에의한 의존관계가 존재한다.

application.factory('unicornLauncher', ["apiToken", function(apiToken) {
  return new UnicornLauncher(apiToken);
}]);

// service의 constructor injection 패턴에 의해 더 simple하게 표현할 수 있다.

$provide.service('unicornLauncher', ["apiToken", UnicornLauncher]);
application.service('unicornLauncher', ["apiToken", UnicornLauncher]);
*/