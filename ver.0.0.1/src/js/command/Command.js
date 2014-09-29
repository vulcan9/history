/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Command 계열 서비스의 부모 클래스

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'Command', _service );

        // 선언
        function _service() {

            out( 'Command 등록 : Command' );

            /////////////////////////////////////
            // 서비스 객체
            /////////////////////////////////////
            
            function Command() {
                //
            }

            Command.prototype = {
                
                execute : function ( config, successCallback, errorCallback ) {

                    out( '# Command Execute : ', this );

                    this._config = config;
                    this._successCallback = successCallback;
                    this._errorCallback = errorCallback;
                    
                    // Override 하여 사용할것
                    
                },

                //-----------------------------------
                // success callback
                //-----------------------------------

                _success : function ( data ) {

                    out( 'success : ', data );

                    var isPrevented = false;
                    if ( successCallback ) {
                        var result = successCallback.apply( null, arguments );

                        // true ||  undefined 이면 계속 진행
                        var isPrevented = !( result == true || result === undefined );
                    }

                    if ( isPrevented ) return;

                    // default Function 실행
                },

                //-----------------------------------
                // error callback
                //-----------------------------------

                _error : function ( data ) {
                    
                    //out( 'error : ', data );
                    out( 'error : ', data );

                    var isPrevented = false;
                    if ( errorCallback ) {
                        var result = errorCallback.apply( null, arguments );

                        // true ||  undefined 이면 계속 진행
                        var isPrevented = !( result == true || result === undefined );
                    }

                    if ( isPrevented ) return;

                    // default Function 실행
                }

            };

            // 서비스 객체 리턴
            return Command;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
