Yagnus.js is a collection of algorithms that can be used in browser, on servers or inside Big Data processing and storage systems that support javascript.

The package contain some algorithms and data structures that we felt we needed while working on huge data but that were generally not openly and conveniently accessible to the public.

The [statistical algorithms](https://en.wikipedia.org/wiki/Statistic) we implement are built groundup to perform <u>parallel</u>, <u>distributed</u> computation on <u>streaming</u> data. We do so by computing [sufficient intermediates](https://en.wikipedia.org/wiki/Sufficient_statistic) in each compute unit using streaming algorithms.  Naturally, the partial sufficient statistics must be *merge*d to yield the final desired output. In order to guarante the accuracy of the algorithm under parallel distributed streaming conditions, the sufficient statistics must not only be sufficient but also have the *merge* operator that is both [commutative](https://www.google.com/search?q=commutative+property) and [associative](https://www.google.com/search?q=associative+property). These intermediate data structure fall into a mathematical structure calld commutative monoids.

Our implementation maintain associativity and commutativity while performing the calcuation so that calculations can be made on separate partitions of the data and then *merge*d together.  The same can be said for the sampling and sketch algorithms, which is that the partial result from computation over disjoint parts of the data or stream can be joined using their associative and commutative *merge* algorithm. The parallel to these parallel distributed and streaming computation in computer science are online algorithms, reinforcement machine learning algorithms, as well as other online machine learning algorithms. This software attempts to implement from ground up algorithms and data structures used to implement them.

Below, we give detailed discription of the actual algorithm that are implemented. You may also wish to look at the unit tests we have implemented as well as the Yagnus Licenses--this document and all of these code are distributed under it.

Descriptive Statistics
======================
[Descriptive statistics](https://en.wikipedia.org/wiki/Descriptive_statistics) are numbers that we calculate to describe a large amount of data we have seen. The most important statistics are: [mean](https://en.wikipedia.org/wiki/Arithmetic_mean), [variance](https://en.wikipedia.org/wiki/Variance), [skewness](https://en.wikipedia.org/wiki/Skewness), and more on [skewness](http://www.amstat.org/publications/jse/v19n2/doane.pdf) and [kurtosis](https://en.wikipedia.org/wiki/Kurtosis), and [covariance](https://en.wikipedia.org/wiki/Covariance_matrix) for multivariate situations. Additionally, sometimes, one just wants to count things, such as number of times a word appear in a text. In the case of counting, we have created a [contingency table](https://en.wikipedia.org/wiki/Contingency_table) which can aggregate over discrete multivariate observations to analyze their cooccurances.

We coded up online gathering of some of these statistics without storing all the data. At time of observing each data point, a constant-time update is performed. At the completion of the calculation, one may chose to call a calc() method to compute the summary statistics from minimum sufficient statistics stored on the stats object.

Basic descriptive statistics are not order sensitve so any permutation of the same set of data points will result in the identical statistics. This means that if we have two collection of statistics:

    var statA = oy.UVar(); //for exampmle intialize a univariate statistics collector

    //followed by some efforts of data gethering or adjustments
	 statA.inc(1);
	 statA.observe(1);
	 statA.o(1);
	 statA.dec(1);
	 statA.unobserve(1);
	 statA.u(1);

    var statB =oy.UVar();
	 //in the mean time some separate effort of data gathering took place
	 statB.inc(5);

    //This following operation adds all of the data points we observed in statB to statA as if we observed them directly using statA
	 statA.inc(statB);
	 var results=statA.calc();

    //prints 3
	 logger.log(results.average);
    //prints 2
	 logger.log(results.count);
    
Univariate Statistics
---------------------
Yagnus lib calculates sum, count, average, variance, skewness, kurtosis, min and max. To start calculating univariate stats call either the shorthand constructor or the constructor long form:

    var stat = oy.UVar();
    var stat = org.yagnus.stats.initUnivariateSummaryStatistics();

To add a number use the inc() method:

    stat.inc(1);
    stat.inc(3.1415);

Add a bunch of numbers all at once:

    stat.inc(1,2,3,4,5,6,7);

Also, o() and observe() are a synonyms for inc():

    stat.o(1,2,3);
    stat.inc(1,2,3);
    stat.observe(1,2,3);

The multivariate and discrete algorithms also suport these aliases as well as u(), unobserve() and dec() for removing data from the aggregating statistics.

To merge in a second univeriate stat use "inc()" or the "update()" method

    stat.inc(stat2);
    stat.update(stat2); //would do the same

both methods add the data from 'stat2' to 'stat' as if they were o()'ed or inc()'ed right on 'stat' itself.  When all the data is gathered and summarized by making a call to "calc()"

    var results=stat.calc();

	results.sum;
	results.count;
	results.min;
	results.max;
	results.average;            //if it exists, otherwise null
	results.variance;           //if it exists, otherwise null
	results.standardDeviation;  //if it exists, otherwise null
	results.skewness;           //if it exists, otherwise null
	results.kurtosis;           //if it exists, otherwise null
	results.excess_kurtosis;    //as defined.
	results.bad;                //contains the number of nan, infinity, or non-numerical strings passed to inc and excluded from above calculations

For those who are curious, the object contains the mergeable minimum-sufficient statistics--the 1st-4th moments about zero--from which the stats can be calculated. Storing the object means storing enough information to compute them merge with another set of these minimum sufficient statistics to form a larger aggregate.

One can also unobserve observations from the univariate stats, however min and max stops working in this implementation after unobserving an observation.

    stat.observe(1);
    stat.unobserve(1);

Univariate Order Statistics
----------------------------
A separate set of algorithms are implemented to calculate median and order statistics that were not included in Univariate Stats above(namely, min&max). The class org.yagnus.stats.Median implements the median-of-median algorithm known as [BFPRT](http://scholar.google.com/scholar?q=Blum+Floyd+Pratt+Rivest+Tarjan) which are the initials of it's inventor Blum, Floyd, Pratt, Rivest, Tarjan.

    var m=org.yagnus.stats.initMedian();
    var m2=oy.UMedian();
    m.inc(1);m.inc(2);//etc...
    m2.inc(100);m2.inc(1000000);//...
    m.inc(m2);
    m.calc();
    m.median;

Continuous-time Impulse Decaying
--------------------------------
Suppose that each stimulus is an impulse with specified amplitude M at time T. Suppose further that its effect decays exponentially with time so that the effect of this impulse at a later time T2 has amplitude:

    M2 = M * exp(T-T2)

The class org.yagnus.stats.ContinuouslyDecayingImpulsesstores the sum of many impulses of this type each decaying at the same rate. The class has a few convenience methods to allow one to specify arbitrary decaying function as long as it has the same properties as the one shown above. Due to a weakness in the implementation, we require that the specified function to be reversible, the name given to this property in this documentation is the associativity of merge() method, but otherwhere it is known as reverisbility:

    var m=oys.nCDI(12345678, decayFunction); //shorthand for org.yagnus.stats.newContinuouslyDecayingImpulses
    m.inc(t1,x1);
    m.inc(t2,x2);
    m.inc(t3,x3);

    var m2=oys.nCDI(12345678, decayFunction); //shorthand for org.yagnus.stats.newContinuouslyDecayingImpulses
    m2.inc(t3,x3);
    m2.inc(t2,x2);
    m2.inc(t1,x1);

    assert(m1.s==m2.s && m1.ts=m2.ts);


Multivariate Statistics
-----------------------
Multivariate stats collector must be constructed with the number of variables we plan to observe.

    var ms = oy.MVar(3);
    var ms = org.yagnus.stats.initMultivariateSummaryStatistics(3);

Observed data points must be entered separately using "inc()" with each parameter corresponding to the variable.

    ms.inc(1,1,1);
    ms.inc(2,2,2);
    ms.inc(3,3,3);

add stats from another set of observation:

	ms.inc(ms2);

finalize using "calc()"

    ms.calc();


the resulting object contains univariate stats for each of the variables. these univariate stats are also calc()'ed when the multivariate aggregator is calc()'ed

    ms.univariates[0].sum;
    ms.univariates[1].variance;

to get the covariance of two variables call "getCovariance()":

    ms.getCovariance(0,1); //notice the variables uses 0-based  index
    ms.getCovariance(0,2); //notice the variables uses 0-based  index

This object can also calculate the [Pearson's product-moment correlation coefficient](https://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient), again using 0-based index to refer to variables:

    ms.getPPMCC(0,1);

Note, all operations are constant-time wrt data count.

The multivariate stats also support the unobserve() method, which removes the effect of an observation as if it was previously observed by the current comutation. It is up to the user to ensure that the observation being removed was indeed observed previously.

    ms.observe(1,2,3,4);
    ms.unobserve(1,2,3,4);


Discrete Multivariate Statistics
--------------------------------
Construction must specify dimensionality:

    var ds = oy.DVar(3);
    var ds = oy.Counter(3);
    var ds = org.yagnus.stats.initDiscreteSummaryStatistics(3);

Observe things:

    ds.inc('a','b','c');

As with Univariate and Multivariate cases, the observed item must be fully observed or else the result will be undefined. 
 
Merge observations

    ds.inc(ds2);

Finalize:

    ds.calc();

Get cell counts:

    ds.getCount('a','b','c');

Get marginal count:

    ds.getCount('a','b'); // number of times we saw 'a,b' followed by any third value.
    ds.getCount(null,'b','c'); // number of times we saw 'b,c' following any first value.

The most frequent usecase will be to count things of just one type:

    var ds = oy.Counter(1);
    for(var i=0;i<100;++i)ds.inc('a');
    ds.calc();
    ds.getCount('a');//100 as expected

One can also ask the counter for all cells. The result is an associative array having each non-empty cell as value and the the full path to that cell as the key.
    var ds = oy.Counter();
    for(var i=0;i<100;++i)ds.inc('a');
    for(var i=0;i<400;++i)ds.inc('b');
    ds.calc();
    ds.getAllCells(); //{ "a" : 100, "b" : 400 }

Higher-dimensional counter:

    var ds = oy.Counter(3);
    ds.inc('a','b','c');
    ds.inc('a','b','c');
    ds.inc('d','e','f');
    ds.calc();
    ds.getAllCells(); //{ "a,b,c" : 2, "d,e,f" : 1 }

Discrete multivariate statistics also support unobserve() method:
    ds.observe('a','b','c');
    ds.unobserve('a','b','c');

Sampling
======================
Uniform Probability Sampling
----------------------------
Most distributed samplers implements sampling without replacement. Since it is relatively difficult to do it with replacement when the distribution (or possibly the population size) is unknown. Therefore these samplers are without replacement samplers without additional specification.

The simplest sampler is the uniform sampler without replacement which is implemented as org.yagnus.stats.samplers.Uniform, aka oy.USamp. This sampler keeps each object "add()"ed to it with probability percentage specified at construction time.

    var sampler = oy.USamp(1.0); //keep one percent of everything "add()"ed
    sampler.add(1);
    sampler.add(2);
    //... 
    sampler.calc();

All of our algorithms are natively parallel streaming distributed, and samplers are no exception. So one could do this and obtain the correct result without concern for the number of data points each of the sampler sees:

    var s1 = oy.USamp(1.0); //takes percentage as parameter, so multiply all your ratios by 100.
    var s2 = oy.USamp(1.0); //ahh, but the percentage must be the same for this to work.
    //... distribute s1 and s2 to gather samples.
    s1.inc(s2);
    //s1 is now updated to include samples from both s1 and s2, as if the 1% sample is taken over the all the data.
    s1.calc();
	
Uniform Reservoir Sampling
----------------------------
Another popular style of sampling is reservoir sampling. This is the algorithm that takes uniformly at random a fixed number of samples from a fully apriori unknown but parallely fully observed population. Suppose we want to draw exact 15 winners from a big-data sized data points or a growing population, simply fire up a reservoir sampler and add away:

    var sampler1 = oy.URsvr(15); //tell it how many we want to keep;
    var sampler2 = oy.URsvr(15); //tell it how many we want to keep;
    sampler1.add(1);
    sampler2.add(2);
    //... keep going
	 sampler1.inc(sampler2);
	 sampler1.calc();

And we kept exactly 15 items selected completely at random.
 
Non-uniform Reservoir Sampling
----------------------------
It also happens sometimes that you will come to know the importance of a sample after you see it. We have a sampler that can sample in distributed parallel streams and maintain correct sampling probability. The importance is passed in as a weight on the second parameter of add. The total weight increases as more sample are added. There are two algorithms implemented to perform non-uniform sampler. They are named after the authors sucessfully describing the algorithm to yagnus: the Chao weighted reservoir sampler and the Efraimidis-Spirakis weighted reservoir sampler, aka CRsvr and ESRsvr

    var sampler1 = oy.CRsvr(15); //tell it how many we want to keep;
    var sampler2 = oy.CRsvr(15); //or oy.ESRsvr(15), but both must be the same implementation to merge.
    sampler1.add(1,5);
    sampler2.add(2,10000);
    //... keep going
	 sampler1.inc(sampler2);
	 sampler1.calc();

Because inflation happens in almost any valued system, we provide a method to adjust for instentaneous inflation. This way we can provide inflation adjusted sample.
    sampler.inflate(2); /// 2% inflation, 

These non-uniform reservoir reservoir sampler is also knowns weighted reservoir sampler (WRS).

Constant-time Weighed Sampling With Replacement
-----------------------------------------------
on rare occasions, you may be asked to produce a convincingly random samples from a fixed set of known objects with probability equaling to their weights relative to the sum of all weights, repeatedly.(Note this differ from the previous algorithms in that the weights of the n items are fixed and known a priori to any sampling) The obvious algorithm that we implement is one that picks a random number k between 0 and 1, proceeds down the list of objects, suming up weights until it exceeds k, and the item whose weight caused the excess to happen is the item selected. The average runtime of this algorithm per sample given a fixed ordering of weights is calculated as

    function calculateExpectedRuntime(weights){
		if(weights.length==0)return 0;
		var e=0,w=0;
		for( var i=0; i< weights.length; ++i)  w += weights[w];
		for( var i=0; i< weights.length; ++i)  e += i * weights[i];
		return e/w;
    }

If all n weights are equal under maximum-entropy situation then the expected average runtime per sample is n, aka O(n) linear time. The performance can be improved if we used an [interval tree](https://en.wikipedia.org/wiki/Interval_tree) or [segment tree](https://en.wikipedia.org/wiki/Segment_tree) or a degenerative implementation in the [yagnus java implementation](https://code.google.com/p/yagnus/source/browse/#svn%2Ftrunk%2Fsrc%2Fjava%2Forg%2Fyagnus%2Fdatastructure) that allows arbitrary openess/closedness on each end of the segments. Using stabbing queries this the performes improves to O(lg(n)) per sample.

However, Knuth's master piece series on the [Art of Computer Programming](https://www.google.com/search?q=art+of+computer+programming) mentions a constant time algorithm, which we shall call the AJ Walker algorithm in honor of the author of the article describing it--Alastair J. Walker. The original algorithm is [purportedly](http://www.gnu.org/software/gsl/manual/html_node/General-Discrete-Distributions.html) to take O(n^2) time to prepare, but we also implement the linear time preparation and constant time algorithm per sample based on our own lazier implementation from these references.

    var smplr = oys.AJWwrs([100., 10., 75., 50., 23, 125, 50]);
	 for(var i=0;i<100;++i)
		smplr.calc();


Parameter Estimation and Forecasting
====================================
We implement parameter estimators for some distributions used frequently on large datasets.

Pareto Distribution
-------------------
The Pareto Distribution is a univariate distribution behind the power law. Data about social phenomenon (as opposed to physical phenomenon) often follow this distribution. This class implements the streaming MLE estimator that uses constant space and only one pass.

    var estimator = org.yagnus.stats.estimator.estimatePareto();
    //add in data
    estimator.inc(e1);
    estimator.inc(e2);
    estimator.inc(e3);
    //add in data from other shards/splits/stratus
    estimator.update(estimator2);
    estimator.update(estimator3);
    estimator.update(estimator4);
    //perform calculation
    estimator.calc();
    logger.log("The parameter to pareto distribution are (" + estimator.location_parameter + ", "+ estimator.scale_parameter +")");

The IMA Forecast
----------------
The integrated moving average is one of the easiest model to build online. Recall that an [ARIMA](https://en.wikipedia.org/wiki/ARIMA)(p,d,q) model is an ARMA(p,d) on the d-integration of the original series. An IMA(1,1) is an ARIMA(0,1,1). Integration means we look at y_t = (x_t - x_{t-1}), MA means e_t - a e_{t-1}

    y_t            = MA
    x_t - x_{t-1}  = e_t - a* e_{t-1}

Forecast for the next value x_{t+1} is

    \bar{x}_{t+1} = a * x_t + (1-a)*\bar{x}_{t-1}

where \bar{x}_{t-1} is the thing that we have been adding together using this exact formula on x_{t-1} and \bar{x}_{t-2}, and so on and so forth. We can trust the value despite the requirement that this summation occurred to infinite history in the past of of the rv x by depending on a to be well conditioned so that all but the most recent of x's history are ignorablely small in this sum.

The IMA forcast is implemented in in org.yagnus.stats.estimator.forecastIMA

    var ima = oys.eIMA(.95); //org.yagnus.stats.estimator.forecastIMA(.95);
    ima.inc(1);
    ima.inc(2);
    ima.inc(3);
    ima.inc(4);
    ima.calc().s; // current forecast based on the IMA model


Utility Data Structures 
=======================
During implementatino of yagnus.js we found it difficult to satisfy some of our needs with existing libraries, so we had to copy/modify/implement some of them. It is extremely regretful that we did not find the time/energy/means to submit the modifications back to original package that we copied the tempmlate code from. In all cases we try to cite as many of the projects we read while writing these classes. We promise to make great effort to submit these modifications back to those projects so that we may simply require(them) in the future.

Bit Field
---------
We implement sparse bit field in org.yagnus.utils.BitField aka oy.BF; The class supports get(), set() methods for indexed bits as well as update methods from another BitField object including: or, and, nor, nand, xor, and xnor. Roughly:

    var myBf = new org.yagnus.utils.BitField(10);// constructs a bit field initially containing 10 bits
    myBf.set(0); //0th bit is now 1
    myBf.set(0,0); //0th bit is now 0
    myBf.set(0,1); //0th bit is now 1 again;
    myBf.get(0);   //returns 1
    var newBf = myBf.copy(); //make a copy of current bit set
    
    myBf.set(11);         //automatically expends bitfield to have at least 11 bits and sets the 11th bit.
    
    myBf.get(12);         //returns 0, all previously unset bit defaults to 0.
    
    myBf.flip(12);        //flips the said bit;
    
    myBf.orEq(otherBf);   // takes each of ith bits from otherBf, logical or with ith bit of myBf, and set that as myBf's ith bit.
    myBf.norEq(otherBf);  // takes each of ith bits' complement from otherBf, logical or with ith bit of myBf, and set that as myBf's ith bit.
    
    myBf.andEq(otherBf);  // takes each of ith bits from otherBf, logical and with ith bit of myBf, and set that as myBf's ith bit.
    myBf.nandEq(otherBf); // takes each of ith bits' complement from otherBf, logical and with ith bit of myBf, and set that as myBf's ith bit.
    
    myBf.xorEq(otherBf);  // takes each of ith bits from otherBf, logical exclusive-or (xor) with ith bit of myBf, and set that as myBf's ith bit.
    myBf.xnorEq(otherBf); // takes each of ith bits' complement from otherBf, logical exclusive-or (xor) with ith bit of myBf, and set that as myBf's ith bit.
    
    myBf.update(otherBf); // by default update is defined as orEq, but you may derive from this class and change the default

Internally, we use 32-bit ints storing 32 bits per array entry. originally looked at [bitfield](https://npmjs.org/package/bitfield)
The operators are only able to include up to the word containing the highest bit ever set() on the operand. So, for example norEq will not set the one millionth bit to 1 when you or two empty bit fields together. When in doubt, construct with the number of bits that you plan to work with.

#### Bit Field TODO
Somebody please implement 

 * Maintaining the fact that all bits > a.length are on or off correctly through logical operatos
 * getNumberOf1s(), getNumberOf0s()
 * leftMost1(), rightMost1(), leftMost0(), rightMost0()
 * slice(), view()


Supportive Math Library
=======================
We implement some basic math library to support the above features.

Kahan Summation
---------------
Javascript like all other computer language suffer from limited precision range. We implement Kahan summation in order to make sure the large collections of numbers we add up together result in the correct sum despite the language/hardware limitations. Kahan summation is implemented in org.yagnus.math.ksum and follows description from its [Wikipedia entry](https://en.wikipedia.org/wiki/Kahan_summation_algorithm), use as follows:

    var s = new org.yagnus.math.KSum(); //or
    var s = oym.KSum();
    s.inc(1);
    s.inc(2);
    s.inc(3);
    s.inc(4);
    s.calc()==10;
    var s2 = oym.KSum();
    s2.inc(5);
    s.update(s2);
    s.calc()==15:

Arbitrary Precision Integers
----------------------------
SInt is a class that can add up integer (both positive and negative) with infinite number of digits. It implements this using the level-set algorithm as described above. Each level holds a collection of integers that are multiplied by 2^53. When a new number is added, a series of updates occur to ensure each level holds the correct number of integers.

    var i = oym.SInt();
    i.inc(100000);
    var i2 = oym.SInt();
    i2.inc(100000);
    i.update(i2);


Installation
======================
[MongoDb](http://www.mongodb.org/)
-----------------------
One can put it in the .mongorc.js

    cat yagnus.js >> ~/.mongorc.js

Or install it into system so that mapreduce can use the stats:

    mongo localhost:27017/analytics yagnus.js oy_mongo_install.js

After that, the stats observers can be used freely inside mapreduction:

    db.rawData.mapReduce(
        //map
        function(){
            emit(this.key, {us:oy.Uvar().add(this.value1, this.value2, this.value3], ms:oy.MVar().add(this.value1, this.value2, this.value3), ds:oy.DVar(2).add(this.kw1,this.kw2)});
        },
        //reduce
        function(k,vs){
            var us = oy.UVar();
            var ms = oy.MVar();
            var ds = oy.DVar();
            vs.forEach(function(v){
                us.update(v.us);
                ms.update(v.ms);
                ds.update(v.ds);
            }
            return {'us':us, 'ms':ms, 'vs':vs};
        },
        //options
        {
            finalize:  function(k,v){ /*v.us.calc();v.ms.calc();v.ds.calc() only if this table won't be reduced into again.*/ return v;},
            out:       {reduce:  "statistics_table"},
				query:      ord_date: { $gt: new Date('01/01/2012')},
			/* scope:   {'org':org, 'oy':oy'} only if these were not installed in system.js or mongorc*/
        }
    );
    
    // one can also have the opposite situation where org and oy are not in ~/.mongorc.js but in system.js then one can load them before map-reducing.
    var org=db.system.js.findOne({'_id':'org'}).value;
    var oy=db.system.js.findOne({'_id':'oy'}).value;
    
And the statistics_table can be incrementally reduced into as needed.
Note that system.js is stored for each database, so for every database mapreduce will run on, it must have it's own copy of this code installed unless you put org/oy into the scope manually at mapreduce time.

[node.js](http://nodejs.org/)
-----------------------
require("yagnus");

Contributing
============
Please, we'd love to have your algorithms. The project is co-hosted at two locations both on [github](https://github.com/alexia-b-chang/yag.js) and on [google code](https://code.google.com/p/yagnus/), check it out and send [me](mailto:alexia.b.chang@yagn.us) an email.

Some Necessary Features
-----------------------
 * Performance testing on more jsvms.
 * Adaptation to more big data platforms.





Yagnus.js Banner
================
                                                                          
                                                                             ###
                                                                             ###
                                                                             ###
                                                                           #####
                                                                        ########
                                                                    ############
                                                                   #############
                                                              ##################
                                                            ####################
                                                         ##################  ###
                       ###                           ###################     ###
                       ###                         ###################       ###
                       ########################################### 
                       ######################################### 
                       ##################################### 
                       ##################################
                       ################################
                       ################################
                       ###                        ####### 
                       ###                            ########
                                                           ####### 
                                                            ########         ###
                                                                 #######     ###
                                                                     ###########
                                                                        ########
                                                                            ####
                                                                             ###
                                                                             ###
                                                                             ###
                                                                             ###
                               #####
                            ########## 
                          ###############        ###
                         ################      #######
                        ##################     ######## 
                       #####          #####    ######### 
                       ####            ####      ##  ####
                       ####            ####           ###
                       ####            ####           ###
                        ###            ###            ###
                         ###          ###           #####
                          ###        ####         ###### 
                         ############################## 
                        ###############################
                       ###############################
                       ############################ 
                       ##########################
                       ###
                       ## 
                         
            ######                       ####### 
          ##########                   ########### 
        #####      ###  ####        ################# 
       ####         ##########      ##################
      ###             ##########  #####################
     ####            ####################        ####### 
     ###             #########  ######             ##### 
     ###            ########    ####                  ###
     ###           #########    ###                   ###
     ###           ########     ###                   ###
     ####         ########      ####                  ###
     ####         ########      #####               #####
     #####       ########        ########        ####### 
     ######     #########         ##################### 
      ##################           ####################
        ###############             ################# #   ## 
         #############               ###############  ## #### 
            #######                      #######       #######
                                                       #######
                                                          ## 
                       ###                            ###
                       ###                            ###
                       ##################################
                       ##################################
                       ##################################
                       ##################################
                       ##################################
                       ###                        ####
                                                   ### 
                                                    ### 
                                                    #### 
                                                    #####
                                                    #####
                       ###                         ######
                       ##################################
                       ################################# 
                       ################################ 
                       ###############################
                       #############################
                       ###
                          
                                                      ###
                                                      ###
                            #############################
                          ###############################
                        #################################
                        #################################
                       ##################################
                       ######
                       ##### 
                       #### 
                        ### 
                        #### 
                          ###
                          ###                         ###
                       ##################################
                       ##################################
                       ##################################
                       ##################################
                       ##################################
                       ###
                          
                       ########             ##### 
                       ########           ######### 
                       ########         ##############
                         #####         ############### 
                        ####          ################# 
                        ###          #########        ## 
                       ###           ########         ###
                       ###           ########         ###
                       ###           #######          ###
                       ###          ########          ###
                       ###          ########         ### 
                       ###         #########        #### 
                        ###       #########        #### 
                        ###       ########        #####
                         #################       ########
                          ###############        ########
                           ############# 
                               ######
                                     
                          ### 
                        #######
                       #########
                       #########
                        ####### 
                          ### 
                              
         ####
       #######
      ######## 
     ######### 
     ## ######
     ## 
     ## 
     ###                                              ###
     ####                                             ###          ### 
      ###################################################        ####### 
        #################################################       #########
         ################################################       #########
             ############################################        #######
                #########################################          ### 
                       ########             ##### 
                       ########           ######### 
                       ########         ##############
                         #####         ############### 
                        ####          ################# 
                        ###          #########        ## 
                       ###           ########         ###
                       ###           ########         ###
                       ###           #######          ###
                       ###          ########          ###
                       ###          ########         ### 
                       ###         #########        #### 
                        ###       #########        #### 
                        ###       ########        #####
                         #################       ########
                          ###############        ########
                           ############# 
                               ######
                                     
                          ###                               ############ 
                        #######                   ######################### 
                       #########      ######################################## 
                       #########     ########################################## 
                        #######             ################################# 
                          ###                               ############ 
                                                                         
                          ###                               ############ 
                        #######                   ######################### 
                       #########      ######################################## 
                       #########     ########################################## 
                        #######             ################################# 
                          ###                               ############ 




<a name="posterity" />

For Posterity
======================

<a name="sampling" />

## Sampling ##


<a name="uniformReservoirSampling" ></a>


### Derivation of the Uniform Reservoir Sampling Scheme ###

Outline induction step: Suppose we were able to maintain a size k reservoir whose items are each inclded from n observations with probability `k/n` and that items not included in reservoir were given fair opportunity to be included with probability `k/n`. On observing a new item, we keep it with probability `k/(n+1)`, this ensures that it's inclusion probability is `k/(n+1)`. If it is decided to be included, it replaced an item chosen from existing size-k reservoir with probability `1/k`. Thus we need to be assured that the items already in reservoir will, after this addition, be kept with probability `k/(n+1)`.

actually we can show that with what ever probability `x/n` any one item was kept in the reservoir before induction step, this replacement procedure will set it to `x/(n+1)`. Starting with `x/n`, with probability `(n+1-k)/(n+1)` it is kept due to not including the new item; with probability `k/(n+1)` the new item is kept and it replaces the item of concern with probability `1/k`, so the posterior probability, after add, of an existing reservoir item staying in the reservoir is:

<!-- original text version
      x/n * (  (n+1-k)/(n+1) + (  k/(n+1) * (k-1)/k  )  )
    = x/n * (nk+k-k^2+k^2-k)/(n+1)/k
    = x/n * (nk)/(n+1)/k
    = x/(n+1)
-->








<math xmlns="http://www.w3.org/1998/Math/MathML"><mtable>          <mtr>           <mtd>            <mrow>             <mrow>              <msub>               <mi>x</mi>               <mi>n</mi>              </msub>              <mo stretchy="false">∗</mo>              <mrow>               <mo stretchy="false">(</mo>               <mrow>                <mrow>                 <mrow>                  <mfrac>                   <mrow>                    <mrow>                     <mrow>                      <mi>n</mi>                      <mo stretchy="false">+</mo>                      <mn>1</mn>                     </mrow>                     <mo stretchy="false">−</mo>                     <mi>k</mi>                    </mrow>                   </mrow>                   <mrow>                    <mrow>                     <mi>n</mi>                     <mo stretchy="false">+</mo>                     <mn>1</mn>                    </mrow>                   </mrow>                  </mfrac>                  <mo stretchy="false">+</mo>                  <mrow>                   <mrow>                    <mfrac>                     <mi>k</mi>                     <mrow>                      <mrow>                       <mi>n</mi>                       <mo stretchy="false">+</mo>                       <mn>1</mn>                      </mrow>                     </mrow>                    </mfrac>                   </mrow>                   <mo stretchy="false">∗</mo>                   <mrow>                    <mfrac>                     <mrow>                      <mrow>                       <mi>k</mi>                       <mo stretchy="false">−</mo>                       <mn>1</mn>                      </mrow>                     </mrow>                     <mi>k</mi>                    </mfrac>                   </mrow>                  </mrow>                 </mrow>                </mrow>               </mrow>               <mo stretchy="false">)</mo>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mfrac>                <mi>x</mi>                <mi>n</mi>               </mfrac>               <mo stretchy="false">∗</mo>               <mrow>                <mrow>                 <mfrac>                  <mrow>                   <mrow>                    <mrow>                     <mrow>                      <mrow>                       <mi mathvariant="italic">nk</mi>                       <mo stretchy="false">+</mo>                       <mi>k</mi>                      </mrow>                      <mo stretchy="false">−</mo>                      <msup>                       <mi>k</mi>                       <mn>2</mn>                      </msup>                     </mrow>                     <mo stretchy="false">+</mo>                     <msup>                      <mi>k</mi>                      <mn>2</mn>                     </msup>                    </mrow>                    <mo stretchy="false">−</mo>                    <mi>k</mi>                   </mrow>                  </mrow>                  <mrow>                   <mrow>                    <mi>n</mi>                    <mo stretchy="false">+</mo>                    <mn>1</mn>                   </mrow>                  </mrow>                 </mfrac>                 <mo stretchy="false">/</mo>                 <mi>k</mi>                </mrow>               </mrow>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mrow>                <mfrac>                 <mi>x</mi>                 <mi>n</mi>                </mfrac>                <mo stretchy="false">∗</mo>                <mrow>                 <mfrac>                  <mrow>                   <mi mathvariant="italic">nk</mi>                  </mrow>                  <mrow>                   <mrow>                    <mi>n</mi>                    <mo stretchy="false">+</mo>                    <mn>1</mn>                   </mrow>                  </mrow>                 </mfrac>                </mrow>               </mrow>               <mo stretchy="false">/</mo>               <mi>k</mi>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mfrac>               <mi>x</mi>               <mrow>                <mrow>                 <mi>n</mi>                 <mo stretchy="false">+</mo>                 <mn>1</mn>                </mrow>               </mrow>              </mfrac>             </mrow>            </mrow>           </mtd>          </mtr>         </mtable></math> 







for any x, QED % base case. Originally described in "Jeﬀrey Scott Vitter. Random sampling with a reservoir. ACM Transactions on Mathematical Software, 11(1):37–57, March 1985", "Donald E. Knuth. Seminumerical Algorithms, volume 2 of The Art of Computer Programming. Addison-Wesley, Reading, Mass., 2nd edition, 1981.", etc




<a name="mtchao" />

### Derivation of the M.T. Chao Weighted Reservoir Sampling Scheme: ###

MTChao reservoir sampling was originally described in "M. T. Chao. A general purpose unequal probability sampling plan. Biometrika, 69(3):653–656, 1982.", current author came to know it from ["P. S. Efraimidis. Weighted Random Sampling over Data Streams, 2010"](http://arxiv.org/pdf/1012.0256.pdf). Similar to the last proof, we esetablish the correctness of probability of inclulsion by induction. 

Let's record the sum of all weights seen so far as n and the sum of weights in reservoir to be T. The observation of an item `j` with weight `w_j` will be kept, according to the MTChao scheme, with probability `k*w_j/(n+w_j)`. If `w_j` is kept, it displaces a random item from reservoir. After this operation, we need to establish that any item i where `i<j` is still in the reservoir with the correct probablity.


<!-- original text derivation
        (k * w_i /n) * (  (n + w_n - k*w_n) / (n + w_n) + k * w_n/(n+w_n)  * (k-1)/k  )
      =  k * w_i /n * (  (n + w_n - k*w_n) / (n + w_n) +  w_n/(n+w_n)  * (k-1)  )
      =  k * w_i /n * (  (n + w_n - k*w_n) / (n + w_n) +  (k*w_n - w_n)/(n+w_n)  )
      =  k * w_i /n * (  (n + w_n - k*w_n + k*w_n - w_n)/(n+w_n)  )
      =  k * w_i /n * (  n/(n+w_n)  )
      =  k * w_i / ( n + w_n )
-->






<math xmlns="http://www.w3.org/1998/Math/MathML"><mtable>          <mtr>           <mtd>            <mrow>             <mrow>              <mfrac>               <mrow>                <mi>k</mi>                <mo stretchy="false">∗</mo>                <msub>                 <mi>w</mi>                 <mi>i</mi>                </msub>               </mrow>               <mi>n</mi>              </mfrac>              <mo stretchy="false">∗</mo>              <mrow>               <mo stretchy="false">(</mo>               <mrow>                <mrow>                 <mfrac>                  <mrow>                   <mrow>                    <mrow>                     <mi>n</mi>                     <mo stretchy="false">+</mo>                     <msub>                      <mi>w</mi>                      <mi>n</mi>                     </msub>                    </mrow>                    <mo stretchy="false">−</mo>                    <mrow>                     <mi>k</mi>                     <mo stretchy="false">∗</mo>                     <msub>                      <mi>w</mi>                      <mi>n</mi>                     </msub>                    </mrow>                   </mrow>                  </mrow>                  <mrow>                   <mrow>                    <mi>n</mi>                    <mo stretchy="false">+</mo>                    <msub>                     <mi>w</mi>                     <mi>n</mi>                    </msub>                   </mrow>                  </mrow>                 </mfrac>                 <mo stretchy="false">+</mo>                 <mrow>                  <mrow>                   <mfrac>                    <mrow>                     <mrow>                      <mi>k</mi>                      <mo stretchy="false">∗</mo>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                     </mrow>                    </mrow>                    <mrow>                     <mrow>                      <mi>n</mi>                      <mo stretchy="false">+</mo>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                     </mrow>                    </mrow>                   </mfrac>                  </mrow>                  <mo stretchy="false">∗</mo>                  <mrow>                   <mfrac>                    <mrow>                     <mrow>                      <mi>k</mi>                      <mo stretchy="false">−</mo>                      <mn>1</mn>                     </mrow>                    </mrow>                    <mi>k</mi>                   </mfrac>                  </mrow>                 </mrow>                </mrow>               </mrow>               <mo stretchy="false">)</mo>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mfrac>                <mrow>                 <mi>k</mi>                 <mo stretchy="false">∗</mo>                 <msub>                  <mi>w</mi>                  <mi>i</mi>                 </msub>                </mrow>                <mi>n</mi>               </mfrac>               <mo stretchy="false">∗</mo>               <mrow>                <mo stretchy="false">(</mo>                <mrow>                 <mrow>                  <mrow>                   <mrow>                    <mfrac>                     <mrow>                      <mrow>                       <mrow>                        <mi>n</mi>                        <mo stretchy="false">+</mo>                        <msub>                         <mi>w</mi>                         <mi>n</mi>                        </msub>                       </mrow>                       <mo stretchy="false">−</mo>                       <mrow>                        <mi>k</mi>                        <mo stretchy="false">∗</mo>                        <msub>                         <mi>w</mi>                         <mi>n</mi>                        </msub>                       </mrow>                      </mrow>                     </mrow>                     <mrow>                      <mrow>                       <mi>n</mi>                       <mo stretchy="false">+</mo>                       <msub>                        <mi>w</mi>                        <mi>n</mi>                       </msub>                      </mrow>                     </mrow>                    </mfrac>                   </mrow>                   <mo stretchy="false">+</mo>                   <mrow>                    <mrow>                     <mfrac>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                      <mrow>                       <mrow>                        <mi>n</mi>                        <mo stretchy="false">+</mo>                        <msub>                         <mi>w</mi>                         <mi>n</mi>                        </msub>                       </mrow>                      </mrow>                     </mfrac>                    </mrow>                    <mo stretchy="false">∗</mo>                    <mrow>                     <mrow>                      <mo stretchy="false">(</mo>                      <mrow>                       <mrow>                        <mi>k</mi>                        <mo stretchy="false">−</mo>                        <mn>1</mn>                       </mrow>                      </mrow>                      <mo stretchy="false">)</mo>                     </mrow>                    </mrow>                   </mrow>                  </mrow>                 </mrow>                </mrow>                <mo stretchy="false">)</mo>               </mrow>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mfrac>                <mrow>                 <mi>k</mi>                 <mo stretchy="false">∗</mo>                 <msub>                  <mi>w</mi>                  <mi>i</mi>                 </msub>                </mrow>                <mi>n</mi>               </mfrac>               <mo stretchy="false">∗</mo>               <mrow>                <mrow>                 <mo stretchy="false">(</mo>                 <mrow>                  <mrow>                   <mfrac>                    <mrow>                     <mrow>                      <mrow>                       <mi>n</mi>                       <mo stretchy="false">+</mo>                       <msub>                        <mi>w</mi>                        <mi>n</mi>                       </msub>                      </mrow>                      <mo stretchy="false">−</mo>                      <mrow>                       <mi>k</mi>                       <mo stretchy="false">∗</mo>                       <msub>                        <mi>w</mi>                        <mi>n</mi>                       </msub>                      </mrow>                     </mrow>                    </mrow>                    <mrow>                     <mrow>                      <mi>n</mi>                      <mo stretchy="false">+</mo>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                     </mrow>                    </mrow>                   </mfrac>                   <mo stretchy="false">+</mo>                   <mfrac>                    <mrow>                     <mrow>                      <mrow>                       <mi>k</mi>                       <mo stretchy="false">∗</mo>                       <msub>                        <mi>w</mi>                        <mi>n</mi>                       </msub>                      </mrow>                      <mo stretchy="false">−</mo>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                     </mrow>                    </mrow>                    <mrow>                     <mrow>                      <mi>n</mi>                      <mo stretchy="false">+</mo>                      <msub>                       <mi>w</mi>                       <mi>n</mi>                      </msub>                     </mrow>                    </mrow>                   </mfrac>                  </mrow>                 </mrow>                 <mo stretchy="false">)</mo>                </mrow>               </mrow>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mfrac>                <mrow>                 <mi>k</mi>                 <mo stretchy="false">∗</mo>                 <msub>                  <mi>w</mi>                  <mi>i</mi>                 </msub>                </mrow>                <mi>n</mi>               </mfrac>               <mo stretchy="false">∗</mo>               <mrow>                <mrow>                 <mo stretchy="false">(</mo>                 <mrow>                  <mfrac>                   <mrow>                    <mrow>                     <mrow>                      <mrow>                       <mrow>                        <mi>n</mi>                        <mo stretchy="false">+</mo>                        <msub>                         <mi>w</mi>                         <mi>n</mi>                        </msub>                       </mrow>                       <mo stretchy="false">−</mo>                       <mrow>                        <mi>k</mi>                        <mo stretchy="false">∗</mo>                        <msub>                         <mi>w</mi>                         <mi>n</mi>                        </msub>                       </mrow>                      </mrow>                      <mo stretchy="false">+</mo>                      <mrow>                       <mi>k</mi>                       <mo stretchy="false">∗</mo>                       <msub>                        <mi>w</mi>                        <mi>n</mi>                       </msub>                      </mrow>                     </mrow>                     <mo stretchy="false">−</mo>                     <msub>                      <mi>w</mi>                      <mi>n</mi>                     </msub>                    </mrow>                   </mrow>                   <mrow>                    <mrow>                     <mi>n</mi>                     <mo stretchy="false">+</mo>                     <msub>                      <mi>w</mi>                      <mi>n</mi>                     </msub>                    </mrow>                   </mrow>                  </mfrac>                 </mrow>                 <mo stretchy="false">)</mo>                </mrow>               </mrow>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mrow>               <mfrac>                <mrow>                 <mi>k</mi>                 <mo stretchy="false">∗</mo>                 <msub>                  <mi>w</mi>                  <mi>i</mi>                 </msub>                </mrow>                <mi>n</mi>               </mfrac>               <mo stretchy="false">∗</mo>               <mrow>                <mfrac>                 <mi>n</mi>                 <mrow>                  <mrow>                   <mi>n</mi>                   <mo stretchy="false">+</mo>                   <msub>                    <mi>w</mi>                    <mi>n</mi>                   </msub>                  </mrow>                 </mrow>                </mfrac>               </mrow>              </mrow>             </mrow>             <mi/>            </mrow>           </mtd>          </mtr>          <mtr>           <mtd>            <mrow>             <mrow>              <mi/>              <mo stretchy="false">=</mo>              <mfrac>               <mrow>                <mi>k</mi>                <mo stretchy="false">∗</mo>                <msub>                 <mi>w</mi>                 <mi>i</mi>                </msub>               </mrow>               <mrow>                <mrow>                 <mi>n</mi>                 <mo stretchy="false">+</mo>                 <msub>                  <mi>w</mi>                  <mi>n</mi>                 </msub>                </mrow>               </mrow>              </mfrac>             </mrow>            </mrow>           </mtd>          </mtr>         </mtable></math> 





Awesome! Wow, that's too cool!
But don't ask me on an interview question... it's going to take me just as long to rederive(and then correct grammar and typos). This is why we have libraries, so it isn't rederived every single time.


### Derivation of the Efraimidis-Spirakis Weighted Reservoir Sampling Scheme: ###

The Efraimidis-Spirakis weighted reservoir sampling algorithm was describe by ["Pavlos S. Efraimidis and Paul G. Spirakis. Weighted random sampling with a reservoir. Information Processing Letters, 97(5):181 – 185, 2006."](https://scholar.google.com/scholar?hl=en&q=Weighted+random+sampling+with+a+reservoir). The algorithm on observing the ith observation with weight `w_i` assign to each it a "key" valued at `k_i = r_i ^ (1/w_i)` where `r_i` is an iid sample from `uniform(0,1)`. the k-sized reservoir sample will simply be the items with top `k` key values. The explanation given to support this algorithm is that given any pair of items `i` and `j`, the  `p(k_i < k_j) = w_i / (w_i + w_j)`. The math for this is simpler than one would expect. I went and read a whole [Mathematical Statistics, Shao 2003](http://www.springer.com/statistics/statistical+theory+and+methods/book/978-0-387-95382-3), before realizing this:

    p(k_i<k_j) = p( r_i ^ (1/w_i) > r2 ^ (1/w_j) )
               = p (r_i > r_j ^ (w_i / w_j))                   ## w.l.o.g. w_* >=0
               = \int_0^1{\int_{r_i^(w_j/w_i)}^1{d r_j d r_i}} ## TeX notation, iterate over all values of r_i \in [0,1], then iterate all values of r_j such that k_i<=k_j, add up the density
               = \int_0^1{1-r_i ^(w_j/w_i) d r_i}
               =  r_i - (1+w_i/w_j) * r_i^(w_j/w_i + 1) ]^1_0  ## pre-substitution
               =  1 - 1/(1+w_i/w_j)                            ## everywhere r_i=0 is just 0, where r_i=1 is 1
               =  (1+w_i/w_j - 1)/(1+w_i/w_j)
               =  (w_i/w_j)/(1+w_i/w_j)
               =  (w_i/w_j)/((w_j+w_i)/w_j)
               =  w_i/(w_j+w_i)
               =  w_i/(w_i+w_j)



as claimed.



<a name="algebra" />
## Algebra of Sufficient Intermediates ##

Since we calculate more than statistics on data, the intermediate data structures are to be known as "sufficient intermediates". As mentioned in the introduction the sufficient intermediates are at least commutative monoids in order to support parallel distributed streaming algorithm. Some of the algorithms that we have implemented have a `dec()` method which gives us a [group](https://en.wikipedia.org/wiki/Group_(mathematics)). We review the definitions of these and walk through one example using our implementation of the univariate summary statistics.

<a name="monoid" />
### Sufficient Intermediate of Univariate Statistics is a Monoid ###
The univariate summary statistics object we implement

    var statA = oy.UVar();

are members of a monoid with *merge* operation. The have the following properties required for a monoid:

#### Closure ####
    var statA = oy.UVar();
    var statB = oy.UVar();
    var statC = statA.merge(statB)

statC is still a UVar object.

#### Associativity ####
    var statA = oy.UVar();
    var statB = oy.UVar();
    var statC = oy.UVar();
    var statD = statA.merge(statB.merge(statC)); // A + (B + C)
    var statE = statA.merge(statB).merge(statC));// ( A + B ) + C
    statD == statE

It is also pretty obvious why this is required. The two cases B and C arrive at final reducer before A does,  and A and B arrives before C can and do occur regularly in daily calculations.

####  Identity ####

    var statI = oy.UVar(); // is the identity wrt merge
    var statA = oy.UVar(); statA.add(1);
    var statB = oy.UVar(); statB.add(2);
    statA == statA.merge(oy.UVar()) == oy.UVar().merge(statA);
    statB == statB.merge(oy.UVar()) == oy.UVar().merge(statB);

The default constructor provides an identity object that fulfills this requirement. So as you can see, we have arrived at a monoid that is also the sufficient intermediate statistic for univariate statistics. The reader will have pointed out that just because it's a monoid (closed), it does not mean that the result of merge produces a sufficient intermediate data structure that is suitable for the purpose of computing the final univariate statistics. But it is, up to the limits of numerical precision. Because current implementation suffers from being non-functional, we verify this aspect using unit tests instead of proof on code.

### Commutative Monoid ###
The univariate summary statistics as implemented is also commutative wrt merge.

    var statA = oy.UVar();
    var statB = oy.UVar();
    statA.merge(statB) == statB.merge(statA);

This means we have constructed a commutative monoid .

<a name="group" />
### Inverse? ###

The group, if one is to think object-orientedly inherits from monoid and additionally requires an inverse element corresponding to each element. Although we do not provide an inverse directly, we do provide a `dec()` method, aka `unobserve()` that can not only unobserve individual observations, but it can also unobserve an sufficient intermediate data structure for the univariate statistics computation. Thus if we take the merge identity and decrement from it an object, we obtain the merge inverse.

    var statA = oy.UVar(); statA.o(1,2,3)
    var statAI = oy.UVar().dec(statA);
    statsA.merge(statAI) == statsAI.merge(statsA) == oy.UVar();

This fact in conjunction with the commutative property means that the sufficient intermediate data structure for univariate summary statistics as implemented is an Abelian group !

But I will quickly point out that `statAI` as defined above has little meaning, the object represents the removal of those observations if they were ever to show up. There does not appear to be a conventional statistical interpretation of this concept as far as the current author knows. Another complication is the following

    var statA = oy.UVar(); statA.o(1,2,3);
    var statAI = oy.UVar().dec(statA);
    var statB = oy.UVar(); statB.o(4,5,6);
    statB.merge(statAI);

What is meaning of removing elements that do not exist in an otherwise non-trivial sufficient intermediate data structure? We have yet to find the fuller meaning in the fact that these classes and methods form an Abelian group.

The Abelian group is an attractive status for sufficient intermediates to strive for, although it is not necessary for correctness during parallel distributed streaming computations. The sufficient intermediates need only to be a commutative monoid to guarantee correctness of aggregation. One not so obvious usecase for sufficient intermediates that belong to an Abelian group is to plug it into an naively implemented windowing wrapper, computing in a parallel distributed streaming fashion. Having Abelian group properties assures us that under such circumstances we can maintain summary inside a contiguous region (such as a time range or circle on the surface of the earth) using `observe()` methods. We may wish to slide window the window around due to advancement of time or change in interest, and this may be accomplished using `observe()` and `unobserve()` methods supplied for the Abelian group. There are several such wrappers implemented here `FixedWindowBufferStats`, `FixedWindow`, `FixedWindowStreamableStats`.

This <i>feature</i> of Abelian sufficient intermediate also allow us to maintain stats on non-contiguous portion of the sample--for example, if we need to know daily statistical properties (e.g. min,max,mean,variance) of some measurement on Weekends as compared to Weekdays for a rolling window of 2 weeks. Implementing the computation once as an Abelian sufficient intermediate enabled us to correctly compute both, at the same time, streaming over the distributed data once, in parallel.


Achieving Abelian group status is difficult for many algorithm's sufficient intermediate. However it is important to point out, again, that being a commutative monoid is an important requirement for sufficient intermediates. Sufficient intermediates that are not commutative monoids cannot easily participate in parallel distributed streaming algorithms, certainly not freely in map-reduction framework. Therefore it should be the case that all of these algorithms have sufficient intermediates that are at least commutative monoids.


# Copyright #
These Yagnus organization owns the copyright to this README file and it is distributed under the Free Yagnus Open License. The code it discusses contain their own licensing. Please read their individual licenses to known the aggrement you make with Yagnus when you download these files.

# Yagnus License #

<pre>

Yagnus Licenses, Copyrights and Disclaimers v0.4


This document is about computer files that Yagnus organization makes available to the public.  The files are provided by the Yagnus website and third party software and data repositories including, but not exclusively, http://www.yagn.us/, google code, github, and sourceforge.


Yagnus License:
 * Entities downloading Yagnus files agree that they have read and understood and agree to abide by this entire document, and thereafter they are granted rights to use Yagnus files under following conditions.
 * Name: Entities using Yagnus files must have a name or names its users, creators, contributors and other interested parties all use to refer to it.
 * Acknowledgment: Entities using Yagnus files must make the fact of its agreement to Yagnus license known to all of its current and future users.
 * Replication: Redistribution of unmodified Yagnus files must include a copy of of this entire document in plain text.
 * Replication With Mutation: Distribution of modified Yagnus files must include the unmodified Yagnus License file and a pointer to an publicly accessible URL containing a diff which when applied to original Yagnus files produces the distributed files.
 * Fame: Entities using Yagnus files must make the fact of Yagnus file usage public knowledge by stating in the natural language(s) used by the software or system, on a public forum, uniquely referenced by an URL, indexed by major public search systems, that it uses the Yagnus system.
 * Fortune: Entities using Yagnus files must not use it for commercial purpose without further written agreement.
 * Peace: Yagnus Files must not be used in efforts towards discovery, improvement, construction, storage or deployment of weapons or in support thereof. Yagnus is absolutely against war.
 * Privacy: Yagnus Files must not be used in efforts towards discovery, invasion, violation or corruption of personally, commercially or nationally secret information and properties, or in support thereof, without regard to intentions and goals of such efforts, and without regards to the reason for the privacy or secrecy. Yagnus is absolutely against spying and hacking.
 * Contribution: Entities using Yagnus must report bugs or submit bug fixes as soon as they are discovered to Yagnus.
 * Immutability: This license and its relation to the Yagnus system and Yagnus files cannot be altered by any person's signature.
 * Ownership: By contributing to Yagnus system, it is agreed that Yagnus receives, exclusively, world-wide, any and all rights to license, copy, use, transmit, sell, offer for sale, original and transformations of the contribution.
 * No Confidence: Files are provided "as is" without any warranties, expressed or implied, of any efficacy towards any end or means through any process or duration. Yagnus, its contributors or any person or entity associated with the Yagnus organization are not liable for any effects or side-effects, or the lack thereof, caused by the use of Yagnus files and properties.
 * Pride: By agreeing to Yagnus License you support the Yagnus License.
 * Promotion: Entities using Yagnus files may not use the name Yagnus to promote their systems or effort without additional written agreement.
Use: Use of files, not exclusively, include: Downloading files, storing the files, unarchiving a file containing this notice, compiling, interpreting, executing, linking with, invoking subroutines, encrypting, decrypting, summarizing, pruning, optimizing, re-factoring, documenting, explaining, deriving entropy from, deriving linguistic or any other pattern from, or otherwise transforming, extractions, and citation including quoting, linking, selling, licensing or mentioning Yagnus.
Weapons: Weapons are waves, particles, substances, devices, organisms and procedures whose primary reason, in design or in practice, for being known or designed or created is to be used to destroy, kill, injure, maim, disable, damage, mutate, debilitate or otherwise undesirably alter human, human conditions and human creations.
Private: Information private to an entity are those that may or may not be known to the entity itself but are unknown to others without additional effort.
Secret: Information secret to an entity are those that the entity either declares to be secret or makes significant effort to keep unknown or uncertain to others.


Free Yagnus Open License:
The Free Yagnus Open License is the Yagnus License without any: Contribution, Replication With Mutation, Ownership, Pride, Peace, Privacy, Fame or Fortune.


Copyright(c) this licenses, copyrights and disclaimers file is released under the Free Yagnus Open License v0.4, 2013 and onward
c47a0f2b879f3fcc32191ef1abce372748b0f750732b145c6bb23f06163743a6733715f8c153de513d2efc35ce89cac4092c5fbd1b3f614a3cd9c54079334aeb
c49eb337d5909d59ac8160c22621472d6a6f9db32954229fd4687412670cb883b0097026a33285f307e9b75934400468cb519417fe97e1e03788743daf77af05
64f85472dede9b01e85887d4523b977fef79d1bf9930d8f76e1753471717e7a5c6980088d5d65e69df92da3e745a0b007e471167030b12e45ae0910746007019
1354188d54d1f2bcbd18c4f76c8b75e68fbf55c4f0b6067f07a16990ac857ed962a55ffc49461e0804b0f09d0ee392c8e892a22ca8bab84f2fc3370d72d9e04d
5be5ececbd2d084dd217b438804979329ccd9be344b27fa934372d8fdc2f1b316ff0171b513329da97349e2c9f433ea5fff68f569bd840ec3197961c82e7f0c4
1024ba8c1cf298da5116cd5285d9690740dfa9166478124b163d84035cbee12b2234a24c37b3108df9d4469d6890ebaaf86319586b29a3ba64e7c357ffded042
764b3023cd6ce6224e172feb64a084809757072b5af351150d17eb5712a2cd168d9ee918936ce325fd288c9f2a312e835e2098361f1748a7d9545ce66f119afa
</pre>
