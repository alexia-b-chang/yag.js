/* This file is released under the Yagn.us License */
/**
  * Yagnus License, Copyright and Disclaimers v0.3
  * 
  * This document is about computer files that Yagn.us organization makes available to the public.  The files are provided by the Yagn.us website and third party software and data repositories including, but not exclusively, http://www.yagn.us/, google code, github, and sourceforge.
  * 
  * 
  * Yagn.us License:
  * * Entities downloading Yagn.us files agree that they have read and understood and agree to abide by this entire document, and therefore, they are hereby granted rights to use Yagnus files.
  * * Software or System using Yagn.us files in their software or systems must have a name or names its user, creator and law enforcement uses to refer to the software or system.
  * * Software or Systems using Yagn.us files must make the fact of Yagn.us file usage public knowledge by stating in the natural langauge(s) used by the software or system, on a public forum, uniquely referencable by an URL, indexed by major search systems, that named software or system uses Yagn.us files.
  * * Software or Systems using Yagn.us files must make the fact of its agreement to Yagn.us license known to its users.
  * * Redistribution of unmodified Yagn.us files must include a copy of of this document in plain text.
  * * Distribution of modified Yagn.us files must include an unmodified copy of this file and a pointer to an publically accessible URL containing a diff which when applied to original Yagn.us files produces the distributed files.
  * * Report bugs as soon as they are discovered to Yagn.us via email and at a publically accessible URL indexed by major search systems.
  * * Academic use of Yagnus code must cite Yagn.us as the creator and maintainer of these files.
  * 
  * Free Yagn.us Open License:
  * * Entities downloading Free Yagn.us Open files agree that they have read and understood and agree to abide by this entire document, and therefore, they are hereby granted rights to use Free Yagn.us Open files as long as none of these files are not:
  * ** use, compile, package, or transmit with or as part any software or system that is sold for profit.
  * ** used in efforts towards discovery, improvement, construction, storage or deployement of weapons or in support thereof. Free Yagn.us Open files is absolutely against war.
  * ** used in efforts towards discovery, invasion, violation or corruption of personally, commercially or nationally secret information and properties, or in support thereof, without regard to intentions and goals of such efforts, and without regards to the reason for the privacy or secrecy. Free Yagn.us Open files is abosolutely against spying or hacking.
  * 
  * Under both license files are provided "as is" without any warranties of effecacy towards any end. Yagn.us or any person associated with this entity are not liable for any effects or side-effects caused by the use of Yagn.us and Free Yagn.us Open files.
  * 
  * Use of files, not exclusively, include: Downloading files, unarchiving a file containing this notice, compiling, interpreting, executing, linking with, invoking subroutines, encrypting, decrypting, summarizing, pruning, optimizing, refactoring, documenting, explaining, deriving entropy from, deriving linguistic or any other pattern from, or otherwise transforming, extractions, and citation including quoting, linking or mentioning Yagn.us.
  * Weapons are waves, particles, substances, devices, organisms and procedures whose primary reason, in design or in practice, for being known or designed or created is to be used to destroy, kill, injure, mame, disable, damage, mutate, debilitate or otherwise undesirably alter human, human conditions and human creations.
  * Information private to an entity are those that may or may not be known to the entity itself but are unknown to other entities without the other entity's effort.
  * Information secret to an entity are those that the entity either declares to be secret or makes effort to keep unknown or uncertain to other entities.
  * 
  * Copyright (c) 2013 and forward, Yagn.us. All rights reserved.
  * dda776419d3ed82e11a3dd4c0e29f546
  * 24366a106cc6cff35d76b10db844ea3b189332ecd207d9386a04b950db37d60b
**/
(function(){
  var root = this;
  function makeTop(name,o){
	  //blatantly copied from other projects _
	  if (typeof exports !== 'undefined') {
		 if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = o;
		 }
		 eval("exports."+name+" = o");
	  } else {
		 eval("root."+name+" = o");;
	  }
	}
org = new Object();
makeTop("org",org);
	org.yagnus = new Object();
	org.yagnus.smallInt=-Math.pow(2,53);
	org.yagnus.bigInt=Math.pow(2,53);
	org.yagnus.smallReal=-Number.MAX_VALUE;
	org.yagnus.bigReal=Number.MAX_VALUE;
	oy=org.yagnus;
	oy.ri=org.yagnus.randInt;
	makeTop("oy",org.yagnus);
	org.yagnus.shuffleArray=function(arr){
			 for (var i = arr.length - 1; i > 0; i--) {
				  var j = org.yagnus.randInt(i+1);
				  var tmp = arr[i];
				  arr[i] = arr[j];
				  arr[j] = tmp;
			 }
			 return arr;
		}
	if(!(Array.prototype.shuffle instanceof Function)){
		Array.prototype.shuffle = function () {
			return org.yagnus.shuffleArray(this);
		}
	}
	org.yagnus.utils = new Object();

	// Users may wish to replace util class with underscore.js or one of the other projects having identical names.
	org.yagnus.utils.flatten=function(arr){
		if(arr==null || ! arr instanceof Array)
			return arr;
		var ret=[];
		for(var i=0;i<arr.length;++i){
			if(arr[i]!=null && arr[i] instanceof Array){
				var r = org.yagnus.utils.flatten(arr[i]);
				ret = ret.concat(r);
			}
			else ret.push(arr[i]);
		}
		return ret;
	}

	org.yagnus.utils.extend=function(){
		if(arguments.length<1)return null;
		if(arguments.length<2||typeof(arguments[0])!="object")return arguments[0];
		var ret=arguments[0];
		for(var i=1;i<arguments.length;++i){
			var tr=arguments[i];
			if(typeof(tr)=="object")
				for(var j in tr)
					if(tr.hasOwnProperty(j))
						ret[j]=tr[j];
		}
		return ret;
	}


	//recursive deep equality testing
	org.yagnus.utils.equalsIgnoreMember=function(a,b,ignoreFromA, ignoreFromB, strictType){
		if(typeof(strictType)=='boolean'  && strictType && typeof(a) != typeof(b))return false; //duh
		if(a===b || a==b) return true;

		//array or object comparison
		if( a instanceof Array || a instanceof Object){
			if(typeof(ignoreFromA)=='undefined' || ignoreFromA==null) ignoreFromA={};
			if(typeof(ignoreFromB)=='undefined' || ignoreFromB==null) ignoreFromB={};
			//compare two objects
			var seen={};
			for(x in a){
				if(!(x in ignoreFromA) && a.hasOwnProperty(x)){
					 if(!b.hasOwnProperty(x) || 
					    !org.yagnus.utils.equalsIgnoreMember(a[x],b[x],ignoreFromA, ignoreFromB))
							return false;
					 seen[x]=true;
				}
			}
			for(x in b){
				if(!(x in ignoreFromB) && !(x in seen) && b.hasOwnProperty(x)){
					 if(!a.hasOwnProperty(x) || 
					    !org.yagnus.utils.equalsIgnoreMember(a[x],b[x],ignoreFromA,ignoreFromB))
							return false;
				}
			}
			return true;
		}

		return a===b;
	}
	oy.eqim=org.yagnus.utils.equalsIgnoreMember;

   //This is a link method to create a bit field supporting these methods. We have a default implementation but feel free to use a more efficient implementation
   //    get(i)        //Gets ith bit
   //    set(i,value); //Sets ith bit to value, if value is undefined, sets ith bit to true
   //    update(o);    //takes all bits of o and 'or' into current bitfield. Current field is extended in size if o is bigger.
	org.yagnus.utils.createBitField=function(size){ return new org.yagnus.utils.BitField(size); }



	/** 
     * object is a method that makes an object having fields whose name 
     * come from the array 'a', the value of these fields are either in
     * the array 'b' correspondingly, or else, if b is a function then
     * the value of field in a is the result evaluation of method b on 
     * that name.
	 **/
	org.yagnus.utils.object=function(a,b){
		var ret=new Object();
		var f=function(){return null;}
		if(b instanceof Array ) f=function(i){return b[i];}
		else if(b instanceof Function ) f=b;
		else if(typeof(b)!='undefined') f=function(){return b;}
		for(var i=0;i<a.length;++i)
			ret[a[i]]=f(a[i]);
		return ret;
	}
	oy.O=org.yagnus.utils.object;


	org.yagnus.utils.makeArray=function(){
			var ret= new Array();
			return ret;
	}

	//perform deep copy of arrays
	org.yagnus.utils.copyArray=function(c){
			if(c instanceof Array){
				var ret = [];
				for(var i=0;i<c.length;++i){
					ret[i]=org.yagnus.utils.copyArray(c[i]);
				}
				return ret;
			}else return c;
	}

	org.yagnus.utils.deepCopy=function(c){
			if(c instanceof Array)
				return org.yagnus.utils.copyArray(c);
			if(typeof c != 'object')
				return c;
			var ret={};
			for(var i in c) if(c.hasOwnProperty(i))
					ret[i]=org.yagnus.utils.deepCopy(c[i]);
			return ret;
	}
	org.yagnus.utils.shallowDuckType=function(tp,obj){
			if(tp instanceof Array){
				for(var i=0;i<tp.length;++i)if(!obj.hasOwnProperty(tp[i]))return false;
				return true;
			}else if (typeof(tp)=='object'){
				for(var i in tp)if(
					tp.hasOwnProperty(i) &&
					(!obj.hasOwnProperty(i) || typeof(tp[i])!=typeof(obj[i])))return false;
				return true;
			}else
				return false;
	}
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
/** 
 * This class implements a cascading comparator. the method org.yagnus.comparator.getFieldsComparator takes a list of fields as follows:
 * 
 *    var cmprtr=org.yagnus.comparator.getFieldsComparator('int1', 'int2', 'int3', '-int4', 'callMethod()','-callMethod()','+{me.getVolume()/me.getTime()}');
 *
 * it returns a function that can be passed to the sort function:
 *
 *    var t=[...some array of the object having fields int1,23,4, and callMethod()...]
 *    var sorted = t.sort(cmprtr)
 * 
 * Sorted now contain values of t sorted according the the order and direction specified for cmprtr. if the field leads with + or - then the
 *  sort direction is specified, + is for ascending, - is for descending. if the field ends with '()' then the name is called by name instead
 *  of accessed by name. Finally if the field is enclosed in curly brackets '{}' then the expression inside {} is evaluated for the field. The
 *  current object is refered to as 'me' inside the curly bracket.
 *
 * This class also provides convenient comparator methods called org.yagnus.comparator.cmp and org.yagnus.comparator.ncmp.
 *  cmp returns 1,-1,0 if first parameter is greater than, less than or equal to second parameter, respectively. The reversed 
 *  comparison function ncmp returns -1,1, and 0 respectively.
 *
 * By convention all comparisons will put "undefined" values as smallest values possible.
 *
 **/
	org.yagnus.comparator= new Object();
	org.yagnus.comparator.cmp=function(A,B){
		var ua = (typeof A)=='undefined';
		var ub = (typeof B)=='undefined';
		if(ua && ub) return 0;
		if(!ua && ub) return 1;
		if(ua && !ub) return -1;
		if(A>B)return 1;
		else if(A<B)return -1;
		else return 0;
	}	
	org.yagnus.comparator.ncmp=function(A,B){
		var ua = (typeof A)=='undefined';
		var ub = (typeof B)=='undefined';
		if(ua && ub) return 0;
		if(!ua && ub) return -1;
		if(ua && !ub) return +1;
		if(A>B)return -1;
		else if(A<B)return +1;
		else return 0;
	}
	org.yagnus.comparator.getFieldsComparator=function(){
		var my=this;
		my.fields=[];
		var Field = function(rf){
			var my=this;
			var cmp=org.yagnus.comparator.cmp;
			//remove leading +/-
			rf = ""+rf;//convert numbers to string
			rf = rf.trim();
			my.rf=rf;
			if(rf.indexOf('+')==0)
				rf=rf.substring(1);
			else if(rf.indexOf('-')==0){
				rf=rf.substring(1);
				cmp=org.yagnus.comparator.ncmp;
			}

			if(rf.indexOf('{')==0 && rf.indexOf('}')==rf.length-1){
				rf=rf.substring(1,rf.length-1);
				my.get=function(me){try{return eval(rf)}catch(e){/*ignore it*/}}
			}else{
				//remove surrounding []'s
				if(rf.indexOf('[')==0 && rf.indexOf(']')==rf.length-1){
					rf=rf.substring(1,rf.length-1);
				}			var rparan=rf.indexOf('()');
				if(rparan>0 && rparan ==rf.length-2){
					rf = rf.substring(0,rf.length-2);
					my.get=function(obj){ return obj[rf](); }
				}else{
					my.get=function(obj){ return obj[rf]; }
				}
			}
			my.pcmp=cmp;
			my.cmp=function(objA,objB){ return my.pcmp(my.get(objA),my.get(objB)); }
			my.toString=function(){
				return my.rf;
			}
		}
		for(var ind=0;ind<arguments.length; ++ind)my.fields.push(new Field(arguments[ind]));
		return function(objA,objB){
			for(fInd=0;fInd<my.fields.length;++fInd){
				var field = my.fields[fInd];
				var ret=field.cmp(objA,objB);
				if(ret!=0)return ret;
			}
			return 0;
		}
	}
	oy.Cmptr=org.yagnus.comparator.getFieldsComparator;

/*
var t=[[1,4,-1],[1,3,1],[1,2,-2],[1,1,2],[1,0,-3],[1,0,-5],[1,0,-6]];
print("t:\t\t"+t);
print("t.sort:\t\t"+t.sort());
print("(0,1,2):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(0,1,2)));
print("(-0,-1,-2):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator('-0',-1,-2)));
print("(2,1,0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(2,1,0)));
print("(1,2,0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(1,2,0)));
print("(-1,-2,-0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(-1,-2,-0)));
*/

/** 
//more eadvanced tests of access and curly eval's
var F = function(a,b){
	this.getA=function(){return a;}
	this.getB=function(){return b;}
	this.toString=function(){return "["+a+","+b+"]";};
}
var t=[new F(1,2),new F(3,1),new F(4,0),new F(5,-2),new F(3,0),new F(4,-2)];
print("sort:\t\t\t"+t.sort());
print("sort(A,B):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("getA()","getB()")));
print("sort(-A,B):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getA()","getB()")));
print("sort(-B,A):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getB()","getA()")));
print("sort(-B,-A):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getB()","-getA()")));
print("sort(-{B+A)):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-{me.getB()+me.getA()}")));
print("sort({B-A)):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("{me.getB()-me.getA()}")));
**/
org.yagnus.stats = new Object();
org.yagnus.stats.checkNumber=function(n){ return (n!=null) && (typeof n == 'number') && !isNaN(n) && isFinite(n); }

oys=org.yagnus.stats;
makeTop("oys",org.yagnus.stats);
	org.yagnus.stats.UnivariateBase=function (){
		this.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }
		this._inc=function(){}
		this._dec=function(x){return this._inc(-x);}
		this._inc_helper=function(addData, args){
				var ret = 0;
				var nargs = [];
				for(var i=0;i<args.length;++i){
					var ai=args[i];
					if(ai instanceof Object){
						//Objects, Arrays, Functions etc.
						if(ai instanceof Array) try{
							var tmparr=org.yagnus.utils.flatten(ai);
							if(addData)
								for(var ti=0;ti<tmparr.length;++ti)this._inc(tmparr[ti]);
							else
								for(var ti=0;ti<tmparr.length;++ti)this._inc(-tmparr[ti]);
						}catch(e){++this.bad;
						}else if(ai instanceof org.yagnus.stats.UniStats) try{
							this._update(ai);}catch(e){++this.bad;
						}else try{ //without checking type
							this._update(org.yagnus.utils.extend(org.yagnus.stats.initUnivariateSummaryStatistics(),ai));}catch(e){++this.bad;
						}
					}else//number, string, or boolean
					if(addData) this._inc(ai);
					else this._dec(ai);
				}
			}

		this.o=this.observe=this.inc=function(){this._inc_helper(true, arguments);}
		this.u=this.unobserve=this.dec=function(){this._inc_helper(false, arguments);}

		this.update=function(x){return this._update(x);}
		this.getMss=function(){
			return org.yagnus.utils.extend(new Object(),this);
		}
		this.copy=function(){
			return org.yagnus.utils.extend(new Object(),this);
		}
	}
	org.yagnus.stats.UniStats=function (o){
		this.bad=0;//bad inputs
		this.c=0;//count
		this.s=0.;//sum
		this.ss=0.;//sum of square
		this.sss=0.;//sum of cube
		this.ssss=0.;//sum of quintics
		this.min=org.yagnus.bigReal;
		this.max=org.yagnus.smallReal;
		this.mmbuffer=null;
		this.mmind=false;

		this.skip=function(n){return false;}
		this.touch=function(n){return n;}

		if(arguments.length>=1){
			if(arguments[0] instanceof Function)
				this.skip = arguments[0];
			else if(arguments[0] instanceof Object){
				try{
					var o=arguments[0];
					this.bad=o.bad;
					this.c=o.c;
					this.s=o.s;
					this.ss=o.ss;
					this.sss=o.sss;
					this.ssss=o.ssss;
					this.min=o.min;
					this.max=o.max;
					this.mmbuffer=o.mmbuffer;
					this.mmind=o.mmind;
				}catch(e){this.bbad=true;}
			}
		}

		if(arguments.length>=2  && arguments[1] instanceof Function){
			this.skip = arguments[1];
		}

	}
	org.yagnus.stats.UniStatsMethods=function (){
		this.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }
		this._dec=function(x){ if(this.checkNumber(x)){this.min=this.max=parseFloat('nan'); this._my_inc(-1,x); this.c-=2;}else ++this.bad; }
		this._inc=function(x){return this._my_inc(1,x);}
		this._my_inc=function(sign,x){
				try{
					if(typeof(x)=="string")x=parseFloat(x);
					if(this.checkNumber(x)){
						x=this.touch(x);
					}
					if(this.checkNumber(x)){
						this.c++;
						this.s += sign*x;
						xx=x*x;
						this.ss += sign*xx;
						xxx=xx*x;
						this.sss += sign*xxx;
						xxxx=xxx*x;
						this.ssss += sign*xxxx;
						if(this.mmind){
							if(this.mmbuffer>x){
								if(this.mmbuffer>this.max)this.max=this.mmbuffer;
								if(x<this.min)this.min=x;
							}else{
								if(x>this.max)this.max=x;
								if(this.mmbuffer<this.min)this.min=this.mmbuffer;
							}
							this.mmind=false;
						}else{
							this.mmbuffer=x;
							this.mmind=true;
						}
					}else ++this.bad;
				}catch(e){++this.bad;return;}
			}

			this._update=function(other){
				try{if(this.skip(other))return}catch(e){++this.bad;}
				if(this.checkNumber(other.c)) this.c += other.c;
				if(this.checkNumber(other.s)) this.s += other.s;
				if(this.checkNumber(other.ss)) this.ss += other.ss;
				if(this.checkNumber(other.sss)) this.sss += other.sss;
				if(this.checkNumber(other.ssss)) this.ssss += other.ssss;
				if(this.checkNumber(other.min) && this.min>other.min)this.min=other.min;
				if(this.checkNumber(other.max) && this.max<other.max)this.max=other.max;
				if(this.checkNumber(other.bad))this.bad+=other.bad;
				return this;
			}

			this.calc=function(){
				ret=new Object();
				ret.sum=this.s;
				ret.count=this.c;
				if(this.c>0){
					//e(x), e(x*x), e(x*x*x), and e(x*x*x*x)
					ex = this.s/this.c;
					exx = this.ss/this.c;
					exxx = this.sss/this.c;
					exxxx = this.ssss/this.c;
					//central moments:
					m1 = ex;
					m2 = this.ss/this.c - ex*ex;
					m3 = exxx - 3*exx*ex + 2 *ex*ex*ex;
					m4 = exxxx - 4 * ex * exxx + 6* ex*ex *exx - 3*ex*ex*ex*ex
					ret.average = m1; if(!this.checkNumber(ret.average))delete ret.average;
					ret.variance = m2; if(!this.checkNumber(ret.variance))delete ret.variance;
					ret.standardDeviation= Math.pow(ret.variance,.5);
					if(this.c>2){
						ret.skewness = Math.pow(this.c*(this.c-1),.5)/(this.c-2) * m3 / Math.pow(m2,1.5);
						if(!this.checkNumber(ret.skewness))delete ret.skewness;
					}
					if(m2>0){
						ret.kurtosis = m4 / m2 / m2;
						if(!this.checkNumber(ret.kurtosis))delete ret.kurtosis;
						else ret.excess_kurtosis=ret.kurtosis-3;
					}
					if(this.mmind){
						if(this.mmbuffer<this.min)this.min=this.mmbuffer;
						if(this.mmbuffer>this.max)this.max=this.mmbuffer;
						this.mmind=false;
					}
					ret.minimum = this.min;
					if(!this.checkNumber(ret.minimum))delete ret.minimum;
					ret.maximum = this.max;
					if(!this.checkNumber(ret.maximum))delete ret.maximum;
				}
				return ret;
			}
	}

	org.yagnus.stats.UniStatsMethods.prototype = new org.yagnus.stats.UnivariateBase();
	org.yagnus.stats.UniStats.prototype = new org.yagnus.stats.UniStatsMethods();
	org.yagnus.stats.initUnivariateSummaryStatistics = function (){
		var ar=null;
		var arr=null;
		if(arguments.length>0)ar=arguments[0];
		if(arguments.length>1)arr=arguments[1];
		var ret=new org.yagnus.stats.UniStats(ar,arr);
		if('bbad' in ret)
			return null;
		else 
			return ret;
	}
	oy.UVar  = org.yagnus.stats.initUnivariateSummaryStatistics;
	oys.UVar = org.yagnus.stats.initUnivariateSummaryStatistics;
