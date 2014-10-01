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
        application.service( 'NewCommand', _service );

        // 선언
        function _service(Command, ProgressService, Tool, DataService, $timeout) {

            out( 'Command 등록 : NewCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function NewCommand() {

                _superClass.apply(this, arguments);
                out( '# NewCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( NewCommand.prototype,  _super, {

                /*
                param = {
                    scope : $scope, 
                    element : $element, 
                    attrs : $attrs,
                    ...............
                }
                */
               
                execute : function ( param, successCallback, errorCallback ) {

                    _super.execute.apply(this, arguments);

                    // Override
                    out( '# NewCommand Execute' );

                    // ProgressService.init (true);
                    //ProgressService.init(null);
                    //ProgressService.update(60);

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
/*
                    if(Project.current && Project.current.project){
                        Project.current.project ('TREE', null);
                    }
*/
                    
                    
                    // 편집 결과를 저장한 데이이터
                    Project.current = new Project();














                    // END Execute
                }
            });







            // 서비스 객체 리턴
            return NewCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
