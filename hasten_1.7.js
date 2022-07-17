//* 用于油有的脚本，可以加速网上培训、学习要求观看视频，而无法拖动滚动条的那种

(function(){
  var
    d=document, 
    k = d.querySelector('.cl-menubar'), 
    n=0, l;
  function setK( ){
    k.style.background = '#e33e33';
  }
  function mfoo( n, k ){
    var
      p = d.querySelector('iframe').contentDocument.querySelector('video').player,
      t = p.getCurrentTime(),
      z = p.getDuration(),
      //* 这里要重新获取a标签，因为点击后页面会刷新，原来的a对象不能使用了
      a = d.querySelectorAll('.cl-catalog-link'),
      len = a.length;
    a[n].timer = setInterval(function ( ){
      if(t>z+10){
        clearInterval(a[n].timer);
        if( n < len-1 ){
            setTimeout(function ( ){
               a[n+1].click();
               setTimeout(function ( ){k.click()},4e3);
            }, 2e3);
        }else{
          alert('<h1>恭喜你，已经完成！</h1>');
        }
        return;
      }
      p.seek(t++);
    },10);
  }
  function setN( ){
    let 
      em,
      //*
      //* a标签的获取需要优化，不要用要cl-catalog-link，而用item-no，
      //* 因为前者会获取全部，而后者只是获取还没完成的链接
      //*
      a = d.querySelectorAll('.cl-catalog-link'),
      i = 0,
      f = function(){
        n = this.index;
      };
    l = a.length;
    for( ; i<l; i++ ){
      em = a[i];
      em.index = i;
      em.onclick = f;
    }
  }
  k.onclick = function(){
    !n && (this.style.background = '#343434');
    setN();
    mfoo( n, k )
  };
})();
