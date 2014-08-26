'use strict';

define([], function () {

    
    return ['version', function () {
        
        out('version');
        return {
            restrict: 'EA',
            link: function (scope, el, attrs) {
               el.text("1.0.0");
            }
        };

    }];
    
   
        /*
        //$compileProvider.directive.apply(null, directive);
        .directive('myCustomer', function() {
            return {
                template: 'Name: {{customer.name}} Address: {{customer.address}}'
            };
        });
*/

});
