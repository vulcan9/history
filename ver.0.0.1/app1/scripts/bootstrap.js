require.config({
    baseUrl: './scripts',
    paths: {
		'angular': '../lib/angular/angular.1.2.23',
		'angular-route': '../lib/angular/angular-route.1.2.24',
		'bootstrap': '../lib/bootstrap/js/bootstrap.min',
		'jquery': '../lib/jquery/jquery'
    },
	shim: {
		'app': {
			deps: ['angular', 'angular-route', 'bootstrap']
		},
		'angular-route': {
			deps: ['angular']
		},
		'bootstrap': {
			deps: ['jquery']
		}
	}
});

require
(
    [
        'app'
    ],
    function(app)
    {
        angular.bootstrap(document, ['app']);
    }
);