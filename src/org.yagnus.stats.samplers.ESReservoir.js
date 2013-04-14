	org.yagnus.stats.samplers.ESReservoir=function (size){
		this.size = size;
		this.nh  = function(k,v){ return {key:k,value:v} }
		this.cmpnh  = function(x,y){ if(x.key>y.key)return 1; if(x.key<y.key)return -1; return 0; }
		//keep the maximum k items.
		this.samples=org.yagnus.algo.heap.Heap(this.cmpnh,size);
	}

	org.yagnus.stats.samplers.ESReservoir.prototype = new org.yagnus.stats.UnivariateBase();
	org.yagnus.stats.samplers.ESReservoir.prototype._inc=function(x,w){//perform the reservoir update
		var r = 1; while(r==0)r = org.yagnus.maths.ur();
		var akey = Math.pow(w,1/r);
		this.samples.add( this.nh( x, akey ) );
	}

	org.yagnus.stats.samplers.ESReservoir.prototype._update=function(other){//perform the reservoir update
		if(this.size==other.size)
			this.samples.update(other.samples);
	}

	org.yagnus.stats.samplers.ESReservoir.prototype.calc=function(){
		this.samples = this.samples.get();
		delete this._inc;
		delete this._update;
		delete this.size;
		delete this.nh;
		delete this.cmpnh;

		return {samples:this.samples};
	}

	org.yagnus.stats.samplers.initESReservoir = function (size){
		return new org.yagnus.stats.samplers.ESReservoir(size);
	}
	oy.ESRsvr = org.yagnus.stats.samplers.initESReservoir;
