/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Route  정의
    *     

////////////////////////////////////////////////////////////////////////////////*/
'use strict';
define([
    
    // DIRECTIVE
    _PATH.DIRECTIVE + 'version',
    
    // SERVICE
    _PATH.SERVICE + 'NoticeService',
    _PATH.SERVICE + 'TalkService',
    _PATH.SERVICE + 'VersionService',
    _PATH.SERVICE + 'ProgressService',
    _PATH.SERVICE + 'SessionService',
    _PATH.SERVICE + 'HttpService',
    
    // auth
    _PATH.DIRECTIVE + 'auth/passwordStrength',
    _PATH.DIRECTIVE + 'auth/passwordMatch',

    // 가장 마지막에 로드
    _PATH.CONTROLLER + 'ApplicationController'

], function(
    version, 
    NoticeService, TalkService, VersionService, ProgressService, SessionService, HttpService, 
    passwordStrength, passwordMatch,
    ApplicationController
    ) {

    // ApplicationController에서 사용하는 Service는 여기에서 등록한다.
    function PreInitialize(application) {
        
        regist(application, version);
        
        regist(application, NoticeService);
        regist(application, TalkService);
        regist(application, VersionService);
        regist(application, ProgressService);
        regist(application, SessionService);
        regist(application, HttpService);
        
        // auth
        regist(application, passwordStrength);
        regist(application, passwordMatch);

        // 가장 마지막에 등록
        regist(application, ApplicationController);
    }

    function regist(application, provider) {
        provider._regist(application);
    }
    
    return PreInitialize;
    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});