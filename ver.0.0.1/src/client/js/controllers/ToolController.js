/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( ['U'], function(U) {
    
        // controller간 통신 방법
        // http://programmingsummaries.tistory.com/124
        
        // 선언
        function _controller( $scope, $element, ProgressService, CommandService, $route, $routeParams, NoticeService, $location, $timeout, $rootScope ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);
            
            /*
            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css' ,
                _PATH.CSS + 'application.css',
                _PATH.CSS + 'space.css' 
            ] );
            */

            //-----------------------
            // Tool 데이터 세팅
            //-----------------------

            // tool 동작에 필요한 데이터 기록
            var callback = angular.bind(this, initComplate, $route, $routeParams);
            if (Tool.current == null) {
                Tool.current = new Tool(callback);

                _windowCloseEvent();

            }else{
                Tool.current.initialize(callback);
            }
            
            $scope.$on('$destroy', function(event){
                _checkExit();
            });

            //-----------------------
            // 윈도우 종료 이벤트
            //-----------------------
            
            function _windowCloseEvent(){
                var $window = angular.element(window);
                $window.on('beforeunload', _checkExit);
                $window.on('unload', _checkExit);
            }

            function _checkExit(){
                if(Tool.current && Tool.current.dataChanged){
                    var message = '저장되지 않은 데이터가 있습니다.';
                    return message;
                }else{
                    var $window = angular.element(window);
                    $window.off('beforeunload', _checkExit);
                    $window.off('unload', _checkExit);
                }
            }

            ////////////////////////////////////////
            // 초기화
            ////////////////////////////////////////

            ProgressService.init (true);
            // ProgressService.init(null);
            // ProgressService.update(60);
            
            out ('TODO : Tool 초기화 작업');

            
            // Tool 세팅 관련 데이터가 모두 완료된 뒤 초기화 완료
            
            

            // 로드완료 체크 timeout 간격 (20초)
            // this._loadTimeoutInterval = 20000;

            

            // 화면 보호 관리 protectON, protectOFF
            // Notice, Toast
            
            // 로드 완료 flag 초기화
            // loadingON, loadingOFF
            // this._initReadyState();

            // View 인스턴스 생성
            // 새로운 데이터 구조 생성하기
            
            ////////////////////////////////////////
            // 초기화 상태 지정
            ////////////////////////////////////////
            
            function initComplate(route, routeParams){
                
                var projectUID = routeParams['projectUID'];

                // 유효한 UID인 경우 통과
                var available = true;

                // DB 조회하여 해당 uid의 Project가 있는지 검사

                if(projectUID.indexOf('project-') == 0){
                    // 문서 열기
                    var param = {
                        uid: projectUID
                    }
                    CommandService.exe(CommandService.OPEN, param, function callback(isSuccess, result) {
                        out('# 초기화 실행 종료 : ', isSuccess, ' - ', result);
                        ProgressService.complete();

                        // Project 설정창 띄우기
                        var data = Project.current.PROJECT.TREE;
                        if(data.title) return;

                        $rootScope.showPopup_projectConfiguration(function(){
                            out('# Project 설정 완료');
                        });
                    });
                    return;
                }

                if(projectUID.indexOf('new:project-') != 0){
                    throw new Error('잘못된 접근입니다.');
                    // var projectUID = Project.current.PROJECT.TREE.uid;
                    // var projectUID = 'project-' + U.createUID();
                    // $location.path('/tool/' + projectUID);
                    return;
                }

                /*
                var param = {};
                CommandService.exe ( CommandService.CLOSE, param, function callback(isSuccess, result) {
                    out('# 초기화 실행 종료 : ', isSuccess, ' - ', result);
                    ProgressService.complete();
                });
                
                /*/

                // 새문서 열기
                var param = {
                    uid: projectUID.substring(4),
                    // title: '프로젝트 새로 만들기',
                    // description: '프로젝트에 대한 상세 설명'
                };
                CommandService.exe(CommandService.NEW, param, function callback(isSuccess, result) {
                    out('# 초기화 실행 종료 : ', isSuccess, ' - ', result);
                    ProgressService.complete();

                    // Project 설정창 띄우기
                    var data = Project.current.PROJECT.TREE;
                    if(data.title) return;

                    $rootScope.showPopup_projectConfiguration(function(){
                        out('# Project 설정 완료');
                    });
                });
                
                //*/
            }

            
            

            ////////////////////////////////////////
            // Project Configuration
            ////////////////////////////////////////

            //----------------
            // 팝업창
            //----------------

            $rootScope.showPopup_projectConfiguration = function (callback){
                if(!Project.current){
                    if(callback) callback();
                    return;
                }
                var data = Project.current.PROJECT.TREE;

                var config = {
                    title: '프로젝트 설정',
                    content: U.getTemplate('#project_configuration_popup', $element),
                    isHTML: true,
                    backdrop: true,
                    // hideCloseButton: true,
                    // keyboard: false
                    // templateUrl: _PATH.TEMPLATE + 'popup/notice.html',
                    // buttons: ['예', '아니오', '취소']
                    buttons: ['확인', '취소']
                };

                var handler = {
                    
                    opened: function( element, scope ) {
                        out( 'opened : ', element, scope );
                        scope.project_title = data.title;
                        scope.project_description = data.description;

                        /*
                        // form은 form태그의 name값임
                        var form = scope.form;
                        scope.$watch('project_title', function(newValue, oldValue) {
                            // out('invalid : ', form.$valid);
                            if(form.$invalid){
                                element.find('.modal-footer').addClass('disable');
                            }else{
                                element.find('.modal-footer').removeClass('disable');
                            }
                        });
                        */
                        $timeout(function() {
                            element.find('[name="field_title"]')[0].focus();
                        }, 500);
                    },
                    
                    closed: function( result, element, scope ) {
                        // result : -1:cancel, 1:yes, 0:no
                        if(result == -1){
                            return;
                        }

                        Project.current.projectAPI('title', scope.project_title);
                        Project.current.projectAPI('description', scope.project_description);
                        if(callback) callback();
                    }
                };
                
                // 삭제 대상이되는 uid 표시
                // $scope.removeUID = item.uid;

                //----------------
                // 팝업 닫힘 후 처리
                //----------------

                /*
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
                */

                // 팝업창 띄우기
                NoticeService.open( config, handler );
            }



            ////////////////////////////////////////
            // 데이터
            ////////////////////////////////////////

            /*
            // View 로부터 이벤트를 청취해 Model을 변경한다.
            // Model이 변경되면 Model을 모니터링 하고 있는 view가 자동으로 업데이트 하도록 한다.

            // ItemModel 추가
            addItem: function(itemModel) : this.itemCollection.add(itemModel);

            // Item Model 삭제
            removeItem: function(itemModel) : itemModel.destroy();

            status 값 변경됨
            statusChangedItem: function(data)
            data.model.set({status:status});
            this.itemCollection.trigger("statusChangedItem", data.model);

            property 값 변경됨
            propertyChangedItem: function(data)
            model.set(properties);
            this.itemCollection.trigger("propertyChangedItem", data.model);

            // ItemCollection 데이터 비우기
            removeAllItem: function()

            // Project Model 변경
            setProject: function (data)
            // ProjectModel 내용이 바뀔때
            _onProjectModelChanged: function(projectModel)

            // ItemCollection 이벤트
            onAddItem: function(itemModel)
            onRemoveItem: function(itemModel)
            onChangeItem: function(itemModel)
            onSortItem: function(collection)

            // ItemCollection Custom 이벤트
            // 아이템 상태가 변경될때
            onStatusChangedItem: function(itemModel)
            // 아이템 속성이 변경될때
            onPropertyChangedItem: function(itemModel)
            // 리스트가 초기화 될때
            onRemoveAll: function()
            */

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            








            // End Controller
        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller('ToolController', _controller);
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);