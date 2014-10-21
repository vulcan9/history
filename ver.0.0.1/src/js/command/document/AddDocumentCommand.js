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
        application.service( 'AddDocumentCommand', _service );

        // 선언
        function _service(Command) {

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
                    
                    // 편집 결과를 저장한 데이이터
                    var itemObject = getDefinition(param.uid);
                    Project.current.addDocument(itemObject);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return AddDocumentCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

// content --> element.outerHTML
function getDefinition(uid){
    var definition = {
        "version": "0.0.1",
        "description": "문서 편집 내용 정의",

        "uid": uid,

        "document": {

            "uid": uid,

            "id": "overview",
            "content": "<div id='overview' data-scale='10' data-x='0' data-y='0'></div>"

        },

        "configuration": {

            "uid": uid,

            "id": "overview",
            "subject": "문서 제목",
            "descripty": "문서 요약",

            "security": {
                "permission": "all",
                "grade": "5"
            },

            "history": {
                "create": new Date(),
                "edits": []
            },

            "progress": {
                "start": "",
                "end": "",

                "ignore": "0",
                "percent": "0"
            }
        },

        "todos": {
            "uid": uid,
            "items":{}
        }
    };

    return definition;
}
