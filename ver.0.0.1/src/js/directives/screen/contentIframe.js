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
        application.directive( 'contentIframe', _directive );

        // 선언
        function _directive() {

            //out( 'content' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{content}} </span>',
                templateUrl: _PATH.TEMPLATE + 'screen/contentIframe.html',
                
                replace: true,
                transclude: true,

                scope: {
                    onLoadComplete: '&onLoadComplete',
                    item: '=item'
                },
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {

                // 로드 내용 container DOM 찾기
                this._getContentContainer = function (documentUID){
                    // var $content = $element.find('#contentContainer');
                    // return $content;
                    return $element;
                }

                /*
                // 해당 문서의 Element DOM 찾기
                this._getContentElement = function (elementUID, documentUID){
                    var $contentContainer = this._getContentContainer(documentUID);
                    var $el = $contentContainer.find('[uid=' + elementUID + ']');
                    return $el;
                }
                */

                //-----------------------
                // HTML Content 바인딩
                //-----------------------
                
                var self = this;
                $scope.getContent = function (item) {
                    // var htmlString = item.content;
                    // return $sce.trustAsHtml(htmlString);

                    // attribute에 uid값이 아직 적용되지 않은 경우일 수 있으므로 $evalAsync로 실행한다.
                    $scope.$evalAsync(function(){
                        
                        var documentUID = item.uid
                        var dom = item.content;
                        var $contentContainer = self._getContentContainer(documentUID);
                        
                        // $contentContainer.html(dom);

                        

                        // IFrame에 해당 내용을 로드한다.
                        $contentContainer.attr('src', 'http://localhost/history/ver.0.0.1/src/#/tool/');

                        //****************************************

                        // 랜더링 까지 완료되었음을 알림
                        $scope.onLoadComplete({
                            success:true
                        });

                        //****************************************
                    });
                }

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

            function Link ( $scope, $element, $attrs, controller) {

                // $scope.loadComplete = false;

                // $scope.$watch('size', function(newValue, oldValue) {
                //     $scope.alignInfo_content = getAlignInfo_content(newValue);
                // }, true);
                
                // $scope.$watch('loadComplete', function(newValue, oldValue) {
                //     $scope.complete = $scope.$eval(newValue);
                // });


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