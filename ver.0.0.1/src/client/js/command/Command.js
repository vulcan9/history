/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Command 계열 서비스의 부모 클래스

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service( NoticeService ) {

            out( 'Command 등록 : Command' );

            /////////////////////////////////////
            // 서비스 객체
            /////////////////////////////////////

            function Command() {
                //
            }

            Command.prototype = {

                /*
                param = {
                    scope : $scope, 
                    element : $element, 
                    attrs : $attrs,
                    ...............
                }

                execute (param)
                execute (param, callback)
                */

                _param: null,
                _callback: null,

                /*
                // undo 과정에 의해 호출된 Command인지 여부
                _isUndoProcess: false,
                 //this._isUndoProcess = (isUndoProcess === undefined)? false:isUndoProcess;

                // History과정에 포함시킬려면 다음과 같이 undo 메서드를 정의한다.
                undo: function(){
                    this.execute(this._param, this._callback, true);
                },
                redo: function(){
                    this.execute(this._param, this._callback);
                },
                */

                execute: function( param, callback) {

                    this._param = param;
                    this._callback = callback;

                    // out( '# Command Execute : ', this );

                    try {

                        this._run( param );

                    } catch ( err ) {
                        this._error( err );
                    }
                },

                // Override 하여 사용할것
                _run: function( param ) {
                    // out( 'command run : ', param );

                    /*
                    // 속성 사용
                    this._param
                    this._callback

                    // 결과 값으로 둘중 하나의 메서드 꼭 실행할 것 
                    this._success(result);
                    this._err(error);
                    */

                    this._success(param);
                },

                //-----------------------------------
                // success callback
                //-----------------------------------

                _success: function( data ) {

                    // out( 'command success : ', data||'(ok)' );

                    var isPrevented = false;
                    if ( this._callback ) {
                        var result = this._callback.apply( null, [ true, data ] );

                        // true ||  undefined 이면 계속 진행
                        var isPrevented = !( result == true || result === undefined );
                    }

                    if ( isPrevented ) return;

                    // default Function 실행
                },

                //-----------------------------------
                // error callback
                //-----------------------------------

                _error: function( data, isStopPropergation ) {
                    //out( 'error : ', data );
                    out( '\n\n\n');
                    out( 'ERROR [command error] : ', data );
                    out( '\n\n\n');

                    alert('* command ERROR : ' + data);

                    var isPrevented = false;
                    if ( this._callback ) {
                        var result = this._callback.apply( null, [ false, data, isStopPropergation ] );

                        // true ||  undefined 이면 계속 진행
                        var isPrevented = !( result == true || result === undefined );
                    }

                    if ( isPrevented ) return;

                    // default Function 실행
                },

                _errorNotice: function( config, closedCallback ) {
                    var self = this;
                    var defaultConfig = {
                        // backdrop: false,
                        buttons: [ '예', '아니오' ],
                        hideCloseButton: true
                    };

                    angular.extend( defaultConfig, config );


                    var callback = {
                        closed: function( result, element, scope ) {
                            // result : -1:cancel, 1:yes, 0:no
                            if(closedCallback){
                                closedCallback.apply(self, arguments);
                            }
                            /*
                            if ( result > 0 ) {
                                _super._success.apply( self, [data] );
                            } else {
                                // 저장 체크 변경하지 않음
                                // Tool.current.dataChanged = true;
                                _error.apply( self, [ data, true ] );
                            }
                            */
                        }
                    };

                    NoticeService.open( defaultConfig, callback );
                }

            };

            // 서비스 객체 리턴
            return Command;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'Command', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);