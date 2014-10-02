/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 이름으로 프로젝트 저장 하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'SaveAsCommand', _service );

        // 선언
        function _service(Command) {

            out( 'Command 등록 : SaveAsCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SaveAsCommand() {

                _superClass.apply(this, arguments);
                out( '# SaveAsCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SaveAsCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# SaveAsCommand Execute' );

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                }
            });







            // 서비스 객체 리턴
            return SaveAsCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
