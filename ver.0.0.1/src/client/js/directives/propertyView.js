/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [ 'U' ], function( U ) {

        // 선언
        function _directive( Tool, ELEMENT, CommandService, $timeout ) {

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
                // Tool
                //-------------------------------------

                $scope.$on('#Tool.configed-TOOL.CONFIG', function(e, data){
                    out('#Tool.configed-TOOL.CONFIG (propertyView) : ', data);
                    var documentUID = Project.current.getSelectDocument();
                    $scope.updateContent(documentUID);
                });
                
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
                    // 현재 선택상태 element가 없어도 property 창을 업데이트 한다.
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
                
                // {newValue: 'element-18d53f95-2ffa-433a-9a9a-c57ca1534f04', name: 'ELEMENT', oldValue: 'element-c2d5091c-3d06-470c-b7b0-343a8bd41c88', document: 'document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1'}
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
                    $scope.updateContent(documentUID, elementUID, param);
                }

                function __onSelectElement(newValue, oldValue, documentUID){
                    out(' - oldValue (propertyView) : ', oldValue);
                    out(' - newValue (propertyView) : ', newValue);
                    
                    // var item = Project.current.getElement(documentUID);
                    var elementUID = newValue;
                    $scope.updateContent(documentUID, elementUID);
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                // var _dom;
                var _documentUID;
                var _elementUID;

                // updateContent 실행에 의해 css, option값이 바뀐 경우에는 modifyContent를 실행하지 않기위해 체크함
                var _fromUpdate = false;
                // modifyContent 실행에 의해 속성, 옵션값이 바뀐 경우에는 updateContent를 실행하지 않기위해 체크함
                var _fromModify = false;

                ////////////////////////////////////////
                // Document 환경설정
                ////////////////////////////////////////

                //-------------------
                // snap 크기
                //-------------------
                /*
                $scope.$watch('option.display.snap_pixel',  function (newValue, oldValue){
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Tool.changed-CONFIG.display.snap_pixel' , function(e, data){
                    $scope.updateContent( _documentUID, _elementUID );
                });

                //-------------------
                // grid 보이기
                //-------------------
                /*
                $scope.$watch('option.display.show_grid',  function (newValue, oldValue){
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Tool.changed-CONFIG.display.show_grid' , function(e, data){
                    $scope.updateContent( _documentUID, _elementUID );
                });

                ////////////////////////////////////////
                // Element 환경설정
                ////////////////////////////////////////
                
                //-------------------
                // 텍스트 크기 맞춤 옵션
                //-------------------
                /*
                $scope.$watch('option.display.display_size_toText',  function (newValue, oldValue){
                    if(newValue === undefined) return;

                    // param 지정하지 않으면 현재 선택 상태의 element에 적용됨
                    // var api = Project.current.elementAPI();
                    // api.option('display_size_toText', newValue);
                    $scope.modifyContent( _documentUID, _elementUID );
                });
                */

                $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                    $scope.updateContent( _documentUID, _elementUID );
                });

                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////
                
                // 속성창 내용을 갱신한다.
                $scope.updateContent = function( documentUID, elementUID, param ){
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

                    _getCSS(type, documentUID, elementUID, param);
                    _getOption(type, documentUID, elementUID);
                }
                
                // $scope.$watch('type', function(newValue, oldValue) {
                // });

                //------------------
                // Property
                //------------------

                function _getCSS(type, documentUID, elementUID, param){
                    
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

                        if(!documentUID && !elementUID){
                            _fromUpdate = true;
                            $scope.css = null;
                            return;
                        }

                        var dom = Project.current.getElement(documentUID, elementUID);
                        var $dom = angular.element(dom);
                        
                        css = {
                            // left : U.toNumber( $dom.css('left') ) || 0,
                            // top : U.toNumber( $dom.css('top') ) || 0,
                            // width : $dom.width() || 0,
                            // height : $dom.height() || 0
                        }

                        /*
                        var newCss;
                        if(type == ELEMENT.TEXT)
                        {
                            //
                        }
                        else if(type == ELEMENT.IMAGE)
                        {
                            //
                        }
                        // scope.getModifyElementParameter(documentUID, elementUID);

                        if(newCss) css = angular.extend(css, newCss);
                        */

                        out('TODO : 불필요한 style string Clear 할것');

                        var paramCSS = (param)? param.css : {};

                        // 테두리
                        var border = paramCSS.borderWidth || U.toNumber( $dom.css('borderWidth') ) || 0;
                        css.borderWidth = border;
                        css.borderColor = paramCSS.borderColor || $dom.css('borderColor');
                        css.borderStyle = paramCSS.borderStyle || $dom.css('borderStyle');
                        if(!css.borderStyle || css.borderStyle == 'none') css.borderStyle = 'solid';

                        // 위치
                        css.left = paramCSS.left || U.toNumber( $dom.css('left') ) || 0;
                        css.top = paramCSS.top || U.toNumber( $dom.css('top') ) || 0;

                        // 크기
                        css.width = paramCSS.width || $dom.outerWidth() || 0;
                        css.height = paramCSS.height || $dom.outerHeight() || 0;

                        // 테두리 라운딩
                        css.borderTopLeftRadius = paramCSS.borderTopLeftRadius || U.toNumber($dom.css('borderTopLeftRadius'));
                        css.borderTopRightRadius = paramCSS.borderTopRightRadius || U.toNumber($dom.css('borderTopRightRadius'));
                        css.borderBottomRightRadius = paramCSS.borderBottomRightRadius || U.toNumber($dom.css('borderBottomRightRadius'));
                        css.borderBottomLeftRadius = paramCSS.borderBottomLeftRadius || U.toNumber($dom.css('borderBottomLeftRadius'));

                        css.paddingTop = paramCSS.paddingTop || U.toNumber($dom.css('paddingTop'));
                        css.paddingRight = paramCSS.paddingRight || U.toNumber($dom.css('paddingRight'));
                        css.paddingBottom = paramCSS.paddingBottom || U.toNumber($dom.css('paddingBottom'));
                        css.paddingLeft = paramCSS.paddingLeft || U.toNumber($dom.css('paddingLeft'));

                        // 스크롤
                        css.overflow = paramCSS.overflow || $dom.css('overflow');
                        // css.overflowX = paramCSS.overflowX || $dom.css('overflowX');
                        // css.overflowY = paramCSS.overflowY || $dom.css('overflowY');

                        // 문단
                        // css.wordWrap = paramCSS.wordWrap || $dom.css('wordWrap');
                        css.whiteSpace = paramCSS.whiteSpace || $dom.css('whiteSpace');
                        // 말줄임 표시 (overflow === 'hidden' && whiteSpace === 'nowrap' 일때)
                        css.textOverflow = paramCSS.textOverflow || $dom.css('textOverflow');
                    }

                    // __onModifyElement에 의해 호출된 경우임
                    var isEqual= angular.equals($scope.css, css);
                    if(isEqual) return;

                    // modifyContent 호출 무시
                    _fromUpdate = true;

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
                            display : {
                                snap_pixel: Tool.current.config_display('snap_pixel'),
                                show_grid: Tool.current.config_display('show_grid')
                            }
                        }

                    }else{

                        if(!documentUID && !elementUID){
                            _fromUpdate = true;
                            $scope.option = null;
                            return;
                        }

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
                    _fromUpdate = true;

                    // 값 설정
                    $scope.option = option;
                }

                ////////////////////////////////////////
                // Data 업데이트
                ////////////////////////////////////////

                // 서버 저장값 변경된 경우
                // select가 변경되어 값이 변한 경우
                // type이 변경된 경우
                
                // 속성 변경값 적용
                $scope.$watch('css', function (newValue, oldValue){
                    if(newValue === undefined) return;
                    // out('css : ', newValue, oldValue);
                    
                    $scope.modifyContent(_documentUID, _elementUID);
                }, true);

                // 옵션 변경값 적용
                $scope.$watch('option', function (newValue, oldValue){
                    if(newValue === undefined) return;
                    // out('option');
                    
                    if($scope.type == ELEMENT.DOCUMENT){
                        $scope.configDocument();
                    }else{
                        $scope.modifyContent(_documentUID, _elementUID);
                    }
                    
                }, true);

                //------------------
                // 데이터 수정 - CSS
                //------------------
                
                var __delayTimeout;

                // 속성창 내용을 데이터에 갱신한다.
                $scope.modifyContent = function( documentUID, elementUID ){

                    // 연속으로 호출된 경우 업데이트를 무시하고 최종값을 한번에 적용시킨다.
                    $timeout.cancel(__delayTimeout);

                    __delayTimeout = $timeout(function () {
                        __delayTimeout = null;
                        __modifyContent(documentUID, elementUID);
                    }, 300);
                    
                    // (주의) delay 시간이 250 이하이면 delay 적용되지 않고 실행됨
                    // 연속 클릭 속도 감안하여 500으로 설정해 놓음
                    // $digest 호출 시간이 245정도이기 때문인듯함
                }

                function __modifyContent( documentUID, elementUID ){
                    if(!Project.current) return;

                    if(_fromUpdate){
                        out('* 속성창 CSS, Option 업데이트 완료 (_fromUpdate=false)');
                        _fromUpdate = false;
                        return;
                    }

                    var type = $scope.type;
                    var command;
                    var param;

                    // 수정시에 watch 발생하므로 복사해서 사용
                    var paramCSS = angular.copy($scope.css);

                    if(type == ELEMENT.DOCUMENT){
                        
                        // DOCUMENT  수정

                        command = CommandService.MODIFY_DOCUMENT;
                        param = {
                            documentUID : documentUID,

                            //*********************************
                            
                            // option은 configDocument에서 설정
                            // option: $scope.option,

                            //*********************************

                            // element css 설정값
                            css: paramCSS
                        };

                    }else{
                        
                        // ELEMENT 수정

                        /*
                        var border = paramCSS.borderWidth;
                        if(border < 1){
                            delete paramCSS.borderColor;
                            delete paramCSS.borderStyle;
                        }
                        */

                        if(type == ELEMENT.TEXT){
                            //
                        }

                        command = CommandService.MODIFY_ELEMENT;
                        param = {
                            // 삽입될 문서
                            documentUID : documentUID,
                            elementUID: elementUID,

                            // element 설정값
                            option: $scope.option,
                            css: paramCSS
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

                //------------------
                // 데이터 수정 - Configuration Option
                //------------------
                
                // Deley Time 없이 업데이트 (History에 기록하지 않으므로)
                $scope.configDocument = function(){
                    if(!Project.current) return;

                    var type = $scope.type;
                    var command;
                    var param;

                    if(type != ELEMENT.DOCUMENT){
                        throw '이 옵션 설정은 Document type일때만 가능합니다.';
                    }
                        
                    // CONFIGURATION  설정값 수정
                    param = {
                        // option 설정값
                        option: $scope.option
                    };

                    // command 호출
                    CommandService.exe(CommandService.CONFIGURATION, param);
                }















                ////////////////////////////////////////
                // 폰트 지정
                ////////////////////////////////////////

                $scope.fontOptions = [
                    
                    {group:'hangul', style:'sans-serif', label:'맑은 고딕', value:'맑은 고딕'},
                    {group:'hangul', style:'sans-serif', label:'나눔고딕', value:'나눔고딕'},
                    {group:'hangul', style:'sans-serif', label:'맑은 고딕, 나눔고딕', value:'맑은 고딕, 나눔고딕'},

                    {group:'web safe fonts', style:'sans-serif', label:'Arial, Helvetica', value:'Arial, Helvetica, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Arial Black, Gadget', value:'Arial Black, Gadget, sans-serif'},
                    {group:'web safe fonts', style:'serif', label:'Bookman Old Style', value:'Bookman Old Style, serif'},
                    {group:'web safe fonts', style:'cursive', label:'Comic Sans MS', value:'Comic Sans MS, cursive'},
                    {group:'web safe fonts', style:'monospace', label:'Courier', value:'Courier, monospace'},
                    {group:'web safe fonts', style:'monospace', label:'Courier New, Courier', value:'Courier New, Courier, monospace'},
                    {group:'web safe fonts', style:'serif', label:'Garamond', value:'Garamond, serif'},
                    {group:'web safe fonts', style:'serif', label:'Georgia', value:'Georgia, serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Impact, Charcoal', value:'Impact, Charcoal, sans-serif'},
                    {group:'web safe fonts', style:'monospace', label:'Lucida Console, Monaco', value:'Lucida Console, Monaco, monospace'},
                    {group:'web safe fonts', style:'sans-serif', label:'Lucida Sans Unicode, Lucida Grande', value:'Lucida Sans Unicode, Lucida Grande, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'MS Sans Serif, Geneva', value:'MS Sans Serif, Geneva, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'MS Serif, New York', value:'MS Serif, New York, sans-serif'},
                    {group:'web safe fonts', style:'serif', label:'Palatino Linotype, Book Antiqua, Palatino', value:'Palatino Linotype, Book Antiqua, Palatino, serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Symbol', value:'Symbol, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Tahoma, Geneva', value:'Tahoma, Geneva, sans-serif'},
                    {group:'web safe fonts', style:'serif', label:'Times New Roman, Times', value:'Times New Roman, Times, serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Trebuchet MS, Helvetica', value:'Trebuchet MS, Helvetica, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Verdana, Geneva', value:'Verdana, Geneva, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Webdings', value:'Webdings, sans-serif'},
                    {group:'web safe fonts', style:'sans-serif', label:'Wingdings, Zapf Dingbats', value:'Wingdings, Zapf Dingbats, sans-serif'},

                    // {group:'Google webfonts', style:'', label:'', value:''},
                    {group:'Google webfonts serif', style:'serif', label:'Gentium Basic', value:'http://fonts.googleapis.com/css?family=Gentium+Basic', uri:'http://themes.googleusercontent.com/static/fonts/gentiumbasic/v2/KCktj43blvLkhOTolFn-MVHiOz_YwVS6wxBdUjDFTTY'},
                    {group:'Google webfonts serif', style:'serif', label:'Ovo', value:'http://fonts.googleapis.com/css?family=Abel|Ovo', uri:'http://themes.googleusercontent.com/static/fonts/ovo/v2/Skogr183qOseS7dF1_FRBQ'},
                    {group:'Google webfonts serif', style:'serif', label:'Kreon', value:'http://fonts.googleapis.com/css?family=Kreon', uri:'http://themes.googleusercontent.com/static/fonts/kreon/v2/NJ62MCrBzU-nduth4LABX6CWcynf_cDxXwCLxiixG1c'},
                    {group:'Google webfonts serif', style:'serif', label:'Caudex', value:'http://fonts.googleapis.com/css?family=Caudex', uri:'http://themes.googleusercontent.com/static/fonts/caudex/v1/QWJZjwgAmTC36uOeILZKqOvvDin1pK8aKteLpeZ5c0A'},
                    {group:'Google webfonts serif', style:'serif', label:'Rokkitt', value:'http://fonts.googleapis.com/css?family=Rokkitt', uri:'http://themes.googleusercontent.com/static/fonts/rokkitt/v3/5Yl2vTgdty6AzMt12VYvSgLUuEpTyoUstqEm5AMlJo4'},
                    {group:'Google webfonts serif', style:'serif', label:'Pica', value:'http://fonts.googleapis.com/css?family=IM+Fell+DW+Pica+SC', uri:'http://themes.googleusercontent.com/static/fonts/imfelldwpicasc/v1/xBKKJV4z2KsrtQnmjGO17KGoD0ht6aQUF-IWA1Q8SQ4'},
                    {group:'Google webfonts serif', style:'serif', label:'Ultra', value:'http://fonts.googleapis.com/css?family=Ultra', uri:'http://themes.googleusercontent.com/static/fonts/ultra/v2/8VYG-ol7upKEX3atkhH5CqCWcynf_cDxXwCLxiixG1c'},

                    // san-serif
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Abel', value:'http://fonts.googleapis.com/css?family=Abel', uri:'http://themes.googleusercontent.com/static/fonts/abel/v1/8UIkryAMnYqDga6nPyU77_esZW2xOQ-xsNqO47m55DA'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Marvel', value:'http://fonts.googleapis.com/css?family=Marvel', uri:'http://themes.googleusercontent.com/static/fonts/marvel/v1/qgKLqF4l-tdiOu0kFiQEV-vvDin1pK8aKteLpeZ5c0A'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Carme', value:'http://fonts.googleapis.com/css?family=Carme', uri:'http://themes.googleusercontent.com/static/fonts/carme/v2/xCdMrDGUa-SxPUkvL6W06aCWcynf_cDxXwCLxiixG1c'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Rosario', value:'http://fonts.googleapis.com/css?family=Rosario', uri:'http://themes.googleusercontent.com/static/fonts/rosario/v2/DVZfPvwa_ah_yULIonXDRwLUuEpTyoUstqEm5AMlJo4'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Varela Round', value:'http://fonts.googleapis.com/css?family=Varela+Round', uri:'http://themes.googleusercontent.com/static/fonts/varelaround/v1/APH4jr0uSos5wiut5cpjrpS3E-kSBmtLoNJPDtbj2Pk'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'PT Sans Narrow', value:'http://fonts.googleapis.com/css?family=PT+Sans+Narrow', uri:'http://themes.googleusercontent.com/static/fonts/ptsansnarrow/v0/UyYrYy3ltEffJV9QueSi4VLE0juxe_YrR4_5kH0wfhI'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Metrophobic', value:'http://fonts.googleapis.com/css?family=Metrophobic', uri:'http://themes.googleusercontent.com/static/fonts/metrophobic/v1/0IZPA9DbzKXnGZABsAivTywlidHJgAgmTjOEEzwu1L8'},
                    {group:'Google webfonts san-serif', style:'san-serif', label:'Open Sans', value:'http://fonts.googleapis.com/css?family=Open+Sans', uri:'http://themes.googleusercontent.com/static/fonts/opensans/v4/cJZKeOuBrn4kERxqtaUH3SZ2oysoEQEeKwjgmXLRnTc'},
                    // display
                    {group:'Google webfonts display', style:'display', label:'Smokum', value:'http://fonts.googleapis.com/css?family=Smokum', uri:'http://themes.googleusercontent.com/static/fonts/smokum/v1/XxAkVbxR8S3EtdoKW8_T3uvvDin1pK8aKteLpeZ5c0A'},
                    {group:'Google webfonts display', style:'display', label:'Black Ops One', value:'http://fonts.googleapis.com/css?family=Black+Ops+One', uri:'http://themes.googleusercontent.com/static/fonts/blackopsone/v1/2XW-DmDsGbDLE372KrMW1YWcQgv0WMKv2x2qfcALabs'},
                    {group:'Google webfonts display', style:'display', label:'Pompiere', value:'http://fonts.googleapis.com/css?family=Pompiere', uri:'http://themes.googleusercontent.com/static/fonts/pompiere/v1/Y3DPP8H_-3TwPsh5FkDMHXYhjbSpvc47ee6xR_80Hnw'},
                    {group:'Google webfonts display', style:'display', label:'Maven Pro', value:'http://fonts.googleapis.com/css?family=Maven+Pro', uri:'http://themes.googleusercontent.com/static/fonts/mavenpro/v2/MG9KbUZFchDs94Tbv9U-pSZ2oysoEQEeKwjgmXLRnTc'},
                    {group:'Google webfonts display', style:'display', label:'Limelight', value:'http://fonts.googleapis.com/css?family=Limelight', uri:'http://themes.googleusercontent.com/static/fonts/limelight/v1/kD_2YDkzv1rorNqQ2oFK5iZ2oysoEQEeKwjgmXLRnTc'},
                    {group:'Google webfonts display', style:'display', label:'VT323', value:'http://fonts.googleapis.com/css?family=VT323', uri:'http://themes.googleusercontent.com/static/fonts/vt323/v1/lS5yLrO6Jmka3W5vZS3QCqCWcynf_cDxXwCLxiixG1c'},
                    {group:'Google webfonts display', style:'display', label:'Oswald', value:'http://fonts.googleapis.com/css?family=Oswald', uri:'http://themes.googleusercontent.com/static/fonts/oswald/v1/lXoKq2PC8Z_S1wl-BwvrB-vvDin1pK8aKteLpeZ5c0A'},
                    {group:'Google webfonts display', style:'display', label:'Kenia', value:'http://fonts.googleapis.com/css?family=Kenia', uri:'http://themes.googleusercontent.com/static/fonts/kenia/v2/9TTpzXwTpO7O44FHfOTd8qCWcynf_cDxXwCLxiixG1c'},
                    // Handwriting
                    {group:'Google webfonts Handwriting', style:'Handwriting', label:'Gloria Hallelujah', value:'http://fonts.googleapis.com/css?family=Gloria+Hallelujah', uri:'http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI'},
                    {group:'Google webfonts Handwriting', style:'Handwriting', label:'Delius', value:'http://fonts.googleapis.com/css?family=Delius', uri:'http://themes.googleusercontent.com/static/fonts/delius/v1/VhgncxckLThEfOZprZ74a-vvDin1pK8aKteLpeZ5c0A'},
                    {group:'Google webfonts Handwriting', style:'Handwriting', label:'Swanky and Moo Moo', value:'http://fonts.googleapis.com/css?family=Swanky+and+Moo+Moo', uri:'http://themes.googleusercontent.com/static/fonts/swankyandmoomoo/v1/orVNZ9kDeE3lWp3U3YELu2WHY9iboOoH8OsBr4ISUGM'},
                    {group:'Google webfonts Handwriting', style:'Handwriting', label:'Love Ya Like A Sister', value:'http://fonts.googleapis.com/css?family=Love+Ya+Like+A+Sister', uri:'http://themes.googleusercontent.com/static/fonts/loveyalikeasister/v1/LzkxWS-af0Br2Sk_YgSJYycrTk7iLosofjQDP1-LBOKglnMp3_3A8V8Ai8YosRtX'},
                    {group:'Google webfonts Handwriting', style:'Handwriting', label:'Meddon', value:'http://fonts.googleapis.com/css?family=Meddon', uri:'http://themes.googleusercontent.com/static/fonts/meddon/v2/ksvoKtnK5R4WK1JfWFPPWuvvDin1pK8aKteLpeZ5c0A'}
                ];

                $scope.fontFamilyChange = function(e){
                    
                    function getFontFamily(label){
                        var fonts = label.split(',');
                        for(var prop in fonts){
                            var font = fonts[prop];
                            if((font.indexOf(" ") > 0) && (font.indexOf(",") == -1)){
                                font = "'" + font + "'";
                                fonts[prop] = font;
                            }
                        }
                        return fonts.join(',');
                    }

                    var item = this.fontFamilyObject;
                    if(item.group == 'web safe fonts' || item.group == 'hangul'){
                        var fontFamily = getFontFamily(item.value);
                        $scope.css.fontFamily = fontFamily;
                        return;
                    }

                    var fontName = item.value;
                    var fontURI = item.uri;
                    if(!fontURI) return;

                    var fontFamily = getFontFamily(item.label);
                    if((fontFamily.indexOf(" ") > 0) && (fontFamily.indexOf(",") == -1)){
                        fontFamily = "'" + fontFamily + "'";
                    }
                    
                    /*
                    @font-face {
                        font-family: 'Gloria Hallelujah';
                        font-style: normal;
                        font-weight: normal;
                        src: url('http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI.woff') format('woff'),
                                url('http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI.ttf') format('truetype');
                    }
                    */
                    var atFontFace="@font-face {\n"
                        + "  font-family: " + fontFamily +';\n'
                        + "  font-style: normal;\n"
                        + "  font-weight: normal;\n"
                        + "  src: "//local('"+ fontName +"'), "
                        +"url('" + fontURI +".woff') format('woff'),\n"
                        +"url('" + fontURI +".ttf') format('truetype');\n"
                        +"}\n";

                    // style 태그가 지정되어 있어야함
                    // <style type="text/css" title="wdText" media="all">

                    var styleSheets=document.styleSheets;

                    var ourStyleSheet;
                    for (var i=0; i < styleSheets.length; i++) {
                        var currentStyleSheet = styleSheets[i].title;
                        if(styleSheets[i].title=="dynamicLoadFont"){
                            //this is the one we use for adding @keyframnes rules
                            ourStyleSheet = styleSheets[i]
                        }

                        if(ourStyleSheet){
                            for (var j=0; j < ourStyleSheet.cssRules.length; j++) {
                                ourStyleSheet.deleteRule(j)
                            };
                            // ourStyleSheet.insertRule(code, 0);

                            try {
                                // ourStyleSheet.insertRule(theC, 0);

                                if (atFontFace != ""){
                                    ourStyleSheet.insertRule(atFontFace, 0);
                                }
                                // ourStyleSheet.insertRule(theC, 0);
                                // var ss=ourStyleSheet.cssRules[0];

                            }catch(err){
                                out('[Font ERROR : ]', err);
                                i==i;
                            }

                        }
                    }

                    $scope.css.fontFamily = fontFamily;
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
                    var $dock = $element.parent('.hi-dock');
                    if(w === undefined){
                        w = $dock.outerWidth();
                        w = (w>300) ? 10:400;
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
        _directive._regist = function(application){
            // 등록
            application.directive( 'propertyView', _directive );
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
