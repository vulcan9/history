/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U', 'Application'
    ],
    function( U, application ) {

        // 등록
        application.directive( 'propertyView', _directive );

        // 선언
        function _directive( Tool ) {

            //out( 'version' );

            return {

                restrict: 'EA',
                
                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/propertyView.html',
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
            
            function Controller ( $scope, $element, $attrs) {

                ////////////////////////////////////////////////////////////////////////////////
                // 환경설정
                ////////////////////////////////////////////////////////////////////////////////
                
                //-------------------------------------
                // Pattern
                //-------------------------------------

                $scope.onlyNumbers = /^[0-9]+$/;

                ////////////////////////////////////////////////////////////////////////////////
                // Document
                ////////////////////////////////////////////////////////////////////////////////
                
                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    out('#Project.selected-DOCUMENT (property) : ', data);
                    __onSelectDocument(data.newValue, data.oldValue);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    out('#Project.modified-DOCUMENT (property) : ', data);
                    __onModifyDocument(data.item, data.param);
                });

                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////
                
                function __onSelectDocument (newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    var elementUID = Project.current.getSelectElement(newValue);
                    $scope.updateContent(newValue, elementUID);
                }

                function __onModifyDocument(item, param){
                    alert('// 현재 선택상태 element가 없으면 property 창을 업데이트 한다.');
                    $scope.updateContent(item.uid);
                }

                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////
                
                // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
                $scope.$on('#Project.selected-ELEMENT', function(e, data){
                    out('#Project.selected-ELEMENT (propertyView) : ', data);
                    __onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });
                
                $scope.$on('#Project.modified-ELEMENT', function(e, data){
                    out('#Project.modified-ELEMENT (propertyView) : ', data);
                    __onModifyElement(data.item, data.param);
                });

                function __onModifyElement(item, param){
                    // 현재 선택상태이면 UI를 업데이트 한다.
                    var documentUID = param.documentUID;
                    var elementUID = param.elementUID;
                    $scope.updateContent(documentUID, elementUID);
                }

                function __onSelectElement(newValue, oldValue, documentUID){
                    out(' - oldValue (propertyView) : ', oldValue);
                    out(' - newValue (propertyView) : ', newValue);

                    var elementUID = newValue;

                    // var item = Project.current.getElement(documentUID);
                   $scope.updateContent(documentUID, elementUID);
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                var _dom;
                
                // 속성창 내용을 갱신한다.
                $scope.updateContent = function( documentUID, elementUID ){
                    
                    var type = Project.current.getType(documentUID, elementUID);
                    if(type == 'document'){
                        _getDocumentProperties(documentUID);

                    }else{
                        _getElementProperties(documentUID, elementUID);

                    }

                    $scope.type = type;
                    out('*********************************type : ', type);
                }
                
                // $scope.$watch('type', function(newValue, oldValue) {
                //     getBasicProperties(_dom);
                // });

                function _getDocumentProperties(documentUID){
                    
                    // var documentItem = Project.current.getDocument(documentUID);
                    // _dom = documentItem.document.content;

                    //------------------
                    // Property
                    //------------------

                    var obj = {
                        // left : U.toNumber( $dom.css('left') ),
                        // top : U.toNumber( $dom.css('top') ),
                        width : Project.paper.width,
                        height : Project.paper.height
                    }

                    $scope.properties = obj;

                    //------------------
                    // Config Option
                    //------------------

                    $scope.display_snap_pixel = Tool.current.config_display('display_snap_pixel');
                    $scope.display_grid = Tool.current.config_display('display_grid');
                }

                function _getElementProperties(documentUID, elementUID){

                    var dom = Project.current.getElement(documentUID, elementUID);

                    //------------------
                    // Property
                    //------------------

                    var obj;
                    var type;
                    if(dom){
                        var $dom = angular.element(dom);
                        obj = {
                            left : U.toNumber( $dom.css('left') ),
                            top : U.toNumber( $dom.css('top') ),
                            width : $dom.width(),
                            height : $dom.height()
                        }

                    }else{
                        obj = {
                            left : 0,
                            top : 0,
                            width : 0,
                            height : 0
                        }

                    }

                    $scope.properties = obj;

                    //------------------
                    // Config Option
                    //------------------

                    var api = Project.current.elementAPI (documentUID, elementUID);
                    $scope.display_size_toText = api.option('display_size_toText');
                }

                ////////////////////////////////////////
                // Document 환경설정
                ////////////////////////////////////////

                //-------------------
                // snap 크기
                //-------------------

                $scope.$watch('display_snap_pixel',  function (newValue, oldValue){
                    Tool.current.config_display('display_snap_pixel', newValue);
                });

                $scope.$on('#Tool.changed-CONFIG.display.display_snap_pixel' , function(e, data){
                    $scope.display_snap_pixel = data.newValue;
                });

                //-------------------
                // grid 보이기
                //-------------------

                $scope.$watch('display_grid',  function (newValue, oldValue){
                    Tool.current.config_display('display_grid', newValue);
                });

                $scope.$on('#Tool.changed-CONFIG.display.display_grid' , function(e, data){
                    $scope.display_grid = data.newValue;
                });

                ////////////////////////////////////////
                // Element 환경설정
                ////////////////////////////////////////
                
                //-------------------
                // 텍스트 크기 맞춤 옵션
                //-------------------

                $scope.$watch('display_size_toText',  function (newValue, oldValue){
                    if(newValue === undefined) return;

                    // param 지정하지 않으면 현재 선택 상태의 element에 적용됨
                    var api = Project.current.elementAPI();
                    api.option('display_size_toText', newValue);
                });

                $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                    $scope.display_size_toText = data.newValue;
                });

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

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
                    var $dock = $element.parent('.dock');
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
                
                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end directive
        }



        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
