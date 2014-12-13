/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전을 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U', 'Application'
    ],
    function( U, application ) {

        // 등록
        application.directive( 'loading', _directive );

        // 선언
        function _directive() {

            //out( 'loading' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{loading}} </span>',
                templateUrl: _PATH.TEMPLATE + 'screen/loading.html',
                
                replace: true,
                transclude: true,

                // scope: {
                //     scale: '@scale',
                //     complete: '@complete'
                // },
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {

                //

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            // size, loadComplete 변수는 parent scope으로부터 상속됨

            function Link ( $scope, $element, $attrs) {

                // $scope.loadComplete = false;

                $scope.$watch('size', function(newValue, oldValue) {
                    $scope.alignInfo_loading = getAlignInfo_loading(newValue);
                }, true);
                
                // $scope.$watch('loadComplete', function(newValue, oldValue) {
                //     if(newValue){
                //         $scope.alignInfo_loading = getAlignInfo_loading($scope.size);
                //     }
                // });

                // 가로/세로 중앙 정렬을 위한 위치 정보
                function getAlignInfo_loading(scale){
                    var parent = $element.parent();
                    var paddingW = (U.toNumber(parent.css('padding-left')) || 0) + (U.toNumber(parent.css('padding-right')) || 0);
                    var paddingH = (U.toNumber(parent.css('padding-top')) || 0) + (U.toNumber(parent.css('padding-bottom')) || 0);

                    var alignInfo={
                        
                        // 가로/세로 적용 및 데이터 저장  변수명 지정 (default=both)
                        // type: 'both', // horizontal | vertical | both | undefined (=both)

                        // 초기 visible 설정 지연 millisecond (default=0)
                        visibleDelayTime:500,

                         // 아래 설정값은 생략 가능 
                         // 생략시 현재 dom 상태 기준으로 자동 계산 되어짐
                         // 따라서 transition이 적용되고 있다면 아래값들을 설정하여  최종 결과값을 알려주어야함
                        parentWidth: scale.width - paddingW,
                        parentHeight: scale.height - paddingH
                        // width: scale.width + marginW,
                        // height: scale.height + marginH
                    };

                    // out('loading alignInfo : ', alignInfo);
                    return alignInfo;
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);