////////////////////////////////////////////////////////////////////////////////

    /* 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : service 정의, 등록
    */

////////////////////////////////////////////////////////////////////////////////

'use strict';

define( [ 
        'U',
        'text!' + _PATH.TEMPLATE + '/session/loginForm.html'
     ], function( U, loginForm ) {

        // 여기서 등록 안됨 (application config 전임)
        // application.service( 'SessionService', _service );

        // 선언
        function _service( $location, NoticeService, $q, $rootScope, $timeout, $document ) {

            out( '# Service 등록 : SessionService' );

            /////////////////////////////////////
            // 서비스 객체 싱클톤
            /////////////////////////////////////

            var SessionService = {
                login : login,
                signup : signup
            };
            
            ////////////////////////////////////////
            // Login
            ////////////////////////////////////////
            
            var _popInstance;
            
            function login(enableCancel){
                loginCancel();
                _popInstance = showLoginPopup(enableCancel);
            }

            function loginCancel(){
                if(_popInstance){
                    var reason = -1;
                    NoticeService.close( _popInstance, reason );
                    _popInstance = null;
                }
            }

            ////////////////////////////////////////
            // Sign up
            ////////////////////////////////////////

            function signup(){
                loginCancel();
                // 로그인 페이지로 이동
                $location.path('/signup');
            }

            ////////////////////////////////////////
            // Route 체크 (로그인 세션)
            ////////////////////////////////////////
            
            $rootScope.$on("$routeChangeSuccess", function (event, currRoute, prevRoute) {
                
                // 열린 창 닫기
                loginCancel();

                out('# routeChangeSuccess : ', $location.path(), currRoute);
                // redirect된 상황인지를 필터링
                // var path = $location.path();
                if(currRoute.$$route)
                {
                    var path = currRoute.$$route.originalPath;
                    if(path === '/tool' || path === '/admin')
                    {
                        alert('// 세션 체크(로그인 페이지로 이동)');
                        login(false);
                        return;
                    }
                }
            });

            ////////////////////////////////////////
            // 팝업창
            ////////////////////////////////////////

            /*
            // http://stackoverflow.com/questions/21149653/ng-include-not-working-with-script-type-text-ng-template

            content: '<script type="text/ng-template" id="tree_message_remove">'+
                        '<span>삭제 하시겠습니까?</span>' + 
                        '</script>'+
                        '<div ng-include src="templateID"></div>',
            // scope.templateID = 'tree_message_remove';
            
            content: '<div ng-include src="tree_message_remove.html">' + 
                        '<span>삭제 하시겠습니까?</span>' +
                        '<p style="margin: 20px 40px;" ng-init="option=1">' + 
                        '<label><input type="radio" ng-model="option" name="option" value="1" ng-checked="option==1"> 모든 하위 페이지 함께 제거</label>' + 
                        '<br>'+
                        '<label><input type="radio" ng-model="option" name="option" value="2" ng-checked="option==2"> 해당 페이지만 제거</label>' + 
                        '</p>' + 
                        '</div>',
            */

            function showLoginPopup(enableCancel){
                // 취소 버튼 보이기
                if(enableCancel === undefined){
                    enableCancel = true;
                }

                var config = {
                    title: '로그인',
                    content: loginForm,
                    // content: angular.element(loginForm),
                    // content: U.getTemplate('#session_login_popup', $element),
                    isHTML: true,
                    // backdrop: false,
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

            ////////////////////////////////////////
            // END SessionService
            ////////////////////////////////////////

            // 서비스 객체 리턴
            return SessionService;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'SessionService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END _service
        ////////////////////////////////////////
    }
);

/*
// https://code.angularjs.org/1.2.23/docs/guide/services
// https://code.angularjs.org/1.2.23/docs/guide/providers

function UnicornLauncher(apiToken) {
  this.launchedCount = 0;
  this.launch = function() {
    // make a request to the remote api and include the apiToken
    ...
    this.launchedCount++;
  }
}

// factory 를 이용하는 경우 new 연산자에 의한 의존관계와 매개변수에의한 의존관계가 존재한다.

application.factory('unicornLauncher', ["apiToken", function(apiToken) {
  return new UnicornLauncher(apiToken);
}]);

// service의 constructor injection 패턴에 의해 더 simple하게 표현할 수 있다.

$provide.service('unicornLauncher', ["apiToken", UnicornLauncher]);
application.service('unicornLauncher', ["apiToken", UnicornLauncher]);
*/