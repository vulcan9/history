/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 닫기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'CloseCommand', _service );

        // 선언
        function _service(Command) {

            out( 'Command 등록 : CloseCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function CloseCommand() {

                _superClass.apply(this, arguments);
                out( '# CloseCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( CloseCommand.prototype,  _super, {

                _run : function ( param ) {
                    //_super._run.apply(this, arguments);

                    // Override
                    out( '# CloseCommand Execute' );

                    if(Project.current){
                        Project.current.closeProject();
                    }
                    Project.current = null;

                    // 결과 리턴
                    this._success();
                }
            });







            // 서비스 객체 리턴
            return CloseCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
