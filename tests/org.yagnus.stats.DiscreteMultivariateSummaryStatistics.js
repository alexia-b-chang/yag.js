var yagnus=require('../npm/yagnus');
var ae=require('../doubleTests').ae;

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },

    test_basic_getCount: function (test) {
		var s = org.yagnus.stats.initDiscreteSummaryStatistics(3);
		s.inc('a','b','c');
		s.inc('a','b','d');
		s.inc('b','c','d');
		s.inc('a','b','c');
		s.inc('c','b','a');


		var r = s.calc();
		test.equals(2, r.getCount('a','b','c'), "Checking a,b,c");
		test.equals(1, r.getCount('a','b','d'), "Checking a,b,d");
		test.equals(1, r.getCount('b','c','d'), "Checking b,c,d");
		test.equals(1, r.getCount('c','b','a'), "Checking c,b,a");
		test.equals(0, r.getCount('C','B','A'), "Checking C,B,A");
		test.equals(5, r.getCount(), "total count");

		test.done();
	},
	test_star_getCount: function (test) {
		var s = org.yagnus.stats.initDiscreteSummaryStatistics(3);
		s.inc('a','b','c');
		s.inc('a','b','d');
		s.inc('b','c','d');
		s.inc('a','b','c');
		s.inc('c','b','a');


		var r = s.calc();
		test.equals(2, r.getCount('a',null,'c'), "Checking a,b,c");
		test.equals(3, r.getCount('a',null,null), "Checking a,b,c");
		test.equals(3, r.getCount('a',null), "Checking a,b,c");

		test.equals(2, r.getCount(null,'b', 'c'), "Checking a,b,c");
		test.equals(4, r.getCount(null,'b', null), "Checking a,b,c");

		test.equals(2, r.getCount(null, null, 'c'), "Checking a,b,c");
		test.equals(1, r.getCount(null, 'c', null), "Checking a,b,c");
		test.equals(0, r.getCount(null, 'c', 'null'), "Checking a,b,c");

		test.equals(1, r.getCount(null, null, 'a'), "Checking a,b,c");
		test.equals(0, r.getCount(null, null, 'b'), "Checking a,b,c");

		test.equals(2, r.getCount(null, null, 'd'), "Checking a,b,c");

		test.equals(0, r.getCount('a','b','c','d'), "Checking a,b,c");

		test.done();
	},

   test_merge_dvar: function (test) {
		var s0 = org.yagnus.stats.initDiscreteSummaryStatistics(3);
		var s1 = org.yagnus.stats.initDiscreteSummaryStatistics(3);
		var s2 = org.yagnus.stats.initDiscreteSummaryStatistics(3);

		var input1=[['a','b','c'],['a','b','c'],['a','b','c'],['a','b','d'],['a','b','e'],['a','b','f'],['a','b','g']]
		var input2=[['a','b','c'],['a','b','c'],['a','b','c'],['a','b','d'],['a','b','e'],['a','b','f'],['a','b','g'],['c','d','e'],['f','g','h'],['i','j','k'],['e','f','g']]
		for(x in input1){
			s0.o.apply(s0,input1[x]);
			s1.o.apply(s1,input1[x]);
		}
		for(x in input2){
			s0.o.apply(s0,input2[x]);
			s1.o.apply(s2,input2[x]);
		}

		var ss=org.yagnus.stats.initDiscreteSummaryStatistics(3);
		ss.update(s1);
		ss.update(s2);
		
		var r1=s0.calc();
		var r2=ss.calc();

		test.ok(org.yagnus.utils.equalsIgnoreMember(r1,r2),"Checking that update-merging two results are same as s0");
		test.done();
	},
	test_shorthand:function (test) {
		test.equals(org.yagnus.stats.initDiscreteSummaryStatistics, oy.DVar, "checking that the oy shorthand works.");
		test.equals(org.yagnus.stats.initDiscreteSummaryStatistics, oy.Counter, "checking that the oy shorthand works.");
		test.equals(org.yagnus.stats.initDiscreteSummaryStatistics, oys.DVar, "checking that the oy shorthand works.");
		test.equals(org.yagnus.stats.initDiscreteSummaryStatistics, oys.Counter, "checking that the oy shorthand works.");
		test.done();
	}
}
