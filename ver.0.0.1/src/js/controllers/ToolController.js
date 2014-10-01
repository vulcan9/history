/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.controller( 'ToolController', _controller );

        // controller간 통신 방법
        // http://programmingsummaries.tistory.com/124
        
        // 선언
        function _controller( $scope, $element, $attrs, DataService, ExecuteService ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);
            
            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css' ,
                _PATH.CSS + 'application.css',
                _PATH.CSS + 'space.css' 
            ] );

            //-----------------------
            // Tool 데이터 세팅
            //-----------------------

            // tool 동작에 필요한 데이터 기록
            if (!Tool.current) {
                Tool.current = new Tool();
            }

            ////////////////////////////////////////
            // 초기화
            ////////////////////////////////////////

            // ProgressService.init (true);
            // ProgressService.init(null);
            // ProgressService.update(60);
            
            out ('TODO : Tool 초기화 작업');

            /*
            // 저장 성공 여부 기록
            this._saveSuccessed = undefined;

            // 로드완료 체크 timeout 간격 (20초)
            this._loadTimeoutInterval = 20000;

            // 함수 호출 관리 (Command Process 관리)
            this._process = new ProcessQueue();
            //processAdd, processNext, processCancel, _checkProcess

            // 화면 보호 관리 protectON, protectOFF
            // Notice, Toast
            
            // 로드 완료 flag 초기화
            loadingON, loadingOFF
            this._initReadyState();

            // View 인스턴스 생성

            // 새로운 데이터 구조 생성하기
            this.initProject();
            // 저장된 이후로 데이터가 변경되었는지를 체크
            this._dataChanged = false;
            
            // 최종 랜더링 확인
            this.addResizeEvent();
            this.render();

            // 닫기 상태로 초기화 완료
            this.closeProject();
            */

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

            ////////////////////////////////////////
            // 새프로젝트 만들기
            ////////////////////////////////////////
            
            var param = {
                // scope : $scope, 
                // element : $element, 
                // attrs : $attrs
            }

            ExecuteService.execute('new', param, function successCallback(){

            }, function errorCallback(){

            });

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            








            // End Controller
        }

        // 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);