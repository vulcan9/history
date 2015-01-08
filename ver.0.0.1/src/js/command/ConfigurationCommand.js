/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {


        //*********************************************************
        //
        // Document 설정은 ModifyDocument에서 실행하지 않는다.
        // 이Command는 History 관리에 포함시키지 않는다.
        //
        // ModifyCommand의 경우 History 연속 등록을 방지하기 위해 값이 변할때 약간의 delay time을 주게되는데
        // 이 시간때문에 Configuration 값  변경시 느리게 동작하는것처럼 보이일 수 있으므로 이를 분리한다.
        //
        //*********************************************************


        // 선언
        function _service(Command, VersionService, Project) {

            out( 'Command 등록 : ConfigurationCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function ConfigurationCommand() {

                _superClass.apply(this, arguments);
                out( '# ConfigurationCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( ConfigurationCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# ConfigurationCommand Execute : ', param);

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------
                    
                    Tool.current.configuration(param);

                    // 결과 리턴
                    _super._run.apply(this, arguments);

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return ConfigurationCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'ConfigurationCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

