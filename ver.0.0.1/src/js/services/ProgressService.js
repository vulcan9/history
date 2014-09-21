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
        application.service( 'ProgressService', _service );

        // 선언
        function _service($document) {

            out( 'Service 등록 : ProgressService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            /*
                    // 초기화
                    singleton.init();
                    singleton.init(true);

                    // 사용 : 
                    ProgressService.value(50);
                    ProgressService.value(null);

                    var value = ProgressService.value();
                    var isPercentage = ProgressService.isPercentage();
            */
            
            //var scope = angular.element( document ).scope();
            var scope = $document.scope();

            function singleton() {
                //
            };

            singleton.isPercentage =  function(){
                return scope.progress.isPercentage;
            };

            singleton.value = function(value){

                // GET
                if(value === undefined){
                    return scope.progress.value;
                }

                // SET
                var isPercentage = (value === null) ? /*eventMode*/ false : !isNaN(value);
                if(!isPercentage) value = 100;

                scope.progress = {
                    value: value,
                    isPercentage: isPercentage
                };

                scope.$emit('#progressService.progressChange', scope.progress);
                scope.$broadcast('#progressService.progressChange', scope.progress); 
            };

            //-----------------------
            // API
            //-----------------------

            singleton.init =  function(isEventMode){

                if(scope.progress === undefined){
                    scope.progress = {
                        value: 0,
                        isPercentage: false
                    };
                }
                
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
