	//Implement support for Level Sets algorithms.
	org.yagnus.LevelSet = function(){ this.levels=[]; }
	org.yagnus.LevelSet.prototype.updateLevel=function(level){}
	org.yagnus.LevelSet.prototype.addAt=function(level,result){
		if (level in this.levels)this.levels[level].push(result);
		else this.levels[level]=[result];
		this.updateLevel(level);
	}
	org.yagnus.LevelSet.prototype.addAll=function(otherLS){
		//todo typecheck otherLS
		for(var i=0;i<otherLS.levels.length;++i)
			if(otherLS.levels[i] instanceof Array)
				for(var j=0;j<otherLS.levels[i].length;++j)
					this.addAt(i,otherLS.levels[i][j]);
	}

	oy.LS = org.yagnus.LevelSet;
