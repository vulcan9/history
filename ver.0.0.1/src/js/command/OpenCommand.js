/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 데이터 로드를 위한 서비스 호출 유틸

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'OpenCommand', _service );

        // 선언
        function _service(Command) {

            out( 'Command 등록 : OpenCommand' );



            






            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            function OpenCommand() {

                out( '# OpenCommand : ', Command.prototype);
                alert('TODO : 상속 구조 구현');
                angular.extend(this.prototype, Command.prototype);
                
            };




            // 서비스 객체 리턴
            return OpenCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
