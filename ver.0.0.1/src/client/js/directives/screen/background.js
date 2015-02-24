/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : 버전을 표시

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define([], function () {

        // 선언
        function _directive() {

            //out( 'background' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{background}} </span>',
                templateUrl: _PATH.TEMPLATE + 'screen/background.html',

                replace: true,
                transclude: true,
                scope: {
                    scale: "@scale"
                },

                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller($scope, $element, $attrs) {
                $scope.ratio = 1;
                $scope.stroke = 1;


                $scope.$watch('scale', function (newValue, oldValue) {
                    var scale = $scope.$eval(newValue);
                    $scope.ratio = getRatio(scale);
                }, true);

                /*
                 $scope.$evalAsync( function(){
                 // $element.trigger('#view.layoutUpdate');
                 } );

                 $scope.$watch(function(){
                 // $element.trigger('#view.layoutUpdate');
                 });
                 */

                //-----------------------------------
                // Background Pattern, align-center 데이터
                // Svg Attribute (ng-attr-xxx 사용해야함)
                // bug patch : http://alexandros.resin.io/angular-d3-svg/
                //-----------------------------------

                // 배경 패턴을 그리기 위한 위치 정보
                function getRatio(scale) {
                    var obj = {
                        value: scale
                    };
                    for (var i = 0; i < 11; ++i) {
                        var unit = i * 10;
                        obj['r' + unit] = unit * scale;
                    }
                    return obj;
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

            function Link($scope, $element, $attrs) {

                // $timeout (function() {
                //     $element.trigger('#view.layoutUpdate');
                // }, 100);

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function (application) {
            // 등록
            application.directive('background', _directive);
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);