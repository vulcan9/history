/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.controller( 'ToolController', _controller );

        // 선언
        function _controller( $scope, ProgressService, DataService, $rootElement, $rootScope, $timeout, Project ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);
            
            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css' ,
                _PATH.CSS + 'application.css',
                _PATH.CSS + 'space.css' 
            ] );

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            var DATA  = new Project();
            Project.current = DATA;

            // controller간 통신 방법
            // http://programmingsummaries.tistory.com/124

            ProgressService.init (true);
            //ProgressService.init(null);
            //ProgressService.update(60);
            
            ////////////////////////////////////////
            // 데이터 로드 서비스 호출 : Project - 문서 구조 관련 데이터
            ////////////////////////////////////////
            
            out ('TODO : project 데이터 로드 세팅 : project.json');

            var projectUID = 'project-b16fea9c-d10a-413b-ba20-08344f937336';
            var projectURL = _PATH.ROOT + 'data/' + projectUID + '.json';

            DataService(
                {
                    method : 'GET', 
                    url : projectURL
                },

                function success(data){

                    DATA.setProject(data);

                    out ('# Project 로드 완료 : ', data);
                    // ProgressService.complete();
                    
                    // 갱신
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.project = Project.current.getProject();
                            out('project callLater', $scope);
                        });
                    }, 0);
                },

                function error(){

                    DATA._setProject(null);

                    // preventDefault
                    //return false;
                    
                    out ('# 로드 에러 : ', projectUID, '\n-url : ', projectURL);
                    // ProgressService.complete();
                }
            );
            
            // 데이터 로드 서비스 호출 : Presentation - PT 관련 데이터


            // 데이터 로드 서비스 호출 : Document Info - 문서 부가 기능 관련 정보
            

            // 데이터 로드 서비스 호출 : Document content - 문서 내용
            

            ////////////////////////////////////////
            // 메뉴 설정 데이터 로드
            ////////////////////////////////////////
            
            var menuURL = _PATH.ROOT + 'data/menu.json';
            DataService(
                {
                    method : 'GET', 
                    url : menuURL
                },

                function success(data){

                    DATA.setTool({ menu: data });

                    out ('# Menu 로드 완료 : ', data);
                    // ProgressService.complete();
                    
                    // 갱신
                    $timeout(function() {
                        $scope.$apply(function(){
                            $scope.menu = Project.current.TOOL.menu;
                            out('menu callLater', $scope);
                        });
                    }, 0);
                },

                function error(){

                    DATA.setTool({ menu: null });

                    // preventDefault
                    //return false;
                    
                    out ('# Menu 로드 에러 : ', menuURL);
                    // ProgressService.complete();
                }
            );
            


            function callLater(){

            }








        }

        // 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);