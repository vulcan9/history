


console.log("# Application By Vulcan.");


var _PATH_ROOT = './';
var _PATH = {
    CSS :                _PATH_ROOT + 'css/',
    TEMPLATE :       _PATH_ROOT + 'templates/',
    LIB :                  _PATH_ROOT + 'lib/',
    
    JS :                    _PATH_ROOT + 'js/',
    CONTROLLER :    _PATH_ROOT + 'js/controllers/',
    DIRECTIVE :         _PATH_ROOT + 'js/directives/',
    FILTER :              _PATH_ROOT + 'js/filters/'
};

/*
user strict 명령은 엄격하게 JavaScript 룰을 적용하라는 의미이다.
일부 브라우저의 경우 use strict 명령을 통해 보다 빠르게 동작하는 경우도 존재하는 것 같다.
잘못된 부분에 대한 검증도 보다 엄격하게 동작한다.
하지만, 일부 라이브러리의 경우 use strict 명령을 사용하면 동작하지 않는 경우도 있으므로 주의해야 한다.
*/
'use strict';
 
////////////////////////////////////////
//requireJS 기본 설정 부분
////////////////////////////////////////

requirejs.config({

    /*
    baseUrl: JavaScript 파일이 있는 기본 경로를 설정한다.
    만약 data-main 속성이 사용되었다면, 그 경로가 baseUrl이 된다.
    data-main 속성은 require.js를 위한 특별한 속성으로 require.js는 스크립트 로딩을 시작하기 위해 이 부분을 체크한다.
    */
    baseUrl : _PATH_ROOT,


    /*
    paths:  path는 baseUrl 아래에서 직접적으로 찾을 수 없는 모듈명들을 위해 경로를 매핑해주는 속성이다.
    "/"로 시작하거나 "http" 등으로 시작하지 않으면, 기본적으로는 baseUrl에 상대적으로 설정하게 된다.
 
    paths: { "exam": "aaaa/bbbb" }
 
    의 형태로 설정한 뒤에, define에서 "exam/module" 로 불러오게 되면, 스크립트 태그에서는 실제로는 src="aaaa/bbbb/module.js" 로 잡을 것이다.
    path는 또한 아래와 같이 특정 라이브러리 경로 선언을 위해 사용될 수 있는데, path 매핑 코드는 자동적으로 .js 확장자를 붙여서 모듈명을 매핑한다.
    */
    
    //뒤에 js 확장자는 생략한다.
    paths:{
        // text : HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'text':             _PATH.LIB + 'require/text',
        'jquery':         _PATH.LIB + 'jquery/jquery',
        'jquery-ui':     _PATH.LIB + 'jquery/jquery-ui-1.10.2.min',
        'angular':       _PATH.LIB + 'angular/angular',

        'lazyDirectives':   _PATH.JS + 'registers/lazy-directives',
        'lazyServices':     _PATH.JS + 'registers/lazy-services', 
        'lazyFilters':         _PATH.JS + 'registers/lazy-filters',

        'RouteConfig':      _PATH.JS + 'RouteConfig',
        'App':                 _PATH.JS + 'App',
        'Routes':             _PATH.JS + 'Routes',

        // directive나 template 도 path를 등록하여 사용할 수 있음
        // 'version':'./js/directives/version',
        // 'view1':'./templates/view1.html',
        // 'c_App' : _PATH.CONTROLLER + 'c_App',
    },
    
    /*
    shim: AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
    참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
    */
    shim:{
        'angular':{
            deps:['jquery'],
            exports:'angular'
        },
        'jquery-ui': {
            deps: ['jquery'] 
        },

        'App':{
            deps:['angular', 'RouteConfig']
        },
        'Routes':{
            deps:['angular']
        }
    }
});

////////////////////////////////////////
//requireJS를 활용하여 모듈 로드
////////////////////////////////////////

requirejs( [
        'text', //미리 선언해둔 path, css나 html을 로드하기 위한 requireJS 플러그인
        'jquery', //미리 선언해둔 path, jQuery는 AMD를 지원하기 때문에 이렇게 로드해도 jQuery 또는 $로 호출할 수 있다.
        'angular', 
        //'jquery-ui',
        'App', //App.js
        'Routes' //Routes.js
    ],
    
    function (text, $, angular) {
        //이 함수는 위에 명시된 모든 디펜던시들이 다 로드된 뒤에 호출된다.
        //주의해야할 것은, 디펜던시 로드 완료 시점이 페이지가 완전히 로드되기 전 일 수도 있다는 사실이다.
        
        //페이지가 완전히 로드된 뒤에 실행
        $(document).ready(function () {
 
            //위의 디펜던시 중 myApp이 포함된 app.js가 로드된 이후에 아래가 수행된다.
            //임의로 앵귤러 부트스트래핑을 수행한다.
            
            // angular.bootstrap(element, [modules], [config]);
            // - Returns the newly created injector for this app.
            angular.bootstrap(document, ['App']);
 
        });
 
    }
);







