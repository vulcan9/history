/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'version', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                template: '<span><span ng-transclude></span> version {{version}}</span>',
                //templateUrl: _PATH.TEMPLATE + 'menu.html',

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
                scope: {},

                terminal: false,

                // AngularJS의 다른 컨트롤러나 디렉티브의 controller()에 this로 정의된 function을 사용할 때 선언.
                // require에 컨트롤러 이름을 설정하면 해당 컨트롤러를 주입받게 됩니다.
                // 이후 디렉티브의 link()내에서 주입받은 컨트롤러의 this로 선언된 모든 function을 사용할 수 있습니다.
                require: false,

                // 다른 디렉티브들과 통신하기 위한 역할을 하는 controller명칭을 정의.
                // this로 정의된 data 및 function은 3.9의’require’ rule을 사용하여 다른 디렉티브에서 엑세스 할 수 있게 합니다.
                controller: function( $scope, $element, $attrs, $transclude, $rootScope ) {
                    $scope.version = '1.0.0';
                    //console.log('scope : ', $scope);

                    //var childElement = $transclude();   //childScope 없이 그냥 호출
                    //$element.append( childElement );
                    
                    $element.on('$destroy', function() {
                        //$interval.cancel(timeoutId);
                    });
                },

                // 확인할 사항 : 
                // compile function과 link function (이 둘을 함께 설정할 수는 없다고 한다. - ? -)
                // http://blog.naver.com/jjoommnn/220020656133

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
               //*/

                //*
                // 2-way data binding을 위해 해당 디렉티브 DOM엘리먼트의 event  listener를 등록.
                // ( 디렉티브의 대부분의 로직을 여기에 선언하며 postLink()만 지원.)
                link: function( scope, el, attrs, controller, transclude ) {
                    //console.log('controller : ', controller);

                    //var childScope = scope.$new();
                    //var childElement = transclude( childScope, function (clone){
                    //    el.append( clone );    
                    //} );   //childScope를 넣어서 호출


                    scope.click = function() {
                        //console.log(" * item에 해당하는 command를 호출! : ", this.item);
                    };


                    //scope.version = scope.version || '1.0.0';


                    scope.$watch( 'version', function( newValue, oldValue ) {
                        //el.text ('version.' + scope.version);
                        //el.empty();

                        //console.log("*", scope.version, el, scope.message);

                    } );

                }
                //*/
            };

        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

/*
//https://code.angularjs.org/1.2.23/docs/guide/directive
//http://www.codeproject.com/Articles/607873/Extending-HTML-with-AngularJS-Directives

$compileProvider.directive('name', _directive);

application.directive('myCustomer', function() {
    return {
        //templateUrl: 'my-customer.html',
        template:'<div>myCustomer Directive</div>'
    };
});
*/