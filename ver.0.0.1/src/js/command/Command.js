/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 데이터 로드를 위한 서비스 호출 유틸

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
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            function Command() {
                //
            }

            Command.prototype = {
                
                execute : function ( config, successCallback, errorCallback ) {

                    out( '# OpenCommand : [', config.method, '] ', config.url );

                    this._config = config;
                    this._successCallback = successCallback;
                    this._errorCallback = errorCallback;
                    
                    // Override
                    
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
                    //alert( 'TODO : Json 로드 에러' );
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
