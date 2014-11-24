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
        application.service( 'SelectDocumentCommand', _service );

        // 선언
        function _service(Command, VersionService, Project) {

            out( 'Command 등록 : SelectDocumentCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SelectDocumentCommand() {

                _superClass.apply(this, arguments);
                out( '# SelectDocumentCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SelectDocumentCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# SelectDocumentCommand Execute : ', param);

                    //-----------------------
                    // 데이터 세팅
                    //-----------------------
                    
                    Project.current.setSelectDocument(param.uid);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return SelectDocumentCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

