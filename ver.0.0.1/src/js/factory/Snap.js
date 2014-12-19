/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 가로/세로/Scale 등의 연산 처리

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.factory( 'Snap', _factory );

        // 선언
        function _factory( ) {

            ////////////////////////////////////////
            // 생성자
            ////////////////////////////////////////

            /*
            // 사용 방법

            //--------------------
            // Snap 체크
            //--------------------
            
            var changed_x = false;
            if(this.direction == 'both' || this.direction == 'x'){
                // var newX = x + distX;
                var snapX = this.snap.snapToPixel(x, distX);
                changed_x = (snapX != x);
                x = snapX;
            }
        
            */

            function Snap(){
                this.sensitive = 1;
                this.scale = 1;
            }

            ////////////////////////////////////////
            // Prototype
            ////////////////////////////////////////

            Snap.prototype = {

                update: function(propertyName, value){
                    if(propertyName in this){
                        this[propertyName] = value;
                    }

                    this.unit = this.sensitive * this.scale;
                },

                //-----------------------
                // pixel 에 맞춤
                //-----------------------

                // sensitive : snap 격자 간격 (Pixel 단위)
                snapToPixel: function  (pos, dist){
                    
                    if(this.unit == 0) return pos;

                    //if(Math.abs(dist) >= this.unit){
                        pos = pos + dist;
                    //}

                    var newPos = this.unit * Math.round(pos / this.unit);
                    return newPos;
                }

                ////////////////////////////////
                // Prototype END
                ////////////////////////////////
            };

            ////////////////////////////////////////
            // END
            ////////////////////////////////////////

            // 서비스 객체 리턴
            return Snap;
        }

        // 리턴
        return _factory;
    }
);
