/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : directive 정의, 등록

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {

        // 선언
        function _directive(Tool, ELEMENT, CommandService, $timeout) {

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

            function Controller($scope, $element, $attrs) {

                //$scope.css = {};
                //$scope.temp = {};
                //$scope.option = {};
                //$scope.tempOption = {};

                ////////////////////////////////////////////////////////////////////////////////
                // 환경설정
                ////////////////////////////////////////////////////////////////////////////////

                //-------------------------------------
                // Tool
                //-------------------------------------

                $scope.$on('#Tool.configed-TOOL.CONFIG', function (e, data) {
                    out('#Tool.configed-TOOL.CONFIG (propertyView) : ', data);
                    var documentUID = Project.current.getSelectDocument();
                    $scope.updateContent(documentUID);
                });

                ////////////////////////////////////////////////////////////////////////////////
                // Document
                ////////////////////////////////////////////////////////////////////////////////

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function (e, data) {
                    out('#Project.selected-DOCUMENT (property) : ', data);
                    __onSelectDocument(data.newValue, data.oldValue);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function (e, data) {
                    out('#Project.modified-DOCUMENT (property) : ', data);
                    __onModifyDocument(data.item, data.param);
                });

                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////

                function __onSelectDocument(newValue, oldValue) {
                    var elementUID = Project.current.getSelectElement(newValue);
                    $scope.updateContent(newValue, elementUID);
                }

                function __onModifyDocument(item, param) {
                    // 현재 선택상태 element가 없어도 property 창을 업데이트 한다.
                    $scope.updateContent(item.uid);
                }

                $scope.$on('#Project.removed-ELEMENT', function (e, data) {
                    // 해당 element가 선택상태이면 선택 해지
                    var documentUID = Project.current.getSelectDocument();
                    $scope.updateContent(documentUID);
                });

                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////

                // {newValue: 'element-18d53f95-2ffa-433a-9a9a-c57ca1534f04', name: 'ELEMENT', oldValue: 'element-c2d5091c-3d06-470c-b7b0-343a8bd41c88', document: 'document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1'}
                $scope.$on('#Project.selected-ELEMENT', function (e, data) {
                    out('#Project.selected-ELEMENT (propertyView) : ', data);
                    __onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });

                $scope.$on('#Project.modified-ELEMENT', function (e, data) {
                    out('#Project.modified-ELEMENT (propertyView) : ', data);
                    __onModifyElement(data.item, data.param);
                });

                function __onModifyElement(item, param) {
                    // 현재 선택상태이면 UI를 업데이트 한다.
                    var documentUID = param.documentUID;
                    var elementUID = param.elementUID;
                    $scope.updateContent(documentUID, elementUID, param);
                }

                function __onSelectElement(newValue, oldValue, documentUID) {
                    var elementUID = newValue;
                    $scope.updateContent(documentUID, elementUID);
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                var _documentUID;
                var _elementUID;
                var _currentElement;

                ////////////////////////////////////////
                // Document 환경설정
                ////////////////////////////////////////

                //-------------------
                // snap 크기
                //-------------------

                $scope.$on('#Tool.changed-CONFIG.display.snap_pixel', function (e, data) {
                    $scope.updateContent(_documentUID, _elementUID);
                });

                //-------------------
                // grid 보이기
                //-------------------

                $scope.$on('#Tool.changed-CONFIG.display.show_grid', function (e, data) {
                    $scope.updateContent(_documentUID, _elementUID);
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

                 $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                 $scope.updateContent( _documentUID, _elementUID );
                 });
                 */

                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////

                // 속성창 내용을 갱신한다.
                $scope.updateContent = function (documentUID, elementUID, param) {
                    _documentUID = documentUID;
                    _elementUID = elementUID;

                    var type = Project.current.getType(documentUID, elementUID);
                    $scope.type = type;

                    // type 이 바뀌지 않은 상태에서도 속성값은 계속 수정되므로
                    // type watch에서 실행하지 않늗다.
                    if (type == ELEMENT.DOCUMENT) {
                        $scope.uid = documentUID;
                    } else {
                        $scope.uid = elementUID;
                    }

                    if (!Project.current) return;
                    if (!documentUID) return;

                    if (elementUID) {
                        _currentElement = Project.current.getElement(documentUID, elementUID);
                    } else {
                        _currentElement = null;
                    }

                    var $dom = angular.element(_currentElement);
                    if (_currentElement && !$dom.css('fontSize')) {
                        out('wait...');
                        $timeout(function () {
                            $scope.updateContent(documentUID, elementUID, param);
                        }, 100);
                        return;
                    }

                    if ($scope.$unwatch) {
                        $scope.$unwatch();
                        $scope.$unwatch = null;
                    }
                    if ($scope.$unwatchOption) {
                        $scope.$unwatchOption();
                        $scope.$unwatchOption = null;
                    }

                    $scope.css = null;
                    $scope.temp = null;
                    $scope.option = null;
                    $scope.tempOption = null;

                    _getCSS(type, param);
                    _getOption(type, param);

                    $scope.$unwatch = watch();
                    $scope.$unwatchOption = watchOption();

                }

                ////////////////////////////////////////////////////////////////////////////////
                //
                // CSS
                //
                ////////////////////////////////////////////////////////////////////////////////

                // 속성 변경값을 Command 에 전달할때 사용
                $scope.$watch('css', function (newValue, oldValue) {
                    if (newValue === undefined || newValue === null) {
                        newValue = {};
                        return;
                    }
                    $scope.modifyContent(_documentUID, _elementUID);
                }, true);

                // DOM 으로부터 값 변경된 경우
                function watch() {
                    // oldValue와 검사하면 안됨
                    // (oldValue는 같은 element끼리의 값이 아닌 이전 select element의 값이 될수도 있으므로)
                    var unwatch = $scope.$watch('temp', function (newValue, oldValue) {
                        if (newValue == oldValue) return;

                        var changeList;
                        var newCSS;
                        var currentCSS;

                        for (var name in newValue) {

                            out('*** : ', name, ' : ', newValue[name]);

                            //if(!_currentElement){
                            if ($scope.type == ELEMENT.DOCUMENT) {
                                // document는 아직 CSS 변경 항목 없음

                            } else {
                                // element
                                if (_currentElement.style[name] === undefined && $(_currentElement).css(name) === undefined) {
                                    //if(name.match(/-[webkit|moz|o]+-/g) == null) continue;
                                    continue;
                                }

                                // prefix 구문 찾기
                                //-[webkit|moz|o]+-(.*?:)(.*?)(?=[;|\"])

                                // 객체로 구성되는 CSS 예외처리 (Group Object)
                                var currentObj;
                                var newObj;
                                var isGroup = true;
                                switch (name) {
                                    case 'border':
                                        newObj = newValue['borderGroup'];
                                        newCSS = getBorderCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getBorderGroup(currentCSS);
                                        break;
                                    case 'lineHeight':
                                        newObj = newValue['lineHeightGroup'];
                                        newCSS = getLineHeightCSS(newObj);

                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getLineHeightGroup(currentCSS);
                                        break;
                                    case 'letterSpacing':
                                        newObj = newValue['letterSpacingGroup'];
                                        newCSS = getLetterSpacingCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getLetterSpacingGroup(currentCSS);
                                        break;
                                    case 'fontSize':
                                        newObj = newValue['fontSizeGroup'];
                                        newCSS = getFontSizeCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getFontSizeGroup(currentCSS);
                                        break;
                                    case 'fontFamily':
                                        newObj = newValue['fontFamilyGroup'];
                                        newCSS = getFontFamilyCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getFontFamilyGroup(currentCSS);
                                        break;
                                    case 'textIndent':
                                        newObj = newValue['textIndentGroup'];
                                        newCSS = getTextIndentCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getTextIndentGroup(currentCSS);
                                        break;

                                    case 'columnRule':
                                        newObj = newValue['columnRuleGroup'];
                                        newCSS = getColumnRuleCSS(newObj);
                                        currentCSS = getCSSValue(name, null);
                                        currentObj = getColumnRuleGroup(currentCSS);
                                        break;

                                    default:
                                        newObj = newValue[name];
                                        newCSS = newObj;
                                        var isNumber = (typeof newCSS == 'number');
                                        currentCSS = getCSSValue(name, null, isNumber);
                                        currentObj = currentCSS;
                                        isGroup = false;
                                        break;
                                }

                                // borderGroup의 경우 객체 비교는 false이지만 색상 비교는 true가 되므로
                                // Group 요소를 개별 비교
                                var isObjectEqual = compareGroup(newObj, currentObj);
                                var isCSSEqual = angular.equals(newCSS, currentCSS);
                                if (isObjectEqual && isCSSEqual) continue;

                                // 색상 검사 (문자열 비교이기 때문에 같은 색상이더라도 not Equal로 비교될수 있으니 이를 체크한다.)
                                //var isColorEqual = compareColor(newCSS, currentCSS);
                                //if(isColorEqual) continue;

                                out('watch : ', name, ' : ', currentCSS, ' --> ', newCSS);
                                if (!changeList) changeList = {};
                                changeList[name] = newCSS;
                            }
                        }

                        // 변경 사항이 있다면 modify가 호출됨
                        $scope.css = changeList;
                    }, true);
                    return unwatch;
                }

                function compareGroup(valueObj, currentObj) {
                    var isEqual = angular.equals(valueObj, currentObj);
                    if (isEqual) return true;
                    if (!angular.isObject(valueObj)) {
                        var isColorEqual = compareColor(valueObj, currentObj);
                        return isColorEqual;
                    }

                    isEqual = true;
                    for (var prop in valueObj) {
                        var valueCSS = valueObj[prop];
                        var currentCSS = currentObj[prop];
                        out('\t - ', prop, ' : ', currentCSS, valueCSS);
                        if (angular.equals(valueCSS, currentCSS) == false) {
                            var isColorEqual = compareColor(valueCSS, currentCSS);
                            if (isColorEqual) continue;
                            isEqual = false;
                            break;
                        }
                    }
                    return isEqual;
                }

                function compareColor(valueCSS, currentCSS) {
                    var isColorEqual = angular.equals(valueCSS, currentCSS);
                    if (typeof valueCSS == 'string') {
                        var valueColor = getRGBA(valueCSS);
                        var currentCSSColor = getRGBA(currentCSS);
                        isColorEqual = angular.equals(valueColor, currentCSSColor);
                    }
                    return isColorEqual;
                }

                function getRGBA(rgbColor) {
                    if (typeof rgbColor != 'string') return null;
                    if (rgbColor.indexOf('rgb') < 0) return null;
                    var colorString = rgbColor.match(/rgba?\(.+\)/g)[0];
                    var rgba = colorString.match(/-?\d+(\.\d+)?/g);
                    return {
                        r: Number(rgba[0]) || 0,
                        g: Number(rgba[1]) || 0,
                        b: Number(rgba[2]) || 0,
                        a: (rgba[3] === undefined) ? 1 : Number(rgba[3])
                    }
                }

                ////////////////////////////////////////
                // CSS 변경
                ////////////////////////////////////////

                function _getCSS(type, param) {
                    var paramCSS = (param) ? param.css : null;
                    if (!paramCSS) paramCSS = {};

                    var temp;
                    if (type == ELEMENT.DOCUMENT) {
                        temp = {};
                        temp.width = Project.paper.width;
                        temp.height = Project.paper.height;

                    } else {
                        temp = updateElementCSS(paramCSS);
                    }
                    $scope.temp = temp;
                }

                function getCSSValue(name, paramCSS, isNumber) {
                    var style = _currentElement.style;
                    var $dom = angular.element(_currentElement);
                    paramCSS = paramCSS || {};

                    var value;
                    if (isNumber) {
                        value = U.toNumber(paramCSS[name]) || U.toNumber(style[name]) || U.toNumber($dom.css(name));
                        //out(name, ' : ', value, '(',U.toNumber(paramCSS[name]), '-', U.toNumber(style[name]), '-', U.toNumber($dom.css(name)), ')');
                    } else {
                        value = paramCSS[name] || style[name] || $dom.css(name);
                        // px가 안붙는 버그(크롬)
                        if (name == 'letterSpacing' && value.toString().indexOf('px' < 0)) value = value + 'px';
                        //out(name, ' : ', value, '(', paramCSS[name], '-', style[name], '-', $dom.css(name), ')');
                    }
                    return value;
                }

                /*
                 function toNumber(str){
                 if(!str) return 0;
                 var num = str.match(/-?\d+(\.\d+)?/g)
                 return (num == null)? 0 : num[0];
                 }
                 */

                // Element 개별 옵션값 탐색
                function updateElementCSS(paramCSS) {
                    var temp = {};
                    var $dom = angular.element(_currentElement);
                    //var dom  = _currentElement;

                    // 위치
                    temp.left = getCSSValue('left', paramCSS, true);
                    temp.top = getCSSValue('top', paramCSS, true);

                    // 크기
                    // padding, border에 따라 달라지므로 항상 실 측정치를 사용
                    var boxSizing = $dom.css('box-sizing');
                    //temp.width = U.toNumber(paramCSS.width) || U.toNumber((boxSizing == 'border-box')? $dom.outerWidth():$dom.css('width'));
                    //temp.height = U.toNumber(paramCSS.height) || U.toNumber((boxSizing == 'border-box')? $dom.outerHeight():$dom.css('height'));
                    temp.width = U.toNumber((boxSizing == 'border-box') ? $dom.outerWidth() : $dom.css('width'));
                    temp.height = U.toNumber((boxSizing == 'border-box') ? $dom.outerHeight() : $dom.css('height'));

                    // 여백
                    temp.paddingTop = getCSSValue('paddingTop', paramCSS, true);
                    temp.paddingRight = getCSSValue('paddingRight', paramCSS, true);
                    temp.paddingBottom = getCSSValue('paddingBottom', paramCSS, true);
                    temp.paddingLeft = getCSSValue('paddingLeft', paramCSS, true);

                    // 테두리 파싱
                    var border = getCSSValue('border', paramCSS);
                    temp.borderGroup = getBorderGroup(border);
                    temp.border = getBorderCSS(temp.borderGroup);

                    // 테두리 라운딩
                    temp.borderTopLeftRadius = getCSSValue('borderTopLeftRadius', paramCSS, true);
                    temp.borderTopRightRadius = getCSSValue('borderTopRightRadius', paramCSS, true);
                    temp.borderBottomRightRadius = getCSSValue('borderBottomRightRadius', paramCSS, true);
                    temp.borderBottomLeftRadius = getCSSValue('borderBottomLeftRadius', paramCSS, true);

                    // 스크롤
                    temp.overflow = getCSSValue('overflow', paramCSS);
                    // css.overflowX = getCSSValue('overflowX', paramCSS);
                    // css.overflowY = getCSSValue('overflowY', paramCSS);

                    // 문단
                    // css.wordWrap = paramCSS.wordWrap || $dom.css('wordWrap');
                    temp.whiteSpace = getCSSValue('whiteSpace', paramCSS);
                    // 말줄임 표시 (overflow === 'hidden' && whiteSpace === 'nowrap' 일때)
                    temp.textOverflow = getCSSValue('textOverflow', paramCSS);

                    // jquery에서 lineHeight 스타일은 무조건 px를 반환하므로 style에 직접 접근한다.
                    var lineHeight = getCSSValue('lineHeight', paramCSS);
                    temp.lineHeightGroup = getLineHeightGroup(lineHeight);
                    temp.lineHeight = getLineHeightCSS(temp.lineHeightGroup);

                    var letterSpacing = getCSSValue('letterSpacing', paramCSS);
                    temp.letterSpacingGroup = getLetterSpacingGroup(letterSpacing);
                    temp.letterSpacing = getLetterSpacingCSS(temp.letterSpacingGroup);

                    // 텍스트 정렬
                    temp.textAlign = getCSSValue('textAlign', paramCSS);

                    // 폰트
                    //css.fontFamily : $scope.fontFamilyChange 에서 처리함
                    //temp.fontFamilyGroup = (fontFamily)? compareFontFamily(fontFamily) : $scope.fontOptions[2];
                    var fontFamily = getCSSValue('fontFamily', paramCSS);
                    temp.fontFamilyGroup = getFontFamilyGroup(fontFamily);
                    temp.fontFamily = getFontFamilyCSS(temp.fontFamilyGroup);

                    var fontSize = getCSSValue('fontSize', paramCSS);
                    temp.fontSizeGroup = getFontSizeGroup(fontSize);
                    temp.fontSize = getFontSizeCSS(temp.fontSizeGroup);

                    temp.color = getCSSValue('color', paramCSS);
                    temp.fontWeight = getCSSValue('fontWeight', paramCSS);
                    temp.fontStyle = getCSSValue('fontStyle', paramCSS);
                    temp.textDecoration = getCSSValue('textDecoration', paramCSS);

                    // 들여쓰기
                    var textIndent = getCSSValue('textIndent', paramCSS);
                    temp.textIndentGroup = getTextIndentGroup(textIndent);
                    temp.textIndent = getTextIndentCSS(temp.textIndentGroup);

                    // 다단
                    //temp.columnCountGroup = getColumnCountGroup(columnCount);
                    temp.columnCount = getCSSValue('columnCount', paramCSS) || 'auto';

                    var columnRuleString = getCSSValue('columnRule', paramCSS);
                    temp.columnRuleGroup = getColumnRuleGroup(columnRuleString);
                    temp.columnRule = getColumnRuleCSS(temp.columnRuleGroup);

                    temp.columnGap = getCSSValue('columnGap', paramCSS, true);



                    //background : 0;
                    //background-attachment : scroll;
                    //background-clip : border-box;
                    //background-color : transparent;
                    //background-image : none;
                    //background-origin : padding-box;
                    //background-position : 0 0;
                    //background-position-x : 0;
                    //background-position-y : 0;
                    //background-repeat : repeat;
                    //background-size : auto auto;

                    return temp;
                }

                function getColumnRuleGroup(columnRuleCSS) {
                    var columnRuleWidth = columnRuleCSS.match(/-?\d+?\s?px/g);
                    var columnRuleColor = columnRuleCSS.match(/rgba?\(.+\)/g);
                    var columnRuleStyle = columnRuleCSS.match(/none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit/g);
                    return {
                        columnRuleWidth: columnRuleWidth ? U.toNumber(columnRuleWidth[0]) : undefined,
                        columnRuleColor: columnRuleColor ? columnRuleColor[0] : undefined,
                        columnRuleStyle: columnRuleStyle ? columnRuleStyle[0] : undefined
                    };
                }

                function getColumnRuleCSS(columnRule) {
                    columnRule = columnRule || {};
                    if (columnRule.columnRuleWidth === undefined) columnRule.columnRuleWidth = 0;
                    columnRule.columnRuleColor = columnRule.columnRuleColor || 'rgb(0,0,0)';
                    if (!columnRule.columnRuleStyle || columnRule.columnRuleStyle == 'none') columnRule.columnRuleStyle = 'solid';
                    var style = columnRule.columnRuleWidth + 'px' + ' ' + columnRule.columnRuleStyle + ' ' + columnRule.columnRuleColor;
                    return style;
                }

                function getBorderGroup(borderCSS) {
                    var borderWidth = borderCSS.match(/-?\d+?\s?px/g);
                    var borderColor = borderCSS.match(/rgba?\(.+\)/g);
                    var borderStyle = borderCSS.match(/none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|initial|inherit/g);
                    return {
                        borderWidth: borderWidth ? U.toNumber(borderWidth[0]) : undefined,
                        borderColor: borderColor ? borderColor[0] : undefined,
                        borderStyle: borderStyle ? borderStyle[0] : undefined
                    };
                }

                function getBorderCSS(border) {
                    border = border || {};
                    if (border.borderWidth === undefined) border.borderWidth = 0;
                    border.borderColor = border.borderColor || 'rgb(0,0,0)';
                    if (!border.borderStyle || border.borderStyle == 'none') border.borderStyle = 'solid';
                    var style = border.borderWidth + 'px' + ' ' + border.borderStyle + ' ' + border.borderColor;
                    return style;
                }

                function getLineHeightGroup(lineHeightCSS) {
                    return {
                        num: (lineHeightCSS) ? U.toNumber(lineHeightCSS) : undefined,
                        unit: (lineHeightCSS) ? lineHeightCSS.match(/[%|em|px].?/)[0] : undefined
                    }
                }

                function getLineHeightCSS(lineHeight) {
                    lineHeight = lineHeight || {};
                    lineHeight.num = lineHeight.num || 1;
                    lineHeight.unit = lineHeight.unit || 'em';
                    return lineHeight.num + lineHeight.unit;
                }

                function getLetterSpacingGroup(letterSpacingCSS) {
                    return {
                        num: (letterSpacingCSS) ? U.toNumber(letterSpacingCSS) : undefined,
                        unit: (letterSpacingCSS) ? letterSpacingCSS.match(/[px].?/)[0] : undefined
                    }
                }

                function getLetterSpacingCSS(letterSpacing) {
                    letterSpacing = letterSpacing || {};
                    letterSpacing.num = letterSpacing.num || 0;
                    letterSpacing.unit = letterSpacing.unit || 'px';
                    return letterSpacing.num + letterSpacing.unit;
                }

                function getFontSizeGroup(fontSizeCSS) {
                    return {
                        num: (fontSizeCSS) ? U.toNumber(fontSizeCSS) : undefined,
                        unit: (fontSizeCSS) ? fontSizeCSS.match(/[px|em|%].?/)[0] : undefined
                    }
                }

                function getFontSizeCSS(fontSize) {
                    fontSize = fontSize || {};
                    fontSize.num = fontSize.num || 1;
                    fontSize.unit = fontSize.unit || 'em';
                    return fontSize.num + fontSize.unit;
                }

                function getFontFamilyGroup(fontFamilyCSS) {
                    return (fontFamilyCSS) ? compareFontFamily(fontFamilyCSS) : $scope.fontOptions[2];
                }

                function getFontFamilyCSS(fontFamilyGroup) {
                    fontFamilyGroup = fontFamilyGroup || $scope.fontOptions[2];
                    return fontFamilyChange(fontFamilyGroup);
                }

                function getTextIndentGroup(textIndent) {
                    return {
                        num: (textIndent) ? U.toNumber(textIndent) : undefined,
                        unit: (textIndent) ? textIndent.match(/[px|em|%|pt|cm].?/)[0] : undefined
                    }
                }

                function getTextIndentCSS(textIndentGroup) {
                    textIndentGroup = textIndentGroup || {};
                    textIndentGroup.num = textIndentGroup.num || 0;
                    textIndentGroup.unit = textIndentGroup.unit || 'px';
                    return textIndentGroup.num + textIndentGroup.unit;
                }

                ////////////////////////////////////////////////////////////////////////////////
                //
                // Option Property
                //
                ////////////////////////////////////////////////////////////////////////////////

                // 옵션 변경값 적용
                $scope.$watch('option', function (newValue, oldValue) {
                    if (newValue === undefined || newValue === null) {
                        newValue = {};
                        return;
                    }

                    if ($scope.type == ELEMENT.DOCUMENT) {
                        $scope.configDocument();
                    } else {
                        $scope.modifyContent(_documentUID, _elementUID);
                    }
                }, true);

                // DOM 에서 값이 변경될때
                function watchOption() {
                    var unwatch = $scope.$watch('tempOption', function (newValue, oldValue) {
                        if (newValue == oldValue) return;

                        var changeList;
                        var newOption;
                        var currentOption;

                        for (var name in newValue) {
                            var newObj;
                            var currentObj;
                            //out('option : ', name, ' : ', newValue[name]);
                            if ($scope.type == ELEMENT.DOCUMENT) {

                                newObj = newValue[name];
                                currentObj = Tool.current.TOOL.CONFIG[name];
                                if (angular.equals(newObj, currentObj)) continue;
                                // 색상 검사 (문자열 비교이기 때문에 같은 색상이더라도 not Equal로 비교될수 있으니 이를 체크한다.)
                                var isColorEqual = compareColor(newObj, currentObj);
                                if (isColorEqual) continue;

                                var obj = angular.extend({}, currentObj, newObj);
                                if (!changeList) changeList = {};
                                changeList[name] = obj;
                                out('watch : ', name, ' : ', currentObj, ' --> ', obj)

                            } else {

                                var api = Project.current.elementAPI(_documentUID, _elementUID);
                                if (type == ELEMENT.TEXT) {
                                    //tempOption.display_size_toText = api.option('display_size_toText');
                                } else if (type == ELEMENT.IMAGE) {
                                    //
                                }
                            }
                        }

                        // 변경 사항이 있다면 modify가 호출됨
                        $scope.option = changeList;
                    }, true);
                    return unwatch;
                }

                //------------------
                // Config Option
                //------------------

                // 속성창에 표시할 Option 값 탐색
                function _getOption(type, param) {
                    if (!Project.current) return;
                    var paramOption = (param) ? param.css : null;
                    if (!paramOption) paramOption = {};

                    var tempOption;
                    if (type == ELEMENT.DOCUMENT) {
                        tempOption = {};
                        tempOption.display = {
                            snap_pixel: Tool.current.config_display('snap_pixel'),
                            show_grid: Tool.current.config_display('show_grid')
                        }

                    } else {
                        tempOption = updateElementOPT(paramOption);
                    }

                    // 값 설정
                    $scope.tempOption = tempOption;
                }

                // Element 개별 옵션값을 지정한다.
                function updateElementOPT(paramOption) {
                    var tempOption = {};
                    out('paramOption', paramOption);
                    //var $dom = angular.element(_currentElement);

                    var type = $scope.type;
                    var api = Project.current.elementAPI(_documentUID, _elementUID);
                    if (type == ELEMENT.TEXT) {
                        //tempOption.display_size_toText = api.option('display_size_toText');
                    }
                    else if (type == ELEMENT.IMAGE) {
                        //
                    }

                    return tempOption;
                }

                ////////////////////////////////////////////////////////////////////////////////
                //
                // Data 업데이트
                //
                ////////////////////////////////////////////////////////////////////////////////

                // 서버 저장값 변경된 경우
                // select가 변경되어 값이 변한 경우
                // type이 변경된 경우

                //------------------
                // 데이터 수정 - CSS
                //------------------

                // 연속으로 호출된 경우 업데이트를 무시하고 최종값을 한번에 적용시킨다.
                // (주의) delay 시간이 250 이하이면 delay 적용되지 않고 실행됨
                // 연속 클릭 속도 감안하여 500으로 설정해 놓음
                // $digest 호출 시간이 245정도이기 때문인듯함

                //ng-model-options="{ debounce: 500 }" 설정함
                $scope.modelOption = {
                    debounce: 500
                }

                // 속성창 내용을 데이터에 갱신한다.
                $scope.modifyContent = function (documentUID, elementUID) {

                    if (!Project.current) return;

                    var type = $scope.type;
                    var command;
                    var param;

                    // 수정시에 watch 발생하므로 복사해서 사용
                    var paramCSS = angular.copy($scope.css);

                    if (type == ELEMENT.DOCUMENT) {

                        // DOCUMENT  수정

                        command = CommandService.MODIFY_DOCUMENT;
                        param = {
                            documentUID: documentUID,

                            //*********************************

                            // option은 configDocument에서 설정
                            // option: paramOption,

                            //*********************************

                            // element css 설정값
                            css: paramCSS
                        };

                    } else {

                        // ELEMENT 최종 수정
                        if (type == ELEMENT.TEXT) {
                            //
                        }

                        var paramOption = angular.copy($scope.option);
                        command = CommandService.MODIFY_ELEMENT;
                        param = {
                            // 삽입될 문서
                            documentUID: documentUID,
                            elementUID: elementUID,

                            // element 설정값
                            option: paramOption,
                            css: paramCSS
                        };

                    }

                    // Modify command 호출
                    CommandService.exe(command, param, function () {
                        out('* 속성창 변경값 데이터 저장 완료');
                    });
                }

                //------------------
                // 데이터 수정 - Configuration Option
                //------------------

                // Deley Time 없이 업데이트 (History에 기록하지 않으므로)
                $scope.configDocument = function () {
                    if (!Project.current) return;

                    var type = $scope.type;
                    var param;

                    if (type != ELEMENT.DOCUMENT) {
                        throw '이 옵션 설정은 Document type일때만 가능합니다.';
                    }

                    // CONFIGURATION  설정값 수정
                    var paramOption = angular.copy($scope.option);
                    param = {
                        // option 설정값
                        option: paramOption
                    };

                    // command 호출
                    CommandService.exe(CommandService.CONFIGURATION, param);
                }


                ////////////////////////////////////////
                // 폰트 지정
                ////////////////////////////////////////

                $scope.fontOptions = [

                    {group: 'hangul', style: 'sans-serif', label: '맑은 고딕', value: '맑은 고딕'},
                    {group: 'hangul', style: 'sans-serif', label: '나눔고딕', value: '나눔고딕'},
                    {group: 'hangul', style: 'sans-serif', label: '맑은 고딕, 나눔고딕', value: '맑은 고딕, 나눔고딕'},

                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Arial, Helvetica',
                        value: 'Arial, Helvetica, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Arial Black, Gadget',
                        value: 'Arial Black, Gadget, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'serif',
                        label: 'Bookman Old Style',
                        value: 'Bookman Old Style, serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'cursive',
                        label: 'Comic Sans MS',
                        value: 'Comic Sans MS, cursive'
                    },
                    {group: 'web safe fonts', style: 'monospace', label: 'Courier', value: 'Courier, monospace'},
                    {
                        group: 'web safe fonts',
                        style: 'monospace',
                        label: 'Courier New, Courier',
                        value: 'Courier New, Courier, monospace'
                    },
                    {group: 'web safe fonts', style: 'serif', label: 'Garamond', value: 'Garamond, serif'},
                    {group: 'web safe fonts', style: 'serif', label: 'Georgia', value: 'Georgia, serif'},
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Impact, Charcoal',
                        value: 'Impact, Charcoal, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'monospace',
                        label: 'Lucida Console, Monaco',
                        value: 'Lucida Console, Monaco, monospace'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Lucida Sans Unicode, Lucida Grande',
                        value: 'Lucida Sans Unicode, Lucida Grande, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'MS Sans Serif, Geneva',
                        value: 'MS Sans Serif, Geneva, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'MS Serif, New York',
                        value: 'MS Serif, New York, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'serif',
                        label: 'Palatino Linotype, Book Antiqua, Palatino',
                        value: 'Palatino Linotype, Book Antiqua, Palatino, serif'
                    },
                    {group: 'web safe fonts', style: 'sans-serif', label: 'Symbol', value: 'Symbol, sans-serif'},
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Tahoma, Geneva',
                        value: 'Tahoma, Geneva, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'serif',
                        label: 'Times New Roman, Times',
                        value: 'Times New Roman, Times, serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Trebuchet MS, Helvetica',
                        value: 'Trebuchet MS, Helvetica, sans-serif'
                    },
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Verdana, Geneva',
                        value: 'Verdana, Geneva, sans-serif'
                    },
                    {group: 'web safe fonts', style: 'sans-serif', label: 'Webdings', value: 'Webdings, sans-serif'},
                    {
                        group: 'web safe fonts',
                        style: 'sans-serif',
                        label: 'Wingdings, Zapf Dingbats',
                        value: 'Wingdings, Zapf Dingbats, sans-serif'
                    },

                    // {group:'Google webfonts', style:'', label:'', value:''},
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Gentium Basic',
                        value: 'http://fonts.googleapis.com/css?family=Gentium+Basic',
                        uri: 'http://themes.googleusercontent.com/static/fonts/gentiumbasic/v2/KCktj43blvLkhOTolFn-MVHiOz_YwVS6wxBdUjDFTTY'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Ovo',
                        value: 'http://fonts.googleapis.com/css?family=Abel|Ovo',
                        uri: 'http://themes.googleusercontent.com/static/fonts/ovo/v2/Skogr183qOseS7dF1_FRBQ'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Kreon',
                        value: 'http://fonts.googleapis.com/css?family=Kreon',
                        uri: 'http://themes.googleusercontent.com/static/fonts/kreon/v2/NJ62MCrBzU-nduth4LABX6CWcynf_cDxXwCLxiixG1c'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Caudex',
                        value: 'http://fonts.googleapis.com/css?family=Caudex',
                        uri: 'http://themes.googleusercontent.com/static/fonts/caudex/v1/QWJZjwgAmTC36uOeILZKqOvvDin1pK8aKteLpeZ5c0A'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Rokkitt',
                        value: 'http://fonts.googleapis.com/css?family=Rokkitt',
                        uri: 'http://themes.googleusercontent.com/static/fonts/rokkitt/v3/5Yl2vTgdty6AzMt12VYvSgLUuEpTyoUstqEm5AMlJo4'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Pica',
                        value: 'http://fonts.googleapis.com/css?family=IM+Fell+DW+Pica+SC',
                        uri: 'http://themes.googleusercontent.com/static/fonts/imfelldwpicasc/v1/xBKKJV4z2KsrtQnmjGO17KGoD0ht6aQUF-IWA1Q8SQ4'
                    },
                    {
                        group: 'Google webfonts serif',
                        style: 'serif',
                        label: 'Ultra',
                        value: 'http://fonts.googleapis.com/css?family=Ultra',
                        uri: 'http://themes.googleusercontent.com/static/fonts/ultra/v2/8VYG-ol7upKEX3atkhH5CqCWcynf_cDxXwCLxiixG1c'
                    },

                    // san-serif
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Abel',
                        value: 'http://fonts.googleapis.com/css?family=Abel',
                        uri: 'http://themes.googleusercontent.com/static/fonts/abel/v1/8UIkryAMnYqDga6nPyU77_esZW2xOQ-xsNqO47m55DA'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Marvel',
                        value: 'http://fonts.googleapis.com/css?family=Marvel',
                        uri: 'http://themes.googleusercontent.com/static/fonts/marvel/v1/qgKLqF4l-tdiOu0kFiQEV-vvDin1pK8aKteLpeZ5c0A'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Carme',
                        value: 'http://fonts.googleapis.com/css?family=Carme',
                        uri: 'http://themes.googleusercontent.com/static/fonts/carme/v2/xCdMrDGUa-SxPUkvL6W06aCWcynf_cDxXwCLxiixG1c'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Rosario',
                        value: 'http://fonts.googleapis.com/css?family=Rosario',
                        uri: 'http://themes.googleusercontent.com/static/fonts/rosario/v2/DVZfPvwa_ah_yULIonXDRwLUuEpTyoUstqEm5AMlJo4'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Varela Round',
                        value: 'http://fonts.googleapis.com/css?family=Varela+Round',
                        uri: 'http://themes.googleusercontent.com/static/fonts/varelaround/v1/APH4jr0uSos5wiut5cpjrpS3E-kSBmtLoNJPDtbj2Pk'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'PT Sans Narrow',
                        value: 'http://fonts.googleapis.com/css?family=PT+Sans+Narrow',
                        uri: 'http://themes.googleusercontent.com/static/fonts/ptsansnarrow/v0/UyYrYy3ltEffJV9QueSi4VLE0juxe_YrR4_5kH0wfhI'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Metrophobic',
                        value: 'http://fonts.googleapis.com/css?family=Metrophobic',
                        uri: 'http://themes.googleusercontent.com/static/fonts/metrophobic/v1/0IZPA9DbzKXnGZABsAivTywlidHJgAgmTjOEEzwu1L8'
                    },
                    {
                        group: 'Google webfonts san-serif',
                        style: 'san-serif',
                        label: 'Open Sans',
                        value: 'http://fonts.googleapis.com/css?family=Open+Sans',
                        uri: 'http://themes.googleusercontent.com/static/fonts/opensans/v4/cJZKeOuBrn4kERxqtaUH3SZ2oysoEQEeKwjgmXLRnTc'
                    },
                    // display
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Smokum',
                        value: 'http://fonts.googleapis.com/css?family=Smokum',
                        uri: 'http://themes.googleusercontent.com/static/fonts/smokum/v1/XxAkVbxR8S3EtdoKW8_T3uvvDin1pK8aKteLpeZ5c0A'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Black Ops One',
                        value: 'http://fonts.googleapis.com/css?family=Black+Ops+One',
                        uri: 'http://themes.googleusercontent.com/static/fonts/blackopsone/v1/2XW-DmDsGbDLE372KrMW1YWcQgv0WMKv2x2qfcALabs'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Pompiere',
                        value: 'http://fonts.googleapis.com/css?family=Pompiere',
                        uri: 'http://themes.googleusercontent.com/static/fonts/pompiere/v1/Y3DPP8H_-3TwPsh5FkDMHXYhjbSpvc47ee6xR_80Hnw'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Maven Pro',
                        value: 'http://fonts.googleapis.com/css?family=Maven+Pro',
                        uri: 'http://themes.googleusercontent.com/static/fonts/mavenpro/v2/MG9KbUZFchDs94Tbv9U-pSZ2oysoEQEeKwjgmXLRnTc'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Limelight',
                        value: 'http://fonts.googleapis.com/css?family=Limelight',
                        uri: 'http://themes.googleusercontent.com/static/fonts/limelight/v1/kD_2YDkzv1rorNqQ2oFK5iZ2oysoEQEeKwjgmXLRnTc'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'VT323',
                        value: 'http://fonts.googleapis.com/css?family=VT323',
                        uri: 'http://themes.googleusercontent.com/static/fonts/vt323/v1/lS5yLrO6Jmka3W5vZS3QCqCWcynf_cDxXwCLxiixG1c'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Oswald',
                        value: 'http://fonts.googleapis.com/css?family=Oswald',
                        uri: 'http://themes.googleusercontent.com/static/fonts/oswald/v1/lXoKq2PC8Z_S1wl-BwvrB-vvDin1pK8aKteLpeZ5c0A'
                    },
                    {
                        group: 'Google webfonts display',
                        style: 'display',
                        label: 'Kenia',
                        value: 'http://fonts.googleapis.com/css?family=Kenia',
                        uri: 'http://themes.googleusercontent.com/static/fonts/kenia/v2/9TTpzXwTpO7O44FHfOTd8qCWcynf_cDxXwCLxiixG1c'
                    },
                    // Handwriting
                    {
                        group: 'Google webfonts Handwriting',
                        style: 'Handwriting',
                        label: 'Gloria Hallelujah',
                        value: 'http://fonts.googleapis.com/css?family=Gloria+Hallelujah',
                        uri: 'http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI'
                    },
                    {
                        group: 'Google webfonts Handwriting',
                        style: 'Handwriting',
                        label: 'Delius',
                        value: 'http://fonts.googleapis.com/css?family=Delius',
                        uri: 'http://themes.googleusercontent.com/static/fonts/delius/v1/VhgncxckLThEfOZprZ74a-vvDin1pK8aKteLpeZ5c0A'
                    },
                    {
                        group: 'Google webfonts Handwriting',
                        style: 'Handwriting',
                        label: 'Swanky and Moo Moo',
                        value: 'http://fonts.googleapis.com/css?family=Swanky+and+Moo+Moo',
                        uri: 'http://themes.googleusercontent.com/static/fonts/swankyandmoomoo/v1/orVNZ9kDeE3lWp3U3YELu2WHY9iboOoH8OsBr4ISUGM'
                    },
                    {
                        group: 'Google webfonts Handwriting',
                        style: 'Handwriting',
                        label: 'Love Ya Like A Sister',
                        value: 'http://fonts.googleapis.com/css?family=Love+Ya+Like+A+Sister',
                        uri: 'http://themes.googleusercontent.com/static/fonts/loveyalikeasister/v1/LzkxWS-af0Br2Sk_YgSJYycrTk7iLosofjQDP1-LBOKglnMp3_3A8V8Ai8YosRtX'
                    },
                    {
                        group: 'Google webfonts Handwriting',
                        style: 'Handwriting',
                        label: 'Meddon',
                        value: 'http://fonts.googleapis.com/css?family=Meddon',
                        uri: 'http://themes.googleusercontent.com/static/fonts/meddon/v2/ksvoKtnK5R4WK1JfWFPPWuvvDin1pK8aKteLpeZ5c0A'
                    }
                ];

                function compareFontFamily(fontFamily) {
                    if (!fontFamily) return null;

                    var fonts = $scope.fontOptions;
                    for (var prop in fonts) {
                        var value = fonts[prop].value;
                        if (value.indexOf('http://') == 0) {
                            value = fonts[prop].label;
                        }
                        var font = getFontFamilyLabel(value);
                        if (font == fontFamily) {
                            return fonts[prop];
                        }
                    }
                    return null;
                }

                function getFontFamilyLabel(label) {
                    var fonts = label.split(',');
                    for (var prop in fonts) {
                        var font = fonts[prop];
                        font = font.trim();
                        if ((font.indexOf(" ") > 0) && (font.indexOf(",") == -1)) {
                            font = "'" + font + "'";
                            fonts[prop] = font;
                        }
                    }
                    return fonts.join(',');
                }

                function fontFamilyChange(item) {
                    if (!item) {
                        return null;
                    }

                    //var item = $scope.temp.fontFamilyGroup;
                    if (item.group == 'web safe fonts' || item.group == 'hangul') {
                        var fontFamily = getFontFamilyLabel(item.value);
                        return fontFamily;
                    }

                    var fontName = item.value;
                    var fontURI = item.uri;
                    if (!fontURI) return null;

                    var fontFamily = getFontFamilyLabel(item.label);
                    /*
                     fontFamily = fontFamily.trim();
                     if((fontFamily.indexOf("'") != 0) && (fontFamily.indexOf(" ") > 0) && (fontFamily.indexOf(",") == -1)){
                     fontFamily = "'" + fontFamily + "'";
                     }
                     */

                    /*
                     @font-face {
                     font-family: 'Gloria Hallelujah';
                     font-style: normal;
                     font-weight: normal;
                     src: url('http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI.woff') format('woff'),
                     url('http://themes.googleusercontent.com/static/fonts/gloriahallelujah/v2/CA1k7SlXcY5kvI81M_R28d8e37SXvEhDxPg1zCoHdaI.ttf') format('truetype');
                     }
                     */
                    var atFontFace = "@font-face {\n"
                        + "  font-family: " + fontFamily + ';\n'
                        + "  font-style: normal;\n"
                        + "  font-weight: normal;\n"
                        + "  src: "//local('"+ fontName +"'), "
                        + "url('" + fontURI + ".woff') format('woff'),\n"
                        + "url('" + fontURI + ".ttf') format('truetype');\n"
                        + "}\n";

                    // style 태그가 지정되어 있어야함
                    // <style type="text/css" title="wdText" media="all">

                    var styleSheets = document.styleSheets;

                    var ourStyleSheet;
                    for (var i = 0; i < styleSheets.length; i++) {
                        //var currentStyleSheet = styleSheets[i].title;
                        if (styleSheets[i].title == "dynamicLoadFont") {
                            //this is the one we use for adding @keyframnes rules
                            ourStyleSheet = styleSheets[i]
                        }

                        if (ourStyleSheet) {
                            for (var j = 0; j < ourStyleSheet.cssRules.length; j++) {
                                ourStyleSheet.deleteRule(j)
                            }
                            ;
                            // ourStyleSheet.insertRule(code, 0);

                            try {
                                // ourStyleSheet.insertRule(theC, 0);

                                if (atFontFace != "") {
                                    ourStyleSheet.insertRule(atFontFace, 0);
                                }
                                // ourStyleSheet.insertRule(theC, 0);
                                // var ss=ourStyleSheet.cssRules[0];

                            } catch (err) {
                                out('[Font ERROR : ]', err);
                                i == i;
                            }

                        }
                    }

                    return fontFamily;
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

            function Link($scope, $element, $attrs) {

                // $element.trigger('#view.layoutUpdate');

                // 너비 초기 설정값
                __pannelToggle(250);
                // $scope.$evalAsync( __pannelToggle );
                // $timeout(__pannelToggle, 500);

                // pannel 열기/닫기
                $scope.pannelToggle = function (scope) {
                    __pannelToggle();
                };

                function __pannelToggle(w) {
                    var $dock = $element.parent('.hi-dock');
                    if (w === undefined) {
                        w = $dock.outerWidth();
                        w = (w > 300) ? 10 : 400;
                    }

                    $dock.css({
                        'min-width': w + 'px',
                        'width': w + 'px'
                    });

                    $element.trigger('#view.layoutUpdate', {
                        targetCSS: {
                            width: w
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
        _directive._regist = function (application) {
            // 등록
            application.directive('propertyView', _directive);
        };
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
