	org.yagnus.stats.UnivariateBase=function (){}
	org.yagnus.stats.UnivariateBase.prototype.checkNumber=function(n){return org.yagnus.stats.checkNumber(n) && !this.skip(n); }
	org.yagnus.stats.UnivariateBase.prototype.inc=function(){
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
		org.yagnus.stats.UnivariateBase.prototype.getMss=function(){
			return org.yagnus.utils.extend(new Object(),this);
		}
		org.yagnus.stats.UnivariateBase.prototype.copy=function(){
			return org.yagnus.utils.extend(new Object(),this);
		}