/**
 * The discrete multivariate stats gatherer. Computes the full coocurrence matrix O(v^k) space where k is the number
 * of variables and v is number of levels.
 *
 *
 * @author hc.busy@yagn.us
 *
 **/

	org.yagnus.stats.DiscreteStats = function(nvar){
		if(typeof nvar=='undefined')nvar=1;
		else if(org.yagnus.utils.shallowDuckType(['nvar','contin','bad'],nvar)){
			//copy constructor
			var o=nvar;
			this.nvar=o.nvar;
			this.contin = org.yagnus.utils.deepCopy(o.contin);
			this.bad=o.bad;
		}else{
			this.nvar=nvar;//number of variables
			this.contin = {};
			this.bad=0;
		}
	}
	org.yagnus.stats.DiscreteStatsMethods = function(){
		var my=this;
		my.update=function(o){
			function _update(a1,a2){
				for(var key in a2)
					if(typeof a2[key] == 'number'){
						if(typeof a1[key] == 'number')
							a1[key] += a2[key];
						else if(typeof a1[key] == 'undefined')
							a1[key] = a2[key];
					}else if(typeof a2[key] == 'object' ){
						if(typeof a1[key] == 'undefined')a1[key]={};
						_update(a1[key],a2[key]);
					}
			}
			this.bad += o.bad;
			_update(this.contin, o.contin);
			return this;
		}


		my.o=my.observe=
		my.inc=function(){ this._inc_helper(1,arguments); }
		my.minc=function(c){ var my2=this; return function(){ my2._inc_helper(c,arguments); }};

		my.u=my.unobserve=
		my.dec=function(){ this._inc_helper(-1,arguments); }
		my.mdec=function(c){ var my2=this; return function(){my2._inc_helper(-c,arguments); }};

		my._inc_helper=function(cnt,args){
			var nargs = [];
			for(var i=0;i<args.length;++i){
				if(args[i] instanceof org.yagnus.stats.DiscreteStats) try{this.update(args[i]);}catch(e){++this.bad;}
				else nargs.push(args[i]);
			}

			while(nargs!=null && nargs.length==1 && nargs[0] instanceof Array){ nargs = args[0]; }
			if(this.nvar==nargs.length){
				var itr=this.contin;
				for(var i=0;i<this.nvar;++i){
					var ck=""+nargs[i];
					if(i<this.nvar-1){
						var arr = itr[ck];
						if((typeof arr)=='undefined')arr = {};
						itr[ck] = arr;
						itr = arr;
					}else{
						if((typeof itr[ck])!='number')
							itr[ck] = 0;
						itr[ck] += cnt;
					}
				}
			}else{this.bad += 1;}

		}

		my.getCount=function(){
			//copy arguments into an array. mongo doesn't put slice() on arguments object.
			if(arguments.length>this.nvar)return 0;//surely 0
			args = [];
			var x=0;
			for(;x<arguments.length;++x) args.push(arguments[x]);
			for(;x<this.nvar;++x) args.push(null);
			function _c(arr,arg){
				if(typeof arr == "number")return arr;
				if(typeof(arr) != 'object') return 0;
				if(arg.length<1)return 0;
				var myarg=arg[0];
				var narg=arg.slice(1,arg.length);
				var cnt=0;
				if((typeof myarg) == 'undefined' || myarg == null){
					for(var k in arr) if(arr.hasOwnProperty(k))
						cnt+=_c(arr[k],narg);
				}else{
					cnt += _c(arr[""+myarg],narg);
				}
				return cnt;
			}
			return _c(this.contin,args);
		}

		my.getAllCells=function(){
			var r={};
			function _c(arr,key,agg){
				if(key.length==my.nvar)
					agg[""+key]=arr;
				else
					for(var k in arr) _c(arr[k],key.concat([k]),agg);
			}
			_c(this.contin,[],r);
			return r;
		}

		my.calc=function(){
			return org.yagnus.stats.initDiscreteSummaryStatistics(this); //return a copy
		}
	}

	org.yagnus.stats.DiscreteStats.prototype= new org.yagnus.stats.DiscreteStatsMethods ();

	org.yagnus.stats.initDiscreteSummaryStatistics = function(nvar){
		return new org.yagnus.stats.DiscreteStats(nvar);
	}

	oy.DVar = org.yagnus.stats.initDiscreteSummaryStatistics;
	oy.Counter = org.yagnus.stats.initDiscreteSummaryStatistics;
	oys.DVar = org.yagnus.stats.initDiscreteSummaryStatistics;
	oys.Counter = org.yagnus.stats.initDiscreteSummaryStatistics;

