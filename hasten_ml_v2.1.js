// ==UserScript==
// @name         Hxpx_mulu
// @namespace    Yoncms/Hxpxw
// @version      2.1
// @description  突破视频观看速度以及进度条无法拖动的限制，极速完成观看任务！
// @author       Yoncms
// @match        http://pt.hxpxw.net/els/html/learnroadmap/learnroadmap.viewRoadMapDetail.do*
// @icon         
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

		//* 就是2.1版的源代码

    //http://pt.hxpxw.net/els/html/learnroadmap/learnroadmap.viewRoadMapDetail.do?roadMapId=869e73be5c244e3fa47524f79503f4ff&projectId=8e521e6b45fd4949b8ba1c27f2639296
    var
        ls = -1,
        flag = 0,
        len = 0,
        cc,
        tfv = document.querySelector('#track_front_view');
    function f(){
        flag = 0;
    }
    tfv.onclick = function(){
        cc = document.querySelectorAll('.goCourseByStudy');
        len = cc.length;
    }
    localStorage.setItem('abc',0);
		//* 这里必须有延时，否则获取不到对象
    setTimeout(function(){tfv.click()},3e3);
    for( let i=0; i<len; i++ ){
        let c = cc[i];
        c.index = i;
        c.onclick = f;
    }
    var timer = setInterval( function ( ){
        let lg = Number(localStorage.getItem('abc'));
        if( ls != lg && len!=0 ){
            console.log( '正在播放第：>>>>>>>', lg, '讲' );
            ls = lg;
            flag = 1;
            localStorage.getItem('suc')!=0 && localStorage.setItem('suc', 0 );
        }else if( ls == lg ){
            flag=0;
            console.log('......');
        }else{}
        if( len != 0 && localStorage.getItem('abc')>=len ){
            localStorage.setItem('suc', 100 );
            document.querySelector('#track_map').innerHTML = '<h1 style="font-size:40px;color:yellow">>>>>>>OK！完成！<<<<<<</h1>';
            return clearInterval( timer );
        }
        if( flag ){
            cc[ls].click();
        }
    }, 4000 );
})();
