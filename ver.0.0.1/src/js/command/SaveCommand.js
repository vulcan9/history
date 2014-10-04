/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 저장 하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'SaveCommand', _service );

        // 선언
        function _service(Command, Tool, $timeout) {

            out( 'Command 등록 : SaveCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SaveCommand() {

                _superClass.apply(this, arguments);
                out( '# SaveCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SaveCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# SaveCommand Execute' );

                    // 결과 리턴
                    // _super._run.apply(this, arguments);
                    
                    /*
                    var title = LOCALE.getLocaleString("Application","save","error_title", "문서 저장 실패");
                    var msg = LOCALE.getLocaleString("Application","save","error01", "문서 저장에 실패하였습니다.");
                    
                    if (self._process.size() !== 0) {
                        msg += LOCALE.getLocaleString("Application","save","error02", " 계속 진행 하시겠습니까?");
                        if(errMsg) msg += "<br>" + errMsg;
                        u.confirm(msg, title, true, callback, self);
                    } else {
                        msg += LOCALE.getLocaleString("Application","save","error03", " 다시 시도하여 주십시요.");
                        if(errMsg) msg += "<br>ERROR : " + errMsg;
                        u.alert(msg, title, true, callback, self);
                    }
                    */


                    var self = this;
                    $timeout(function(){
                        
                        // 저장 체크
                        Tool.current.dataChanged = true;
                    
                        self._success.apply(self, [param]);

                    }, 2000);
                }
            });







            // 서비스 객체 리턴
            return SaveCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
