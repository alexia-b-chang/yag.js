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
