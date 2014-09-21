/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전 정보를 정의하는 문서임

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'VersionService', _service );

        // 선언
        function _service( $http ) {

            // 버전 기록
            var Version = {
                    
                    project : "Hi-Story",

                    version : "0.0.1.1",
                    
                    company : "vulcan",
                    
                    developer : "ⓒ Dong-il Park",
                    
                    email : "pdi1066@naver.com",
                    
                    web : "https://github.com/vulcan9/history",

                    toString : function(){
                        return Version.project + " Version." + Version.version + "<br>"
                                 + Version.company  + " "+ Version.developer  + " ( " + Version.email + " ) <br>"
                                 + Version.web;
                    }
            };

            // 서비스 객체 리턴
            return Version;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
