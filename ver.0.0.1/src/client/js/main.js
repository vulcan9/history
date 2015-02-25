/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록
    *
    * Refrence
    *     [ AngularJS + RequireJS ]
    *         - https://www.startersquad.com/blog/angularjs-requirejs/
    *     [ angularjs-lazy-loading-with-requirejs ]
    *         - https://github.com/ifyio/angularjs-lazy-loading-with-requirejs
    *     

////////////////////////////////////////////////////////////////////////////////*/

/*
user strict 명령은 엄격하게 JavaScript 룰을 적용하라는 의미이다.
일부 브라우저의 경우 use strict 명령을 통해 보다 빠르게 동작하는 경우도 존재하는 것 같다.
잘못된 부분에 대한 검증도 보다 엄격하게 동작한다.
하지만, 일부 라이브러리의 경우 use strict 명령을 사용하면 동작하지 않는 경우도 있으므로 주의해야 한다.
*/

'use strict';

////////////////////////////////////////
// 로그 출력
////////////////////////////////////////

window.debug = true;

(function() {

    // IE 7, 8
    if ( typeof window.console === 'undefined' || typeof window.console.log === 'undefined' ) {
        window.console = {};
        // union of Chrome, FF, IE, and Safari console methods
        var m = [ 
            "log", "info", "warn", "error", "debug", "trace", "dir", 
            "group", "groupCollapsed", "groupEnd", "time", "timeEnd", 
            "profile", "profileEnd", "dirxml", "assert", "count", 
            "markTimeline", "timeStamp", "clear" 
        ];
        for (var i = 0; i < m.length; i++) {
            if (!window.console[m[i]]) {
                window.console[m[i]] = function() {};
            }    
        }
    }

    window.out = window.out || function() {
        if( !window.debug ) return;
        if ( !arguments || arguments.length < 1 ) return;

        if ( window.out && window.out.$log ) {
            window.out.$log.info.apply( window.out.$log, arguments );
        } else {
            console.log.apply( window.console, arguments );
        }
    }

})();

console.log ('TODO : // 디버깅용으로 노출된 속성 비활성화 시킬것 (window.debug=false)');
console.log( '# Application By Vulcan.' );

////////////////////////////////////////
// 렌더링 타이밍
////////////////////////////////////////

//  requestAnimationFrame();
//    requestAnimationFrame Polyfill
//    More info:
//    http://paulirish.com/2011/requestanimationframe-for-smart-animating/

var requestAnimationFrame = window.requestAnimationFrame || (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            // callback : function FrameRequestCallback
            // element : DOMElement Element
            window.setTimeout(callback, 1000 / 60);
        };
}());


////////////////////////////////////////
// Global 속성
////////////////////////////////////////

/*

// 일반 서버
// 서버상의 실제 설치된 위치가 "/history/ver.0.0.1/src" 인 경우
// Install Folder URL 지정 (URL 상의 Root-Prefix)
// (예) http://localhost/history/ver.0.0.1/src/#/404_NOT_FOUND

var _VIRTUAL_ROOT_URL = '/history/ver.0.0.1/src/';

/*/

// Node 서버
// 설치 폴더가 "/history" 에 라우팅 되어 있는 경우
// (예) http://localhost:8000/history/#/404_NOT_FOUND

var _VIRTUAL_ROOT_URL = '/history/';

//*/

// Client Setting
var _PATH_ROOT = '/';


var _PATH = {
    ROOT:                _VIRTUAL_ROOT_URL,
    CSS:                   _VIRTUAL_ROOT_URL + 'client/css/',
    TEMPLATE:         _VIRTUAL_ROOT_URL + 'client/templates/',
    LIB:                    _VIRTUAL_ROOT_URL + 'client/libs/',
    DATA:                 _VIRTUAL_ROOT_URL + 'client/js/data/',

    // EDITOR:                 _VIRTUAL_ROOT_URL + 'editor/',

    JS:                     _VIRTUAL_ROOT_URL + 'client/js/',
    MODULE:            _VIRTUAL_ROOT_URL + 'client/js/modules/',
    CONTROLLER:    _VIRTUAL_ROOT_URL + 'client/js/controllers/',
    DIRECTIVE:         _VIRTUAL_ROOT_URL + 'client/js/directives/',
    SERVICE:           _VIRTUAL_ROOT_URL + 'client/js/services/',
    FACTORY:           _VIRTUAL_ROOT_URL + 'client/js/factory/',
    FILTER:               _VIRTUAL_ROOT_URL + 'client/js/filters/',
    COMMAND:         _VIRTUAL_ROOT_URL + 'client/js/command/',

    ANGULAR:          _VIRTUAL_ROOT_URL + 'client/libs/angular.1.3.8/'
};