/**
 * The multivariate stats gatherer. Computes the covariance matrix and related statistics using O(k^2) space where k is the number
 * of variables.
 *
 *
 * @author hc.busy@yagn.us
 *
 **/
	org.yagnus.stats.MultiStats = function(nvar,skipf){
		if(typeof nvar=='undefined')nvar=1;
		else if(org.yagnus.utils.shallowDuckType(['nvar','uni','bad','sxy','cxy','skip'],nvar)){
			//copy constructor
			var o=nvar;
			this.nvar=o.nvar;
			this.uni = org.yagnus.utils.deepCopy(o.uni);
			this.sxy= org.yagnus.utils.arrayCopy(o.sxy);
			this.cxy= org.yagnus.utils.arrayCopy(o.cxy);
			this.bad=o.bad;
			this.skip=o.skip;
		}else{
			//store individual univariate stats
			this.bad = 0;

			this.nvar=nvar;//number of variables

			this.uni = new Array(); 
			for(var i=0;i<this.nvar;++i)
				this.uni[i]=org.yagnus.stats.initUnivariateSummaryStatistics(this.skip);

			if(typeof skipf == 'undefined')
				this.skip=function(n){return false;}
			else
				this.skip = skipf;

			this.sxy = new Array();
			this.cxy = new Array();
			for(var i=0;i<nvar;++i){
				var narr=new Array();
				this.sxy[i]=narr;
				var carr=new Array();
				this.cxy[i]=carr;
				for(var j=0;j<i;++j){narr[j]=0;carr[j]=0;}
			}
		}
	}



	org.yagnus.stats.MultiStatMethods = function(nvar,skipf){
		
		this.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }

		this.update=function(o){
			if(this.nvar==o.nvar){
				for(var i=0;i<this.nvar;++i){
					this.uni[i].update(o.uni[i]);
					for(var j=0;j<i;++j){
						this.sxy[i][j]+=o.sxy[i][j];
						this.cxy[i][j]+=o.cxy[i][j];
					}
				}
			}
			if(this.checkNumber(o.bad))this.bad+=o.bad;
			return this;
		}


		this._inc_helper=function(addData, args){
			var paramCnt=0;
			var j=0;
			var nargs = [];
			for(var i=0;i<args.length;++i){
				var ai=args[i];
				if(ai instanceof org.yagnus.stats.MultiStats) try{this.update(ai);}catch(e){++this.bad;}
				else nargs.push(ai);
			}

			while(nargs!=null && nargs.length==1 && nargs[0] instanceof Array){ nargs = args[0]; }

			for(var i=0;i<this.nvar && i<nargs.length;++i){
				if(!this.checkNumber(nargs[i])){
					this.bad++;
					return 0;
				}
				paramCnt++;
			}
			if(paramCnt!=this.nvar){
				this.bad++;
				return 0;
			}
			for(var i=0;i<this.nvar;++i){
				this.uni[i]._inc_helper(addData,[nargs[i]]);
				if(addData){
					for(var j=0;j<i;++j) {
						this.sxy[i][j] += nargs[i]*nargs[j];
						++this.cxy[i][j];
					}
				}else{
					for(var j=0;j<i;++j) {
						this.sxy[i][j] -= nargs[i]*nargs[j];
						--this.cxy[i][j];
					}
				}
			}
			return 1;
		}
		
		this.o = this.observe   = this.inc=function(){this._inc_helper(true, arguments);}
		this.u = this.unobserve = this.dec=function(){this._inc_helper(false, arguments);}


		this.calc=function(){
			var ret={};
			var univariates = ret.univariates = [];

			//Covariance: http://en.wikipedia.org/wiki/Covariance
			var covariances= ret.covariances = [];
			for(var i=0;i<this.nvar;++i){
				univariates[i] = this.uni[i].calc();
				covariances[i] = new Array();
				for(var j=0;j<i;++j){
					covariances[i][j]=this.sxy[i][j]/this.cxy[i][j]-univariates[i].average*univariates[j].average
				}
			}
			ret.getCovariance=function(i,j){
				if(j==i)
					return this.univariates[i].variance;

				if(j<i) 
					return this.covariances[i][j];
				else 
					return this.covariances[j][i];
			}

			//Pearson's Product-moment Correlation Coefficient: http://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient
			ret.getPPMCC=function(i,j){
				return this.getCovariance(i,j) / this.univariates[i].standardDeviation / this.univariates[j].standardDeviation;
			}

			return ret;
		}

	}


	org.yagnus.stats.initMultivariateSummaryStatistics = function(nvar){
		var ret=new org.yagnus.stats.MultiStats(nvar);
		return ret;
	}
	oy.MVar = org.yagnus.stats.initMultivariateSummaryStatistics;
	oys.MVar = org.yagnus.stats.initMultivariateSummaryStatistics;
