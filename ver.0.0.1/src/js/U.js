/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 유틸함수들

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [],
    function( ) {

        return {

            // 숫자화 (fallback : 숫자 변환 실패시 반환값)
            toNumber : function (numeric, fallback) {
                var num = parseFloat(numeric, 10);
                return isNaN(num) ? (fallback || 0) : num;
            }
            
            ,toArray: function (a) {
                return [].slice.call(a);
            }
            
            ////////////////////////////////////
            // UUID 생성기
            ////////////////////////////////////

            ,createUID: function (){
                var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                var uid = uid.replace(/[xy]/g, function(c){
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                
                return uid;
            }

            //---------------------------
            // 템플릿 가져오기
            //---------------------------
            
            // <script> 태그에 있는 템플릿 객체 가져오기
            // 사용예 : U.getTemplate('#tree_message_remove', $element);

            ,getTemplate: function (templateElement_selector, $parent){
                var templateElement = $parent.find(templateElement_selector)[0];
                var $template = angular.element(templateElement);
                var html;

                if(templateElement){
                    if(templateElement.nodeName.toUpperCase() == "SCRIPT"){
                        var htmlString = $template.text();
                        if(htmlString){
                            // var html = $.parseHTML(htmlString);
                            html = angular.element(htmlString);
                        }
                    }else{
                        html = $template.html();
                    }
                }
                return html;
                
                /*
                // template가 없으면  alert을 띄운다.
                if($template){
                    if($template.nodeName.toUpperCase() == "SCRIPT"){
                        var htmlString = $template.text();
                        if(htmlString){
                            var html = $.parseHTML(htmlString);
                        }
                    }else{
                        var html = $template.html();
                    }
                    
                    return $(html);
                }
                return null;
                */
            }
            ////////////////////////////////////
            // Getter, Setter 메서드로 속성 정의
            ////////////////////////////////////

            // 'name' 이름의 속성을 정의한다. (get, set)
            // 이때 '__name' 속성이 자동으로 만들어 진다.
            
            /*
            this.__name = U.defineProperty ( this, 'num', {set:false, value:10});
            this.__name == 10; //true
            this.num == 10; //true
            this.num = 10 ; // error (readOnly)
            */
           
            /*
            config = {
                get:Function or Boolean, (생략시 true)
                set:Function or Boolean, (생략시 true)
                value:Function or Primitive (생략시 undefined)
            }

            예:{
                get:true, (생략)

                // override
                set:function (value){
                    this.__name = value;
                }, 
                value: function (){
                    return 10;
                }
            }
            */
           
            // IE 9 이상 (8, but only on DOM objects and with some non-standard behaviors
            ,defineProperty : function (context, name, config) {
                
                var readOnly = (config === 'readOnly');
                var writeOnly = (config === 'writeOnly');
                var defaultValue;

                // readOnly, defaultValue
                if(config === undefined || typeof config === 'string')
                {
                    config = {
                        get: getter,
                        set: setter
                    };
                }
                else
                {
                    // writeOnly 체크
                    if(typeof config.get !== 'function'){
                        writeOnly = (config.get === undefined) ? false : !Boolean(config.get);
                        config.get = getter;
                    }

                    // readOnly 체크
                    if(typeof config.set !== 'function'){
                        readOnly = (config.set === undefined) ? false : !Boolean(config.set);
                        config.set = setter;
                    }

                    // 초기값 설정
                    if(typeof config.value === 'function'){
                        defaultValue = config.value.apply(context);
                    }else{
                        defaultValue = config.value;
                    }

                    delete config.value;
                }

                // 재정의 가능한 속성으로 설정
                config.configurable = true;
                // 속성 생성
                Object.defineProperty( context, name, config);

                // 기본 설정값 리턴
                return defaultValue;

                //-----------------
                // getter, setter
                //-----------------
                
                function getter() {
                    if(writeOnly){
                        throw new Error('[ ' + name + ' ]은 쓰기 전용 속성입니다.');
                        return ;
                    }
                    return context['__' + name];
                };
                function setter(value) {
                    if(readOnly){
                        throw new Error('[ ' + name + ' ]은 읽기 전용 속성입니다.');
                        return;
                    }
                    context['__' + name] = value;
                };
            }

            ////////////////////////////////////
            // Angular 유틸
            ////////////////////////////////////

            // 디렉티브에 정의된 controller 찾기
            ,getController: function(selector, directiveName){
                    // var $document = angular.element(document);
                    // var treeContainer = $document.find('.treeContainer');
                    
                    var $element = angular.element(selector);
                    var controller = $element.controller(directiveName);
                    return controller;
            }

            // 디렉티브의 scope 설정이 false로 설정되었다면 아래와 같이 접근 가능하다.
            // 디렉티브의 scope 설정이 scope={} 로 설정된 경우에는 scop 하위에 새로운 child scpoe에서 찾아야 한다.
            ,getScope: function(selector, directiveName){
                    // var $document = angular.element(document);
                    // var treeContainer = $document.find('.treeContainer');
                    
                    var $element = angular.element(selector);
                    var $scope = treeContainer.scope(directiveName);
                    return $scope;
            }







            // END
        };

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
