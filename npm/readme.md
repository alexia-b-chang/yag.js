Yagnus.js is a collection of classes that can be used to calculate statistics in browser, on servers or inside mongodb.

Descriptive Statistics
======================
[Descriptive statistics](http://en.wikipedia.org/wiki/Descriptive_statistics) are numbers that we calculate to describe a large amount of data we have seen. The most important statistics are: [mean](http://en.wikipedia.org/wiki/Arithmetic_mean), [variance](http://en.wikipedia.org/wiki/Variance), [skewness](http://en.wikipedia.org/wiki/Skewness) and [kurtosis](http://en.wikipedia.org/wiki/Kurtosis), and [covariance](http://en.wikipedia.org/wiki/Covariance_matrix) for multivariate situations. Additionally, sometimes, one just wants to count things, such as number of times a word appear in a text. In the case of counting, we have created a [counting contingency table](http://en.wikipedia.org/wiki/Contingency_table) which can count one things or analyze cooccurance of multiple discrete variables.

Yagnus implements gathering of these statistics without storing all the data. At time of observing each data point, a constant-time update is performed. At the completion of the calculation, one may chose to call a calc() method to remove machinery for calculating data. After calc is run, the object can no longer be updated or merged with other aggregator.

Basic descriptive statistics are not order sensitve so any permutation of the same set of data points will result in the identical statistics. This means that if we have two collection of statistics:

    var statA = oy.UVar(); //for exampmle intialize a univariate statistics collector

    //followed by some efforts of data gethering
	 statA.inc(1);

    var statB =oy.UVar();
	 //followed by some separate effort of data gathering
	 statB.inc(5);

    //This followin operation adds all of the datapoints we observed in statB to statA as if we observed them directly using statA
	 statA.inc(statB);
	 var results=statA.calc();

    //prints 3
	 console.log(results.average);
    //prints 2
	 console.log(results.count);
    
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

Too merge in a second univeriate stat use "inc()"
    stat.inc(stat2);

When all the data is gathered and frozen from a call to "calc()"

    var results=stat.calc();

At this point stat can no longer b updated or merged but you can get results from the object:

	results.sum;
	results.count;
	results.min;
	results.max;
	results.average;   //if it exists, otherwise null
	results.variance;  //if it exists, otherwise null
	results.standardDeviation;//if it exists, otherwise null
	results.skew;      //if it exists, otherwise null
	results.kurtosis;  //if it exists, otherwise null
	results.bad;//contains the number of nan, infinity, or non-numerical strings passed to inc and excluded from above calculations

For those who are curious, the object from instantiation to calc() contains something close to the iminimum sufficient statistics to calculate the promised final statistics. Therefore storing the object means storing enough information to compute them merge with another set of these minimum sufficient statistics to form a larger aggregate. For compatibility with external systems, a method called "getMSS()" allows you retrieve a javascript object containing just these minimum sufficient statistics without the methods:

    var stats = oy.UVar();
    stats.getMss();
    {
    	"bad" : 0,
    	"c" : 0,
    	"s" : 0,
    	"ss" : 0,
    	"sss" : 0,
    	"ssss" : 0,
    	"min" : 9007199254740992,
    	"max" : -9007199254740992,
    	"mmbuffer" : null,
    	"mmind" : false
    },

Univariate Order Statistics
----------------------------
A separate set of algorithms are implemented to calculate median and order statistics that were not included in Univariate Stats above(namely, min&max). The class org.yagnus.stats.Median implements the [median-of-median algorithm known as BFPRT which are the initials of it's inventor Blum, Floyd, Pratt, Rivest, Tarjan](http://scholar.google.com/scholar?q=Blum+Floyd+Pratt+Rivest+Tarjan).

    var m=org.yagnus.stats.initMedian();
    var m2=oy.UMedian();
    m.inc(1);m.inc(2);//etc...
    m2.inc(100);m2.inc(1000000);//...
    m.inc(m2);
    m.calc();
    m.median;


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

This object can also calculate the [//Pearson's Product-moment Correlation Coefficient](http://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient), again using 0-based index to refer to variables:

    ms.getPPMCC(0,1);

Note, all operations are constant-time wrt data count.


Discrete Multivariate Statistics
-----------------------
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

Installation
======================
MongoDb
-----------------------
One can put it in the .mongorc.js

    cat yagnus.js >> ~/.mongorc.js

Or install it into system so that mapreduce can use the stats:

    mongo localhost:27017/analytics yagnus.js oy_mongo_install.js

After that, the stats observers can be used freely inside mapreduction:
    db.rawData.mapReduce(
		  //map
        function(){
				emit(this.key, {us:[this.value1, this.value2, this.value3], ms:[[this.value1, this.value2, this.value3]], ds:[this.kw1,this.kw2]});
        },
		  //reduce
        function(k,vs){
            var us = oy.UVar();
            var ms = oy.MVar();
            var ds = oy.DVar();
            vs.forEach(function(v){
                us.inc(v.us);
                ms.inc(v.ms);
                ds.inc(v.ds);
            }
            return {'us':us, 'ms':ms, 'vs':vs};
        },
        //options
        {
            finalize:  function(k,v){ /*v.us.calc();v.ms.calc();v.ds.calc() only if this table won't be reduced into again.*/ return v;},
            out:       {reduce:  "statistics_table"},
				query:      ord_date: { $gt: new Date('01/01/2012')},
			/* scope:   {'org':org, 'oy':oy'} only if these were not installed in system.js   */
        }
    );
    
    // one can also have the opposite situation where org and oy are not in ~/.mongorc.js but in system.js then one can load them before map-reducing.
    var org=db.system.js.findOne({'_id':'org'}).value;
    var oy=db.system.js.findOne({'_id':'oy'}).value;
    
And the statistics_table can be incrementally reduced into as needed.
Note that system.js is stored for each database, so for every database mapreduce will run on, it must have it's own copy of this code installed unless you put org/oy into the scope manually at mapreduce time.

node.js
-----------------------
require("yagnus");

Yagnus.js Banner
-----------------------
                                                                          
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
                                                                         

For Posterity
======================
Derivation of the Uniform Reservoir Sampling Scheme
---------------------------------------------------
Outline induction step: Suppose we were able to maintain a size k reservoir whose items are each inclded from n observations with probability k/n and that items not included in reservoir were given fair opportunity to be included with probability k/n. On observing a new item, we keep it with probability k/(n+1), this ensures that it's inclusion probability is k/(n+1). If it is decided to be included, it replaced an item chosen from existing size-k reservoir with probability 1/k. Thus we need to be assured that the items already in reservoir will, after this addition, be kept with probability k/(n+1).

actually we can show that with what ever probability x/n any one item was kept in the reservoir before induction step, this replacement procedure will set it to x/(n+1). Starting with x/n, with probability (n+1-k)/(n+1) it is kept due to not including the new item; with probability k/(n+1) the new item is kept and it replaces the item of concern with probability 1/k, so the posterior probability, after add, of an existing reservoir item staying in the reservoir is:

      x/n * (  (n+1-k)/(n+1) + (  k/(n+1) * (k-1)/k  )  )
    = x/n * (nk+k-k^2+k^2-k)/(n+1)/k
    = x/n * (nk)/(n+1)/k
    = x/(n+1)

for any x, QED % base case. Originally described in "Jeﬀrey Scott Vitter. Random sampling with a reservoir. ACM Transactions on Mathematical Software, 11(1):37–57, March 1985", "Donald E. Knuth. Seminumerical Algorithms, volume 2 of The Art of Computer Programming. Addison-Wesley, Reading, Mass., 2nd edition, 1981.", etc

Derivation of the M.T. Chao Weighted Reservoir Sampling Scheme:
-----------------------------------------------------------
MTChao reservoir sampling was originally described in "M. T. Chao. A general purpose unequal probability sampling plan. Biometrika, 69(3):653–656, 1982.", current author came to know it from ["P. S. Efraimidis. Weighted Random Sampling over Data Streams, 2010"](http://arxiv.org/pdf/1012.0256.pdf). Similar to the proof, esetablish basecase where each item i was kept with probability k*w_i, a new item n with weight w_n is introduced and kept with probability k*w_n. If the new item is kept, it replaces an item chosen uniformly at random from reservoir uniform. We need to maintain two accumulator variable, n being the sum of all weights seen so far and T, the sum of weights of items in the reservoir.

        (k * w_i /n) * (  (n + n_w - k*w_n) / (n + w_n) + k * w_n/(n+w_n)  * (k-1)/k  )
      =  k * w_i /n * (  (n + n_w - k*w_n) / (n + w_n) +  w_n/(n+w_n)  * (k-1)  )
      =  k * w_i /n * (  (n + n_w - k*w_n) / (n + w_n) +  (k*w_n - w_n)/(n+w_n)  )
      =  k * w_i /n * (  (n + n_w - k*w_n + k*w_n - w_n)/(n+w_n)  )
      =  k * w_i /n * (  n/(n+w_n)  )
      =  k * w_i / ( n + w_n )

Awesome! But don't ask me on an interview question... it's going to take me just as long to rederive. This is why we have libraries, so it isn't rederived every single time.
