'use strict';

define([], function () {

    return ['menu', function () {

        /* 
        디렉티브 : http://www.nextree.co.kr/p4850/

        [compile 단계] : 
            - HTML의 DOM 엘리먼트들을  돌면서 디렉티브를 찾는다. 
            - (attribute name, tag name, comments, class name을 이용하여 디렉티브를 매칭시킨다.)
            - 결과로 link function을 리턴한다. 
        [ink 단계] : 
            - 디렉티브와 HTML이 상호작용(동적인 view) 할 수 있도록 디렉티브에 event listener를 등록하며
            -  scope와 DOM 엘리먼트간에 2-way data binding을 위한 $watch를 설정한다. 

            // 정의
            angular.module.(....)
                .directive('myExample', function() {
                    -- [생략] directive 내용 작성 --
                )};

            // 사용 : 
            <my-example></my-example>
            <my:example></my:example>
            <my_example></my_example>
        */
       
        var directive = {

            // DOM 엘리먼트의 속성 : EACM (default - A)
            // element, attribute, class, comment
            restrict: 'E',

            /*
            // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
            template: '<div>version : <span version/><div ng-transclude/>' + 
                        '<ul>' + 
                            '<li ng-repeat="item in items" ng-click="click()">{{item.label}}</li>' +
                        '</ul></div>',
            */
            templateUrl: _PATH.TEMPLATE + 'menu.html',
            
            // template을 추가할지 교체할지 
            replace: true,
            // 디렉티브 별로 compile()과 link()의 호출 우선 순위를 지정. (기본값은 0)
            // priority 값이 클 수록 우선순위가 높고 먼저 호출
            priority: 0,
            // template에 ng-transclude이 사용된 부분에 원본 내용을 포함(true)
            transclude: true,
            
            /*
            scope : false -> 새로운 scope 객체를 생성하지 않고 부모가 가진 같은 scope 객체를 공유. (default 옵션)
            scope : true -> 새로운 scope 객체를 생성하고 부모 scope 객체를 상속.
            scope: { … } -> isolate/isolated scope를 새롭게 생성. 

            * scope: { … }는 재사용 가능한 컴포넌트를 만들 때 사용하는데 
                          컴포넌트가 parent scope의 값을 read/write 못하게 하기 위함입니다. 
                          parent scope에 접근(access) 하고 싶을 경우 Binding 전략(=, @, &)를 이용합니다.

            * Binding 전략
                    =   :   부모 scope의 property와 디렉티브의 property를 data binding하여 부모 scope에 접근
                    @  :   디렉티브의 attribute value를 {{}}방식(interpolation)을 이용해 부모 scope에 접근
            */
            scope: {
                //
            },

            terminal: false,

            // AngularJS의 다른 컨트롤러나 디렉티브의 controller()에 this로 정의된 function을 사용할 때 선언.
            // require에 컨트롤러 이름을 설정하면 해당 컨트롤러를 주입받게 됩니다.
            // 이후 디렉티브의 link()내에서 주입받은 컨트롤러의 this로 선언된 모든 function을 사용할 수 있습니다.
            require: false,

            // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
            // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.items = [
                    {label: 'File'},
                    {label: 'Edit'},
                    {label: 'View'}
                ];
            },

            /*
            // compile단계에서는 아직 scope가 존재하지 않은 상태
            // 때문에 compile()은 scope를 매개변수로 가지고 자유롭게 접근할 수 있는 link()를 리턴합니다. 
            // 리턴된 link()은 scope와 디렉티브간의 $watch를 설정하여 model과 view간의 동적인 연결을 구성합니다.
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    // compile phase가 실행되고 child 엘리먼트가 link 되기 전에 호출
                    pre: function preLink(scope, el, attrs, controller) {
                        //
                    },
                    // compile phase가 실행되고 child 엘리먼트가 link 된 후 호출
                    // ( 따라서, DOM 구조를 변경하기 위해서는 postLink()를 이용. )
                    post: function postLink(scope, el, attrs, controller) { 
                        console.log("post : ", scope.info);
                    }
                }
            },
            */
            
            // 2-way data binding을 위해 해당 디렉티브 DOM엘리먼트의 event  listener를 등록.
            // ( 디렉티브의 대부분의 로직을 여기에 선언하며 postLink()만 지원.)
            link: function (scope, el, attrs, controller) {
                
                scope.click = function(){
                    console.log(" * item에 해당하는 command를 호출! : ", this.item);
                };

            }
        }

        return directive;
    }];
    
});
