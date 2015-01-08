/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 종료 후 닫기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service(Command) {

            out( 'Command 등록 : ExitCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function ExitCommand() {

                _superClass.apply(this, arguments);
                out( '# ExitCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( ExitCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# ExitCommand Execute' );

                    // 결과 리턴
                    _super._run.apply(this, arguments);
                }
            });







            // 서비스 객체 리턴
            return ExitCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'ExitCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
