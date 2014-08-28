'use strict';

define( ['Application'], function(application) {

    application.directive( 'version', _directive );

    function _directive() {

        out( 'version' );
        return {
            restrict: 'EA',
            link: function( scope, el, attrs ) {
                el.text( "1.0.0" );
            }
        };

    }
    return _directive;


    /*
        //$compileProvider.directive.apply(null, directive);
        .directive('myCustomer', function() {
            return {
                template: 'Name: {{customer.name}} Address: {{customer.address}}'
            };
        });
*/

} );