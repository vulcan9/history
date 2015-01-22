/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Tool : HI-STORY (https://github.com/vulcan9/history)
    * Description : 새 프로젝트 작성하기

////////////////////////////////////////////////////////////////////////////////*/

'use strict';


define( [], function() {



        // 선언
        function _service(Command, Project, $q, ProcessService) {

            out( 'Command 등록 : NewCommand' );

            /////////////////////////////////////
            // 생성자
            /////////////////////////////////////

            var _superClass = Command;
            var _super = _superClass.prototype;

            function NewCommand() {

                _superClass.apply(this, arguments);
                out( '# NewCommand : ', this);

            }

            /////////////////////////////////////
            // Prototype 상속
            /////////////////////////////////////

            angular.extend( NewCommand.prototype,  _super, {
                
                _run : function ( param ) {

                    // Override
                    out( '# NewCommand Execute' );

                    //-----------------------
                    // Project 데이터 세팅
                    //-----------------------

                    /*
                    var process = ProcessService.process();
                    process.start();
                    
                    process.add($q.defer(), angular.bind(this, function(d){
                        Tool.current.newProject();
                        d.resolve();
                    }));

                    process.add($q.defer(), angular.bind(this, function(d){
                        // 편집 결과를 저장한 데이이터
                        Project.current = new Project();
                        Project.current.newProject();
                        d.resolve();
                    }));

                    process.end().then(angular.bind(this, function(){
                        // 결과 리턴
                        _super._run.apply(this, arguments);
                    }));
                    
                    /*/
                    
                    Tool.current.newProject(
                        angular.bind(this, function(){

                            // 편집 결과를 저장한 데이이터
                            Project.current = new Project();
                            Project.current.newProject(param);

                            // 결과 리턴
                            _super._run.apply(this, arguments);

                        })
                    );

                    //*/

                    // END Execute
                }
            });

            // 서비스 객체 리턴
            return NewCommand;
        }

        // 리턴
        _service._regist = function(application){
            // 등록
            application.service( 'NewCommand', _service );
        }
        return _service;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
