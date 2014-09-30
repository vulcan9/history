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
        application.service( 'DataService', _service );

        // 선언
        function _service( $http, $timeout ) {

            out( 'Service 등록 : DataService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            // 데이터 로드 서비스 호출
            // https://code.angularjs.org/1.2.23/docs/api/ng/service/$http
            
            function singleton( config, successCallback, errorCallback ) {

                out( '# 데이터 로드 : [', config.method, '] ', config.url );
                if(!config.url || !config.method){

                    $timeout(function(){
                        error('서버 요청을 할 수 없습니다.');
                    }, 1000);
                    return;
                }
                
                /*
                // method : 'GET', 'POST'...
                // url : 서버 요청 주소
                config = {
                    method: method,
                    url: url
                    ......
                }
                */

                $http( config )
                    .success( success )
                    .error( error );

                //-----------------------------------
                // success callback
                //-----------------------------------

                function success( data, status, headers, config ) {
                    out( 'success : [', status, '] ', config.url );
                    //out( 'status : ', status );
                    //out( 'headers : ', headers() );
                    //out( 'config : ', config );

                    var isPrevented = false;
                    if ( successCallback ) {
                        var result = successCallback.apply( null, arguments );

                        // true ||  undefined 이면 계속 진행
                        var isPrevented = !( result == true || result === undefined );
                    }

                    if ( isPrevented ) return;

                    // default Function 실행
                }

                //-----------------------------------
                // error callback
                //-----------------------------------

                function error( data, status, headers, config ) {
                    //out( 'error : ', data );
                    out( 'error : [', status, '] ', config.url );
                    //out( 'headers : ', headers() );
                    //out( 'config : ', config );

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

                // singleton End
            };

            // 서비스 객체 리턴
            return singleton;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
