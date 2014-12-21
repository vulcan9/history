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
        function _directive( Tool, ELEMENT, CommandService ) {

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

                $scope.$on('#Project.removed-ELEMENT', function(e, data){
                    // 해당 element가 선택상태이면 선택 해지
                    var documentUID = Project.current.getSelectDocument();
                    $scope.updateContent(documentUID);
                });
                
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

                // var _dom;
                var _documentUID;
                var _elementUID;

                // updateContent 실행에 의해 css, option값이 바뀐 경우에는 modifyContent를 실행하지 않기위해 체크함
                var _fromUpdate_css = false;
                var _fromUpdate_option = false;
                // modifyContent 실행에 의해 속성, 옵션값이 바뀐 경우에는 updateContent를 실행하지 않기위해 체크함
                var _fromModify = false;

                ////////////////////////////////////////
                // Document 환경설정
                ////////////////////////////////////////

                //-------------------
                // snap 크기
                //-------------------
                /*
                $scope.$watch('option.display_snap_pixel',  function (newValue, oldValue){
                    // Tool.current.config_display('display_snap_pixel', newValue);
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Tool.changed-CONFIG.display.display_snap_pixel' , function(e, data){
                    // $scope.option.display_snap_pixel = data.newValue;
                    $scope.updateContent( _documentUID, _elementUID );
                });

                //-------------------
                // grid 보이기
                //-------------------
                /*
                $scope.$watch('option.display_grid',  function (newValue, oldValue){
                    // Tool.current.config_display('display_grid', newValue);
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Tool.changed-CONFIG.display.display_grid' , function(e, data){
                    // $scope.option.display_grid = data.newValue;
                    $scope.updateContent( _documentUID, _elementUID );
                });

                ////////////////////////////////////////
                // Element 환경설정
                ////////////////////////////////////////
                
                //-------------------
                // 텍스트 크기 맞춤 옵션
                //-------------------
                /*
                $scope.$watch('option.display_size_toText',  function (newValue, oldValue){
                    if(newValue === undefined) return;

                    // param 지정하지 않으면 현재 선택 상태의 element에 적용됨
                    // var api = Project.current.elementAPI();
                    // api.option('display_size_toText', newValue);
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                    // $scope.option.display_size_toText = data.newValue;
                    $scope.updateContent( _documentUID, _elementUID );
                });

                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////
                
                // 속성창 내용을 갱신한다.
                $scope.updateContent = function( documentUID, elementUID ){
                    _documentUID = documentUID;
                    _elementUID = elementUID;

                    var type = Project.current.getType(documentUID, elementUID);
                    $scope.type = type;

                    // type 이 바뀌지 않은 상태에서도 속성값은 계속 수정되므로 
                    // type watch에서 실행하지 않늗다.
                    if(type == ELEMENT.DOCUMENT){
                        $scope.uid = documentUID;
                    }else{
                        $scope.uid = elementUID;
                    }

                    if(!Project.current) return;

                    _getCSS(type, documentUID, elementUID);
                    _getOption(type, documentUID, elementUID);
                }
                
                // $scope.$watch('type', function(newValue, oldValue) {
                // });

                //------------------
                // Property
                //------------------

                function _getCSS(type, documentUID, elementUID){
                    
                    // var documentItem = Project.current.getDocument(documentUID);
                    // _dom = documentItem.document.content;
                    var css;
                    if(type == ELEMENT.DOCUMENT){
                        
                        css = {
                            // left : U.toNumber( $dom.css('left') ),
                            // top : U.toNumber( $dom.css('top') ),
                            width : Project.paper.width,
                            height : Project.paper.height
                        }

                    }else{

                        var dom = Project.current.getElement(documentUID, elementUID);
                        var $dom = angular.element(dom);
                        
                        css = {
                            left : U.toNumber( $dom.css('left') ) || 0,
                            top : U.toNumber( $dom.css('top') ) || 0,
                            width : $dom.width() || 0,
                            height : $dom.height() || 0
                        }

                        var newCss;
                        if(type == ELEMENT.TEXT)
                        {
                            //
                        }
                        else if(type == ELEMENT.IMAGE)
                        {
                            //
                        }

                        if(newCss) css = angular.extend(css, newCss);
                    }

                    // __onModifyElement에 의해 호출된 경우임
                    var isEqual= angular.equals($scope.css, css);
                    if(isEqual) return;

                    // modifyContent 호출 무시
                    _fromUpdate_css = true;

                    // 값 설정
                    $scope.css = css;
                }

                //------------------
                // Config Option
                //------------------

                function _getOption(type, documentUID, elementUID){
                    if(!Project.current) return;
                    
                    var option;
                    if(type == ELEMENT.DOCUMENT){

                        option = {
                            display_snap_pixel: Tool.current.config_display('display_snap_pixel'),
                            display_grid: Tool.current.config_display('display_grid')
                        }

                    }else{

                        var api = Project.current.elementAPI (documentUID, elementUID);
                        option = {}

                        var newOption;
                        if(type == ELEMENT.TEXT)
                        {
                             newOption = {
                                display_size_toText: api.option('display_size_toText')
                            };
                        }
                        else if(type == ELEMENT.IMAGE)
                        {
                            //
                        }

                        if(newOption) option = angular.extend(option, newOption);
                    }

                    // __onModifyElement에 의해 호출된 경우임
                    var isEqual= angular.equals($scope.option, option);
                    if(isEqual) return;

                    // modifyContent 호출 무시
                    _fromUpdate_option = true;

                    // 값 설정
                    $scope.option = option;
                }

                ////////////////////////////////////////
                // Data 업데이트
                ////////////////////////////////////////

                // 속성 변경값 적용
                $scope.$watch('css', function (newValue, oldValue){
                    if(newValue === undefined) return;
                    if(_fromUpdate_css){
                        out('* 속성창 CSS 업데이트 완료 (_fromUpdate_css=false)');
                        _fromUpdate_css = false;
                        return;
                    }

                    $scope.modifyContent(_documentUID, _elementUID);
                }, true);

                // 옵션 변경값 적용
                $scope.$watch('option', function (newValue, oldValue){
                    if(newValue === undefined) return;
                    if(_fromUpdate_option){
                        out('* 속성창 Option 업데이트 완료 (_fromUpdate_option=false)');
                        _fromUpdate_option = false;
                        return;
                    }
                    
                    $scope.modifyContent(_documentUID, _elementUID);
                }, true);

                //------------------
                // 데이터 전송
                //------------------
                
                // 속성창 내용을 데이터에 갱신한다.
                $scope.modifyContent = function( documentUID, elementUID ){

                    // _modifyCSS($scope.type, _documentUID, _elementUID);
                    // _modifyOption($scope.type, _documentUID, _elementUID);
                    
                    if(!Project.current) return;

                    var type = $scope.type;
                    var command;
                    var param;

                    if(type == ELEMENT.DOCUMENT){
                        
                        // DOCUMENT  수정

                        command = CommandService.MODIFY_DOCUMENT;
                        param = {
                            // 삽입될 문서
                            documentUID : documentUID,
                            elementUID: elementUID,

                            // element 설정값
                            option: $scope.option,
                            css: $scope.css
                        };

                    }else{
                        
                        // ELEMENT 수정

                        command = CommandService.MODIFY_ELEMENT;
                        param = {
                            // 삽입될 문서
                            documentUID : documentUID,
                            elementUID: elementUID,

                            // element 설정값
                            option: $scope.option,
                            css: $scope.css
                        };

                    }

                    // updateContent 호출 무시
                    _fromModify = true;

                    // Modify command 호출
                    CommandService.exe(command, param, function(){
                        out('* 속성창 변경값 데이터 저장 완료 (_fromModify=false)');
                        _fromModify = false;
                    });
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
