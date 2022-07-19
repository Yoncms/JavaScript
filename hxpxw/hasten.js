var
  d = document,
  ls = -1,
  flag = 0,
  len = 0,
  cc,
  tfv = d.querySelector('#track_front_view'),
  k = d.querySelector('.cl-menubar'),
  n=0, a, l=0;
//* 生成cookie
function setCook( k, v ){
//* max-age的单位是秒
d.cookie = k + '=' + v + ';path=/;max-age=0';
d.cookie = k + '=' + v + ';path=/;max-age=60000';
}
//* 获取cookie
function getCook( k ){
var
  i = 0,
  len = 0,
  dck = d.cookie;
dck = dck.split(';');
len = dck.length;
for( ; i<len; i++ ){
   if( dck[i].indexOf(k)! = -1 ){
       dck = dck[i].split('=');
       return dck[1];
   }
}
}
//* 删除cookie
function deCook( k ){
  d.cookie = k + '=;path=/;max-age=0';
}
function f(){
  flag = 0;
}
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
          Html('>>>>OK，本讲已经完成！<<<<');
          var x = Number(getCook('cook')) + 1;
          setCook('cook', x );
          getCook('suc') == 100 && Html( '>>>>恭喜你，所以视频全部完成！<<<<');
          deCook('suc');
      }
      return;
  }
  p.seek(t++);
  },8);
}
//* 所有的视频全部完成
function allCompleted( ){
  clearInterval( timer );
  flag = 0;
  setCook('suc', 100 );
  var tm = d.querySelector('#track_map');
  sCss( tm, {fontSize:'40px',color:'yellow'} );
  tm.innerHTML = '<h1>>>>>>>OK！完成！<<<<<<</h1>';
}
function mulu( ){
  let lg = Number(getCook('cook'));
  console.log( 'continue>>>>', ls, lg );
  if( ls != lg && len!=0 ){
    console.log( '正在播放第：>>>>>>>', lg, '讲' );
    ls = lg;
    flag = 1;
    getCook('suc')!=0 && setCook('suc', 0 );
  }else if( ls == lg ){
    flag=0;
  }else{}
  if( len != 0 && getCook('cook')>=len ){
    allCompleted( );
    return;
  }
  if( flag ){
    cc[ls].click();
  }
}
function sCss( obj, Json ){
  var i=null;
  for( i in Json ){
    obj.style[i] = Json[i];
  } 
}
function Css( Json ){
  sCss( k, Json );
}
function Html( Content ){
  k.innerHTML = Content;
}
function setAL( ){
  var i = 0;
  a = d.querySelectorAll('.cl-catalog-link');
  l = a.length;
  f = function(){
    n = this.index;
  };
  for( ; i<l; i++ ){
    let em = a[i];
    em.index = i;
    em.onclick = f;
  }
}
function setN(){
  Css({color:'yellow',lineHeight:'50px',paddingLeft:'100px'});
  setAL();
  Html('>>>>本讲有 '+l+' 个视频，正在观看的是第 '+ (n+1) + ' / '+ l + ' 个！<<<<');
}
//* player
if( k ){
  setTimeout(function(){k && k.click()}, 3e2);
  k.style.background = '#e33e33';
  k.onclick = function(){
    !n && (this.style.background = '#343434');
    setN();
    mfoo( n )
  };
}
tfv.onclick = function(){
  cc = document.querySelectorAll('.goCourseByStudy');
  len = cc.length;
}
//* mulu
if( tfv ){
  setCook('cook',0);
  setTimeout(function(){tfv && tfv.click()}, 3e3 );
  for( let i=0; i<len; i++ ){
    let c = cc[i];
    c.index = i;
    c.onclick = f;
  }
  var timer = setInterval( mulu, 4e3);
}