org.yagnus.stats.histogram = new Object();
	org.yagnus.stats.histogram.BasicHistogram=function (low,high,width){
		if(org.yagnus.utils.shallowDuckType(['low','high','width','counts','total','tooHigh','tooLow','bad'],low)){
			//make a copy
			var o = low;
			this.low=o.low;
			this.high=o.high;
			this.width=o.width;
			this.counts=org.yagnus.stats.initDiscreteSummaryStatistics(o.counts);
			this.total=o.total;
			this.tooHigh=o.tooHigh;
			this.tooLow=o.tooLow;
			this.bad=o.bad;
		} else if(arguments.length==3){
			this.low=low;
			this.high=high;
			this.width=width;
			this.counts=org.yagnus.stats.initDiscreteSummaryStatistics(1);
			this.total=0;
			this.tooHigh=0;
			this.tooLow=0;
			this.bad=0;
		}else { throw {message:"Bad parameter to BasicHistogram constructor."}}
	}

	org.yagnus.stats.histogram.BasicHistogram.prototype = new org.yagnus.stats.UnivariateBase();
	
	org.yagnus.stats.histogram.BasicHistogramPrototype={
		"_inc":function(x){ this._my_helper(1,x); },
	   "_dec":function(x){ this._my_helper(-1,x); },
	   "skip":function(x){ return false;},
		"checkNumber":function(n){ return (n!=null) && (typeof n == 'number') && !isNaN(n); },
		"_my_helper":function(n,x){
				if(this.checkNumber(x)){
					if(x<this.low)++this.tooLow;
					else if(x>=this.high)++this.tooHigh;
					else{
						var ind= Math.floor((x-this.low)/this.width);
						this.counts.minc(n)(ind);
						this.total+=n;
					}
				}else {
					this.bad += n;
				}
			},
		"_update":function(other){
				if(other.low!=this.low || other.high!=this.high || this.width!=other.width) return this; //unchanged
				this.total   += other.total;
				this.tooHigh += other.tooHigh;
				this.tooLow  += other.tooLow;
				this.bad += other.bad;
				this.counts.update(other.counts);
			},
		"getCount":function(inRange){
				var ind=Math.floor((inRange-this.low)/this.width);
				return this.counts.getCount(ind);
			},
		"getRatio":function(inRange){
				var ind=Math.floor((inRange-this.low)/this.width);
				return this.counts.getCount(ind)/this.total;
			},
		"calc":function(){
				return org.yagnus.utils.extend(new Object(),this);
			},
	}

	for(var x in org.yagnus.stats.histogram.BasicHistogramPrototype)
		org.yagnus.stats.histogram.BasicHistogram.prototype[x]=org.yagnus.stats.histogram.BasicHistogramPrototype[x];

	oy.BHist = org.yagnus.stats.histogram.initBasicHistogram=function(low, high, width){
		return new org.yagnus.stats.histogram.BasicHistogram(low, high, width);
	}
