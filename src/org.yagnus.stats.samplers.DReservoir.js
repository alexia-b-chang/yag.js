//distributed Reservoir using level set algorithm
	org.yagnus.stats.samplers.DReservoir=function (size){this.size=size;}
	org.yagnus.stats.samplers.DReservoir.prototype=new org.yagnus.LevelSet();
	org.yagnus.stats.samplers.DReservoir.prototype.updateLevel=function(level){
			if(level == 0 ){
				if(this.levels[0].length>=this.size){
					var dr=org.yagnus.stats.samplers.initReservoir(this.size);
					dr.inc(this.levels[0]);
					this.levels[0]=[];
					this.addAt(1,dr);
				}
			}else{
				if(level in this.levels)if(this.levels[level].length>1){
					var ml = this.levels[level];
					var accm = ml[0];
					for(var i=1;i<ml.length;++i)accm._update(ml[i];
					this.levels[level]=[];
					this.addAt(level+1,accm);
				}
			}
	}
