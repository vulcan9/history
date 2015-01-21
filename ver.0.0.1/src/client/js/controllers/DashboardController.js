/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _controller( $scope, $q, AuthService, ProcessService, HttpService, $rootScope ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            /*
            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css',
                _PATH.CSS + 'application.css',

                '//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css',
                _PATH.CSS + 'login.css'
            ] );
            */

            //$scope.$emit('updateCSS', [_PATH.CSS + 'login.css']);
            // <link href="//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css" rel="stylesheet">

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            ////////////////////////////////////////
            // DB에서 User의 Project 리스트 조회
            ////////////////////////////////////////

            var process = ProcessService.process();
            process.start();
            process.add($q.defer(), angular.bind(this, _load));
            process.end();

            // User 로그인이 되어있는 경우 Tool 설정 로드
            function _load(defer){
                
                out('AuthService.session  : ', AuthService.session);
                var userID = AuthService.session.id;

                var promise = HttpService.load( {
                        method: 'GET',
                        url: '/user'+ '/' + userID + '/project',
                        params: {
                            // user: userID
                        }
                    } )
                    .then( 
                        angular.bind(this, success), 
                        angular.bind(this, error)
                    );

                /*
                result = {
                    message: 'success',
                    data: (doc? doc.tool : null)
                }
                */
                function success(result){
                    out ('# Project 데이터 조회 완료 : ', result);

                    // var projects = [];
                    angular.forEach(result.data, function(value, key) {
                        
                        // project 데이터
                        value.project = angular.fromJson(value.project);

                        // thumbnail : 데이터의 첫 항목의 thumbanil을 사용
                        value.thumbnail = value.project.items[0].thumbnail;

                        // out(key, ' : ', value);
                    });

                    //*******************************

                    this.projects = result.data;
                    defer.resolve();

                    //*******************************
                }

                function error(result){
                    out ('# Project 데이터 조회 에러 : ', result);

                    // defer.reject( data );
                    defer.resolve();
                }
            }

            this.openProject = function(item){
                out('OPEN PROJECT : ', item);
                $rootScope.go_tool(item.uid);
            }
            
            this.newProject = function(){
                out('NEW PROJECT :');
                $rootScope.go_tool();
            }

            ////////////////////////////////////////
            // END Controller
            ////////////////////////////////////////
        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller( 'DashboardController', _controller );
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);