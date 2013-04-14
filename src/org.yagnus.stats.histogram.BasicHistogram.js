	org.yagnus.stats.histogram.BasicHistogram=function (low,high,width){
		this.low=low;
		this.high=high;
		this.width=width;
		var binCount=Math.ceil(=(high-low)/width);
		this.counts=org.yagnus.stats.initDiscreteSummaryStatistics(1);
		this.total=0;
		this.tooHigh=0;
		this.tooLow=0;
		this.bad=0;
	}

	org.yagnus.stats.histogram.BasicHistogram.prototype = new org.yagnus.stats.UnivariateBase();
	org.yagnus.stats.histogram.BasicHistogram.prototype._inc=function(x){
		if(x<this.low)++this.tooLow;
		else if(x>=this.high)++this.tooHigh;
		else{
			var ind= Math.floor((x-this.low)/this.width);
			this.counts.inc(ind);
			++this.total;
		}
	}

	org.yagnus.stats.histogram.BasicHistogram.prototype._update=function(other){
		if(other.low!=this.low || other.high!=this.high || this.width!=other.width) return this; //unchanged
		this.total   += other.total;
		this.tooHigh += other.tooHigh;
		this.tooLow  += other.tooLow;
		this.bad += other.bad;
		this.counts.update(other.counts);
	}

	org.yagnus.stats.histogram.BasicHistogram.prototype.getCount=function(inRange){
		var ind=Math.floor((inRange-this.low)/this.width);
		return this.counts.getCount(ind);
	}
	org.yagnus.stats.histogram.BasicHistogram.prototype.getRatio=function(inRange){
		var ind=Math.floor((inRange-this.low)/this.width);
		return this.counts.getCount(ind)/this.total;
	}
	org.yagnus.stats.histogram.BasicHistogram.prototype.calc=function(){
		return org.yagnus.utils.extend(new Object(),this);
	}

	org.yagnus.stats.histogram.hist = function (low,high,width){
		return new org.yagnus.stats.histogram.BasicHistogram(low,high,width);
	}

	oy.BHist = org.yagnus.stats.histogram.hist;
