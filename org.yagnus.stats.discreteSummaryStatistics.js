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

