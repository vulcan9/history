/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

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
        function _service( $http ) {

            out( 'Service 등록 : DataService' );

            var successCallback, errorCallback;

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            // 데이터 로드 서비스 호출
            // https://code.angularjs.org/1.2.23/docs/api/ng/service/$http
            
            // method : 'GET', 'POST'...
            // url : 서버 요청 주소
            function singleton( method, url, successCallback, errorCallback ) {

                out( '# 데이터 로드 : [', method, '] ', url );

                $http( {
                    method: method,
                    url: url
                } )
                    .success( success )
                    .error( error );

                //-----------------------------------
                // success callback
                //-----------------------------------

                function success( data, status, headers, config ) {
                    out( 'success : ', data );
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
                    out( 'status : ', status );
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
                    alert( 'TODO : Json 로드 에러' );
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
