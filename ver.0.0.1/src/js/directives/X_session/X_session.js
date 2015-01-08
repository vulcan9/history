/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U'
    ],
    function( U ) {


        // 선언
        function _directive() {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                // template: '<span>Session 체크</span>',
                templateUrl: _PATH.TEMPLATE + 'session/session.html',
                
                replace: true,
                transclude: true,
                // priority: 0,
                // scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

                // $timeout (function() {
                //     $element.trigger('#view.layoutUpdate');
                // }, 100);

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller( $scope, $element, $attrs, NoticeService, $q) {
                
                



// RootScope에서 session 값을 유지한다. (api제공) - 보안문제 발생할것 같음
// 값에 따라 로그인 창을 띄운다.

// 매번 로그인 체크하는걸로...
// 어차피 화면 표시되더라도 username 정보 없으면 불러오기 안됨
// session="active" : 로드될때 로그인이 안되어 있으면 로그인 창을 띄운다.
// session="deactive" (default)
//  <div session="active">로그인이 필요한 페이지에 삽입한다.</div>

                
                $scope.login = function(){
                    login();
                };

                $scope.signup = function(){
                    signup();
                };

                ////////////////////////////////////////
                // Login
                ////////////////////////////////////////
                
                function login(){
                    showLoginPopup();
                }

                ////////////////////////////////////////
                // Sign up
                ////////////////////////////////////////

                function signup(){
                    // 로그인 페이지로 이동
                    application.$location.path('/signup');
                }

                ////////////////////////////////////////
                // 팝업창
                ////////////////////////////////////////

                function showLoginPopup(){

                    var config = {
                        
                        /*
                        // http://stackoverflow.com/questions/21149653/ng-include-not-working-with-script-type-text-ng-template

                        content: '<script type="text/ng-template" id="tree_message_remove">'+
                                    '<span>삭제 하시겠습니까?</span>' + 
                                    '</script>'+
                                    '<div ng-include src="templateID"></div>',
                        // scope.templateID = 'tree_message_remove';
                        
                        content: '<div ng-include src="tree_message_remove.html">' + 
                                    '<span>삭제 하시겠습니까?</span>' +
                                    '<p style="margin: 20px 40px;" ng-init="removeOption=1">' + 
                                    '<label><input type="radio" ng-model="removeOption" name="removeOption" value="1" ng-checked="removeOption==1"> 모든 하위 페이지 함께 제거</label>' + 
                                    '<br>'+
                                    '<label><input type="radio" ng-model="removeOption" name="removeOption" value="2" ng-checked="removeOption==2"> 해당 페이지만 제거</label>' + 
                                    '</p>' + 
                                    '</div>',
                        */

                        title: '로그인',
                        content: U.getTemplate('#session_login_popup', $element),
                        isHTML: true,
                        // backdrop: false,
                        // buttons: ['예', '아니오', '취소']
                        buttons: ['예', '아니오']
                        // templateUrl: _PATH.TEMPLATE + 'popup/notice.html'
                    };

                    var callback = {
                        
                        opened: function( element, scope ) {
                            out( 'opened : ', element, scope );
                            // scope.templateID = template;

                            // content scope 초기화
                            // scope.removeOption = 'all';
                            // scope.showDeleteButton = item.items && (item.items.length > 0);
                            
                            scope.$watch('removeOption', function(newValue, oldValue) {
                                $scope.removeOption = newValue;
                                out('removeOption : ', newValue);
                            });
                        },
                        
                        closed: function( result, element, scope ) {
                            // result : -1:cancel, 1:yes, 0:no
                            if ( result > 0 ) {
                                // yes
                                out('- result : 예 (', scope.removeOption, ')');
                                deferred.resolve(scope.removeOption);

                            }else if(result < 0){
                                // cancel
                                out('- result : 취소 (', scope.removeOption, ')');
                                
                            }else{
                                out('- result : 아니오 (', scope.removeOption, ')');
                                deferred.reject(scope.removeOption);
                            }
                        }
                    };
                    
                    // 삭제 대상이되는 uid 표시
                    // $scope.removeUID = item.uid;

                    // 팝업창 띄우기
                    NoticeService.open( config, callback );

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
                            // $scope.removeOption = null;
                        } 
                    );
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function(application){
            // 등록
            application.directive( 'session', _directive );
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);


