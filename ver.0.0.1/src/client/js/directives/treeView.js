/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [ 'U' ], function( U ) {

        /*
        application.filter('orderBy', _filter);
        function _filter() {
            return function(items, field, reverse) {
                
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });

                filtered.sort(function (a, b) {
                    //return (a[field] > b[field] ? 1 : -1);
                    if (a[field] > b[field]){
                        return 1;
                    }else if (a[field] < b[field]){
                        return -1;
                    }else{
                        return (a['index'] > b['index'] ? 1 : -1);
                    }
                });

                if(reverse) filtered.reverse();
                return filtered;


                // 1. depth로 정렬
                // 2. 
                // Tree component
                // http://jimliu.github.io/angular-ui-tree/
            };
        }
        */

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',
                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/treeView.html',
                replace: true,
                scope: {},
                
                controller: Controller,

                link: Link

            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Controller ( $scope, $element, $attrs, Project , CommandService, NoticeService, $q) {

                ////////////////////////////////////////
                // TREE 데이터 이벤트
                ////////////////////////////////////////

                //*
                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Project.changed-TREE (treeView) : ', arguments);

                        // 2. 변경 내용을 scope에 적용한다.
                        var tree = Project.current.project('TREE');
                        $scope.tree = (tree)? tree.items : [];
                    }
                });
                
                // 3. scope이 변경되었음을 감지한다.
                $scope.$watch('tree', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.tree changed (treeView) : ', $scope.tree);
                    $element.trigger('#view.layoutUpdate');
                }, true);
                //*/

                $scope.$on('#Project.changed-DOCUMENT', function(e, data){
                    out('#Project.changed-DOCUMENT (treeView) : ', data.newValue);

                    // Thumbnail 설정
                    initThumbnail();
                });

                ////////////////////////////////////////
                // DOCUMENT 데이터 이벤트
                ////////////////////////////////////////
                
                /*
                #Project.added-DOCUMENT
                #Project.removed-DOCUMENT
                #Project.modified-DOCUMENT
                #Project.selected-DOCUMENT
                */

                // var data = {data:project};
                $scope.$on('#Project.initialized', function(e, data){
                    // $scope.tree = Project.current.project('TREE');
                    // $scope.document = Project.current.project('DOCUMENT');
                    __onInitializeDocument();
                });

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    out('#Project.selected-DOCUMENT (treeView) : ', data);
                    __onSelectDocument(data.newValue, data.oldValue);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.added-DOCUMENT', function(e, data){
                    out('#Project.added-DOCUMENT (treeView) : ', data);
                    __onAddDocument(data.item, data.param);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    out('#Project.removed-DOCUMENT (treeView) : ', data);
                    __onRemoveDocument(data.item, data.param);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    out('#Project.modified-DOCUMENT (treeView) : ', data);
                    __onModifyDocument(data.item, data.param);
                });

                //-------------------------------------
                // 용지 사이즈 세팅
                //-------------------------------------
                
                var __maxWidth = 70;
                var __maxHeight = 70;
                // 용지 원본에 대한 미리보기 scale
                var __scale = 1;
                // 용지 가로,세로 비율
                // var __ratio = 1;

                function __onInitializeDocument(item, param){
                    var sourceWidth = Project.paper.width;
                    var sourceHeight = Project.paper.height;

                    // var scaleW = __maxWidth / sourceWidth;
                    // var scaleH = __maxHeight / sourceHeight;
                    // __scale = Math.min(scaleW, scaleH);
                    __scale = __maxHeight / sourceHeight;

                    var w = sourceWidth * __scale;
                    var h = sourceHeight * __scale;

                    $scope.paper = {
                        width: w,
                        height: h
                    };
                }

                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------

                function __onSelectDocument(newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    $scope.selectUID = newValue;
                }

                /*
                <div class="hi-paper" ng-repeat="item in tree.items" ng-click="selectDocument(item, $index)">
                    {{$index}}
                </div>
                
                option: {
                    position: option,
                    selectUID: uid || Project.current.getSelectDocument()
                }
                */

                // Tree에 해당 위치에 데이터 추가
                function __onAddDocument (item, param){
                    var option = param.option || {};
                    var posOption = option.position;
                    var selectUID = option.selectUID;
                    var info = Project.current.getTreePosition(selectUID, posOption);
                    
                    var uid = item.uid;
                    var treeItem = Project.current.getDefinitionTree(uid);
                    info.items.splice(info.index, 0, treeItem);
                }

                function __onRemoveDocument(item, param){
                    // out('tree remove : ', param.position);
                    // var info = Project.current.getTreePosition(uid);
                    
                    var option = param.option;
                    var info = param.position;
                    var item = info.items[info.index];

                    if(option == 'only'){
                        // 하위 노드들이 있는지 검색 후 있으면 리스트의 depth를 한단계씩 올림

                        // subItem을 이동시킬 index
                        var holder = info.index;
                        var len = item.items.length;

                        for(var i=len-1; i>=0; --i){
                            var subItem = item.items[i];
                            // out('subItem : ', subItem);
                            info.items.splice(holder, 0, subItem);
                        }

                        // index가 변경됨
                        var changedIndex = holder + len;
                        info.items.splice(changedIndex, 1);

                    }else{
                        // option == 'all' : 하위 노드 모두 제거
                        info.items.splice(info.index, 1);
                    }
                }

                function __onModifyDocument(item, param){
                    
                }

                //-------------------------------------
                // Thumbnail 업데이트
                //-------------------------------------

                // thumbnial 초기 세팅
                $scope.thumbnail = {};

                /*
                $scope.initThumbnail = function(documentUID){
                    var api = Project.current.documentAPI(documentUID);
                    var src = api.thumbnail('src');

                    var thumbnail = api.thumbnail();
                    // $scope.thumbnail[documentUID] = thumbnail;
                }
                */

                function initThumbnail(){
                    var documents = Project.current.project('DOCUMENT');
                    for(var documentUID in documents.items)
                    {
                        // var api = Project.current.documentAPI(documentUID);
                        // var thumbnail = api.thumbnail();

                        var item = documents.items[documentUID];
                        var thumbnail = item.document.thumbnail;
                        updateThumbnail(documentUID, thumbnail);

                        // out('* 썸네일 데이터 : ', documentUID, thumbnail);
                    }
                }

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.changed-thumbnail', function(e, data){
                    out('#Project.changed-thumbnail (treeView) : ', data.newValue);
                    
                    // UID로 개별 업데이트 해야함
                    var documentUID = data.documentUID;
                    var thumbnail = data.newValue;
                    updateThumbnail(documentUID, thumbnail);
                });

                function updateThumbnail(documentUID, thumbnail){
                    if(!thumbnail) return;
                    /*
                    var sourceWidth = thumbnail.width;
                    var sourceHeight = thumbnail.height;

                    var maxW = $scope.paper.width;
                    var maxH = $scope.paper.height;
                    var scaleW = maxW / sourceWidth;
                    var scaleH = maxH / sourceHeight;
                    var scale = Math.min(scaleW, scaleH);

                    var w = sourceWidth * scale;
                    var h = sourceHeight * scale;
                    $scope.thumbnail[documentUID] = {
                        width : w,
                        height : h,
                        src : thumbnail ? thumbnail.src : ''
                    };
                    */
                    $scope.thumbnail[documentUID] = thumbnail;
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                ////////////////////////////////////////
                // DOM 인터렉션 실행
                ////////////////////////////////////////

                // Document 선택
                this.selectDocument = function  (item){
                    var param = {
                        documentUID : item.uid
                    };

                    CommandService.exe(CommandService.SELECT_DOCUMENT, param);
                }

                // Document 추가 
                // position : 'next', 'sub', 'prev'
                this.addDocument = function (position, selectUID){

                    if(Project.current == null) return;

                    // 현재 선택 상태의 Document uid 의  nextSibling에 추가한다.
                    // selectUID에 해당되는 tree item 노드 찾기
                    // var selectUID = selectUID || Project.current.getSelectDocument();
                    // var position = Project.current.getTreePosition(selectUID, position);
                    
                    // command 호출
                    var param = {
                        option: {
                            position: position,
                            selectUID: selectUID || Project.current.getSelectDocument()
                        }
                    };

                    CommandService.exe(CommandService.ADD_DOCUMENT, param);
                }

                this.showRemoveDocumentPopup = function (item){

                    if(Project.current == null) return;
                    
                    //----------------
                    // 팝업창
                    //----------------

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

                        title: '삭제',
                        content: U.getTemplate('#tree_message_remove', $element),
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
                    $scope.removeUID = item.uid;

                    // 팝업창 띄우기
                    NoticeService.open( config, callback );

                    //----------------
                    // 팝업 닫힘 후 처리
                    //----------------

                    var self = this;
                    var deferred = $q.defer();
                    deferred.promise.then( 
                        function resolve( optionValue ) {
                        
                            var uid = item.uid;
                            self.removeDocument(optionValue, uid);
                            $scope.removeUID = null;
                        }, 
                        function reject(){
                            out('- 삭제 : 작업 취소');
                            $scope.removeUID = null;
                            $scope.removeOption = null;
                        } 
                    );
                }

                // option: 'all', 'only'
                this.removeDocument = function (option, uid){
                    
                    if(Project.current == null) return;

                    /*
                    if(option == 'all'){
                        out('- 삭제 : 해당 노드 및 하위노드 모두 삭제');
                    }else if(option == 'only'){
                        out('- 삭제 : 해당 노드만 삭제후 하위노드는 상위 depth로 이동');
                    }
                    */
                    
                    // command 호출
                    var removeUID = uid || Project.current.getSelectDocument();
                    var param = {
                        documentUID : removeUID,
                        option : option
                    };

                    CommandService.exe(CommandService.REMOVE_DOCUMENT, param);
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs, controller) {

                // $element.trigger('#view.layoutUpdate');

                // 너비 초기 설정값
                __pannelToggle(250);
                // $scope.$evalAsync( __pannelToggle );
                // $timeout(__pannelToggle, 500);

                // pannel 열기/닫기
                $scope.pannelToggle = function(scope) {
                    __pannelToggle();
                };

                function __pannelToggle(w){
                    var $dock = $element.parent('.hi-dock');
                    if(w === undefined){
                        w = $dock.outerWidth();
                        w = (w>300) ? 250:400;
                    }
                    
                    $dock.css({
                        'min-width': w + 'px',
                        'width': w + 'px'
                    });
                    
                    $element.trigger('#view.layoutUpdate', {
                        targetCSS:{
                            width : w
                        }
                    });
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                //-----------------------------------
                // Tree component
                // http://jimliu.github.io/angular-ui-tree/
                //-----------------------------------

                // dom에서 this == scope
                $scope.toggle = function(scope) {
                    scope.toggle();
                };

                /*
                $scope.moveLastToTheBeginning = function () {
                    var a = $scope.data.pop();
                    $scope.data.splice(0,0, a);
                };
                */
                
                $scope.collapseAll = function() {
                    $scope.$broadcast('collapseAll');
                };

                $scope.expandAll = function() {
                    $scope.$broadcast('expandAll');
                };

                // Document 선택
                $scope.selectDocument = function(item){
                    controller.selectDocument(item);
                };
                
                $scope.addDocument = function(item) {
                    // scope 이용할 경우
                    // var nodeData = scope.$modelValue;
                    // nodeData.items.push({새로운 Documnt - tree item});

                    var uid = item.uid;
                    controller.addDocument('sub', uid);
                };

                $scope.removeDocument = function(item) {
                    controller.showRemoveDocumentPopup(item);
                };

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function(application){
            // 등록
            application.directive( 'treeView', _directive );
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
