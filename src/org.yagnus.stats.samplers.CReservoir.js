	org.yagnus.stats.samplers.CReservoir=function (size){
		this.size = size;
		this.samples=[];
		this.inf=[];
		this.seen=0;
	}

	org.yagnus.stats.samplers.CReservoir.prototype = new org.yagnus.stats.UnivariateBase();
	org.yagnus.stats.samplers.CReservoir.prototype._insert=function(x){ this.samples[org.yagnus.maths.ri(this.size)]=x; }
	org.yagnus.stats.samplers.CReservoir.prototype._inc=function(x,w){//perform the reservoir update
		if(this._inc(x,w))this._checkInfs();
	}

	org.yagnus.stats.samplers.CReservoir.prototype._checkInfs=function(x,w){//perform the reservoir update
		//check infeasible items
		var newinf=[]
		for(var i=this.inf.length-1;i>-1;--i){
			//same logic as _inc but doesn't increase this.seen again
			var np=this.inf[i][1]/this.seen
			if(np <= 1 && org.yagnus.maths.ur() < np)
				this._insert(this.inf[i][0]);
			else
				newinf.push(this.info[i]);
		}
		this.inf=newinf;
	}
	org.yagnus.stats.samplers.CReservoir.prototype.__inc=function(x,w){//perform the reservoir update
		if(this.samples.length<size)this.samples.push(x);
		else{
			if(w>0){
				this.seen+=w/this.size;
				var p = w/this.seen;
				if(p>1){
					this.inf.push([x,w]);
					return false;
				}else{
					if(org.yagnus.maths.ur()<p)
						this._insert(x);
					return true;
				}
			}
		}
	}
	org.yagnus.stats.samplers.CReservoir.prototype._update=function(other){//perform the reservoir update
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
				if(org.yagnus.maths.ur()<this.seen/newSeen)narr=ts;
				else narr=os;
				if(narr.length>0)newSamples.push(narr.pop());
			}
			this.seen=newSeen;
			this.samples=newSamples;

			this.inf = this.inf.concat(other.inf);
			this._checkInfs();
		}
	}
	org.yagnus.stats.samplers.CReservoir.prototype.calc=function(){
		delete this._inc;
		delete this._update;

		//add all the infeasible back in.
		//TODO: check for error case where this.inf.length>this.size
		for(var i=this.inf.length-1;i>-1;--i)
			this._insert(this.inf[i][0]);

		delete this.inf;
		delete this._checkInfs;
		delete this._insert;

		return org.yagnus.utils.extend(new Object(),this);
	}

	org.yagnus.stats.samplers.initCReservoir = function (size){
		return new org.yagnus.stats.samplers.CReservoir(size);
	}
	oy.CRsvr = org.yagnus.stats.samplers.initCReservoir;
