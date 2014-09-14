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
        function _controller( $scope, Loading, DataService ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'ToolController';

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

            ////////////////////////////////////////
            // 데이터 로드 서비스 호출 : Project - 문서 구조 관련 데이터
            ////////////////////////////////////////
            
            Loading.init (true);
            //Loading.value(null);
            //Loading.value(60);

            var projectID = _PATH.DATA + 'project.json';

            DataService(
                'GET', 
                projectID,

                function success(data){
                    DATA.project.id = projectID;
                    DATA.project.data = data;

                    alert('로드 완료');
                    Loading.complete();
                },

                function error(){

                    // preventDefault
                    //return false;
                    
                }
            );
            
            // 데이터 로드 서비스 호출 : Presentation - PT 관련 데이터


            // 데이터 로드 서비스 호출 : Document Info - 문서 부가 기능 관련 정보
            

            // 데이터 로드 서비스 호출 : Document content - 문서 내용
             
            // loadingbar를 전역 서비스로 만들어 API를 사용한다.
        }

        // 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);