////////////////////////////////////////////////////////////////////////////////
///
// requireJS 기본 설정 부분
// 
////////////////////////////////////////////////////////////////////////////////

require.config( {

    /*
    baseUrl: JavaScript 파일이 있는 기본 경로를 설정한다.
    만약 data-main 속성이 사용되었다면, 그 경로가 baseUrl이 된다.
    data-main 속성은 require.js를 위한 특별한 속성으로 require.js는 스크립트 로딩을 시작하기 위해 이 부분을 체크한다.
    */
    baseUrl: _PATH_ROOT,

    /*
    paths:  path는 baseUrl 아래에서 직접적으로 찾을 수 없는 모듈명들을 위해 경로를 매핑해주는 속성이다.
    "/"로 시작하거나 "http" 등으로 시작하지 않으면, 기본적으로는 baseUrl에 상대적으로 설정하게 된다.
 
    paths: { "exam": "aaaa/bbbb" }
 
    의 형태로 설정한 뒤에, define에서 "exam/module" 로 불러오게 되면, 스크립트 태그에서는 실제로는 src="aaaa/bbbb/module.js" 로 잡을 것이다.
    path는 또한 아래와 같이 특정 라이브러리 경로 선언을 위해 사용될 수 있는데, path 매핑 코드는 자동적으로 .js 확장자를 붙여서 모듈명을 매핑한다.
    */

    //뒤에 js 확장자는 생략한다.
    paths: {
        // text : HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'text':                     _PATH.LIB + 'require/text',
        // 'jquery':                 _PATH.LIB + 'jquery/jquery',
        // 'jquery-ui':             _PATH.LIB + 'jquery/jquery-ui-1.10.2.min',

        //-----------------
        // Angular
        //-----------------
        'angular':                _PATH.ANGULAR + 'angular',
        'angular-animate':    _PATH.ANGULAR + 'angular-animate',
        // 'angular-aria':    _PATH.ANGULAR + 'angular-aria',
        // 'angular-cookies':    _PATH.ANGULAR + 'angular-cookies',
        // 'angular-loader':    _PATH.ANGULAR + 'angular-loader',
        'angular-messages':       _PATH.ANGULAR + 'angular-messages',
        // 'angular-mocks':    _PATH.ANGULAR + 'angular-mocks',
        // 'angular-resource':    _PATH.ANGULAR + 'angular-resource',
        'angular-route':       _PATH.ANGULAR + 'angular-route',
        // 'angular-sanitize':    _PATH.ANGULAR + 'angular-sanitize',
        // 'angular-scenario':    _PATH.ANGULAR + 'angular-scenario',
        //' angular-touch':    _PATH.ANGULAR + 'angular-touch',

        //-----------------
        // Angular Module
        //-----------------
        // 'angular-collection':       _PATH.LIB + 'angular/angular-collection',

        //-----------------
        // http://angular-ui.github.io/bootstrap/
        //-----------------
        'bootstrap':                _PATH.LIB + 'bootstrap-3.2.0/js/bootstrap',
        'ui-bootstrap':                _PATH.LIB + 'ui-bootstrap-tpls-0.11.2',
        // https://github.com/buberdds/angular-bootstrap-colorpicker
        'colorpicker.module':      _PATH.LIB + 'angular-bootstrap-colorpicker/bootstrap-colorpicker-module',

        //-----------------
        // 모듈
        //-----------------
        'ui.tree':                _PATH.LIB + 'tree/angular-ui-tree',
        'ui.slider':              _PATH.LIB + 'slider',
        'satellizer':              _PATH.LIB + 'auth/satellizer',

        // 모듈
        'dockModule':         _PATH.MODULE + 'dockModule',
        'alignModule':         _PATH.MODULE + 'alignModule',

        //-----------------
        // Framework
        //-----------------
        'PreInitialize':          _PATH.JS + 'PreInitialize',
        // 'Router':                 _PATH.JS + 'Router',
        // 'RouterService':      _PATH.SERVICE + 'RouterService',
        'Application':          _PATH.JS + 'Application',

        'U':                 _PATH.JS + 'U',
        
        'Space':                 _PATH.LIB + 'space/Space',
        'ScaleMode':                 _PATH.LIB + 'space/ScaleMode',
        'ExtendSpace':                 _PATH.LIB + 'space/ExtendSpace',

        'html2canvas':                 _PATH.LIB + 'dom2image/html2canvas'
        // 'Canvas2Image':                 _PATH.LIB + 'dom2image/canvas2image'
    },

    /*
    shim: AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
    참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
    */
    shim: {
        // 'jquery':{exports: 'jquery'},
        //'jquery-ui': {deps: ['jquery'] },
        'angular': { exports: 'angular' },
        'angular-animate': { deps: [ 'angular' ], exports: 'angular-animate' },
        // 'angular-aria': { deps: [ 'angular' ], exports: 'angular-aria' },
        // 'angular-cookies': { deps: [ 'angular' ], exports: 'angular-cookies' },
        // 'angular-loader': { deps: [ 'angular' ], exports: 'angular-loader' },
        'angular-messages': { deps: [ 'angular' ], exports: 'angular-messages' },
        // 'angular-mocks': { deps: [ 'angular' ], exports: 'angular-mocks' },
        // 'angular-resource': { deps: [ 'angular' ], exports: 'angular-resource' },
        'angular-route': { deps: [ 'angular' ], exports: 'angular-route' },
        // 'angular-sanitize': { deps: [ 'angular' ], exports: 'angular-sanitize' },
        // 'angular-scenario': { deps: [ 'angular' ], exports: 'angular-scenario' },
        //' angular-touch': { deps: [ 'angular' ], exports: 'angular-touch' },

        // 'angular-collection': { deps: [ 'angular' ]},

        'bootstrap': {
            // deps: [ 'jquery' ]
        },
        'ui-bootstrap': { deps: [ 'angular' ]},
        'ui.tree': { deps: [ 'angular' ]},
        'ui.slider':{ deps: [ 'angular' ]},
        'satellizer': { deps: [ 'angular' ], exports: 'satellizer' },
        'colorpicker.module': { deps: [ 'angular' ]},

        'dockModule': { deps: [ 'angular' ]},
        'alignModule': { deps: [ 'angular' ]},
        
        'Application': {
            deps: [ 
                'angular', 'angular-route', 'angular-animate', 'angular-messages', 
                'dockModule', 'alignModule', 
                'ui-bootstrap', 'ui.tree', 'ui.slider', 'colorpicker.module',
                'satellizer'
            ]
        },

        'Space':{
            // deps: [ 'jquery'],
            exports: 'Space'
        },
        'ScaleMode':{
            exports: 'ScaleMode'
        },
        'ExtendSpace':{
            // deps: [ 'jquery', 'Space', 'ScaleMode'],
            deps: [ 'Space', 'ScaleMode'],
            exports: 'ExtendSpace'
        },

        'html2canvas':{
            exports: 'html2canvas'
        }
        /*
        'Canvas2Image':{
            exports: 'Canvas2Image'
        }
        */
    }

    // config End
} );

