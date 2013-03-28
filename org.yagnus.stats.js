org.yagnus.stats = new Object();
org.yagnus.stats.checkNumber=function(n){ return (n!=null) && (typeof n == 'number') && !isNaN(n) && isFinite(n); }

oys=org.yagnus.stats;
makeTop("oys",org.yagnus.stats);
