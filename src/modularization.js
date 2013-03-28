(function(){
  var root = this;
  function makeTop(name,o){
	  //blatantly copied from other projects
	  if (typeof exports !== 'undefined') {
		 if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = o;
		 }
		 eval("exports."+name+" = o");
	  } else {
		 eval("root."+name+" = o");;
	  }
	}
