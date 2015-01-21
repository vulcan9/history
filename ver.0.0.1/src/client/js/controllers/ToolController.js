/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {
    
        // controller간 통신 방법
        // http://programmingsummaries.tistory.com/124
        
        // 선언
        function _controller( $scope, $element, $attrs, ProgressService, CommandService, $route, $routeParams, $location ) {

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
                /*
                var message = _checkExit();
                if(message){
                    // 닫기
                }
                */
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
                if(Tool.current.dataChanged){
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
            // 닫기 상태로 초기화 완료
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
                    });
                    return;
                }

                if(projectUID.indexOf('newproject:project-') != 0){
                    throw new Error('잘못된 접근입니다.');
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
                var param = {};
                CommandService.exe(CommandService.NEW, param, function callback(isSuccess, result) {
                    out('# 초기화 실행 종료 : ', isSuccess, ' - ', result);
                    ProgressService.complete();

                    alert('NEW PROJECT : ' + Project.current.PROJECT.TREE.uid);
==========================================================================================
                    // Project 설정창 띄우기

                    // Project 설정창 닫을때 서버 저장
                });
                
                //*/
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