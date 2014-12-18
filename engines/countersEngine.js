/**
 *
 *
 */
function MySQLBackendCountersEngine() {
	var self = this;
}


/**
 *
 *
 */
MySQLBackendCountersEngine.prototype.buildQuerries = function(userCounters, time_stamp) {

	var querries = [];
	// Iterate on each userCounter
    for(var userCounterName in userCounters) {
      var counterValue = userCounters[userCounterName];
      if(counterValue === 0) {
        continue;
      } else {
        /**********************************************************************
         * Edit following line to custumize where statsd datas are inserted
         *
         * Parameters :
         *    - userCounterName: Counter name
         *    - counterValue: Counter value
         */
        if (userCounterName.search("stats\\.game\\.*\\.") >= 0) {
          // Mirror to separate tables if the metric is a game won/lost/played statistic
          if (userCounterName.indexOf("(won|lost|played)") >= 0) {
            var game = userCounterName.substring(12);
            game = game.substring(0, game.indexOf("."));

            var pid = userCounterName.substring(userCounterName.lastIndexOf(".") + 1);

            if (userCounterName.indexOf("lost") >= 0) {
              querries.push("insert into `"+game+"_lost` select "+time_stamp+", "+pid+", if(max(absolute),max(absolute),0) + "+counterValue+", "+counterValue+" from `"+game+"_lost` where if(id = "+pid+", 1,0) = 1;");
            } else if (userCounterName.indexOf("played") >= 0) {
              querries.push("insert into `"+game+"_played` select "+time_stamp+", "+pid+", if(max(absolute),max(absolute),0) + "+counterValue+", "+counterValue+" from `"+game+"_played` where if(id = "+pid+", 1,0) = 1;");
            } else if (userCounterName.indexOf("won") >= 0) {
              querries.push("insert into `"+game+"_won` select "+time_stamp+", "+pid+", if(max(absolute),max(absolute),0) + "+counterValue+", "+counterValue+" from `"+game+"_won` where if(id = "+pid+", 1,0) = 1;");
            }
          }
        }

        querries.push("insert into `counters_statistics` select "+time_stamp+", '"+userCounterName+"', if(max(absolute),max(absolute),0) + "+counterValue+", "+counterValue+" from `counters_statistics` where if(name = '"+userCounterName+"', 1,0) = 1;");
      }
    }

    return querries;
}


/**
 *
 *
 */
exports.init = function() {
	var instance = new MySQLBackendCountersEngine();
  return instance;
};