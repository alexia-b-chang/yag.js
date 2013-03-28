/** 
 * This class implements a cascading comparator. the method org.yagnus.comparator.getFieldsComparator takes a list of fields as follows:
 * 
 *    var cmprtr=org.yagnus.comparator.getFieldsComparator('int1', 'int2', 'int3', '-int4', 'callMethod()','-callMethod()','+{me.getVolume()/me.getTime()}');
 *
 * it returns a function that can be passed to the sort function:
 *
 *    var t=[...some array of the object having fields int1,23,4, and callMethod()...]
 *    var sorted = t.sort(cmprtr)
 * 
 * Sorted now contain values of t sorted according the the order and direction specified for cmprtr. if the field leads with + or - then the
 *  sort direction is specified, + is for ascending, - is for descending. if the field ends with '()' then the name is called by name instead
 *  of accessed by name. Finally if the field is enclosed in curly brackets '{}' then the expression inside {} is evaluated for the field. The
 *  current object is refered to as 'me' inside the curly bracket.
 *
 * This class also provides convenient comparator methods called org.yagnus.comparator.cmp and org.yagnus.comparator.ncmp.
 *  cmp returns 1,-1,0 if first parameter is greater than, less than or equal to second parameter, respectively. The reversed 
 *  comparison function ncmp returns -1,1, and 0 respectively.
 *
 * By convention all comparisons will put "undefined" values as smallest values possible.
 *
 **/
	org.yagnus.comparator= new Object();
	org.yagnus.comparator.cmp=function(A,B){
		var ua = (typeof A)=='undefined';
		var ub = (typeof B)=='undefined';
		if(ua && ub) return 0;
		if(!ua && ub) return 1;
		if(ua && !ub) return -1;
		if(A>B)return 1;
		else if(A<B)return -1;
		else return 0;
	}	
	org.yagnus.comparator.ncmp=function(A,B){
		var ua = (typeof A)=='undefined';
		var ub = (typeof B)=='undefined';
		if(ua && ub) return 0;
		if(!ua && ub) return -1;
		if(ua && !ub) return +1;
		if(A>B)return -1;
		else if(A<B)return +1;
		else return 0;
	}
	org.yagnus.comparator.getFieldsComparator=function(){
		var my=this;
		my.fields=[];
		var Field = function(rf){
			var my=this;
			var cmp=org.yagnus.comparator.cmp;
			//remove leading +/-
			rf = ""+rf;//convert numbers to string
			rf = rf.trim();
			my.rf=rf;
			if(rf.indexOf('+')==0)
				rf=rf.substring(1);
			else if(rf.indexOf('-')==0){
				rf=rf.substring(1);
				cmp=org.yagnus.comparator.ncmp;
			}

			if(rf.indexOf('{')==0 && rf.indexOf('}')==rf.length-1){
				rf=rf.substring(1,rf.length-1);
				my.get=function(me){try{return eval(rf)}catch(e){/*ignore it*/}}
			}else{
				//remove surrounding []'s
				if(rf.indexOf('[')==0 && rf.indexOf(']')==rf.length-1){
					rf=rf.substring(1,rf.length-1);
				}			var rparan=rf.indexOf('()');
				if(rparan>0 && rparan ==rf.length-2){
					rf = rf.substring(0,rf.length-2);
					my.get=function(obj){ return obj[rf](); }
				}else{
					my.get=function(obj){ return obj[rf]; }
				}
			}
			my.pcmp=cmp;
			my.cmp=function(objA,objB){ return my.pcmp(my.get(objA),my.get(objB)); }
			my.toString=function(){
				return my.rf;
			}
		}
		for(var ind=0;ind<arguments.length; ++ind)my.fields.push(new Field(arguments[ind]));
		return function(objA,objB){
			for(fInd=0;fInd<my.fields.length;++fInd){
				var field = my.fields[fInd];
				var ret=field.cmp(objA,objB);
				if(ret!=0)return ret;
			}
			return 0;
		}
	}
	oy.Cmptr=org.yagnus.comparator.getFieldsComparator;

/*
var t=[[1,4,-1],[1,3,1],[1,2,-2],[1,1,2],[1,0,-3],[1,0,-5],[1,0,-6]];
print("t:\t\t"+t);
print("t.sort:\t\t"+t.sort());
print("(0,1,2):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(0,1,2)));
print("(-0,-1,-2):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator('-0',-1,-2)));
print("(2,1,0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(2,1,0)));
print("(1,2,0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(1,2,0)));
print("(-1,-2,-0):\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator(-1,-2,-0)));
*/

/** 
//more eadvanced tests of access and curly eval's
var F = function(a,b){
	this.getA=function(){return a;}
	this.getB=function(){return b;}
	this.toString=function(){return "["+a+","+b+"]";};
}
var t=[new F(1,2),new F(3,1),new F(4,0),new F(5,-2),new F(3,0),new F(4,-2)];
print("sort:\t\t\t"+t.sort());
print("sort(A,B):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("getA()","getB()")));
print("sort(-A,B):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getA()","getB()")));
print("sort(-B,A):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getB()","getA()")));
print("sort(-B,-A):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-getB()","-getA()")));
print("sort(-{B+A)):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("-{me.getB()+me.getA()}")));
print("sort({B-A)):\t\t\t"+t.sort(org.yagnus.comparator.getFieldsComparator("{me.getB()-me.getA()}")));
**/
