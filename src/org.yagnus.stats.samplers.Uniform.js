	org.yagnus.stats.samplers.Uniform=function (percentKept){
	   this.seen=0;
		this.samples=[];
		this.ratio = percentKept/100;
	}

	org.yagnus.stats.samplers.Uniform.prototype = new org.yagnus.stats.UnivariateBase();
	org.yagnus.stats.samplers.Uniform.prototype._inc=function(x){
				if(org.yagnus.maths.ur()<this.ratio )//keep
					this.samples.push(x);
	}
	org.yagnus.stats.samplers.Uniform.prototype._update=function(other){
		if(other.seen instanceof Array &&  other.samples instanceof Number && other.ratio== this.ratio && other.samples.length>0){
			var newSeen = this.seen + other.seen;
			var newSamples = [];
			var newRatio=this.ratio;

			//add this
			var p1 = this.seen/newSeen;
			for(var i=0;i<this.seen.length;++i)if(org.yagnus.maths.ur()<p1)newSamples.push(this.seen[i]);

			//add other
			var p2 = other.seen/newSeen;
			for(var i=0;i<other.seen.length;++i)if(org.yagnus.maths.ur()<p2)newSamples.push(other.seen[i]);

			//update this
			this.seen=newSeen;
			this.newSamples = newSamples;
			this.ratio=newRatio;
			return this;
		}else
			return false;
	}
	org.yagnus.stats.samplers.Uniform.prototype.calc=function(){
		delete this.inc;
		delete this._inc;
		delete this._update;
		return org.yagnus.utils.extend(new Object(),this);
	}

	org.yagnus.stats.samplers.Uniform.prototype.copy=function(){
		return org.yagnus.utils.extend(new Object(),this);
   }

	org.yagnus.stats.samplers.initUniformSampler = function (percentage){
		return new org.yagnus.stats.samplers.Uniform(percentage);
	}
	oy.USamp = org.yagnus.stats.samplers.initUniformSampler;
