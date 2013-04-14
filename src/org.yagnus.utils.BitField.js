		//this bitfield implementation is copied and improved from require('BitField');
		org.yagnus.utils.BitField=function(p){
			//use 32 bit integer buffer array.
			if(typeof(p)=='object')
				this.a=p.a;
			else if(typeof(p)=='number'){
				this.a = new Array();
				for(var i=Math.ceil(p/32)-1;i>-1;--i)this.a[i]=0;
			}
		}
		org.yagnus.utils.BitFieldMethods = function(){
			//use 32 bit integer buffer array.
			//if size is passed in then ensure those bits
			this.get=function(i){
				i=parseInt(i);
				return !!(this.a[i >> 5] & (1<<(i % 32))); 
			}

			this.copy=function(i){
				var ret = new org.yagnus.utils.BitField();
				ret.a=this.a.slice();
				return ret;
			}

			this.set = function(i, b){
				i=parseInt(i);
				if(b || arguments.length === 1) this.a[i >> 5] |= 1 << (i % 32);
				else this.a[i >> 5] &= ~( 1<< (i % 32));
			};

			this.flip= function(i){
				if(typeof(i)!='number')
					for(var i=this.a.length-1;i>-1;--i){
						this.a[i] = ~this.a[i];
					}
				else{
					i=parseInt(i);
					var ret=this.get(i);
					this.set(i,!ret);
					return ret;
				}
			}

			this.orEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length)this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] |= oai;
				}
				return this;
			}

			this.norEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length)this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] |= ~oai;
				}
				return this;
			}

			this.andEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length) this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] &= oai;
				}
				return this;
			}

			this.nandEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length)this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] &= ~oai;
				}
				return this;
			}

			this.xorEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length)this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] ^= oai;
				}
				return this;
			}

			this.xnorEq = function(o){
				if(o instanceof Object && o.a instanceof Array) for(var i=o.a.length-1;i>-1;--i){
					if (i >= this.a.length)this.a[i]=0;
					var oai= o.a[i]; if(typeof(oai)!='number')oai=0;
					this.a[i] ^= ~oai;
				}
				return this;
			}

			//update is performed by performing '|=' aka orEq
			this.update = this.orEq;
	}
	org.yagnus.utils.initBitField=function(p){ return new org.yagnus.utils.BitField(p); }
	oy.BF = org.yagnus.utils.initBitField;
