/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 저장 하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'SaveCommand', _service );

        // 선언
        function _service(Command) {

            out( 'Command 등록 : SaveCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SaveCommand() {

                _superClass.apply(this, arguments);
                out( '# SaveCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SaveCommand.prototype,  _super, {
                execute : function ( config, successCallback, errorCallback ) {

                    _super.execute.apply(this, arguments);

                    // Override
                    out( '# SaveCommand Execute' );

                }
            });







            // 서비스 객체 리턴
            return SaveCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
