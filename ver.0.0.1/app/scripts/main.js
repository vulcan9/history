if(typeof console === 'undefined' || typeof console.log === 'undefined'){
    var console = {
        log: function(){}
    };
}

var out = window.out || function (){
    if(!arguments || arguments.length < 1) return;

    if(window.out && window.out.$log){
        window.out.$log.info.apply(window.out.$log, arguments);
    }else{
        console.log.apply(window.console, arguments);
    }
}

var _PATH_ROOT = '/history/ver.0.0.1/app/';

require.config( {
    baseUrl: _PATH_ROOT,
    paths: {
        'angular': _PATH_ROOT + 'lib/angular/angular.1.2.23',
        'angular-route': _PATH_ROOT + 'lib/angular/angular-route.1.2.24',

        'app': _PATH_ROOT + 'scripts/app',
    },
    shim: {
        'app': {
            deps: [ 'angular', 'angular-route' ]
        },
        'angular-route': {
            deps: [ 'angular' ]
        }
    }
} );

require(
    [
        'app'
    ],
    function( application ) {

        var head = document.getElementsByTagName( 'head' );
        var base = angular.element( '<base href="' + window.location.pathname + '" />' );
        angular.element( head ).append( base );


        angular.element( document ).ready( function() {
            angular.bootstrap( document, [ 'application' ] );
        } );
    }
);