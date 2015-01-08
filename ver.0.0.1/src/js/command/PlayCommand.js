/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 닫기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {


        
        // 선언
        function _service(Command) {

            out( 'Command 등록 : PlayCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function PlayCommand() {

                _superClass.apply(this, arguments);
                out( '# PlayCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( PlayCommand.prototype,  _super, {

                _run : function ( param ) {
                    //_super._run.apply(this, arguments);

                    // Override
                    out( '# PlayCommand Execute' );

                    // 결과 리턴
                    this._success();
                }
            });







            // 서비스 객체 리턴
            return PlayCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'PlayCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
