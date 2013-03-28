Yagn.us License, Copyright and Disclaimers v0.3

This document is about computer files that Yagn.us organization makes available to the public.

Yagn.us License:
* By downloading Yagn.us files you have read and understood and agree to abide by this entire license, and therefore, you are hereby granted rights to copy, modify and use Yagn.us files except:
* A copy of this license must accompany each copy o fYagn.us files or binary object code produced from them.
* You cannot use name Yagn.us or the names of its contributors in association with Yagn.us to promote your product or cause.
* You must make the fact of Yagn.us file usage public knowledge by stating in the natural language(s) used by the software or system, on a public forum, uniquely locatable by an URL, indexed by major search systems, that your software or system uses Yagn.us files and that those files are being used under this license and the text of this license.
* You must report bugs as soon as they are discovered to Yagn.us via email and at a publicly accessible URL indexed by major search systems.
* Academic use of Yagn.us files must cite Yagn.us as the creator and maintainer of these files.

Free Yagn.us Open License:
* By downloading Free Yagn.us Open files you agree that you have read and understood and agree to abide by both the Yagn.us License and this entire licnse, and therefore, they are hereby granted rights to copy, modify and use Free Yagn.us Open files except:
* You cannot use, compile, package, or transmit with or as part any content or system for commercial purpose.
* These files cannot be used in efforts towards discovery, improvement, construction, storage or deployment of weapons or in support thereof. Free Yagn.us Open files is absolutely against war.
* These files cannot be used in efforts towards discovery, invasion, violation or corruption of personally, commercially or nationally secret information and properties, or in support thereof, without regard to intentions and goals of such efforts, and without regards to the reason for the privacy or secrecy. Free Yagn.us Open files is absolutely against spying or hacking.

Under both license files are provided "as is" without any stated or implied warranties of efficacy or lack thereof towards any end. Yagn.us or any person associated with this entity are not liable for any effects or side-effects caused by the use of Yagn.us and Free Yagn.us Open files.

Use of files, not exclusively, include: Downloading files, unarchiving a file containing this notice, viewing, modifying, compiling, interpreting, executing, linking with, invoking subroutines, encrypting, decrypting, summarizing, pruning, optimizing, refactoring, documenting, explaining, deriving entropy from, deriving linguistic or any other pattern from, or otherwise transforming, extractions, and citation including quoting, linking or mentioning Yagn.us.
Weapons are waves, particles, substances, devices, organisms and procedures whose primary reason, in design or in practice, for being known or designed or created is to be used to destroy, kill, injure, maim, disable, damage, mutate, debilitate or otherwise undesirably alter human, human conditions and human creations.
Information private to an entity are those that may or may not be known to the entity itself but are unknown to other entities without the other entity's effort.
Information secret to an entity are those that the entity either declares to be secret or makes effort to keep unknown or uncertain to other entities.
You are an entity choosing and downloading the Yagn.us files.

