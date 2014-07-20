
//===============================================================
// CORE
//===============================================================

(function ( document, window ) {

    function ext(rootID) {

        // root element ID
        rootID = rootID || "core";
        console.log(rootID);
        // DOM root
        this.root = byId(rootID);
        console.log(this.root);
    }

    ext.prototype = {
        
        init : function () {
            console.log("dddd : ", this.root);
            
            // TODO : canvas를 준비한다.


            // TODO : 최초 svg document를 세팅한다.



            // TODO : 윈도우 리사이징으로 테스트 해본다.















        }

    };

    //-------------------------
    // API 리턴
    //-------------------------

    // 이미 초기화된 root가 있으면 바로 API를 리턴한다.
    window.ext = function (rootID) {

        var instance = new ext(rootID);
        API = {
            init: factory(instance.init),
            //goto: factory(instance.goto),
            //next: factory(instance.next),
            //prev: factory(instance.prev)
        };

        function factory(func) {
            return function () {
                func.apply(instance, arguments)
            }
        }

        return API;
    };

})(document, window);



//===============================================================
// 윈도우 리사이징
//===============================================================

// TODO : scale factor 계산하기

// TODO : HASH

// TODO : Transition 기능


//===============================================================
// HELPER
//===============================================================

//-------------------------
// DOM
//-------------------------

// id로 element 찾기
function byId(id) {
    return document.getElementById(id);
};







































