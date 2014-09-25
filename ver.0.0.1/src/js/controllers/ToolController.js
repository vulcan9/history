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
        function _controller( $scope, ProgressService, DataService, $rootElement, $rootScope, $timeout ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);
            
            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'ToolController';

            // tool 동작에 필요한 데이터 기록
            $scope.TOOL = {};
            // 편집 결과를 저장한 데이이터
            $scope.DATA = {};

            ////////////////////////////////////////
            // 데이터 로드 서비스 호출 : Project - 문서 구조 관련 데이터
            ////////////////////////////////////////
            
            // 데이터 구조 생성
            
            var DATA = {

                // project
                project:{
                    id: '',
                    data:null
                },

                // presentation
                presentation: null,

                // documents
                documents: {
                    info: null,
                    contents: null
                }

            };

            // controller간 통신 방법
            // http://programmingsummaries.tistory.com/124

            ProgressService.init (true);
            //ProgressService.init(null);
            //ProgressService.update(60);
            
            out ('TODO : project 데이터 로드 세팅 : project.json');
            var projectID = _PATH.DATA + 'project.json';

            DataService(
                {
                    method : 'GET', 
                    url : projectID
                },

                function success(data){
                    DATA.project.id = projectID;
                    DATA.project.data = data;

                    //alert ('# 로드 완료 : ', projectID);
                    // ProgressService.complete();
                },

                function error(){

                    // preventDefault
                    //return false;
                    
                    out ('# 로드 에러 : ', projectID);
                    ProgressService.complete();
                }
            );
            
            // 데이터 로드 서비스 호출 : Presentation - PT 관련 데이터


            // 데이터 로드 서비스 호출 : Document Info - 문서 부가 기능 관련 정보
            

            // 데이터 로드 서비스 호출 : Document content - 문서 내용
            
        }

        // 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);