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
