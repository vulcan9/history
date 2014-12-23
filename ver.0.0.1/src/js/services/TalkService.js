/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전 정보를 정의하는 문서임

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'talk', _directive );
        application.service( 'TalkService', _service );

        ////////////////////////////////////////
        // 사용 샘플
        ////////////////////////////////////////
        
        /*
        // DOM에 태그를 추가한 후
        <talk class="talkContainer"></talk>
        
        // Script : 안내 문구 띄우기
        TalkService.open('문서에서 추가할 위치를 클릭하세요.', TalkService.SHORTEST);


                    var msgExist = TalkService.has(__messageObj);
                    if(msgExist < 0){
                        __messageObj = TalkService.open('문서에서 추가할 위치를 클릭하세요.', {
                            delayTime : TalkService.LONGEST,
                            closeCallback: function(){
                                __messageObj = null;
                            }
                        });
                    }else{
                        __messageObj = TalkService.delay(__messageObj, TalkService.LONGEST);
                    }

        */

        ////////////////////////////////////////
        // talk
        ////////////////////////////////////////

        function _directive() {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'popup/talk.html',
                
                replace: true,
                // priority: 0,
                transclude: true,
                // scope: {},
                
                controller: Controller
                // link: Link
            };

            function Controller( $scope, $element, $attrs) {
                
                var __msgID = 0;
                $scope.items = [
                    // { type: '', msg: 'Oh snap! Change a few things up and try submitting again.Oh snap! Change a few things up and try submitting again.Oh snap! Change a few things up and try submitting again.' },
                    // { type: '', msg: 'Well done! You successfully read this important alert message.' }
                ];

                $scope.open = function(item) {
                    item.uid = ++__msgID;
                    $scope.items.push(item);
                    return item;
                };

                $scope.close = function(index) {
                    $scope.items.splice(index, 1);
                };

                $scope.closeItem = function(item){
                    var messageID = item.uid;
                    var idx = $scope.has(messageID);

                    if(idx > -1){
                        $scope.close(idx);
                    }
                };

                $scope.has = function(uid){
                    var len = $scope.items.length;
                    for(var idx=0; idx<len; ++idx){
                        var item = $scope.items[idx];
                        if(item.uid == uid){
                            return idx;
                        }
                    }

                    return -1;
                };
            }
            // end directive
        }

        ////////////////////////////////////////
        // TalkService
        ////////////////////////////////////////

        function _service($timeout, $getScope) {

            var Talk = {
                
                // 시간 상수(milisecond)
                TICK : 200,
                SHORTEST : 500,
                SHORT : 1000,
                LONG : 2000,
                LONGEST : 3000,
                // NONE: 0, // 닫지 않음

                // 메서드
                open : open,
                close : close,
                delay : delay,
                has : has
            };

            /*
            config = {
                container : Message를 표시할 부모 DOM Selector,
                delayTime : Message 유지 시간,
                type :  message type,
                
                openCallback : open시 콜백 함수,
                closeCallback : close시 콜백 함수,
            }
            */

            var directiveName = 'talk';
            var selector = '.talkContainer';

            function open(message, config){
                if(!message) return;

                config = config || {};
                var type = config.type || 'normal';
                var openCallback = config.openCallback;
                var closeCallback = config.closeCallback;

                var container = config.parent || selector;
                var delayTime = config.delayTime || Talk.LONG;
                // var templateUrl = config.templateUrl || _PATH.TEMPLATE + 'popup/talk.html';

                // DOM에 Template 객체 삽입
                // var $parent = angular.element(parent);

                // var $container = angular.element(container);
                // var scope = $container.scope(directiveName);
                var scope = $getScope(container, directiveName);
                var item = {
                    type: type, 
                    msg: message
                };

                var item = scope.open(item);
                var messageObj = {
                    item : item, 
                    container : container,
                    openCallback : openCallback,
                    closeCallback : closeCallback
                };

                // 콜백
                if(openCallback){
                    openCallback.apply(null, messageObj);
                }

                messageObj.promise = $timeout(function(){
                    close(messageObj);
                }, delayTime);

                return messageObj;
            }

            function close(messageObj){
                var container = messageObj.container;
                var scope = $getScope(container, directiveName);

                scope.closeItem(messageObj.item);

                // 콜백
                if(messageObj.closeCallback){
                    messageObj.closeCallback.apply(null, messageObj);
                }
                messageObj = null;
            }

            function delay(messageObj, delayTime){
                out('messageObj : ', messageObj);
                var promise = messageObj.promise;
                $timeout.cancel(promise);

                var container = messageObj.container;
                var scope = $getScope(container, directiveName);
                
                messageObj.promise = $timeout(function(){
                    scope.closeItem(messageObj.item);
                }, delayTime);

                return messageObj;
            }

            function has(messageObj){
                if(!messageObj) return -1;
                var container = messageObj.container;
                var scope = $getScope(container, directiveName);

                var messageID = messageObj.item.uid;
                var index = scope.has(messageID);
                return index;
            }
















            // 서비스 객체 리턴
            return Talk;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
