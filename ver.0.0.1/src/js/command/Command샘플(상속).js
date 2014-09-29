/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기 Command

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'NewCommand', _service );

        // 선언
        function _service(Command) {

            out( 'Command 등록 : NewCommand' );

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function OpenCommand() {

                _superClass.apply(this, arguments);
                out( '# NewCommand : ', this);

            }

            // Prototype 상속
            angular.extend( OpenCommand.prototype,  Command.prototype, {
                execute : function ( config, successCallback, errorCallback ) {

                    _super.execute.apply(this, arguments);

                    // Override
                    out( '# NewCommand Execute' );

                }
            });







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
