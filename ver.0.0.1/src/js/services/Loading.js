/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 로딩바에 표시할 데이터를 정의하는 서비스

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.service( 'Loading', _service );

        // 선언
        function _service() {

            out( 'Service 등록 : Loading' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            /*
            
                    // 초기화
                    singleton.init();
                    singleton.init(true);

                    // 사용 : 
                    Loading.value(50);
                    Loading.value(null);

                    var value = Loading.value();
                    var isPercentage = Loading.isPercentage();
            */
            
            var scope = angular.element( document ).scope();
            //var _value;
            //var _isPercentage = false;

            function singleton() {
                scope.progress = {
                    value: 0,
                    isPercentage: false
                };
            };

            singleton.isPercentage =  function(){
                return scope.progress.isPercentage;
                //return _isPercentage;
            };

            singleton.value = function(value){

                if(value === undefined){
                    return scope.progress.value;
                    //return _value;
                }

                var isPercentage;
                if (value === null){
                    //eventMode
                    isPercentage = false;
                }else{
                    isPercentage = !isNaN(value);
                }

                if(!isPercentage) value = 100;
                //_value = value;
                //_isPercentage = isPercentage;
                var progress = {
                    value: value,
                    isPercentage: isPercentage
                };
                scope.progress = progress;
                //scope.$broadcast('loadStateUpdate', progress); 
                //out( '# progress value : ', scope.progress );
            };

            //-----------------------
            // API
            //-----------------------

            singleton.init =  function(isEventMode){

                // event mode
                if(isEventMode === true){
                    singleton.value(null);
                    return;
                }

                // percent mode
                singleton.value(0);
            };

            singleton.complete =  function(){
                singleton.value(0);
            };

            singleton.update =  function(percent){
                singleton.value(percent);
            };

            // 서비스 객체 리턴
            singleton.init();
            return singleton;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
