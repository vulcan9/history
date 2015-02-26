/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : UI 컨트롤을 위한 기능 구현

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {

        // 사용법
        //<input key-bind="{ enter: 'go()', esc: 'clear()' }" type="text"></input>


        // 선언
        function _directive(KEY_CODE) {

            function map(obj) {
                var mapped = {};
                for (var key in obj) {
                    var action = obj[key];
                    if (KEY_CODE.hasOwnProperty(key)) {
                        mapped[KEY_CODE[key]] = action;
                    }
                }
                return mapped;
            }

            return function (scope, element, attrs) {
                if(attrs.keyBind.indexOf('liveChange') > -1){
                    var func = scope.$eval(attrs.keyBind);
                    if(func && typeof func == 'function') func.apply(scope, [element]);
                    return;
                }

                //element.off("change", onChange);
                var bindings = map(scope.$eval(attrs.keyBind));

                element.on("keydown keypress", function (event) {
                    if (bindings.hasOwnProperty(event.which)) {
                        //scope.$apply(function() {
                        //    scope.$eval(bindings[event.which]);
                        //});

                        var func = scope.$eval(bindings[event.which]);
                        if(func && typeof func == 'function') func.apply(scope, [element, event]);
                        event.preventDefault();
                    }
                });
                element.on("blur", function (event) {
                    var key = KEY_CODE.enter;
                    if (bindings.hasOwnProperty(key)) {
                        scope.$eval(bindings[key]).apply(scope, [element, event]);
                        //event.preventDefault();
                    }
                });
            };

            // end directive
        }

        // 리턴
        _directive._regist = function (application) {
            // 등록
            application.directive('keyBind', ['KEY_CODE', _directive]);
        };
        return _directive;
    }
);






