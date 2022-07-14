
(function ( arg, foo ){
	foo( arg );
})( typeof window != 'undefined' ? window : this, function ( Win, undefined ){
	var 
		Dt,
		$ = function ( arg ){
			return new $.fn.init( arg );
		};
		$.fn = $.prototype = {
			constructor: $,
			length: 0, 
			init: function ( arg ){
				this.elem = [];
				if( $.isFunction( arg ) || arg == document ){
					Dt = document;
					$.isFunction( arg ) && $.DomLoad( arg );
				}else if( $.isString( arg ) ) {
					this.elem = $.Elem( arg );
				}else{	
					this.elem.push( arg );
				}
				this.toThis();
			}
		};
		$.fn.init.prototype = $.fn;
		$.fn.ext = $.ext = function( Json ){
			var i=null;
			for( i in Json ) {
				this[i] = Json[i];
			}
			return this;
		};
		$.ext({
			DomLoad: function ( fn ) {
				var 
					flag = false,
					timer;
				timer = setInterval( function ( ){
					if( flag ) return clearInterval( timer );
					if( /loaded|interactive|complete/.test( document.readyState ) ){
						fn( );
						flag = true;
					}
				}, 1 );
			},
			Elem: function ( arg ) {
				return Dt.querySelectorAll( arg );
			},
			Each: function ( obj, fn ){
				var 
					i, len;
				if( this.isNot( obj.length ) )
					for( i in obj ) fn.call( obj[i], i );
				else{
					i = 0;
					len = obj.length;
					for( ; i<len; i++ ) fn.call( obj[i], i );
				}
			},
			reEach: function ( arr, fn ){
				var 
					len = arr.length,
					i = len - 1;
				for( ; i>=0; i-- ){
					fn.call( arr[i], i );
				}
			},
			css: function ( obj, attr, Value ){
				var 
					objAttr = obj.style,
					unit;
				if( attr != 'opacity' ){
					unit = !$.isNan( Value ) ? Value + 'px' : Value;
					attr == 'zIndex' &&	(unit = Value);
					objAttr[attr] = unit;
				}else{
					objAttr.filter = 'alpha(opacity:' + Value + ')';
					objAttr.opacity = Value / 100;
				}
			},
			cssMore: function ( obj, Json ){
				var 
					attr;
				for( attr in Json ){
					this.css( obj, attr, Json[attr] );
				}
			},
			getAttr: function ( obj, attr ){
				var val = 0;
				if( window.getComputedStyle )
					val = getComputedStyle(obj, null)[attr];
				else
					//* 兼容IE浏览器
					val = obj.currentStyle[attr]; 
				if( this.isNan( val ) ) 
					return val;
				return attr == 'opacity' ? Math.round( val * 100 ) : parseInt( val );
			},
			Display: function ( obj ) {
				return this.getAttr( obj, 'display' );
			},
			Left: function ( obj ) {
				return this.getAttr( obj, 'left' );
			},
			Top: function ( obj ) {
				return this.getAttr( obj, 'top' );
			},
			Width: function ( obj ) {
				return this.getAttr( obj, 'width' );
			},
			Height: function ( obj ) {
				return this.getAttr( obj, 'height' );
			},
			zindex: function ( obj, n ) {
				this.css( obj, 'zIndex', n );
			},			
			//* 首字母大写
			firstUpper: function ( str ){
				return str.replace( str[0], str[0].toUpperCase() );
			},
			getClient: function ( attr ){
				var 
					cs = 'client';
				//* 先去掉首字符s（s是为了区分滚动条的）
				attr = attr[0]=='s' ? [attr.slice(1), cs='scroll'][0] : attr;
				//* 首字母要大写
				attr = cs + this.firstUpper( attr );
				return document.documentElement[attr] || document.body[attr];
			},
			hide: function ( obj ) {
				this.css( obj, 'display', 'none' );
			},
			isString: function ( arg ) {
				return typeof arg == 'string';
			},
			isNumber: function ( arg ) {
				return typeof arg == 'number';
			},	
			isFunction: function ( arg ) {
				return typeof arg == 'function';
			},
			isArr: function ( arg ) {
				return arg.constructor.toLowerCase().indexOf('array') != -1;
			},
			isNot: function ( arg ){
				return typeof arg == 'undefined';
			},
			//* 判断数据不是真的数字（number类型的数据可能是Nan）
			isNan: function ( val ) {
				//* parseInt计算后的值如果不是数字，则返回NaN
				//* 而NaN是唯一一个不等于自身数据;
				return parseInt(val) !== parseInt(val);
			},
			inObj: function ( em, obj ){
				var i;
				if( isNot( obj.length ) ){
					for( i in obj ) 
						if( obj[i] == em ) return true;
				}
				i = 0, len = obj.length;
				for( ; i<len; i++ ){
					if( obj[i] == em ) return true;
				}
			},
			layout: function (elems) {
				this.Each(elems, function ( ){
					$.cssMore(this,{left:this.offsetLeft,top:this.offsetTop});
				});
				//* 一定不能把两个循环合并在一起
				this.Each(elems, function ( ){
					$.cssMore(this, {position:'absolute',margin:0});
				})
			},
			show: function ( obj ) {
				this.css( obj, 'display', 'block' );
			},
			//* 兼容浏览器的获取事件对象
			setE: function ( e ) {
				return window.event || e;
			},
			stopDefault: function ( e ){
				if( e.preventDefault )
					e.preventDefault();
				else
					e.returnValue = false;
			},
			//* 类数组（元素集合、节点列表）转成数组
			toArr: function ( list ){
				return [].slice.call( list );
			}
		});
		//添加事件
		$.ext({
			oEvent: {
				ID : 0,
				addEvent: function ( obj, mType, fn, i ) {
					$.isNot( obj.ets ) && (obj.ets = {});
					$.isNot( obj.ets[mType] ) && (obj.ets[mType] = []);
					var oem = obj.ets[mType];
					if( !$.isNot( fn, oem ) ){
						if( $.isNot( oem[0] ) )
							oem[0] = fn;
						else
							oem[this.ID++] = fn;
					}
					obj['on'+mType] = function ( e ){
						var 
							ev = window.event || e;
						$.stopDefault( ev );
						$.oEvent.exeEvent.call( this, ev, i );
						return;
					};
				},
				exeEvent: function ( e, x ){
					var 
						mType = e.type,
						oem = this.ets[mType],
						i = 0, len;
					if( !$.isNot( this.ets[mType] ) ){
						len = oem.length;
						for( ; i<len; i++ ){
							!$.isNot( oem[i] ) && oem[i].call( this, x );
						}
					}
					return;
				},
				delEvent: function ( obj, mType ){
					!$.isNot( obj.ets[mType] ) && delete obj.ets[mType];
					return;
				}
			}
		});
		//* 添加实例化对象的方法
		$.fn.ext({
			ready: function ( fn ) {
				Dt && $.DomLoad( fn );
			},
			//* elem属性的值转到this
			toThis: function ( ) {
				var 
					elems = this.elem,
					i, len = elems.length;
				for( i in this ) delete this[i];
				this.length = len;
				for( i=0; i<len; i++ ) this[i] = elems[i];
				return this;
			},
			oneElem: function ( n ) {
				return $.isNot(n) ? this[0] : this[n-1];
			},
			toOne: function ( n ) {
				var 
					i = 0,
					len = this.length;
				n = $.isNot( n ) ? 0 : n - 1;
				this.elem = [];
				for( ; i<len; i++ ){
					this.elem[i] = this[i];
					delete this[i];
				}
				this.length = 1;
				this[0] = this.elem[n];
				return this;
			},
			one: function () {
				var 
					args = arguments,
					a0 = args[0],
					n = 0,
					fn = $.isNumber( a0 ) ? [args[1],n=a0-1][0] : a0;
				fn.call( this[n] );
				return  this;
			},
			Each: function ( fn ){
				$.Each( this, fn );
			},
			css: function ( attr, val ){
				this.Each( function ( ){
					$.css( this, attr, val );
				});
				return this;
			},
			cssMore: function ( Json ){
				this.Each(function ( ){
					$.cssMore( this, Json );
				});
				return this;
			},
			addEvent: function ( mType, fn ){
				this.Each(function ( i ){
					$.oEvent.addEvent( this, mType, fn, i );
				});
				return this;
			},
			delEvent: function ( mType ){
				this.Each(function ( ){
					$.oEvent.delEvent( this, mType );
				});
				return this;
			},
			hide: function ( ) {
				this.Each(function ( ){
					$.hide( this );
				});
				return this;
			},
			show: function ( ){
				this.Each(function ( ){
					$.show( this );
				});
				return this;
			},
			//* 布局转换
			layout: function ( ){
				$.layout( this );
				return this;
			}
		});
		$.ext({
			//匀速运动
			Uniform: function ( obj, Json, fn ){
				var 
					current=0,
					attr = Json.attr,
					Target = Json.Target||false, //false是没有目标值
					speed = Json.speed||1;
				this.setTimer( obj, function(){
					current = $.getAttr( obj, attr );
					if( Target == current ){
						clearInterval( obj.timer );
						fn && fn.call( obj );
					}else if( Math.abs(Target - current) < Math.abs(speed)  ) {
						css( obj, attr, Target );
					}else{
						current += speed;
						$.css( obj, attr, current );
					}
					console.log( current );
				});
			},
			//对象根据指定键的顺序进行排序
			jsonSort: function ( Json, arr ){
				if( typeof arr == 'undefined' ) 
					return Json;
				var 
					js = {},
					i = 0,
					len = arr.length;
				for( ; i<len; i++ ){
					!!Json[arr[i]] && ( js[arr[i]] = Json[arr[i]] );
				}
				return js;
			},
			//* 变速运动计算速度
			setSpeed: function ( current, Target, step ){
				var speed = ( Target - current ) / (step || 8 );
				return speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
			},
			//* 速度转换，用于多个样式同时改变时保证同时结束，避免出现抖动***********
			changeSpeed: function ( Json ){
				if(Json.marginLeft||Json.marginRight||Json.left) 
					Json.width = -(Json.marginLeft||Json.marginRight) * 2;
				if(Json.marginTop||Json.marginBottom||Json.top)
					Json.height = -(Json.marginTop||Json.marginBottom) * 2;
				return Json
			},
			//* 变速运动，为里不同属性的运动同步结束，避免出现抖动，***************
			//* 对变速运动的改进，Json需要先进行顺序的转换
			Variable: function ( obj, Json, fn ){
				var 
					current={}, 
					speed={}, 
					flag = 1, 
					em,
					arr = ['marginTop','marginLeft','width','height'];
				Json = $.jsonSort( Json );//顺序转换
				arr = undefined;
				clearInterval( obj.timer );
				obj.timer = setInterval( function ( ){
					flag = 1;
					for( em in Json ){
						current[em] = $.getAttr( obj, em );
						if( em.indexOf( 'margin' ) != -1 )
							speed[em] = $.setSpeed( current[em], Json[em] );
						speed = $.changeSpeed( speed );
						if( current[em] != Json[em] ) {
							flag = 0;
							current[em] += speed[em];
							$.css( obj, em, current[em] );
						}
						if( flag ){
							clearInterval( obj.timer );
							fn && fn.call( obj );
						}
					}
				}, 30 );
			},
			//*变速运动，同时有多个运动可能不同步
			Varmove: function ( obj, Json, fn ){
				/**
				* Json = {attr:val,speed:'可选'}
				*/
				var current, speed, flag=0;
				this.setTimer( obj, function(){
					flag = 1;
					var i = null;
					for( i in Json ) {
						current = $.getAttr( obj, i );
						speed = $.setSpeed( current, Json[i], i=='opacity'?50:undefined );
						if( Json[i] != current ){
							flag = 0;
							current += speed;
							$.css( obj, i, current );
						}
						if( !!flag ){
							$.clearTimer( obj );
							fn && fn.call( obj );
						}
					}
				});
			},
			//无缝滚动
			seamless: function(obj, direct, speed){
				/**
				* Json可以没参数，最多有两个元素，一个方向，一个速度
				* 默认方向向左，速度为1
				*/
				var 
					attr, mw, current,
					//* 默认在后面没有创新赋值，所以声明时必须有默认值
					init=0,	
					This = this,
					oAttr = 'height';
				void function ( ){
					/**
					* 向左运动Json = {attr:'left'}
					* 向右运动Json = {attr:'left',direction:'r'}
					* 向上运动Json = {attr:'top',direction:'u'}
					* 向下运动Json = {attr:'top',direction:'d'}
					*/
					attr = direct=='u'||direct=='d' ? 'top' : 'left';
					attr=='left' && (oAttr = 'width');
					speed = -speed || -1;
					obj.innerHTML += obj.innerHTML;
					mw = This.getAttr( obj, oAttr );
					This.css( obj, oAttr, mw*2 );
					//默认是left向左运动，无需进行计算
					!!direct && compute( );
					This.setTimer( obj, function(){
						current = This.getAttr( obj, attr );
						if( current == -mw )
							current = init;
						else if( Math.abs(current + mw) < Math.abs(speed ) )
							current = -mw;
						else
							current += speed;
						$.css( obj, attr, current );
					});
				}( );
				function compute( ){
					//方向向右、向下
					if(direct=='r'||direct=='d'){
						//初始值为负的一半宽或高
						init = -mw;
						speed = -speed;
						//目标是0，到零就往回拽
						mw = 0;
					}else
						//方向向上、向左，初始值为0，速度为负，目标是负的一半宽或高
						init = 0; 
					$.css( obj, attr, init );
				}
			},
			//分享栏
			share: function( obj ){
				void function share( ){
					var	cWidth = obj.offsetWidth;
					scrval( obj, cWidth );
					$.oEvent.addEvent( Win, 'scroll', function ( ){
						scrval( obj );
					});
					$.oEvent.addEvent( obj, 'mouseover', function (){
						$.Varmove( obj, {left:0} );
					});
					$.oEvent.addEvent( obj, 'mouseout', function ( ){
						$.Varmove( obj, {left:-cWidth + 20} );
					});
				}();
				function scrval() {
					var 
						ch = $.getClient('height'),
						cs = $.getClient( 'stop' ),
						val = Math.ceil(( ch - obj.offsetHeight ) / 2) + cs;
					$.css( obj, 'top', val );
				}
			},
			setTimer: function ( obj, fn, Delay ) {
				this.clearTimer( obj );
				obj.timer = setInterval( fn, Delay || 30 );
				return;
			},
			clearTimer: function ( obj ){
				obj && clearInterval( obj.timer );
				return;
			}
		});

		//* 拖拽 *********************************************
		$.ext({
			drag: function ( obj ){
				$.oEvent.addEvent( obj, 'mousedown', function ( e ){
					var 
						ev = $.setE( e ),
						This = this, //就是obj对象
						//图片的left到鼠标的x坐标的距离
						cx = ev.clientX - this.offsetLeft,
						//图片的top到鼠标的y坐标的距离
						cy = ev.clientY - this.offsetTop;
						$.stopDefault( ev );
					$.oEvent.addEvent( Dt, 'mousemove', function ( e ){
						var 
							et = $.setE( e ),
							currentX = et.clientX - cx,
							currentY = et.clientY - cy,
							cw = $.getClient('width') - This.offsetWidth,
							ch = $.getClient('height') - This.offsetHeight;
						
						currentX<0 && (currentX=0);
						currentY<0 && (currentY=0);
						currentX>cw && (currentX=cw);
						currentY>ch && (currentY=ch);

						$.cssMore( This, {left:currentX, top:currentY} );
					});
					$.oEvent.addEvent(Dt,'mouseup', function ( ){
						$.oEvent.delEvent( Dt, 'mousemove' );
						$.oEvent.delEvent( Dt, 'mouseup' );
						return;
					});
				});
			}
		});
		//* 漂浮运动
		$.ext({
			float: function( obj, speed ){
				var
					lFlag, tFlag, tScl, lScl, cWth, cHgt, 
					mLef,	mTop, dWth, dHgt, rLef,	rTop;
				speed = speed || 1;
				function moving( ){
					tScl = $.getClient( 'stop' );
					lScl = $.getClient( 'sleft' );
					cWth = $.getClient( 'width' );
					cHgt = $.getClient( 'height' );
					mLef = lScl + cWth - dWth;
					mTop = tScl + cHgt - dHgt;
					$.cssMore(obj, {left:rLef,top:rTop});
					rLef += !lFlag ? speed : -speed;
					rTop += !tFlag ? speed : -speed;
					compute();
				}
				function init( ) {
					dWth = obj.offsetWidth;
					dHgt = obj.offsetHeight;
					rLef = parseInt(Math.random() * 500 );
					rTop = parseInt( Math.random() * 400 );
				}
				function compute( ){
					if( rLef <= lScl ){
						lFlag = 0; rLef = lScl;
					}
					if( rLef >= mLef ){
						lFlag = 1; rLef = mLef;
					}
					if( rTop <= tScl ){
						tFlag = 0; rTop = tScl;
					}
					if( rTop >= mTop ){
						tFlag = 1; rTop = mTop;
					}
				}
				void function float( ){
					!dWth && init( obj );	
					$.setTimer( obj, moving );
					$.oEvent.addEvent( obj, 'mouseover',function ( ){
						$.clearTimer( obj );
					});
					$.oEvent.addEvent( obj, 'mouseout', function ( ){
						$.setTimer( this, moving );
					});
				}();
			},
			//* 不能适应任意的场景，在某些场景里使用弹性运动，会出问题；
			//* 速度的系数也不能任意设定 ************************
			elastic: function ( obj, attr, Target ){
				var 
					speed = 0,
					current = 0;
				clearInterval( obj.timer );
				obj.timer = setInterval( function ( ){
					if( Math.abs(current - Target)<1 && Math.abs( speed )<1 ){
						clearInterval( obj.timer );
						current = Target;
					}else{
						current = $.getAttr( obj, attr );
						speed += ( Target - current ) * 0.5;
						speed *= 0.9
						current += speed;
					}
					$.css( obj, attr, current );
				}, 30 );
			},
			//* 垂直放大 ***************************
			vertical: function ( elem, btn1, btn2 ){
				var 
					ht = $.Height( elem );
				$(btn1).addEvent('click', function ( ){
					if( $.Display(elem) == 'block' ) 
						return;
					$.show( elem );
					$.cssMore( elem, {height:0, marginTop:ht/2} );
					$.Variable( elem, {marginTop:0, height:ht} );
				});
				$(btn2).addEvent('click', function ( ){
					$.Variable( elem, {marginTop:ht/2, height:0}, function ( ){
						$.hide( elem );
					});
				});
			},
			/*
			* 从中心位置向四周扩大，只要两个参数，一个mtop，一个mleft,
			* mtop和mleft是要变化的幅度，而不是目标值；然后通过mtop
			* 和mleft计算height和width，因为width和height的增加值
			* 是mtop和mleft的两倍（否则会抖动）
			*/
			amplify: function ( obj, Json ){
				var
					arr = [],
					ml = Json.mleft,
					mt = Json.mtop,
					yWidth = this.Width(obj),
					yHeight = this.Height(obj),
					mWidth = yWidth + ml * 2,
					mHeight = yHeight + mt * 2;
				arr[0]={marginLeft:-ml,marginTop:-mt,width:mWidth,height:mHeight};
				arr[1]={marginLeft:0,marginTop:0,width:yWidth,height:yHeight};
				return arr;
			},
			//* 渐变切换
			ramp: function( obj, Delay ){
				var		
					index1 = 1,
					index2 = 0;
				function change( d1, d2 ){
					index1 = index1 == 0 ? 1 : 0;
					index2 = index1 == 0 ? 1 : 0;
					$.cssMore( d1, {zIndex:index1, opacity: index1 * 100 } );
					$.cssMore( d2, {zIndex:index2, opacity: index2 * 100 });
					$.Varmove( d1, { opacity:( (index1+1) % 2 ) * 100 } );
					$.Varmove( d2, { opacity: ( (index2+1) % 2 ) * 100 } );
				}
				void function ( obj, Delay ){
					var 
						objChild = obj.children,
						d1 = objChild[0],
						d2 = objChild[1];
					Delay = Delay || 5000;
					$.setTimer( obj, function ( ){
						change( d1, d2 );
					}, Delay);
					$.oEvent.addEvent( obj, 'mouseover', function ( ){
						$.clearTimer( this );
					});
					$.oEvent.addEvent( obj, 'mouseout', function ( ){
						$.setTimer( obj, function ( ){
							change( d1, d2 );
						}, Delay );
					});
				}(obj, Delay);
			}
		});
		//**********************************
		$.fn.ext({
			Varmove: function ( Json, fn ){
				this.Each(function ( ){
					$.Varmove( this, Json, fn );
				});
				return this;
			},
			seamless: function ( direct, speed ){
				this.Each(function ( ){
					$.seamless( this, direct, speed );
					$.oEvent.addEvent(this, 'mouseover', function ( ){
						$.clearTimer( this );
					});
					$.oEvent.addEvent( this, 'mouseout', function ( ){
						$.seamless( this, direct, speed );
					});
				});
				return this;
			},
			share: function ( ){
				this.Each(function ( ){
					$.share( this );
				});
				return this;
			},
			float: function ( speed ){
				this.Each(function ( ){
					$.float( this, speed );
				});
				return this;
			},
			drag: function ( ){
				this.Each(function ( ){
					$.drag( this );
				});
				return this;
			},
			//* 从中心位置向四周扩大
			amplify: function ( Json ) {
				var arr = [], n=10000;
				this.Each(function ( ){
					arr = $.amplify( this, Json );
					$.oEvent.addEvent(this,'mouseover', function ( ){
						$.css( this, 'zIndex', n++ );
						$.Variable( this, arr[0] );
					});
					$.oEvent.addEvent(this, 'mouseout', function ( ){
						$.Variable( this, arr[1] );
					});
				});
				return this;
			},
			//* 垂直方向扩大
			vertical: function ( btn1, btn2 ){
				this.Each(function ( ){
					$.vertical( this, btn1, btn2 );
				});
				return this;
			},
			//* 图片渐变切换
			ramp: function ( Delay ){
				this.Each(function ( ){
					$.ramp( this, Delay );
				});
				return this;
			},
			//* flash播放
			flash: function ( Delay ){
				this.Each(function ( ){
					$.flash(this, Delay );
				});
				return this;
			}
		});
		//* Flash播放
		$.ext({
			flash:function( obj, direct, Delay ){
				var 
					len, img, li, attr, index1=1, index2=0, 
					mAttr = 'left', mVal = 0, Json={};
				if( direct == 'd' || direct == 'u' ) mAttr = 'top';
				attr = mAttr=='left'?'width':'height';
				Json[mAttr] = 0;
				void function ( ) {
					imgli( );
					Delay = Delay || 4500;
					liMove( );
					$.setTimer( obj, setIndex, Delay);
					$.oEvent.addEvent(obj, 'mouseover', function ( ){
						$.clearTimer( obj );
					});
					$.oEvent.addEvent(obj, 'mouseout', function ( ){
						$.setTimer( this, setIndex, Delay );
					});
				}( );
				//* 获取img和li集合
				function imgli( ) {
					//* 获取到子节点列表，并把节点列表先转成数组
					var elem = $.toArr( obj.children );
					li = [elem, elem.pop().children][1];
					img = elem;
					obj = obj;
					len = img.length;
				}
				function setIndex( ){
					index1 = index1 == len ? 0 : index1;
					index2 = index1 == 0 ? len - 1 : index1 - 1;
					imgMove( );
					index1++;
				}
				//* 当前li标签的classname为active，也就是激活状态；
				//* 通过classname是否为active，找到当前图片对应的下标
				function getIndex( ){
				  var Index = 0;
				  for( ; Index<len; Index++ ){
				    if( li[Index].className == 'active' )
				      return Index;
				  }
				}
				//* li的轮播或鼠标指向时，播放对应的大图
				function liMove( ){
						$.Each( li, function ( k ){
						this.onmouseover = function( ){
							index1 = k; //指向的数字所对应的图片，就是接下去用来的切换图片
							index2 = getIndex( ); // 当前图片就是接下去的背景
							imgMove( );
						};
						this.onmouseout = function( ){
							$.clearTimer( obj );
							//鼠标移出后，幻灯片继续转动切换，接下去要切换的图片就是当前的图片加1
							index1 = index1 == len ? 0 : index1+ 1;
						};
					});
				}
				
				//* 大图的轮播
				function imgMove( ){
					$.Each( img, function ( k ){
						$.zindex( this, 0 );
						li[k].className = '';
					});
					li[index1].className = 'active';
					$.zindex( img[index1], 100 );
					mVal = $.getAttr( img[index1], attr );
					$.css( img[index1], mAttr, !direct||direct=='u'?mVal:-mVal);
					$.zindex( img[index2], 99 );
					$.Varmove( img[index1], Json );
				}
			}	
		
		});

		Win.$ = $;

});
