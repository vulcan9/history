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
    _PATH.DIRECTIVE + 'version.js',
    
    // SERVICE
    _PATH.SERVICE + 'NoticeService.js',
    _PATH.SERVICE + 'TalkService.js',
    _PATH.SERVICE + 'VersionService.js',
    _PATH.SERVICE + 'ProgressService.js',
    _PATH.SERVICE + 'AuthService.js',
    _PATH.SERVICE + 'HttpService.js',
    
    // auth
    _PATH.DIRECTIVE + 'auth/passwordStrength.js',
    _PATH.DIRECTIVE + 'auth/passwordMatch.js',

    // 가장 마지막에 로드
    _PATH.CONTROLLER + 'ApplicationController.js'

], function(
    version, 
    NoticeService, TalkService, VersionService, ProgressService, AuthService, HttpService, 
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
        regist(application, AuthService);
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