////////////////////////////////////////////////////////////////////////////////
//
// requireJS를 활용하여 모듈 로드
//
////////////////////////////////////////////////////////////////////////////////

require(
    [
        'bootstrap',
        'angular',
        'Application'
    ],

    /*
    Uncaught Error: [jqLite:nosel] Looking up elements via selectors is not supported by jqLite! 
    See: 
    http://docs.angularjs.org/api/angular.element
    http://errors.angularjs.org/1.2.22/jqLite/nosel 
    */

    function( bootstrap, angular, Application ) {

        //-----------------------------------
        // Base URL
        //-----------------------------------

        //$('head').append($('<base href="' + window.location.pathname + '" />'));
        var head = document.getElementsByTagName( 'head' );
        var base = angular.element( '<base href="' + window.location.pathname + '"/>' );
        angular.element( head ).prepend( base );

        // <link rel="stylesheet" href="css/basic.css"/>
        // var basic_stylesheet = angular.element( '<link rel="stylesheet" href="css/basic.css"/>' );
        // angular.element( head ).append( basic_stylesheet );

        // var application_stylesheet = angular.element( '<link rel="stylesheet" href="css/application.css"/>' );
        // angular.element( head ).append( application_stylesheet );

        //-----------------------------------
        // angular.bootstrap(element, [modules], [config]);
        //-----------------------------------

        //이 부분은 위에 명시된 모든 디펜던시들이 다 로드된 뒤에 호출된다.
        //(주의) 디펜던시 로드 완료 시점이 페이지가 완전히 로드되기 전 일수도 있다.

        //페이지가 완전히 로드된 뒤에 실행
        angular.element( document ).ready( function() {

            angular.bootstrap( document, [ 'Application' ] );
            
        } );

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);