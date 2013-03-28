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