org.yagnus._={"explanation":"This object is a work-around for inheritence to survive through serialization"}
org.yagnus.stats.initUnivariateSummaryStatistics = function (){
	if(typeof(org.yagnus._.isUniStatsReady)!='boolean' || !org.yagnus.isUniStatsReady){
		org.yagnus.stats.UniStatsMethods.prototype = new org.yagnus.stats.UnivariateBase();
		org.yagnus.stats.UniStats.prototype = new org.yagnus.stats.UniStatsMethods();
		org.yagnus._.isUniStatsReady=true;
	}
	var ar=null;
	var arr=null;
	if(arguments.length>0)ar=arguments[0];
	if(arguments.length>1)arr=arguments[1];
	return new org.yagnus.stats.UniStats(ar,arr);
}
oy.UVar = org.yagnus.stats.initUnivariateSummaryStatistics;
oys.UVar = org.yagnus.stats.initUnivariateSummaryStatistics;




org.yagnus.stats.initMultivariateSummaryStatistics = function(nvar){
	if(typeof(org.yagnus._.isMultiStatsReady)!='boolean' || !org.yagnus.isMultiStatsReady){
		org.yagnus.stats.MultiStats.prototype = new org.yagnus.stats.MultiStatMethods();
		org.yagnus._.isMultiStatsReady=true;
	}
	var ret=new org.yagnus.stats.MultiStats(nvar);
	return ret;
}
oy.MVar = org.yagnus.stats.initMultivariateSummaryStatistics;
oys.MVar = org.yagnus.stats.initMultivariateSummaryStatistics;

