/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 프로젝트 불러오기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.service( 'OpenCommand', _service );

        // 선언
        function _service(Command, DataService, Project, ProgressService) {

            out( 'Command 등록 : OpenCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function OpenCommand() {

                _superClass.apply(this, arguments);
                out( '# OpenCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( OpenCommand.prototype,  _super, {

                /*
                param = {
                    scope : $scope, 
                    element : $element, 
                    attrs : $attrs,
                    ...............
                }
                */
               
                execute : function ( param, successCallback, errorCallback ) {

                    _super.execute.apply(this, arguments);

                    // ProgressService.init (true);
                    //ProgressService.init(null);
                    //ProgressService.update(60);
                    
                    _super.execute.apply(this, arguments);

                    // Override
                    out( '# OpenCommand Execute' );

                    // var DATA  = new Project();
                    // Project.current = DATA;

                    ////////////////////////////////////////
                    // 데이터 로드 서비스 호출 : Project - 문서 구조 관련 데이터
                    ////////////////////////////////////////
                    
                    out ('TODO : project 데이터 로드 경로(아이디) 세팅 : project.json');

                    var projectUID = 'project-b16fea9c-d10a-413b-ba20-08344f937336';
                    var projectURL = _PATH.ROOT + 'data/' + projectUID + '.json';

                    DataService(
                        {
                            method : 'GET', 
                            url : projectURL
                        },

                        function success(data){

                            out ('# Project 로드 완료 : ', data);
                            // ProgressService.complete();
                            
                            out('TODO : // CloseCommand 실행');

                            // 데이터 변경
                            Project.current.project('TREE', data);

                            // Controller 메서드 직접 호출 방법
                            // var treeController = U.getController('.treeContainer', 'tree');
                            // treeController.updateTree();

                            // scope에 직접 접근 방법
                            // var $scope = param.scope;
                            // $scope.tree = Project.current.project('TREE');
                        },

                        function error(){

                            Project.current.project('TREE', null);

                            // preventDefault
                            //return false;
                            
                            out ('# 로드 에러 : ', projectUID, '\n-url : ', projectURL);
                            // ProgressService.complete();
                        }
                    );

                    // 데이터 로드 서비스 호출 : Presentation - PT 관련 데이터


                    // 데이터 로드 서비스 호출 : Document Info - 문서 부가 기능 관련 정보
                    

                    // 데이터 로드 서비스 호출 : Document content - 문서 내용

























                    // END Execute
                }
            });







            // 서비스 객체 리턴
            return OpenCommand;
        }

        // 리턴
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
