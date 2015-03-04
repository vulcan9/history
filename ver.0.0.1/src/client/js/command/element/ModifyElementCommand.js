/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service(Command, Project, Tool) {

            out( 'Command 등록 : ModifyElementCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function ModifyElementCommand() {

                _superClass.apply(this, arguments);
                out( '# ModifyElementCommand : ', this);

            }

            // undo/redo 지원
            ModifyElementCommand.getUndoParam = function(newParam){
                // ModifyElementCommand 호출에 사용할 param을 구성한다.
                var documentUID = newParam.documentUID;
                var elementUID = newParam.elementUID;

                var el = Project.current.getElement(documentUID, elementUID);
                var $dom = angular.element(el);
                var type = $dom.attr('element');

                var styleString = $dom.attr('style-string') || '{}';
                //var css = angular.fromJson(styleString);
                var option = Project.current.elementAPI(documentUID, elementUID).option();
                var oldHTML = Tool.current.history(documentUID).getSnapshot(el);

                var undoParam = {
                    documentUID: newParam.documentUID,
                    elementUID : newParam.elementUID,
                    type: type,

                    //css:css,

                    html: oldHTML,
                    option: option
                }
                return undoParam;
            };

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( ModifyElementCommand.prototype,  _super, {

                _run : function ( param ) {

                    // Override
                    out( '# ModifyElementCommand Execute' );

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
                    
                    Project.current.modifyElement(param);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return ModifyElementCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'ModifyElementCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
