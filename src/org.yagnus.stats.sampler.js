	org.yagnus.stats.samplers.Uniform=function (percentKept){
	   this.seen=0;
		this.samples=[];
		this.percentage = percentKept/100;
	}

	org.yagnus.stats.samplers.Uniform.prototype.add=function(){
		for(var i=0;i<arguments.length;++i){
				this._add(arguments[i]);
		}
	}
	org.yagnus.stats.samplers.Uniform.prototype._add=function(x){
				if(Math.random()<this.percentage)//keep
					this.samples.push(x);
	}
	org.yagnus.stats.samplers.Uniform.prototype._update=function(other){
		if(other.seen instanceof Array &&  other.samples instanceof Number && other.percentage == this.percentage && other.samples.length>0){
			var newSeen = this.seen + other.seen;
			var newSamples = [];
			var newPercentage=this.percentage;

			//add this
			var p1 = this.seen/newSeen;
			for(var i=0;i<this.seen.length;++i)if(Math.random()<p1)newSamples.push(this.seen[i]);

			//add other
			var p2 = other.seen/newSeen;
			for(var i=0;i<other.seen.length;++i)if(Math.random()<p2)newSamples.push(other.seen[i]);

			//update this
			this.seen=newSeen;
			this.newSamples = newSamples;
			this.percentage=newPercentage;
			return this;
		}else
			return false;
	}
	org.yagnus.stats.samplers.Uniform.prototype.calc=function(){
		delete this.add;
		delete this._add;
		delete this._update;
		return org.yagnus.utils.extend(new Object(),this);
	}

	org.yagnus.stats.samplers.Uniform.prototype.copy=function(){
		return org.yagnus.utils.extend(new Object(),this);
   }

	org.yagnus.stats.samplers.initUniform = function (percentage){
		return new org.yagnus.stats.samplers.Uniform(percentage);
	}
	oy.USamp = org.yagnus.stats.samplers.initUniform;
