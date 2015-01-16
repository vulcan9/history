/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 데이터 로드를 위한 서비스 호출 유틸

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function( ) {

        // 선언
        function _service( $http, $timeout, $q ) {

            out( 'Service 등록 : ProcessService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////

            // 비동기 함수실행을 동기화 처리

            /*
            // 사용예
            var process = ProcessService.process();

            process.start().then(function(){
                out('process started');
            });

            var map = Tool.current.TOOL.CURRENT.document.map;
            for(var uid in map)
            {
                var item = map[uid];
                // out(' - ', uid, ' : ', item.dataChanged);

                if(item.dataChanged){
                    var documentItem = Project.current.getDocument(uid);

                    // documentItem.document.content 를 DOM 구조에서 String로 변환시킨다.
                    var content = documentItem.document.content;
                    var htmlString = content.outerHTML;

                    documentItem.document.content = htmlString;
                    var json = angular.toJson(documentItem);
                    documentItem.document.content = content;
                    out('- JSON Data : ', uid, ' : ', json);

                    // 요청
                    process.add(defer, function(defer, param){
                        defer.resolve( param );
                    }, param)
                    .then(function(data){
                        out('add process After : ');
                    });
                }
            }
            
            process.end().then(function(){
                out('process ended');
            });
            */

            var singleton = {
                process: newInstance
            };

            function newInstance() {
                
                // var defer = $q.defer();
                var defer;

                var process = {
                    start: function(d){
                        // var d = $.Deferred();
                        d = d || $q.defer();
                        defer = __start(d);
                        return defer.promise;
                    },
                    
                    /*
                    add: function(data, d){
                        // var d = $.Deferred();
                        // defer.then(function(){
                        d = d || $q.defer();
                        defer.promise.then(function(){
                            __resolver(d, data);
                        });
                        defer = d;
                        return defer.promise;
                    },
                    */

                    // resolver함수에는 d.resolve() 가 호출되는 코드가 있어야함
                    /* 
                    // (예시)
                    function __resolver(d, data) {
                        
                        setTimeout(function () {
                            out ('# 저장 완료 : ', data);
                            d.resolve(data);
                        }, Math.random() * 500+1000);
                        
                        return d;
                    }
                    */
                    add: function(d, resolver, data){
                        // var d = $.Deferred();
                        // defer.then(function(){
                        d = d || $q.defer();
                        defer.promise.then(function(){
                            out('# process add');
                            resolver(d, data);
                        });
                        defer = d;
                        return defer.promise;
                    },

                    end: function(d){
                        // var d = $.Deferred();
                        // defer.then(function(){
                        d = d || $q.defer();
                        defer.promise.then(function(){
                            __end(d);
                        });
                        defer = d;
                        return defer.promise;
                    }
                }
                return process;
            }

            //-----------------------------------
            // success callback
            //-----------------------------------

            function __start(d) {
                
                setTimeout(function () {
                    out('# process start');
                    d.resolve();
                }, 0);
                
                return d;
            }

            function __end(d) {
                
                setTimeout(function () {
                    out('# process end');
                    d.resolve();
                }, 0);
                
                return d;
            }

            /*
            // http://stackoverflow.com/questions/18302894/jquery-run-multiple-methods-sequentially/18303277#18303277
            // promiseB will be resolved immediately after promiseA is resolved and its value
            // will be the result of promiseA incremented by 1
            promiseB = promiseA.then(function(result) {
                return result + 1;
            });

            // defer 차이점
            // JQuery는 defer.then():defer
            // angular는 promise.then():promise

            $(function () {
                $('#color-form').on('submit', function (e) {
                    var color = [1,2,3,4,5,6,7], d;
                    d = start('start');
                    for(var i=0; i<color.length; ++i){
                        //if(d){
                            d = d.then(changeColorAsync.bind(this, color[i]));
                        //}else{
                            //d = changeColorAsync(color[i]);
                        //}
                    }
                    
                    //if(d){
                        d = d.then(end.bind(this, 'End'));
                    //}else{
                        //d = end('End');
                    //}
                    return false;
                });
            });

            function start(num) {
                var d = $.Deferred();
                $('#num').text('in');
                
                setTimeout(function () {
                    $('#num').text(num);
                    d.resolve();

                }, 3000);
                
                return d;
            }
            function end(num) {
                var d = $.Deferred();
                //$('#num').text(num);
                
                setTimeout(function () {
                    $('#num').text(num);
                    d.resolve();

                }, 3000);
                
                return d;
            }
            function changeColorAsync(num) {
                var d = $.Deferred();
                
                setTimeout(function () {
                    $('#num').text(num);
                    
                    d.resolve();

                }, Math.random() * 500+1000);
                
                return d;
            }
            */

            // 서비스 객체 리턴
            return singleton;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'ProcessService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);