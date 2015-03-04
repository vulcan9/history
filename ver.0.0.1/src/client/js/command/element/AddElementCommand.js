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

            // undo/redo 지원
            AddElementCommand.getUndoParam = function(newParam){
                // RemoveElementCommand 호출에 사용할 param을 구성한다.
                /*
                var newParam = {
                    documentUID: "document-7dc1d5a0-f477-4ef3-a5b0-8842c8ec88ca",
                    elementUID : "element-d88f2fde-3878-4c1c-b5c9-3897b6f81f6a",
                    type: "text",
                    option: {},
                    css:{}
                }
                */
                var undoParam = {
                    documentUID: newParam.documentUID,
                    elementUID: newParam.elementUID
                };
                return undoParam;
            };

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
        _service._regist = function(application){
            // 등록
            application.service( 'AddElementCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

