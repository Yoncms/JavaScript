//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//-+------------------------------------------
//-+------------------------------------------
//-+------------------------------------------
// | 模拟JQuery库
//-+------------------------------------------
//-+------------------------------------------
//-+------------------------------------------
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
(function ( arg, foo ){

  foo( arg );

})(window?window:this, function( Win, undefined ){
  //
  //-+-----------------------------------------------------+-
  // | 在javascript里一切皆为对象，所以$要理解成是一个     |
  // | 变量也是一个对象，是变量就可以赋值，这里的值是      |
  // | 一个匿名函数，而是对象就可以添加成员（属性或方法）  |
  //-+-----------------------------------------------------+-
  //
  var
    $=function ( args ){
      //
      //-+---------------------------------------------------+-
      // |就是在这里创建实例化对象，$.fn.init就是构造函数；  |
      // |函数返回的是一个对象，这里不能直接new $()，因为这样|
      // |就死循环了                                         |
      //-+---------------------------------------------------+-
      //
      return new $.fn.init( args );
  };
  //
  //-+------------------------------------------------------+-
  // |这里本来应该是$.prototype，但是在前面在写上$.fn，这里 |
  // |的$就要看成是一个对象，fn是$对象里的一个属性，这写法  |
  // |比较简化（为了简写），后续的$.prototype就可以写成$.fn;|
  //-+------------------------------------------------------+-
  //
  $.fn = $.prototype = {
    //init才是真正的构造函数
    init: function( args ){
      var tp = typeof args;
      this.elem = null;
      if( tp == 'function' ){
        $.DomLoad( args );
      }else if( tp == 'string' )
        this.elem = $.getElem( args );
      else if( tp == 'object' )
        this.elem = args;
      else
        this.elem = undefined;
      //
      //-+------------------------------------------------------+-
      // |把eleme赋给this，以后this就是elem（要操作的元素集合），
      // |没有必要再用一个属性来赋值
      //-+------------------------------------------------------+-
      //
      this.toThis( );
      return this;
    }
  };
  //
  //-+-------------------------------------------------------+-
  // |整个库真正的构造函数是init，而添加属性或方法都是要往   |
  // |原型里加，但是jquery里真正添加的时候，是往$.fn里加，   |
  // |所以就要把$.fn对象整个赋给init原型，这样添加到$.fn对象 |
  // |里的方法才能绑定到init原型上，进而通过init对象才能调用 |
  // |$.fn对象里的方法；至于是$.prototype还是$.fn，都是可以  |
  // |的，因为在前面已经有了$.fn = $.prototype               |
  //-+-------------------------------------------------------+-
  //  $.fn.init.prototype = $.prototype;
  $.fn.init.prototype = $.fn;
  //以上两句代码的作用是一样的
  //
  //-+---------------------------------------------------------+-
  // |下面的$.extend的$同样要看成是一个对象，而extend是对象里  |
  // |的方法，$.fn对象里同样有一个extend的方法；因为$并不是    |
  // |一个实例化对象，所以添加到$的方法只是静态方法，只能被$调 |
  // |用；而$.fn是添加到init构造函数的原型的对象，所以添加到   |
  // |$.fn对象里的方法是实例化方法，只能被实例化对象所调用，主 |
  // |要是被文档里的元素对象调用，也就是用来操作元素的         |
  //-+---------------------------------------------------------+-
  //
  $.ext = $.fn.ext = function(  ){
    //
    //-+----------------------------------------------+-
    // |$.extend里，调用extend的是$，所以this就是$     |
    // |$.fn.extend里，调用extend的是$.fn，也就是      |
    // |添加到init构造函数里的方法，所以this就是实     |
    // |例化对象                                       |
    //-+----------------------------------------------+-
    //
    var obj = this,
        args = arguments[0] || {},
        i=null;
    for( i in args ) {
      //
      // 如果方法已经存在就不再添加
      //
      if( !obj[i] )
        obj[i] = args[i];
    }
    return obj;
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //添加静态方法
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  $.ext({

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //ajax++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    AJAX : {
      XXX : (function ( ) {
        //兼容不同的浏览器，创建XHR对象
        if( Win.ActiveXObject )
          return new ActiveXObject( 'MicroSoft.XMLHTTP' );
        return new XMLHttpRequest()
      })(),
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      RequestHead : function ( ) {
        var
          CT = 'Content-type';
          APP = 'application/x-www-form-urlencoded';
        //图片的话用：multipart/form-data；
        this.XXX.setRequestHeader( CT, APP );
        return;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //formId参数是form的id值
      openSend : function ( Url, formId ) {
        var
          xhr = this.XXX,
          Data = $.formData( formId );
        xhr.open( 'POST', Url, false );
        if( Data )
          this.RequestHead();
        xhr.send( Data );
        return;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      changeState : function ( fn ){
        var xhr = this.XXX;
        xhr.onreadystatechange=function(){
          if( this.readyState == 4 && this.status == 200 ){
            //没有参数，返回空数据
            if( !fn )
              return;
            //有数据并且是函数
            else if( typeof fn == 'function' )
              //函数的this就是这里的responseText
              fn.call( this.responseText );
            //不是函数
            else
              $.getElem(fn)[0].innerHTML = this.responseText;
          }
        };
        return;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      ajax : function ( Url, formId, fn ){
        this.changeState( fn );
        this.openSend( Url, formId );
        return ;
      }
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++数组求和++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    arrSum : function ( arr ) {
      if( arr == [] ) return 0;
      var
        sum = 0;
        i = null;
      //这里不用for循环，如果用for循环，要是arr
      //的键不是连续的，或者第一个是空，就会报错
      for( i in arr )
        sum = sum + arr[i];
      return sum;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++一个对象同时绑定含计时器的开始和停止运动的事件++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    bindEvent : function ( obj, json ) {
      var
        //开启运动
        startEv = json.startEv,
        //延时
        delay = json.delay,
        //停止运动
        stopEv = json.stopEv,
        //运动的方法
        fn = json.fn;
      obj.timer = null;
      //开始运动
      obj.timer = this.setinterval( obj, fn, delay );
      //停止运动
      this.oEvent.addEv( obj, stopEv, function (){
        $.clearTimer( this.timer );
      });
      //再打开运动
      this.oEvent.addEv( obj, startEv, function (){
        $.clearTimer( this.timer );
        this.timer = $.setinterval( this, fn, delay );
      });
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //获取浏览器信息+++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    browserInfo : function(){
      return navigator.userAgent;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++变速运动++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    changeMove : function ( json ) {
      //速度默认是1/8
      step = json.step || 8;
      var
        obj = json.obj,
        attr = json.attr,
        End = json.End,
        SV = this.Sport.styleValue( obj, attr ),
        sp = ( End - SV ) / step,
        Step = sp > 0 ? Math.ceil( sp ) : Math.float( sp );
      this.Sport.run({
        'obj' : obj,
        'attr': attr,
        'step': Step
      });
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++专门用来清除计时器++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    clearTimer : function ( obj, flag ) {
      if( !flag )
        clearInterval( obj );
      else{
        var i=null;
        for( i in obj )
          clearInterval( obj[i] );
      }
      return ;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Css : function ( obj, json ) {
      var i=null;
      for( i in json )
        obj.style[i] = json[i];
    },
		Bgd: function ( obj, clr ) {
			this.Css( obj, {background:clr} );
		},
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    DCM : document,
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Display : function ( obj, flag ) {
      this.Css( obj, { display:flag } );
      return;
    },
		show: function ( obj ) {
			this.Display( obj, 'block' );
		},
		hide: function ( obj	 ) {
			this.Display( obj, 'none' );
		},
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Disable : function ( obj, flag ) {
      if( flag )
        obj.disabled = 'disabled';
      else
        obj.removeAttribute( 'disabled' );
      return ;
    },
    //DOM加载
    DomLoad : function( args ){
      var
        n = 0,
        timer = null;
      timer = setInterval( function (){
        if( n == 1 ) {
          clearInterval( timer );
          return;
        }
        if( /loaded|complete/.test( document.readyState ) ){
          args();
          n = 1;
        }
      }, 1 );
    },

    //
    //+++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++弹性运动++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++
    //
    elastic : {
      //速度
      Sp : 0,
      //属性值
      Sv : 0,
      move : function ( json ){
        var
          obj = json.obj,
          attr = json.attr,
          End = json.End;
        this.Sv = $.Sport.styleValue( obj, attr );
        //速度先快后慢，End-Sv先正后负
        this.Sp += ( End-this.Sv ) / 5;
        //为了最后能停下来，速度要乘以一个0-1之间的系数
        this.Sp *= 7/10;
        this.Sv += this.Sp;
        if( Math.abs( this.Sp ) < 1 && Math.abs( End-this.Sv ) < 1 ){
          $.clearTimer( obj.timer );
          obj.style[attr] = End + 'px';
        }else
          obj.style[attr] = this.Sv + 'px';
      }
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //只获取集合里的一个元素++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    findOnly: function ( arg, n ) {
      var
        tpf = typeof arg,
        elems = null;
      if( tpf == 'object' )
        return arg;
      elems = this.getElem( arg )
      //默认是获取第一个元素
      n = n ? n : 0;
      return elems[n] ? elems[n] : null;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++获取获得焦点的标签+++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    focusTag : function ( obj ) {
      var
        obj = this.DCM.activeElement.tagName;
      return obj ? obj : false;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+本方法是为了避免button等非输入框标签参与拼接post字符串+
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    inputIsBtn : function ( formObj, obj ) {
      var
        obj = [],
        tpf = '',
        i=0,
        lng = formObj.length;
      for( ; i<lng; i++ ) {
        //如果是注册会有密码确认
        if( formObj[i].name == 'prePsw' )
          continue;
        tpf = formObj[i].type;
        if( tpf != 'button'&& tpf != 'undefined')
          obj[i] = formObj[i];
      }
      return obj;
    },
    //* ajax根据传递来的Id进行不同的操作
    idType : function ( Id ) {
      var
        obj = null,
        elems = null;
        tpf = typeof Id;
      //* id是布尔型
      if( tpf == 'boolean' )
        return false;
      //* id直接就是对象的，返回父标签，也就是form
      if( tpf == 'object' )
        obj =  Id.parentNode;
      //* id是字符串的
      if( tpf == 'string' ){
        //* 如果字符串里有等号，直接就是post语句
        if( Id.indexOf('=') )
          return Id;
        //* 是节点的id属性
        obj = this.Yoncms.ById( Id );
        if( !obj )
          return Id;
        obj =  obj[0];
      }
      //* 获取form标签里的子节点，就是input标签
      elems = this.Yoncms.ByClass( 'mInput', obj )||this.Yoncms.ByTagName( 'input', obj );
      //* 去掉按键标签
      return this.inputIsBtn( elems );
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++form表单序列+++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    formData : function ( Id ) {
      if( !Id ) return ;
      var
        dataStr = '',
        inpt = null,
        connector = '&',
        iv = null,
        i = 0,
        lng = 0,
        idForm = this.idType( Id );
      if( !idForm )
        return ;
      if( typeof idForm == 'string' )
        return Id;
      //* 获取form表单里的input标签
      //* 去掉空元素
      //* idForm = $.removeSpace( idForm );
      lng = idForm.length;
      for( ; i<lng; i++ ){
        inpt = idForm[i];
        if( i >= lng-1 )
          connector = '';
        iv = null;
        /**
        *使用了ckeditor，获取ck的值是CKEDITOR.instances[iv].getData()；
        *如果CKEDITOR.instances[ckId]，就是ck编辑器的内容
        */
        iv = inpt['id'];
        if( typeof CKEDITOR != 'undefined' && CKEDITOR.instances[iv] )
          iv = CKEDITOR.instances[iv].getData();
        else
          iv = inpt.value;
        //拼接POST语句
        dataStr += inpt.name + '=' + iv + connector;
      }
      return dataStr;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++获取元素++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    getElem : function( args ){
      if( !args )
        return;
      var elem,
          Dcm = this.DCM;
      if( Dcm.querySelector )
        elem = Dcm.querySelectorAll( args );
      //兼容不支持querySelector的浏览器
      else
        elem = this.Yoncms.Query( args );
      if( !!elem[0] )
        return elem;
      return [];
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+获取某元素的innerHTML++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    getHtml : function ( arg, n ) {
      return this.findOnly( arg, n ).innerHTML;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++往返运动+++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    goBack : function ( json ){
      var
        //属性
        attr = json.attr,
        //对象
        obj = json.obj,
        //目标
        tar = json.get,
        //速度
        step = json.step,
        //对象要改变的属性值
        SV = this.Sport.styleValue( obj, attr )
        if( SV >= tar )
          //达到目标就往回走
          obj.step = -step;
        if( SV <= 0 )
          obj.step = step;
      this.Sport.run({
        'obj': obj,
        'attr': attr,
        'step': obj.step
      });
      //如果目标和值的差小于速度时，则不会刚好在目标上，
      //那就直接跳到目标的位置
      if( Math.abs( SV-tar )<step )
        obj.style[atte] = tar + 'px';
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++隐藏元素+++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Hide : function ( obj ) {
      this.Css( obj, { 'display': 'none' } );
      return ;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++隐藏元素+++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Html : function ( obj, contents ) {
      obj.innerHTML = contents;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++元素是否在对象里+++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    inObj:function( elem, obj ){
      var i=null;
      for( i in obj ) {
        if( obj[i] == elem )
          return true;
      }
      return false;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++文档是否获取焦点++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    isFocus : function ( ) {
      if( this.DCM.hasFocus() )
        return true;
      return false;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++判断浏览器是否全屏+++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    isFull : function (){
      if( window.outerHeight === screen.availHeight ){
        if( window.outerWidth === screen.availWidth ){
          //全屏
          return true;
        }
      }
      //不全屏
      return false;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++获取下一个节点++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    nextEm : function ( obj, n ) {
      if( !obj ) return;
      n = !!n ? n : 1;
      var
        i = 0;
      for( ; i<n; i++ )
        //* 查找兄弟节点的属性里，有或没有Element的
        //* 区别在于，有Element的属性，不包含文字节点
        obj = obj.nextElementSibling;
      return obj;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++添加事件++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    oEvent : {
      ID : 0,
      addEv : function( obj, eType, fn ){
        if( !obj.elem )
          obj.elem = {};
        if( !obj.elem[eType] )
          obj.elem[eType] = [];
        var Oee = obj.elem[eType];
				if( Oee[0] == undefined )
					Oee[0] = fn;
        if( !$.inObj( fn, Oee ) )
          Oee[this.ID++] = fn;
        var This = this;
        //绑定事件函数
        obj['on'+eType] = function( e ){
          var Ev = Win.event || e;
          This.execFoo.call( obj, Ev );
        };
        return false;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++执行事件++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      execFoo : function ( e ) {
        var
          eType = e.type,
          oElem = this.elem[eType],
          k = null;
        for( k in oElem )
          oElem[k].call( this );
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++删除事件函数+++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      delFoo : function ( obj, eType ){
        var
          oElem = obj.elem;
        if( oElem[eType] )
          delete oElem[eType];
        return false;
      }
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++输入框的相关判断++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Judg : {
      //* 为了判断user方法是否存在
      user : true,
      //* 为了判断psw方法是否存在
      psw : true,
      //* 为了判断email方法是否存在
      email : true,
      //* 为了判断rep方法是否存在
      rep : true,
      //*
      //* 以上的属性都有对应的方法，如果不存在就是
      //* input的name为该属性的标签输入不需要判断
      //*
      //* 存储每一项判断的信息
      Jsn : {},
      //* form标签
      oForm : null,
      //* 按键标签
      Btn : null,
      //* form的id
      fid : null,
      //* 用来与email进行比对，主要用于forget
      inpEmail : null,
      //* 计算form里的input标签数量，或计算json的长度
      inputQuantity : function ( obj, flag ){
        var
          tbj,
          n = 0,
          i=null;
        for( i in obj ) {
          tbj = obj[i];
          //* 如果flag不存在就是计算inupt标签数,
          //* 否则就是计算json的单元数
          if( !flag ){
            //* 去掉不是input的标签和按键
            if( tbj.tagName == 'INPUT' && tbj.type!='button' )
              n++;
          }else
            n++;
        }
        return n;
      },
      //* span标签文字的颜色，错误时红色
      red : function ( obj ) {
        $.Css( obj, {'color':'red'});
      },
      //* span标签文字的颜色，正确时绿色
      green : function ( obj ) {
        $.Css( obj, {'color':'green'});
      },
      //* span标签的显示的内容
      Html : function ( obj, ctnt ){
        var
          iName = obj.name,
          nextEm = $.nextEm( obj ),
          iJsn = this.inJson( iName,this.Jsn ) ? this.Jsn[iName] : null;
        if( iJsn === 0 )
          this.green( nextEm );
        else
          this.red( nextEm );
        return $.Html( nextEm, getLang( ctnt ) );
      },
      //* 通过往前查找兄弟节点找元素，n是往前几级
      getPre : function ( obj, n ) {
        var
          i=0;
        n = n || 1;
        for( ; i<n; i++ )
          //* previousElementSibling和previousSibling的差别
          //* 就是：前者不包含文字节点，后者包含
          obj = obj.previousElementSibling;
        return obj;
      },
      //* 计算对象里的元素值的和
      jsonSum : function ( json ){
        if( json === {} )
          return false;
        var
          sum = 0,
          i=null;
        for( i in json )
          sum += json[i];
        return sum;
      },
      //* 判断json是否存在键值是elem的元素
      inJson : function ( elem, json ) {
        var i=null;
        for( i in json ) {
          if( i == elem )
            return true;
        }
        return false;
      },
      //* 给mForm和Btn属性赋值，参数form和btn的id
      formBtn : function ( formId, btn ) {
        this.fid = formId;
        this.oForm = $.getElem( '#' + formId )[0];
        this.Btn = $.getElem( '#' + btn )[0];
        return;
      },
     /*
      * flag判断是注册还是登录，因为如果是登录，
      * 用户名在表里必须存在，而如果是注册，用户
      * 名或邮箱地址在表里不能存在
      */
      query : function ( formId, btn, Url ){
        this.formBtn( formId, btn );
        var
          mForm = this.oForm,
          Btn = this.Btn,
          i = 0,
          inp,
          l = mForm.length;
        for( ; i<l; i++ ){
          inp = mForm[i];
          this.mFocus( inp );
          this.mBlur( inp, Url );
          if( formId == 'register' )
            this.mKeyup( inp, Url );
        }
        return;
      },
      //* 按键放开时判断
      mKeyup : function ( obj, Url ) {
        var
          This = this;
        $.oEvent.addEv( obj, 'keyup', function (){
          This.mEvent( obj, Url );
        });
      },
      //* 放开按键和失去焦点的公共方法
      mEvent : function ( obj, Url ) {
        var
          Val = obj.value,
          tName = obj.name,
          label = this.getPre( obj ),
          msg,foo;
        if( !!label )
          label = label.innerHTML;
        //* 数据为空
        if( Val == '' ){
          msg = 'not,' + label + ',noEmpty';
          this.Ending( obj, msg, 1 );
        }else{
          //* 如果方法存在则进行判断
          if( this[tName] )
            this[tName]( tName, Url );
        }
        this.Judg( Url, this.Jsn );
      },
      //* 获取焦点时清空input
      mFocus : function ( obj ){
        var
          This = this,
          iName = obj.name;
        $.oEvent.addEv( obj, 'focus',function (){
          if( typeof( this.value ) != 'undefined' && !This.inJson( iName, This.Jsn ) )
            this.value = '';
          //* 获取焦点时，按键都是不能点击的
          $.Disable( This.Btn, true );
        });
      },
      //* 失去焦点时
      mBlur: function ( obj, Url ){
        var
          This = this;
        $.oEvent.addEv( obj, 'blur', function (){
          This.mEvent( this, Url );
        });
      },
      //* 判断的结果，参数1是input对象，2是要显示的信息
      //* 3是错误的代码，4是条件是否成立
      Ending : function ( obj, msg, num ) {
        this.Jsn[obj.name] = num;
        this.Html( obj, msg );
        return ;
      },
      //* 通过form的id来获取input，iName是input的name
      getInput : function ( iName ) {
        var
          Fm = this.oForm,
          inp, i=0, len=Fm.length;
        for( ; i<len; i++ ){
          inp = Fm[i];
          if( inp.name == iName )
            return inp;
        }
        return ;
      },
      //用户名和邮箱地址判断
      userIsIn : function ( str, Url ){
        var
          aff,
          THIS = this;
        $.AJAX.ajax( Url, str, function (){
          //* this就是true或false，true是存在，false是不存在
          aff = eval( '('+this+')');
        });
        return aff;
      },
      //* 比对数据表里的user是否存在
      comUser : function ( Val, Url ) {
        var
          col = Val.indexOf( '@' ) < 0 ? 'user' : 'email';
          aff = this.userIsIn( col+'='+ Val, Url );
        return aff;
      },
      //* 判断是用户还是邮箱地址
      userEmail : function ( obj ) {
        var
          label = this.getPre( obj );
        return label.innerHTML;
      },
      //* 用户名的判断
      user : function ( user, Url ) {
        var
          obj = this.getInput( user ),
          Val = obj.value,
          len = Val.length,
          msg = len<4 ? 'tooShort' : ( len>15 ? 'tooLong' : '' ),
          reg = /^[a-zA-Z][a-zA-Z_0-9]{4,15}/;
        if( msg )
          return this.Ending( obj, 'not,'+msg, 1 );
        if( !reg.test( Val ) )
          this.Ending( obj, 'not,noFormat', 1 );
        var
          //* 查询用户名在数据库是否已经存在
          ajaxUser = this.comUser( Val, Url+'userIsIn' ),
          Au, mail,
          Ue = this.userEmail( obj );
        //* 如果是用户注册，用户存在是不可以的，而如果不是
        //* 注册，用户存在是可以的，用户不存在反而不可以
        if( this.fid == 'register' ){
          Au = !!ajaxUser ? 1 : 0;
          msg = !!ajaxUser ? 'not,'+ Ue +',isset' : 'yes';
        }else{
          if( !ajaxUser ){
            Au = 1;
            msg = 'not,'+ Ue +',noIsset';
          }else{
            //* 给inpEmail属性赋值，用于在email方法里进行比对
            this.inpEmail = ajaxUser['email'];
            Au = 0;
            msg = 'yes';
            //* 经过查询如果邮箱存在，则打开email的输入框
            $.Disable( $('#email')[0], false );
          }
        }
        return this.Ending( obj, msg, Au );
      },
      email : function ( email, Url ) {
        var
          obj = this.getInput( email ),
          Val = obj.value,
          reg = /^\w+(\.\w+)*@\w+(\.\w+)+$/;
        if( !reg.test( Val ) )
          return this.Ending( obj, 'not,mail,noFormat', 3 );
        var Ae;
        //* 如果是用户注册，只要邮箱不存在就可以了
        if( this.fid == 'register' ){
          var
            msg,
            //* 查询邮箱地址在数据库是否已经存在
            ajaxEmail = this.comUser( Val, Url+'userIsIn' ),
            Ue = this.userEmail( obj );
          Ae = !!ajaxEmail ? 3 : 0;
          msg = !!ajaxEmail ? 'not,'+Ue+',isset': 'yes';
        }else{
          //* 非注册时，无需查询数据库，只要把前面通过user
          //* 查询获取的、和输入框输入的email进行比对，如果
          //* 相同则表示输入的信息是正确的
          if( this.inpEmail == Val ){
            Ae = 0;
            msg = 'yes';
            $.Disable( this.Btn, false );
          }else{
            Ae = 3;
            msg = 'not,userEmail';
          }
        }
        return this.Ending( obj, msg, Ae );
      },
      psw : function ( psw ) {
        var
          obj = this.getInput( psw ),
          Val = obj.value,
          Ap = 0,
          msg = 'yes',
          //* 开头到结尾不能全是数字、字母
          reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,18}$/;
        //* 密码只判断格式，其他都不必判断
        if( !reg.test( Val ) ){
          Ap = 2;
          msg = 'not,noFormat';
        }
        this.Ending( obj, msg, Ap );
      },
      //* 注册时要两次输入密码
      rep : function ( rep ) {
        var
          psw = this.getInput( 'psw' ).value,
          obj = this.getInput( rep ),
          Val = obj.value,
          comRp=0,
          msg = 'yes';
        if( Val != psw ){
          comRp = 5;
          msg = 'not,pswNoSame'
        }
        this.Ending( obj, msg, comRp );
      },

      //* 获取form里除了btn外的input标签
      formInput : function ( ) {
        var
          Fm = this.oForm,
          inp,
          elems=[],
          i = 0,
          l = Fm.length;
        for( ; i<l; i++ ){
          inp = Fm[i];
          //* 把按键标签去掉
          if( inp.tagName == 'INPUT' && inp.type != 'button' )
            elems.push( inp );
        }
        return elems;
      },
      //* 最后的综合判断
      Judg: function ( Url, jsn ){
        //* 为了防止一开始只有一个input标签有值且值是正确的，按键能使用，
        //* 先计算input标签的数量，如果jsn的元素不等于标签数，说明没有
        //* 全部标签都进行了填写，那么按键为不可用状态
        var
          quantity = this.inputQuantity( this.oForm.children ),
          Json = this.inputQuantity( jsn, true ),
          sum = this.jsonSum( jsn ),
          This = this;
        //* Json如果等于quantity表示所有标签都进行了填写
        //* sum等于0表示所有的填写都可用
        if( Json == quantity && sum === 0 ){
          //* 如果条件成立，打开按键提交数据
          $.Disable( this.Btn, false );
          $.oEvent.addEv( this.Btn, 'click', function (){alert(11);
            var fid = This.fid;
            //* 地址的后面是注册的方法
            Url += id;
            $.AJAX.ajax( Url, fid, function (){
              //* 把返回的数据打印在父标签里
              $( '#'+fid ).Html( this );
              getLang( 'backTime' );
            } );
          });
        }else
          this.Btn.disabled = 'disabled';
      },
      //* 颜色进制转换
      colorRGBtoHex:function (color) {
        var rgb = color.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substring(1);
        return hex;
      }
    },
    //* 上传图片时的图片预览，obj是上传文件的
    //* input标签；showId是预览图片的标签id
    showImg : function ( obj, showId ){
      var
        file = obj.files[0],
        reader = new FileReader(),
        img = $.getElem( '#'+ showId )[0];
      reader.readAsDataURL(file);
      //* 读取文件
      reader.onload = function (e) {
        img.src = e.target.result;
      };
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //兼容浏览器的获取元素兼容模式
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Yoncms : {
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //通过类名获取元素++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      ByClass : function ( ClassName, Parent ) {
        Parent = Parent || this.DM;
        var
          frr = [],
          elemClass = null,
          elems = Parent.getElementsByTagName( '*' ),
          i = 0,
          lng = elems.length;
        if( !elems ) return;
        for( ; i<lng; i++ ){
          elemClass = elems[i];
          //用来赋值标签的className
          var ECN = elemClass.className;
          //className可能有空格符，表示有多个class名
          if( ECN.indexOf( ' ' ) == -1 ){
            if( ECN == ClassName )
              frr.push( elemClass );
          }else{
            //如果有空格先按空格拆分成数组，然后判断class名是否在数组里
            if( $.inObj( ClassName, this.DelNul( ECN ) ) )
              frr.push( elemClass );
          }
        }
        return frr[0] ? frr : null;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //通过ID获取元素++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      ById : function ( Id ) {
        if( !Id )
          return;
        var
          Dcm = $.DCM,
          elem = Dcm.getElementById( Id );
        //* console.info( elem );
        return elem ? [elem] : null;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++通过标签名获取++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      ByTagName : function ( TagName, Parent ){
        Parent = Parent ? Parent : $.DM;
        var
          elems = Parent.getElementsByTagName( TagName );
        return elems[0] ? elems : null;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //如果字符串里空白的地方有多个空格符的元素，根据
      //空格符拆分成数组会有空值元素，把空值元素去掉
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      DelNul : function( str, flag ){
        if( !str )
          return;
        var frr = [],
            obj = null,
            arr = str.split( flag || ' ' ),
            i = 0,
            lng = arr.length;
        for( ; i<lng; i++ ){
          obj = arr[i];
          if( obj != '' )
            frr.push( obj );
          else
            continue;
        }
        return frr;
      },
      DM : $.DCM,
      //HasParent的私有函数
      HasParentFoo : function ( tag, Parent ) {
         //非第一级的父节点
        var
          temp = [],
          par = null,
          em = null,
          eLng = 0,
          k = 0,
          i = 0,
          pLng = Parent.length;
        //每次循环都遍历父节点
        for( ; i<pLng; i++ ){
          par = Parent[i];
          //查找父节点下所有的fri元素
          em = this.oneArg( tag, par );
          k = 0;
          eLng = em.length;
          //把找到的所有元素都赋给temp
          for( ; k<eLng; k++ )
            temp.push( em[k] );
        }
        return temp;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++有父节点的情况+++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      HasParent : function ( arg ) {
        var
          Parent = [],
          frr = this.DelNul( arg ),
          i = 0,
          lng = frr.length,
          fri = null;
        for( ; i<lng; i++ ) {
          fri = frr[i];
          //第一级的父节点是document
          if( i == 0 )
            Parent = this.oneArg( fri, $.DCM );
          else
            Parent = this.HasParentFoo( fri, Parent );
        }
        //循环完了，最后找到的元素就是要获取的元素，直接返回
        return Parent[0] ? Parent : [];
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      NotParent : function ( arg ) {
        var obj = this.oneArg( arg );
        if( !obj[0] )
          return [];
        return obj;
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //判断第一个字符，和去掉第一个字符
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      oneArg : function ( arg, Parent ) {
        var
            Parent = Parent ? Parent : $.DCM,
            one = arg.substr( 0, 1 ),
            oArg = arg.substr( 1 );
        //如果第一个字符是指定字符
        if( one == '#' )
          return this.ById( oArg );
        else if( one == '.' )
          return this.ByClass( oArg, Parent );
        else
          return this.ByTagName( arg, Parent );
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //元素分为有父级元素和没有父级元素两种情况++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      Query : function ( args ) {
        var
          arg = $.trim( args ),
          nul = arg.indexOf( ' ' );
        //没有父级元素
        if( nul == -1 )
          return this.NotParent( arg );
        else
          return this.HasParent( arg );
      }
    }
  });
  //*************************************************
  //*************************************************
  //*********独立于静态方法和实例化方法**************
  //*************************************************
  //*************************************************
  $.ext({
    Regext : function ( str ) {
      var reg = /^[a-zA-Z]+[a-zA-Z_0-9]/;
      if( !reg.test( str ) )
        return false;
      return true;
    },

    //* 防止事件捕获和冒泡/阻止默认事件
    returnFalse : function ( e ) {
      var ev = e || window.event;
      if( ev.stopPropagation ){
        ev.stopPropagation;
        ev.preventDefault();
      }else{
        ev.cancelBubble = true;
        ev.returnValue = false;
      }
      return false;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++定时器在窗口没有激活时关闭++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    setinterval : function ( obj, fn, delay ){
      var
        //
        //hidden属性有两种情况，可见时是false
        //不可见时true
        //
        Property = 'hidden' in document ? 'hidden' :
                   'webkitHidden' in document ? 'webkitHidden' :
                   'mozHidden' in document ? 'mozHidden' : null,
        //前缀是为了区分各种浏览器
        Prefix = Property.replace( /hidden/i, '' );
        //
        //不同浏览器的事件名不一样，把前缀加上；
        //
        ChangeEvent = Prefix + 'visibilitychange',
        //
        //浏览器的状态，不同浏览器的属性名也不一样，把前缀加上；
        //状态有两种，可见时是visible，不可见是hidden
        //
        VState = Prefix + 'VisibilityState';
      delay = delay || 30;
      obj.timer=null;
      obj.timer = setInterval( fn, delay );
      document.addEventListener( ChangeEvent, function (){
        //
        //如果不可见，包括标签切换、最小化等，
        //关闭定时器
        //
        if( this[Property] || this[VState] == 'hidden' )
          $.clearTimer( obj.timer );
        else{
          $.clearTimer( obj.timer );
          obj.timer = setInterval( fn, delay );
        }
      });
      return obj.timer;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++显示元素+++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Show : function ( obj ) {
      this.Css( obj, {'display' : 'block' } );
      return ;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++运动++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Sport : {
      //兼容浏览器的标签属性值
      styleValue : function ( obj, attr ){
        var sty = null;
        //兼容旧版IE浏览器
        if( window.currentStyle )
          sty = obj.currentStyle;
        else
          sty = getComputedStyle( obj, null );
        return parseFloat( sty[attr] );
      },
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //++++++++++++++++运动的基本函数++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      run : function ( json ){
        var
          //速度
          step = json.step,
          //运动的对象
          obj = json.obj,
          //运动的属性
          attr = json.attr;
        step += this.styleValue( obj, attr );
        obj.style[attr] = step + 'px';
      }
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++去掉字符串两边指定字符++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    trim : function ( arg, rg ) {
      //默认是空字符
      var reg = new RegExp( "^"+ rg + '+|' + rg + "+$", "g" );
      rg = rg ? rg : ' ';
      return arg.replace( reg, '' );
    },
  });
  //
  //
  //
  //
  //
  //
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++添加实例化方法++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //
  $.fn.ext({
    //
    //-+----------------------------------+-
    // |把元素直接赋给this，这样this就是  |
    // |要操作的元素                      |
    //-+----------------------------------+-
    //
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++绑定事件++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    addEvent : function ( eType, fn ) {
      this.Each(function (n){
        $.oEvent.addEv( this, eType, function ( ){
					fn.call(this, n);
        } );
      });
      return this;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //调用ajax静态方法，一般是form的提交按钮绑定本方法++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    ajax : function ( Url, fn, eType ) {
      this.Each(function (){
        var
          //默认是click事件
          eType = eType || 'click';
          //按键父节点的id就是form表单
          parId = this.parentNode.id;
        $.oEvent.addEv( this, eType, function (){
          $.AJAX.ajax( Url, parId, fn );
        } );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    //++++++++++++++++++放大鼠标指向的元素++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    amplify : function ( fn1, fn2 ) {
      this.Each(function (){
        $.oEvent.addEv( this, 'mouseover', fn1 );
        $.oEvent.addEv( this, 'mouseout', fn2 )
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++字体闪烁++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    blink : function ( color1, color2, delay) {
      this.Each(function (){
        var This = this;
        $.setInterval( this, function(){
          delay = delay ? delay : 30;
          This.style.color = This.style.color==color1 ? color2 : color1;
        }, delay );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //同一对象绑定多个事件++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    changeEvent : function ( ) {
      var
        fn = arguments,
        lng = fn.length;
      //n = 0;
      this.Each(function (){
        this.n = 0;
        (function ( obj ){
          $.oEvent.addEv( obj, 'click', function (){
            fn[this.n++ % lng].call( obj );
          });
        })( this );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++设置样式++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Css : function( json ){
      this.Each(function (){
        $.Css( this, json );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++删除事件+++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    delEvent : function ( eType ) {
      this.Each(function (){
        $.oEvent.delFoo( this, eType );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //遍历elem，并进行操作，具体操作在fn函数里进行++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Each : function( fn ){
      if( !this )
        return;
      var i=0,
          len = this.length;
      for( ; i<len; i++ )
        fn.call( this[i], i );
      return;
    },
    //
    //+++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++弹性运动++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++
    //
    elastic : function ( json, delay ) {
      this.Each(function (){
        //把对象添加到json
        json.obj = this;
        $.setinterval(this, function (){
          $.elastic.move( json );
        }, delay);
      });
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //只操作elem里的某个元素，默认是第一个++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    findOnly : function( fn, n ){
      n = n ? n : 0;
      fn.call( this[n] );
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
    //+++++++++++++来回匀速运动+++++++++++++++++++++++++++++++//
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
    goBack : function ( json, delay ) {
      var
        elems = {};
      //开启运动的事件
      elems.startEv = 'mouseout';
      //停止运动的事件
      elems.stopEv = 'mouseover';
      //运动延时
      elems.delay = delay || 30;

      this.Each(function (){
        //运动的对象
        json.obj = this;
        //运动的方法
        elems.fn = function( ){
          $.goBack( json );
        };
        //绑定开启、停止事件
        $.bindEvent( this, elems );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //隐藏标签++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Hide : function(){
      this.Each(function (){
        $.Display( this, 'none' );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++设置标签的innerHTML+++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Html : function( str ){
      this.Each(function (){
        $.Html( this, str );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++添加计时器++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    setinterval : function ( fn, delay ) {
      this.Each( function(){
        $.setinterval( this, fn, delay );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //显示标签++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Show : function ( ) {
      this.Each(function (){
        $.Display( this, 'block' );
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++使this指向要操作的对象+++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    toThis : function ( ) {
      if( !this.elem )
        return;
      var 
					em = this.elem,
					i = null,
          j = 0,
          len = em.length;
      //先删除this原有的成员
      for( i in this )
        delete this[i];
      //再指定this的长度，就是elem的长度
      this.length = len;
      for( ; j<len; j++ )
        this[j] = em[j];
      return;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++设置标签的Value+++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Value : function ( str ) {
      this.Each(function (){
        this.value = str;
      });
      return this;
    },
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    //++++++++++++++++++++对象是否存在++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    objExists : function ( ) {
      var flag = false;
      this.Each( function (){
        if( this.id != 'undefined' )
          flag = true;
      });
      return flag;
    },

    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    //++++++++++++++++++++测试用的++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    demo : function ( ) {
      this.Each(function (){
        console.log( $.formData( this ) );
      });
    }

    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
    //++++++++++++++++++++++++++++++++++++++++++++++++++++//
  });


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


//if( document.hasFocus() )
  Win.$ = $;


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++//


});

