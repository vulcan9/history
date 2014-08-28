define(
    [ 'app', 'scripts/directives/app-color' ],
    function( app ) {

        app.controller( 'AboutViewController', _controller );

        function _controller( $scope, $route, $routeParams, $location, $rootScope ) {
            $scope.page = {
                heading: 'About Us~'
            };
        }


        // 컨트롤러 리턴
        return _controller;
    }
);