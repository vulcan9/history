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

        console.log( "# Version.", _service().version() );

        // 등록
        application.service( 'VersionService', _service );

        // 선언
        function _service( ) {

            // 버전 기록
            var Version = {
                    
                    project : "Hi-Story",

                    number : "0.0.1.1",
                    
                    company : "vulcan",
                    
                    developer : "ⓒ Dong-il Park",
                    
                    email : "pdi1066@naver.com",
                    
                    web : "https://github.com/vulcan9/history",

                    toString : function(){
                        return Version.version() + "<br>" + Version.copyright() + "<br>" + Version.web;
                    }, 

                    version : function(){
                        return Version.project + " " + Version.number;
                    },

                    copyright : function(){
                        return Version.company  + " "+ Version.developer  + " ( " + Version.email + " )";
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
