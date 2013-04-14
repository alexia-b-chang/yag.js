	org.yagnus = new Object();
	org.yagnus.smallInt=-9007199254740992;
	org.yagnus.bigInt=9007199254740992;
	org.yagnus.smallReal=-Number.MAX_VALUE;
	org.yagnus.bigReal=Number.MAX_VALUE;
	org.yagnus.randInt=function(i){return Math.floor(Math.random()*i);}
	oy=org.yagnus;
	oy.ri=org.yagnus.randInt;
	makeTop("oy",org.yagnus);
	org.yagnus.shuffleArray=function(arr){
			 for (var i = arr.length - 1; i > 0; i--) {
				  var j = org.yagnus.randInt(i+1);
				  var tmp = arr[i];
				  arr[i] = arr[j];
				  arr[j] = tmp;
			 }
			 return arr;
		}
	if(!(Array.prototype.shuffle instanceof Function)){
		Array.prototype.shuffle = function () {
			return org.yagnus.shuffleArray(this);
		}
	}
