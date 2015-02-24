/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : 로딩바, ProgressService Bar 를 표시

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define([], function () {

        // 선언
        function _directive(ProgressService) {

            //out( 'version' );

            return {

                restrict: 'EA',

                templateUrl: _PATH.TEMPLATE + 'view/progressView.html',

                replace: true,
                transclude: true,
                scope: {},

                controller: Controller,
                link: Link

            };
            function Controller($scope, $element, $attrs) {

                //*

                // watch를 이용한 업데이트 방법
                $scope.$watch('progress', function (newValue, oldValue) {
                    // if (newValue === oldValue) { return; }
                }, true);

                $scope.progress = ProgressService;

                /*/

                 // 이벤트를 이용한 업데이트 방법 - 이벤트 등록전에는 업데이트 못함
                 $scope.$on('#progressService.progressChange', function(event, progress){
                 out('progress - ', progress);
                 onUpdate();
                 });

                 function onUpdate(){
                 // $scope.$evalAsync(function(){
                 $scope.progress = ProgressService;
                 // });
                 }

                 //*/
            }

            function Link($scope, $element, $attrs) {

                //--------------
                // End Link
            }
        }

        // 리턴
        _directive._regist = function (application) {
            // 등록
            application.directive('progressView', _directive);
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