org.yagnus.stats.initDiscreteSummaryStatistics=function(nvar){
	if(typeof(org.yagnus._.isDiscreteMultiStatsReady)!='boolean' || !org.yagnus.isDiscreteMultiStatsReady){
		org.yagnus.stats.DiscreteStats.prototype= new org.yagnus.stats.DiscreteStatsMethods ();
		org.yagnus._.isDiscreteMultiStatsReady=true;
	}
	return new org.yagnus.stats.DiscreteStats(nvar);
}
oy.DVar  = org.yagnus.stats.initDiscreteSummaryStatistics;
oy.Counter = org.yagnus.stats.initDiscreteSummaryStatistics;
oys.DVar = org.yagnus.stats.initDiscreteSummaryStatistics;
oys.Counter = org.yagnus.stats.initDiscreteSummaryStatistics;




org.yagnus.utils.initBitField=function(p){
	if(typeof(org.yagnus._.isBitFieldReady)!='boolean' || !org.yagnus._.isBitFieldReady){
		org.yagnus.utils.BitField.prototype = new org.yagnus.utils.BitFieldMethods();
		org.yagnus._.isBitFieldReady=true;
	}
	return new org.yagnus.utils.BitField(p);
}
oy.BF = org.yagnus.utils.initBitField;
oys.BF = org.yagnus.utils.initBitField;



