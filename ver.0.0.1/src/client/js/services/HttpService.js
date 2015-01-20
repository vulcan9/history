/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 데이터 로드를 위한 서비스 호출 유틸

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function( ) {

        // 선언
        function _service( $http, $timeout, $q ) {

            out( 'Service 등록 : HttpService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////

            // 데이터 로드 서비스 호출
            // https://code.angularjs.org/1.2.23/docs/api/ng/service/$http

            /*
            // method : 'GET', 'POST'...
            // url : 서버 요청 주소
            config = {
                method: method,
                url: url,
                data: { test: 'test' },
                ......
            }
            */

            var singleton = {
                load: loadExecute,

                // HTTP 1.1 status codes
                statuscode: {
                    100 : 'Continue',
                    101 : 'Switching protocols',
                    200 : 'OK, 전송 성공',
                    201 : 'Created, POST 명령 실행 및 성공',
                    202 : 'Accepted, 서버가 클라이언트 명령을 받음',
                    203 : 'Non-authoritative information, 서버가 클라이언트 요구 중 일부만 전송',
                    204 : 'No content, 클라언트 요구을 처리했으나 전송할 데이터가 없음',
                    205 : 'Reset content',
                    206 : 'Partial content',
                    300 : 'Multiple choices, 최근에 옮겨진 데이터를 요청',
                    301 : 'Moved permanently, 요구한 데이터를 변경된 임시 URL에서 찾았음',
                    302 : 'Moved temporarily, 요구한 데이터가 변경된 URL에 있음을 명시',
                    303 : 'See other, 요구한 데이터를 변경하지 않았기 때문에 문제가 있음',
                    304 : 'Not modified 웹페이지에서 요청만하고 자신의 브라우저의 캐쉬를 사용하는 경우',
                    305 : 'Use proxy',
                    400 : 'Bad request, 클라이언트의 잘못된 요청으로 처리할 수 없음',
                    401 : 'Unauthorized, 클라이언트의 인증 실패',
                    402 : 'Payment required, 예약됨',
                    403 : 'Forbidden, 접근이 거부된 문서를 요청함',
                    404 : 'Not found, 요청에 응답할 문서를 찾을 수 없음',
                    405 : 'Method not allowed, 리소스를 허용안함',
                    406 : 'Not acceptable, 허용할 수 없음',
                    407 : 'Proxy authentication required, 프록시 인증 필요',
                    408 : 'Request timeout, 요청시간이 지남',
                    409 : 'Conflict',
                    410 : 'Gone, 영구적으로 사용할 수 없음',
                    411 : 'Length required',
                    412 : 'Precondition failed, 전체조건 실패',
                    413 : 'Request entity too large,',
                    414 : 'Request-URI too long, URL이 너무 김',
                    415 : 'Unsupported media type',
                    500 : 'Internal server error, 내부서버 오류(잘못된 스크립트 실행시)',
                    501 : 'Not implemented, 클라이언트에서 서버가 수행할 수 없는 행동을 요구함',
                    502 : 'Bad gateway, 서버의 과부하 상태',
                    503 : 'Service unavailable, 외부 서비스가 죽었거나 현재 멈춤 상태',
                    504 : 'Gateway timeout',
                    505 : 'HTTP version not supported'
                }
            };


            function loadExecute( config ) {

                var defered = $q.defer();

                out( '# 데이터 로드 : [', config.method, '] ', config.url );
                if ( !config.url || !config.method ) {

                    $timeout( function() {
                        error( '서버 요청을 할 수 없습니다.' );
                    }, 5000 );
                    return;
                }

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

                    defered.resolve( data );
                    return data;
                }

                //-----------------------------------
                // error callback
                //-----------------------------------

                function error( data, status, headers, config ) {
                    //out( 'error : ', data );
                    out( 'error : [', status, '] ', config.url );
                    //out( 'headers : ', headers() );
                    //out( 'config : ', config );

                    defered.reject( data );
                    return data;
                }

                return defered.promise;
            }

            /*
            function singleton_old( config, successCallback, errorCallback ) {

                out( '# 데이터 로드 : [', config.method, '] ', config.url );
                if ( !config.url || !config.method ) {

                    $timeout( function() {
                        error( '서버 요청을 할 수 없습니다.' );
                    }, 1000 );
                    return;
                }

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
            */

            // 서비스 객체 리턴
            return singleton;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'HttpService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);