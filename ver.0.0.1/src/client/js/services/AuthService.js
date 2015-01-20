////////////////////////////////////////////////////////////////////////////////

    /* 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : service 정의, 등록
    */

////////////////////////////////////////////////////////////////////////////////

/*
// satellizer - signout 로직 추가함
http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer
https://satellizer.herokuapp.com/#/profile

// 참고 : lynndylanhurley/ng-token-auth
// https://github.com/lynndylanhurley/ng-token-auth
// http://ng-token-auth-demo.herokuapp.com/#/
*/

'use strict';

define( [ 
        'U'
     ], function( U ) {

        // 선언
        function _service( $auth, $http, TalkService, NoticeService) {

            out( '# Service 등록 : AuthService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////
            
            var AuthService = {
                
                isAuthenticated: isAuthenticated,
                getProfile: getProfile,
                updateProfile: updateProfile,

                login: login,
                logout: logout,
                signup: signup,
                signout: signout,

                authenticate: authenticate,
                // link: link,
                // unlink: unlink,
                session: null
            };
            
            if(isAuthenticated()){
                // AuthService.session 업데이트 
                // (url을 통해 바로 접근하는 경우 아직 AuthService.session값은 채워져 있지 않음)
                getProfile();
            }

            ////////////////////////////////////////
            // 등록, 로그인
            ////////////////////////////////////////

            function getUserSession(user){
                return {
                    id: user._id,
                    email: user.email,
                    displayName: user.displayName
                };
            }

            function isAuthenticated(){
                return $auth.isAuthenticated();
            }

            /*
            var user = { 
                email: $scope.email, 
                password: $scope.password 
            };
            */
            function login(user){
                console.log('* login user : ', user);
                console.log('* login user : 비밀번호 노출됨');
                
                $auth.login(user)
                .then(function(result) {
                    /*
                    result = { 
                        user: {
                            _id: "54bb28bb0ce410d828b20e76"
                            displayName: "e"
                            email: "pdi1066@naver.com"
                            password: "$2a$10$kEU2kPhSvx3/MZ6rkfD4h.93iWSee.ynDja5CujalbwT6rLo/g8Wm"
                        }, 
                        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NGJiMjhiYjBjZTQxMGQ4MjhiMjBlNzYiLCJpYXQiOjE0MjE1NTI2NDcsImV4cCI6MTQyMjc2MjI0N30.-dultr389OE4jLYdqxeDOKQNEp0HLWiKgc5F16XFkQ0"
                    }
                    */
                    talk('You have successfully logged in');
                    out('* login result : ', result);
                    AuthService.session = getUserSession(result.data.user);
                })
                .catch(function(response) {
                    notice(response.data.message);
                });
            }

            function logout(){
                if (!isAuthenticated()) {
                    return;
                }

                $auth.logout()
                .then(function() {
                    talk('You have been logged out');
                    out('* logout result : --');
                    AuthService.session = null;
                });
            }
            /*
            var user = {
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            }
            */
            function signup(user){
                console.log('* signup user : ', user);
                console.log('* signup user : 비밀번호 노출됨');

                $auth.signup(user)
                .then(function(result) {
                    out('* signup result : ', result);
                    AuthService.session = getUserSession(result.data.user);
                })
                .catch (function(response) {
                    notice(response.data.message);
                });
            }

            function signout(){
                
                $auth.signout()
                .then(function(result) {
                    talk('You have been signed out');
                    out('* signout result : ', result);
                    AuthService.session = null;
                });
            }

            ////////////////////////////////////////
            // 다른 인증 사이트를 이용한 로그인
            ////////////////////////////////////////

            // $auth.authenticate(name, [userData]);
            function authenticate(provider, userData){

                $auth.authenticate(provider)
                .then(function(result) {
                    talk('You have successfully logged in');
                    out('* authenticate result : ', result);
                    console.log('* authenticate result config에 비밀번호 노출됨');

                    AuthService.session = getUserSession(result.data.user);
                })
                .catch(function(response) {
                    notice(response.data.message);
                });
            }

            /*
            // $auth.link(provider, [userData]);
            function link(provider, userData, callback){

                $auth.link(provider)
                .then(function() {
                    talk('You have successfully linked ' + provider + ' account');
                })
                .then(function() {
                    getProfile(callback);
                })
                .catch(function(response) {
                    notice(response.data.message);
                });

            }

            // $auth.unlink(provider);
            function unlink(provider, callback){

                $auth.unlink(provider)
                .then(function() {
                    talk('You have successfully unlinked ' + provider + ' account');
                })
                .then(function() {
                    getProfile(callback);
                })
                .catch(function(response) {
                    talk(response.data ? response.data.message : 'Could not unlink ' + provider + ' account');
                });

            }
            */

            ////////////////////////////////////////
            // Profile
            ////////////////////////////////////////

            function getProfile(callback) {
                $http.get('/api/me')
                .success(function(user) {
                    AuthService.session = getUserSession(user);
                    if(callback) callback(user);
                    out('* getProfile result : ', user);
                })
                .error(function(error) {
                    notice(response.data.message);
                });
            };

            /*
            var profileData = {
                displayName: $scope.user.displayName,
                email: $scope.user.email
            }
            */
            function updateProfile(profileData) {
                $http.put('/api/me', profileData)
                .then(function(user) {
                    AuthService.session = getUserSession(user);
                    // talk('Profile has been updated');
                    notice('Profile has been updated');
                    out('* updateProfile result : ', user);
                });
            };

            ////////////////////////////////////////
            // 팝업창
            ////////////////////////////////////////

            function talk(message){
                TalkService.open(message, {
                    delayTime:TalkService.LONGEST
                });
            }

            function notice(message, enableCancel){
                // 취소 버튼 보이기
                if(enableCancel === undefined){
                    enableCancel = true;
                }

                var config = {
                    title: '알림',
                    content: '<span>' + message + '</span>',
                    // content: angular.element(loginForm),
                    // content: U.getTemplate('#auth_login_popup', $element),
                    isHTML: true,
                    backdrop: (enableCancel)? true:'static',
                    buttons: ['확인'], //['예', '아니오', '취소'],
                    // templateUrl: _PATH.TEMPLATE + 'popup/notice.html',
                    hideCloseButton: !enableCancel,
                    // ESC키로 닫힘
                    keyboard : enableCancel
                };
                
                // 팝업창 띄우기
                var popup = NoticeService.open( config );
                return popup;
            }

            /*
            function showLoginPopup(enableCancel){
                // 취소 버튼 보이기
                if(enableCancel === undefined){
                    enableCancel = true;
                }

                var config = {
                    title: '로그인',
                    content: loginForm,
                    // content: angular.element(loginForm),
                    // content: U.getTemplate('#auth_login_popup', $element),
                    isHTML: true,
                    backdrop: (enableCancel)? true:'static',
                    buttons: [], //['예', '아니오', '취소'],
                    // templateUrl: _PATH.TEMPLATE + 'popup/notice.html',
                    hideCloseButton: !enableCancel,
                    // ESC키로 닫힘
                    keyboard : enableCancel
                };

                var callback = {
                    
                    opened: function( element, scope ) {
                        out( 'opened : ', element, scope );
                        
                        // content scope 초기화
                        // scope.option = 'all';
                        // scope.showDeleteButton = item.items && (item.items.length > 0);
                        
                        element.find('.modal-footer').remove();
                        
                        scope.$watch('option', function(newValue, oldValue) {
                            // $scope.option = newValue;
                            out('option : ', newValue);
                        });

                        scope.signup = function(){
                            signup();
                        };

                        scope.forgotPassword = function(){
                            // scope.cancel();
                            signup();
                        };
                        
                        scope.login = function(){
                            login();
                        };

                    },
                    
                    closed: function( result, element, scope ) {
                        // result : -1:cancel, 1:yes, 0:no
                        if ( result > 0 ) {
                            // yes
                            out('- result : 예 (', scope.option, ')');
                            deferred.resolve(scope.option);

                        }else if(result < 0){
                            // cancel
                            out('- result : 취소 (', scope.option, ')');
                            
                        }else{
                            out('- result : 아니오 (', scope.option, ')');
                            deferred.reject(scope.option);
                        }
                    }
                };
                
                // 삭제 대상이되는 uid 표시
                // $scope.removeUID = item.uid;

                // 팝업창 띄우기
                var popup = NoticeService.open( config, callback );

                //----------------
                // 팝업 닫힘 후 처리
                //----------------

                var self = this;
                var deferred = $q.defer();
                deferred.promise.then( 
                    function resolve( optionValue ) {
                        out('- 로그인 : 작업 실행');
                        // var uid = item.uid;
                        // self.removeDocument(optionValue, uid);
                        // $scope.removeUID = null;
                    }, 
                    function reject(){
                        out('- 로그인 : 작업 취소');
                        // $scope.removeUID = null;
                        // $scope.option = null;
                    } 
                );

                return popup;
            }
            */

            ////////////////////////////////////////
            // END AuthService
            ////////////////////////////////////////

            // 서비스 객체 리턴
            return AuthService;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'AuthService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END _service
        ////////////////////////////////////////
    }
);