org.yagnus.utils.initStreamingWindowStat=function(stat,window){
	if(typeof(org.yagnus._.isStreamingStatedReady)!='boolean' || !org.yagnus._.isStreamingStatedReady){
		org.yagnus.stats.windows.FixedWindowStreamableStats.prototype=new org.yagnus.stats.windows.FixedWindow();
		org.yagnus._.isStreamingStatedReady=true;
	}
	var ret = new org.yagnus.stats.windows.FixedWindowStreamableStats(stat,window);
	return ret;
}
oy.streamingWindowStat = org.yagnus.utils.initStreamingWindowStat;
oys.streamingWindowStat = org.yagnus.utils.initStreamingWindowStat;



org.yagnus.utils.initBufferWindowStat=function(stat,window){
	if(typeof(org.yagnus._.isBufferStatedReady)!='boolean' || !org.yagnus._.isBufferStatedReady){
		org.yagnus.stats.windows.FixedWindowBufferStats.prototype=new org.yagnus.stats.windows.FixedWindow();
		org.yagnus._.isBufferStatedReady=true;
	}
	var ret = new org.yagnus.stats.windows.FixedWindowBufferStats(stat,window);
	return ret;
}
oy.streamingWindowStat = org.yagnus.utils.initBufferWindowStat;
oys.streamingWindowStat = org.yagnus.utils.initBufferWindowStat;




org.yagnus.stats.histogram.initBasicHistogram=function(low, high, width){
	if(typeof(org.yagnus._.isBasicHistogramReady)!='boolean' || !org.yagnus._.isBasicHistogramReady){
   	org.yagnus.stats.histogram.BasicHistogram.prototype = new org.yagnus.stats.UnivariateBase();
		for(var x in org.yagnus.stats.histogram.BasicHistogramPrototype)
			org.yagnus.stats.histogram.BasicHistogram.prototype[x]=org.yagnus.stats.histogram.BasicHistogramPrototype[x];
		org.yagnus._.isBasicHistogramReady=true;
	}
	var ret = new org.yagnus.stats.histogram.BasicHistogram(low, high, width);
	return ret;
}
oys.BHist=oy.BHist = org.yagnus.stats.histogram.initBasicHistogram;


}).call(this);
