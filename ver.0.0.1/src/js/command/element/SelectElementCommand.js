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
        application.service( 'SelectElementCommand', _service );

        // 선언
        function _service(Command, VersionService, Project) {

            out( 'Command 등록 : SelectElementCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SelectElementCommand() {

                _superClass.apply(this, arguments);
                out( '# SelectElementCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SelectElementCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# SelectElementCommand Execute : ', param);

                    //-----------------------
                    // 데이터 세팅
                    //-----------------------
                    
                    Project.current.setSelectElement(param.uid);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return SelectElementCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

