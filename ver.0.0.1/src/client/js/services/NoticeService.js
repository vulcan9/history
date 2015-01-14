/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 버전 정보를 정의하는 문서임

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define([], function( ) {

        // 선언
        function _service( $modal, $modalStack ) {

            ////////////////////////////////////////
            // 스킨 샘플
            ////////////////////////////////////////
            
            /*
            <script type="text/ng-template" id="notice.html">
                
                <div class="modal-header">
                    <h3 class="modal-title">{{title}}</h3>
                </div>

                <div class="modal-body"></div>
                
                <div class="modal-footer">
                    <button class="btn btn-success" ng-click="yes()">OK</button>
                    <button class="btn btn-default" ng-click="no()">Cancel</button>
                </div>

            </script>
            */
   
            ////////////////////////////////////////
            // 사용 샘플
            ////////////////////////////////////////
            
            // 원본 소스 수정함 : 
            // navigation 메뉴가 두번 클릭에 의해서 열리기 때문에 주석처리함
            // dropdownToggle directive의 dropdownCtrl.toggle(); 라인 
            
            // UI Bootstrap [modal ]
            // http://angular-ui.github.io/bootstrap/

            // size : 'lg', 'sm', or undefined
            // backdrop : true, false, static (static:바닥 클릭시 닫힘)
            // keyboard : true, false (esc 키 동작)
            
            // var modalInstance = Notice.open( config, callback );
            // Notice.close( modalInstance );
            
            /*
            var config = {
                title: '저장',
                content: '<span>저장되지 않은 데이터가 있습니다. 저장하시겠습니까?</span>',
                size: '',
                backdrop: true, // 반투명 배경(true)
                buttons: ['예', '아니오', '취소']
                isHTML: false // content가 HTML 이면 true
                hideCloseButton: false // x버튼 감출려면 tree
                keyboard : true (esc 키 동작)
            };
            var callback = {
                
                //-----------------
                // 버튼 이벤트가 발생됬을때
                //-----------------
                
                ok: function( result, element, scope ) {
                    out( 'close : ', element );
                    var config = {
                        title: '알림',
                        content: '<b>하시겠습니까?</b>',
                        size: '',
                        backdrop: true,
                    };
                    confirmPopup( config );

                    // prevent
                    // return false;
                },
                no: function( result, element, scope ) {
                    out( 'close : ', element );
                    var config = {
                        title: '알림',
                        content: '<b>하시겠습니까?</b>',
                        size: '',
                        backdrop: true,
                    };
                    confirmPopup( config, {
                        closed: function( result, element, scope ) {
                            scope.$parent.aaa = 'ddddddddddddd';
                        }
                    } );

                    // prevent (창을 닫지 않음)
                    return true;
                },

                //-----------------
                // 창이 열리거나 닫힐때
                //-----------------
                
                opened: function( element, scope ) {
                    out( 'opened : ', element );
                },
                closed: function( result, element, scope ) {
                    // result : -1:cancel, 1:yes, 0:no
                    if ( result > 0 ) {
                        out( 'closed : ok - ', result, element );
                    } else {
                        out( 'closed : no - ', result, element );
                    }
                }
            };
            */

            var Notice = {
                open : confirmPopup,
                close : closePopup
            };
            
            
            function confirmPopup( config, callback ) {
                var config = config || {};
                var callback = callback || {};

                config.size = config.size || '';
                config.templateUrl = config.templateUrl || _PATH.TEMPLATE + 'popup/notice.html';
                config.backdrop = ( config.backdrop === undefined ) ? 'static' : config.backdrop;
                config.controller = ConfirmController;

                angular.extend( config, {
                    // modalInstance의 controller에서 사용할 수있는 변수를 정의
                    resolve: {
                        config: function() {
                            return config;
                        },
                        callback: function() {
                            return callback;
                        }
                    }
                } );

                var modalInstance = $modal.open( config );
                return modalInstance;
            }

            function ConfirmController( $scope, $timeout, $modalInstance, $compile, config, callback ) {

                var windowElement;
                $scope.title = config.title;
                // $scope.content = config.content;

                // Opened
                $modalInstance.opened.then( function( isOpened ) {
                    $timeout( openedCallback );
                } );

                // Closed
                // 전달값 : 'ok, 'cancel, 'backdrop click' (X 버튼, 배경클릭)
                // reason : -1:cancel, 1:yes, 0:no
                $modalInstance.result.then(
                    // YES : 1
                    function( reason ) {
                        if ( callback.closed ) callback.closed.apply( null, [ reason, windowElement, $scope ] );
                    },
                    // NO : 0, -1
                    function( reason ) {
                        if ( reason == 'backdrop click' ) reason = -1;
                        if ( callback.closed ) callback.closed.apply( null, [ reason, windowElement, $scope ] );
                    }
                );

                function openedCallback( isOpened ) {

                    // UI Bootstrap
                    // http://angular-ui.github.io/bootstrap/
                    windowElement = angular.element( 'div[modal-window]' );
                    var $header = windowElement.find( '.modal-header' );
                    var $body = windowElement.find( '.modal-body' );
                    var $footer = windowElement.find( '.modal-footer' );

                    // 마지막 요소
                    var win = $body[$body.length-1];

                    if(config.isHTML){
                        var linkingFunction = $compile( config.content );
                        var elem = linkingFunction( $scope );
                        angular.element( win ).html( elem );
                    }else{
                        angular.element( win ).html( config.content );
                    }

                    out('# NOTICE : ', angular.element( win ).text());

                    //-----------------
                    // close 버튼 표시
                    //-----------------
                    
                    var $close = $header.find( '.close' );
                    if(config.hideCloseButton){
                        // $close.remove();
                        $close.css('display', 'none');
                    }else{
                        $close.css('display', 'inline-block');
                    }
                    
                    //-----------------
                    // 버튼 label, 개수 재조정
                    //-----------------
                    
                    var $buttons = $footer.find('.btn');
                    var len = $buttons.length;
                    for(var i=len-1; i>=0; --i){
                        var label = config.buttons[i];
                        if(label){
                            angular.element($buttons[i]).html(label);    
                        }else{
                            angular.element($buttons[i]).remove();
                        }
                    }

                    // opened callback 호출
                    if ( callback.opened ) callback.opened.apply( null, [ windowElement, $scope ] );
                }

                //-----------------
                // 버튼 클릭
                //-----------------

                $scope.yes = function() {
                    if ( callback.ok ) {
                        var prevent = callback.ok.apply( null, [ 1, windowElement, $scope ] );
                        if ( prevent ) return;
                    }

                    closePopup($modalInstance, 1)
                };

                $scope.no = function() {
                    if ( callback.no ) {
                        var prevent = callback.no.apply( null, [ 0, windowElement, $scope ] );
                        if ( prevent ) return;
                    }
                    $modalInstance.dismiss( 0 );
                };

                $scope.cancel = function() {
                    if ( callback.cancel ) {
                        var prevent = callback.no.apply( null, [ -1, windowElement, $scope ] );
                        if ( prevent ) return;
                    }
                    $modalInstance.dismiss( -1 );
                };

            }

            // reason : -1:cancel, 1:yes, 0:no
            function closePopup( modalInstance, reason ) {
                modalInstance.close( reason );
            }























            // 서비스 객체 리턴
            return Notice;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'NoticeService', _service );
        };
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
