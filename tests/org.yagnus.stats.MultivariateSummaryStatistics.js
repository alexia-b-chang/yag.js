var yagnus=require('../npm/yagnus');
var ae=require('../doubleTests').ae;

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        callback();
    },

    test_basic_get_set: function (test) {

		var s = org.yagnus.stats.initMultivariateSummaryStatistics(3);

		for(var i=0;i<100;++i){
			s.o(i,2*i,Math.pow(2,i));
		}
		var sc=s.calc();

		//test the PPMCC's
		test.ok(ae(1,sc.getPPMCC(0,0)));
		test.ok(ae(1,sc.getPPMCC(1,1)));
		test.ok(ae(1,sc.getPPMCC(2,2)));
		test.ok(ae(1,sc.getPPMCC(0,1)));
		test.ok(ae(1,sc.getPPMCC(1,0)));
		test.ok(ae(0.2954805,sc.getPPMCC(0,2),1e-6));
		test.ok(ae(0.2954805,sc.getPPMCC(1,2),1e-6));
		test.ok(ae(0.2954805,sc.getPPMCC(2,0),1e-6));
		test.ok(ae(0.2954805,sc.getPPMCC(2,1),1e-6));

		//test the covariances
		test.ok(ae(841.6667,sc.getCovariance(0,0),10),"variance check 0.");
		test.ok(ae(3366.667,sc.getCovariance(1,1),100),"variance check 1.");
		test.ok(ae(5.248249e57,sc.getCovariance(2,2),1e56),"variance check 2.");

		test.done();
	},
   test_update: function (test) {

		var s = org.yagnus.stats.initMultivariateSummaryStatistics(3);
		var s2 = org.yagnus.stats.initMultivariateSummaryStatistics(3);
		var s3 = org.yagnus.stats.initMultivariateSummaryStatistics(3);

		for(var i=0;i<50;++i){
			s.o(i,2*i,Math.pow(2,i));
			s2.o(i,2*i,Math.pow(2,i));
		}
		for(var i=50;i<100;++i){
			s.o(i,2*i,Math.pow(2,i));
			s3.o(i,2*i,Math.pow(2,i));
		}
		var s4 = org.yagnus.stats.initMultivariateSummaryStatistics(3);
		s4.update(s2).update(s3);
		
		var sc=s.calc();
		var sc4=s4.calc();
		test.ok(org.yagnus.utils.equalsIgnoreMember(sc,sc4), "Check that the whole result objects are equal");
		test.done();
	},
   check_short_hands: function (test) {
		test.equals(org.yagnus.stats.initMultivariateSummaryStatistics,oy.MVar,"checking that the oy shorthand is the same as the long hand.");
		test.equals(org.yagnus.stats.initMultivariateSummaryStatistics,oys.MVar,"checking that the oy shorthand is the same as the long hand.");
		test.done();
	}
}
