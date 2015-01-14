/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 저장 하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service( Command, Tool, NoticeService, $timeout ) {

            out( 'Command 등록 : SaveCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function SaveCommand() {

                _superClass.apply( this, arguments );
                out( '# SaveCommand : ', this );

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( SaveCommand.prototype, _super, {

                _run: function( param ) {

                    // Override
                    out( '# SaveCommand Execute' );

                    out( 'TODO : // SaveCommand 실행' );

                    // 결과 리턴
                    // _super._run.apply(this, arguments);

                    /*
                    var self = this;
                    $timeout( function() {
                        self._success.apply(self, [param]);
                        // self._error.apply(self, [param]);
                        // self._error();
                    }, 2000 );
                    */

                    //**********************************************
                    
                    // 로컬 저장 또는 서버 전송 구현
                    if(window._SAVE_LOCAL){
                        this.saveLocal();
                    }else{
                        this.saveServer();
                    }
                    









                    
                    //**********************************************
                },

                _success: function( data ) {
                    
                    // 저장 체크 변경
                    Tool.current.dataChanged = false;

                    // 콜백 호출
                    _super._success.apply( this, arguments );
                },

                _error: function( data ) {
                    var self = this;
                    this._errorNotice( {
                            title: '저장 실패',
                            content: '저장하기에 실패했습니다. 계속 진행 하시겠습니까?'
                        },
                        function( result, element, scope ) {
                            // result : -1:cancel, 1:yes, 0:no
                            if ( result > 0 ) {
                                _super._error.apply( self, [ data ] );
                            } else {
                                // 저장 체크 변경하지 않음
                                // Tool.current.dataChanged = true;
                                _super._error.apply( self, [ data, true ] );
                            }
                        }
                    );
                }
            } );

            // 서비스 객체 리턴
            return SaveCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'SaveCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);