Copyright (c) 2013 and forward, Yagn.us. All rights reserved.
a7f52d1c38a1442dc4db7f34df787364
256dee505f4e8cf1afa3c262c072cd0b84af8f72583ad0df00436f8fe40d86b6712980c92d97373c2fd8efa46e94440be5f99f7492f962a0fbe259ccc142e674
(function(){
  var root = this;
  function makeTop(name,o){
	  //blatantly copied from other projects
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
	org.yagnus.smallInt=-9007199254740992;
	org.yagnus.bigInt=9007199254740992;
	org.yagnus.smallReal=-Number.MAX_VALUE;
	org.yagnus.bigReal=Number.MAX_VALUE;
	oy=org.yagnus;
	makeTop("oy",org.yagnus);

	org.yagnus.utils = new Object();

	// Users may wish to replace util class with underscore.js or one of the other projects having identical names.
	org.yagnus.utils.flatten=function(arr){
		if(arr==null || ! arr instanceof Array)
			return arr;
		var ret=[]
		for(var i=0;i<arr.length;++i){
			if(arr[i]!=null && arr[i] instanceof Array)ret = ret.concat(org.yagnus.flatten(arr));
			else ret.push(arr);
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
/**
 * This object calculates some very basic univariate statistics including min/max, mean, variance, skew and kurtosis.
 *
 * The package runs both in browsers and in mongodb. The algorithms all use constant memory (The original data is not kept in memory)
 * to construct call:
 * <pre>
 *     var stats = org.yagnus.stats.initUnivariateSummaryStatistics();
 * </pre>
 *
 * during updates call the .inc(x) method. This method returns the number of values added to stats excluding NaN and other "excluded numbers".
 *
 * <pre>
 *     var stats.inc(1);
 *     var stats.inc(2);
 *     var stats.inc(3);
 *     var stats.inc(100);
 *     var stats.inc(-3,-2,-1); //or add many values at once
 *     var stats.inc(curVallue);
 *     //...etc
 * </pre>
 *
 * And to get the value out of the variable
 * <pre>
 *     var results=stats.calc();
 *     {
 *   	"count" : 7,
 *   	"average" : 14.285714285714286,
 *   	"variance" : 1418.2857142857144,
 *   	"skew" : 2.1182837291937906,
 *   	"kurtosis" : 7077.668048432678,
 *   	"minimum" : -3,
 *   	"maximum" : 100
 *     }
 * </pre>
 *
 * Note: a calc'ed object can not be updated again.
 *
 * A constructor parameter can specify a filtering function that allows us to skip numerical values.
 * For example if we want to keep only values between 0 and 100:
 *
 * <pre>
 *     var stats = initUnivariateSummaryStatistics(function(n){return n >=0 && n<=100;);
 * </pre>
 *
 * If data are summarized in parallel producing several stats objects then they can be merged using the update method:
 * <pre>
 *     var merger = initUnivariateSummaryStatistics();
 *     ... make some calculates that result in partial1, partial2, and partial3
 *     merger.inc(partial1);
 *     merger.inc(partial2);
 *     merger.inc(partial3);
 *     var merged_results = merger.calc();
 * </pre>
 *
 *
 *
 *
 * @author hc.busy@yagn.us
 */
	org.yagnus.stats.UniStats=function (){
		this.bad=0;//bad inputs
		this.c=0;//count
		this.s=0.;//sum
		this.ss=0.;//sum of square
		this.sss=0.;//sum of square
		this.ssss=0.;//sum of square
		this.min=org.yagnus.bigReal;
		this.max=org.yagnus.smallReal;
		this.mmbuffer=null;
		this.mmind=false;
		if(arguments.length<1 || !(arguments[0] instanceof Function)){
			this.skip=function(n){return false;}
		}else{
			this.skip = arguments[0];
		}
		if(arguments.length<2 || !(arguments[1] instanceof Function)){
			this.touch=function(n){return n;}
		}else{
			this.skip = arguments[1];
		}
	}


	org.yagnus.stats.UniStats.prototype.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }
	org.yagnus.stats.UniStats.prototype.inc=function(){
			var ret = 0;
			var nargs = [];
			for(var i=0;i<arguments.length;++i){
				if(arguments[i] instanceof Object){
					//Objects, Arrays, Functions etc.
					if(arguments[i] instanceof Array) try{
						var tmparr=org.yagnus.utils.flatten(arguments[i]);
						for(var ti=0;ti<tmparr.length;++ti)this._inc(tmparr[ti]);}catch(e){++this.bad;
					}else if(arguments[i] instanceof org.yagnus.stats.UniStats) try{
						this._update(arguments[i]);}catch(e){++this.bad;
					}else try{ //without checking type
						this._update(org.yagnus.utils.extend(org.yagnus.stats.initUnivariateSummaryStatistics(),arguments[i]));}catch(e){++this.bad;
					}
				}else//number, string, or boolean
					this._inc(arguments[i]);
			}
		}
		org.yagnus.stats.UniStats.prototype._inc=function(x){
			try{
				if(typeof(x)=="string")x=parseFloat(x);
				if(this.checkNumber(x)){
					x=this.touch(x);
				}
				if(this.checkNumber(x)){
					this.c++;
					this.s += x;
					xx=x*x;
					this.ss += xx;
					xxx=xx*x;
					this.sss += xxx;
					xxxx=xxx*x;
					this.ssss += xxxx;
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

		org.yagnus.stats.UniStats.prototype._update=function(other){
			try{if(this.skip(other))return}catch(e){++this.bad;}
			if(this.checkNumber(other.c)) this.c += other.c;
			if(this.checkNumber(other.s)) this.s += other.s;
			if(this.checkNumber(other.ss)) this.ss += other.ss;
			if(this.checkNumber(other.sss)) this.sss += other.sss;
			if(this.checkNumber(other.ssss)) this.ssss += other.ssss;
			if(this.checkNumber(other.min) && this.min>other.min)this.min=other.min;
			if(this.checkNumber(other.max) && this.max<other.max)this.max=other.max;
			if(this.checkNumber(other.bad))this.bad+=other.bad;
		}

		org.yagnus.stats.UniStats.prototype.getMss=function(){
			return org.yagnus.utils.extend(new Object(),this);
		}

		org.yagnus.stats.UniStats.prototype.calc=function(){
			this.sum=this.s;
			this.count=this.c;
			if(this.c>0){
				//e(x), e(x*x), e(x*x*x), and e(x*x*x*x)
				ex = this.s/this.c;
				exx = this.ss/this.c;
				exxx = this.sss/this.c;
				exxxx = this.ssss/this.c;
				//central moments:
				m1 = ex;
				m2 = this.ss/this.c - ex;
				m3 = exxx - 3*exx*ex + 2 *ex*ex*ex;
				m4 = exxxx - 3*exxx*ex + 6*exx*ex*ex - -3*ex*ex*ex*ex ;
				this.average = m1; if(!this.checkNumber(this.average))delete this.average;
				this.variance = m2; if(!this.checkNumber(this.variance))delete this.variance;
				this.standardDeviation= Math.pow(this.variance,.5);
				if(this.c>2){
					//http://www.amstat.org/publications/jse/v19n2/doane.pdf
					//http://en.wikipedia.org/wiki/Skewness
					this.skew = Math.pow(this.c*(this.c-1),.5)/(this.c-2) * m3 / Math.pow(m2,1.5);
					if(!this.checkNumber(this.skew))delete this.skew;
				}
				if(m2>0){
					//http://en.wikipedia.org/wiki/Kurtosis
					this.kurtosis = m4 / m2 / m2 - 3
					if(!this.checkNumber(this.kurtosis))delete this.kurtosis;
				}
				if(this.mmind){
					if(this.mmbuffer<this.min)this.min=this.mmbuffer;
					if(this.mmbuffer>this.max)this.max=this.mmbuffer;
				}
				this.minimum = this.min;
				if(!this.checkNumber(this.minimum))delete this.minimum;
				this.maximum = this.max;
				if(!this.checkNumber(this.maximum))delete this.maximum;
			}
			delete this.c; delete this.s; delete this.ss; delete this.sss; delete this.ssss; delete this.min; delete this.max; delete this.inc; delete this._inc; delete this._update; delete this.calc; delete this.update; delete this.checkNumber; delete this.skip; delete this.mmind; delete this.mmbuffer;
			return org.yagnus.utils.extend(new Object(),this);
		}

	org.yagnus.stats.UniStats.prototype.copy=function(){
		return org.yagnus.utils.extend(new Object(),this);
   }

	org.yagnus.stats.initUnivariateSummaryStatistics = function (){
		var ar=null;
		var arr=null;
		if(arguments.length>0)ar=arguments[0];
		if(arguments.length>1)arr=arguments[1];
		return new org.yagnus.stats.UniStats(ar,arr);
	}
	oy.UVar = org.yagnus.stats.initUnivariateSummaryStatistics;
/**
 * The discrete multivariate stats gatherer. Computes the full coocurrence matrix O(v^k) space where k is the number
 * of variables and v is number of levels.
 *
 *
 * @author hc.busy@yagn.us
 *
 **/

	org.yagnus.stats.DiscreteStats = function(nvar){
		this.makeArray=function(){
			var ret= new Array();
			return ret;
		}
		this.nvar=nvar;//number of variables
		this.contin = this.makeArray();
		this.bad=0;
	}

	org.yagnus.stats.initDiscreteSummaryStatistics = function(nvar){
		if(typeof nvar=='undefined')nvar=1;
		var ret=new org.yagnus.stats.DiscreteStats(nvar);
		var my=ret;

		ret.update=function(o){
			function _update(a1,a2){
				for(var key in a2)
					if(typeof a2[key] == 'number'){
						if(typeof a1[key] == 'number')
							a1[key] += a2[key];
						else if(typeof a1[key] == 'undefined')
							a1[key] = a2[key];
					}else if(typeof a2[key] == 'object' && typeof a1[key] == 'object'){
						_update(a1[key],a2[key]);
					}
			}
			_update(this.contin, o.contin);
		}

		ret.inc=function(){
			var nargs = [];
			for(var i=0;i<arguments.length;++i){
				if(arguments[i] instanceof org.yagnus.stats.DiscreteStats) try{this.update(arguments[i]);}catch(e){++this.bad;}
				else nargs.push(arguments[i]);
			}

			while(nargs!=null && nargs.length==1 && nargs[0] instanceof Array){ nargs = arguments[0]; }

			if(this.nvar==nargs.length){
				var itr=this.contin;
				for(var i=0;i<this.nvar;++i){
					var ck=""+nargs[i]
					if(i<this.nvar-1){
						var arr = itr[ck];
						if(typeof arr=='undefined')arr = my.makeArray();
						itr[ck] = arr;
						itr = arr;
					}else{
						if(typeof itr[ck]!='number')
							itr[ck] = 0;
						++ itr[ck];
					}
				}
			}else{this.bad += 1;}
		}

		ret.getCount=function(){
			var my=this;

			//copy arguments into an array. mongo doesn't put slice() on arguments object.
			args = [];
			var x=0;
			for(;x<arguments.length;++x) args.push(arguments[x]);
			for(;x<this.nvar;++x) args.push(null);

			function _c(arr,arg){
				if(typeof arr == "number")return arr;
				if(! arr instanceof Array) return 0;
				if(arg.length<1)return 0;
				var myarg=arg[0];
				var narg=arg.slice(1,arg.length);
				var cnt=0;
				if(typeof myarg == 'undefined' || myarg == null){
					for(var k in arr)
						cnt+=_c(arr[k],narg);
				}else{
					cnt += _c(arr[""+myarg],narg);
				}
				return cnt;
			}
			return _c(this.contin,args);
		}

		ret.getAllCells=function(){
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

		ret.calc=function(){
			delete this.inc; delete this.calc; delete this.update;
			return this;
		}
		return ret;
	}

	oy.DVar = org.yagnus.stats.initDiscreteSummaryStatistics;
	oy.Counter = org.yagnus.stats.initDiscreteSummaryStatistics;

/**
 * The multivariate stats gatherer. Computes the covariance matrix and related statistics using O(k^2) space where k is the number
 * of variables.
 *
 *
 * @author hc.busy@yagn.us
 *
 **/
	org.yagnus.stats.MultiStats = function(nvar,skipf){
		this.nvar=nvar;//number of variables

		//store individual univariate stats
		this.uni = new Array(); 
		this.bad = 0;
		if(typeof skipf == 'undefined')
			this.skip=function(n){return false;}
		else
			this.skip = skipf;
		for(var i=0;i<this.nvar;++i)
			this.uni[i]=org.yagnus.stats.initUnivariateSummaryStatistics(this.skip);
		
		//also store pairwise correlation
		this.sxy = new Array();
		this.cxy = new Array();
		for(var i=0;i<nvar;++i){
			var narr=new Array();
			this.sxy[i]=narr;
			var carr=new Array();
			this.cxy[i]=carr;
			for(var j=0;j<i;++j){narr[j]=0;carr[j]=0;}
		}

		this.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }
	}

	org.yagnus.stats.initMultivariateSummaryStatistics = function(nvar){
		var ret=new org.yagnus.stats.MultiStats(nvar);
		ret.update=function(o){
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
		}

		ret.inc=function(){
			var paramCnt=0;
			var j=0;
			var nargs = [];

			for(var i=0;i<arguments.length;++i){
				if(arguments[i] instanceof org.yagnus.stats.MultiStats) try{this.update(arguments[i]);}catch(e){++this.bad;}
				else nargs.push(arguments[i]);
			}

			while(nargs!=null && nargs.length==1 && nargs[0] instanceof Array){ nargs = arguments[0]; }

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
				this.uni[i].inc(nargs[i]);
				for(var j=0;j<i;++j)
					if(this.checkNumber(nargs[j])){
						this.sxy[i][j] += nargs[i]*nargs[j];
						++this.cxy[i][j];
					}
				ret++;
			}
			return 1;
		}

		ret.calc=function(){
			this.univariates = this.uni;
			//Covariance: http://en.wikipedia.org/wiki/Covariance
			this.covariances=[];
			for(var i=0;i<this.nvar;++i){
				this.univariates[i].calc();
				this.covariances[i] = new Array();
				for(var j=0;j<i;++j)this.covariances[i][j]=this.sxy[i][j]/this.cxy[i][j]-this.uni[i].average*this.uni[j].average
			}
			this.getCovariance=function(i,j){
				if(j==i){
					return this.univariates[i].variance;
				}if(j>i){var t=i;i=j;j=t;}
				return this.covariances[i][j];
			}

			//Pearson's Product-moment Correlation Coefficient: http://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient
			this.getPPMCC=function(i,j){
				if(j==i){//standard deviation
					return this.univariates[i].standardDeviation;
				}if(j>i){var t=i;i=j;j=t;}
				return this.covariances[i][j] / this.univariates[i].standardDeviation / this.univariates[j].standardDeviation;
			}

			//cleanup
			delete this.nvar; delete this.uni; delete this.sxy; delete this.cxy; delete this.inc; delete this.calc; delete this.skip;delete this.checkNumber;delete this.update;
			return this;
		}
		return ret;
	}
	oy.MVar = org.yagnus.stats.initMultivariateSummaryStatistics;
}).call(this);
