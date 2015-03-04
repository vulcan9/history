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

            // undo/redo 지원
            /*
             var param = {
                 documentUID: Project.current.getSelectDocument(),
                 elementUID: Project.current.getSelectElement()
             };
             */
            SelectElementCommand.getUndoParam = function(newParam){

                // SelectElementCommand 호출에 사용할 param을 구성한다.
                var documentUID = newParam.documentUID;
                //var elementUID = newParam.elementUID;
                var oldSelectUID = newParam.oldSelectUID;

                var undoParam = {
                    documentUID: documentUID,
                    elementUID: oldSelectUID
                };

                return undoParam;
            };

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
                    
                    var documentUID = param.documentUID;
                    var elementUID = param.elementUID;
                    Project.current.setSelectElement(documentUID, elementUID);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return SelectElementCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'SelectElementCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

