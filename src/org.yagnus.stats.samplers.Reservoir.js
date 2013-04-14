	org.yagnus.stats.samplers.Reservoir=function (size){
		this.size = size;
		this.samples=[];
		this.seen=0;
	}

	org.yagnus.stats.samplers.Reservoir.prototype._inc=function(x){//perform the reservoir update
		if(this.samples.length<size)this.samples.push(x);
		else{
			this.seen+=1;
			if(Math.random()< size/this.seen)
				this.samples[org.yagnus.randInt(this.size)]=x;
		}
	}
	org.yagnus.stats.samplers.Reservoir.prototype._update=function(other){//perform the reservoir update
		if(other.samples.length<this.size){//just add them in
			this.inc(other.samples);
		}else if(this.samples.length<this.size){
			var myarr=this.samples;
			//copy the other
			this.samples=other.samples.slice();
			this.seen=other.seen;
			//add myself back in;
			this.inc(myarr);
		}else{
			//both are actual samples
			var newSeen = this.seen + other.seen;
			var newSamples = [];
			var ts=org.yagnus.shuffleArray(this.samples.slice());
			var os=org.yagnus.shuffleArray(other.samples.slice());
			while(newSamples.length<this.size){
				var narr=[];
				if(Math.random()<this.seen/newSeen)narr=ts;
				else narr=os;
				if(narr.length>0)newSamples.push(narr.pop());
			}
			this.seen=newSEen;
			this.samples=newSamples;
		}
	}
	org.yagnus.stats.samplers.Reservoir.prototype.calc=function(){
		delete this._add;
		delete this._update;
		return org.yagnus.utils.extend(new Object(),this);
	}

	org.yagnus.stats.samplers.initReservoir = function (size){
		return new org.yagnus.stats.samplers.Reservoir(size);
	}
	oy.URsvr = org.yagnus.stats.samplers.initReservoir;
