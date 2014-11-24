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
        application.service( 'RemoveDocumentCommand', _service );

        // 선언
        function _service(Command, Project) {

            out( 'Command 등록 : RemoveDocumentCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function RemoveDocumentCommand() {

                _superClass.apply(this, arguments);
                out( '# RemoveDocumentCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( RemoveDocumentCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# RemoveDocumentCommand Execute' );

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
                    
                    Project.current.removeDocument(param);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return RemoveDocumentCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
