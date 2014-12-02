/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'AddElementCommand', _service );

        // 선언
        function _service(Command, VersionService, Project) {

            out( 'Command 등록 : AddElementCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function AddElementCommand() {

                _superClass.apply(this, arguments);
                out( '# AddElementCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( AddElementCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# AddElementCommand Execute : ', param);

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
                    
                    Project.current.addElement(param);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return AddElementCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

