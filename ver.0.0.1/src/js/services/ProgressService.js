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
                    ProgressService.init();
                    ProgressService.init(true);

                    // 사용 : 
                    ProgressService.update(50);
                    ProgressService.update(null);

                    var value = ProgressService.value;
                    var isPercentage = ProgressService.isPercentage;
            */
            
            

            var progress = {
                isPercentage : true,
                value : 0,
                init : function(isEventMode){

                    // event mode
                    if(isEventMode === true){
                        _percentage(null);
                        return;
                    }

                    // percent mode
                    _percentage(0);
                },
                update : function(percent){
                    _percentage(percent);
                },
                complete : function(){
                    _percentage(0);
                }
            };

            //-----------------------
            // 구현
            //-----------------------

            function _percentage(value){

                // GET
                if(value === undefined){
                    return progress.value;
                }

                // SET
                var isPercentage = (value === null) ? /*eventMode*/ false : !isNaN(value);
                if(!isPercentage) value = 100;

                progress.value = value;
                progress.isPercentage = isPercentage;

                /*
                // 이벤트 발송
                //var scope = angular.element( document ).scope();
                var scope = $document.scope();
                scope.$emit('#progressService.progressChange', progress);
                scope.$broadcast('#progressService.progressChange', progress); 
                */
            };


            // 서비스 객체 리턴
            return progress;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
