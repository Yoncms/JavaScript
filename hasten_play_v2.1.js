// ==UserScript==
// @name         Hxpxw_player
// @namespace    Yoncms/Hxpxw
// @version      2.1
// @description  突破视频观看速度以及进度条无法拖动的限制，极速完成观看任务！
// @author       Yoncms
// @match        http://pt.hxpxw.net/els/html/courseStudyItem/courseStudyItem.learn.do*
// @icon
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
(function(){

	//*就是2.1版的源代码

	var
    d=document,
    k = d.querySelector('.cl-menubar'),
    n=0, a, l;
  k.style.background = '#e33e33';
	//* 这里必须有延时，否则获取不到对象
  setTimeout(function(){k.click()},3e3);
  function mfoo( n ){
    var
      p = d.querySelector('iframe').contentDocument.querySelector('video').player,
      t = p.getCurrentTime(),
      z = p.getDuration();
    a[n].timer = setInterval(function(){
      if(t>z+10){
        clearInterval(a[n].timer);
        if( n < l-1 ){
          setTimeout(function(){
             a[n+1].click();
             setTimeout(function(){k.click()},4e3);
          }, 1e3);
        }else{
            Css({color:'red'});
            Html('>>>>恭喜你，已经完成！<<<<');
            var x = Number(localStorage.getItem('abc'))+1;
            localStorage.setItem('abc', x );
            if( localStorage.getItem('suc') == 100 ){
                alert( '全部完成');
            }
        }
        return;
      }
      p.seek(t++);
    },8);
  }
  function Css( Json ){
    var i=null;
    for( i in Json ){
      k.style[i] = Json[i];
    }
  }
  function Html( Content ){
    k.innerHTML = Content;
  }
  function setN(){
    let
      //*
      //* a标签的获取需要优化，不要用要cl-catalog-link，而用item-no，
      //* 因为前者会获取全部，而后者只是获取还没完成的链接
      //*
      i = 0,
      f = function(){
        n = this.index;
      };
    a = d.querySelectorAll('.cl-catalog-link');
    l = a.length;
    Css({color:'yellow',lineHeight:'50px',paddingLeft:'100px'});
    Html('>>>>你有【'+(l-n)+'】个视频未完成观看！');
    for( ; i<l; i++ ){
      let em = a[i];
      em.index = i;
      em.onclick = f;
    }
  }
  k.onclick = function(){
    !n && (this.style.background = '#343434');
    setN();
    mfoo( n )
  };
})();

})();
