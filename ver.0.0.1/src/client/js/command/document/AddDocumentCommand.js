/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service(Command, VersionService, Project) {

            out( 'Command 등록 : AddDocumentCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function AddDocumentCommand() {

                _superClass.apply(this, arguments);
                out( '# AddDocumentCommand : ', this);

            }

            /*
            // undo/redo 지원
            AddDocumentCommand.getUndoParam = function(newParam){
                // RemoveDocumentCommand 에 사용할 Param을 구성한다.
                var param = {
                    uid : selectUID,
                    option : 'only'
                };
            };
            */

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( AddDocumentCommand.prototype,  _super, {

                _run : function ( param ) {

                    // Override
                    out( '# AddDocumentCommand Execute : ', param);

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
                    
                    Project.current.addDocument(param);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return AddDocumentCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'AddDocumentCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

