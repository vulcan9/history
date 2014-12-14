/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.directive( 'element', _directive );

        function _directive () {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{background}} </span>',

                // templateUrl: _PATH.TEMPLATE + 'ui/element.html',
                // replace: true,
                // transclude: true,
                
                // scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {
                
                // element 클릭시 선택상태로 변경
                $element.on('mousedown', angular.bind(this, onMousedown));
                // $element.on('mousedown', onMousedown);

                function onMousedown(e){
                    
                    // out('down : ', this);
                    // out('down : ', arguments);
                    // out('scope : ', $scope);

                    var selectUID = $element.attr('uid');
                    $scope.selectElement(selectUID);
                    $scope.$apply();
                }

                //--------------
                // End Controller
            }

            ////////////////////////////////////////
            // Link
            ////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

                // alert('uid : ' + $attrs.uid);


                //--------------
                // End Link
            }

            // end directive
        }

        // 리턴
        return _directive;
    }
);
