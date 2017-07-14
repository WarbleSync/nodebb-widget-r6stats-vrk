'use strict';

var async =  module.parent.require('async'),
fs = require('fs'),
path = require('path'),
templates = module.parent.require('templates.js'),
db = require.main.require('./src/database'),
util = require("util"),
cron = require.main.require('cron').CronJob,
MongoClient = require('mongodb').MongoClient,
assert = require('assert'),
url = 'mongodb://localhost:27017/0',
RainbowSixApi = require('rainbowsix-api-node'),
R6 = new RainbowSixApi(),
players = [],
cronJobs = [],
app;

var Widget = {
	templates: {}
};

//setup cron job
cronJobs.push(new cron('30 0 * * *', function(){
	console.log('UPDATING R6STATS')
	Widget.updateStats()
}, null, false));

Widget.init = function(params, callback) {
  console.log('r6 init')
  app = params.app;
	reStartCronJobs()
  var templatesToLoad = [
    'widget.tpl',
    'r6siege.tpl'
  ];

  function loadTemplate(template, next){
    fs.readFile(path.resolve(__dirname,'./public/templates/' + template), function(err,data){
      if(err){
        console.log(err.message);
        return next(err);
      }
      Widget.templates[template] = data.toString();
      next(null);
    });
  }

  async.each(templatesToLoad, loadTemplate);

  callback();
};

Widget.renderR6StatsWidget = function(widget, callback) {
  var lookup_keys = []
  var players = []

	function getAttacker(player){
		player.operator_records.forEach(function(op){
			if(op.operator.role == 'atk'){
				if(!player.hasOwnProperty('fav_atk')){
					player.fav_atk = op
				}
				if(player.fav_atk.stats.played < op.stats.played){
					player.fav_atk = op
				}
			}
		})
	}

	function getDefender(player){
		player.operator_records.forEach(function(op){
			if(op.operator.role == 'def'){
				if(!player.hasOwnProperty('fav_def')){
					player.fav_def = op
				}
				if(player.fav_def.stats.played < op.stats.played){
					player.fav_def = op
				}
			}
		})
	}
  async.waterfall([
    function(callback){
			db.getSortedSetRangeWithScores('username:uid',0,-1,function(err,res){
				var results = res
				results.forEach(function(u){
					lookup_keys.push('user:' + u.score + ':r6stats')
				})
				callback()
			})
    },
		function(callback){
			db.getObjects(lookup_keys,function(err, results){
				results.forEach(function(u){
					if(typeof u !== 'undefined'){
						if(u.stats.casual.playtime  >= 3600){
							u.playtime = Math.floor(u.stats.casual.playtime / 3600 ) + ' h ' + Math.floor((u.stats.casual.playtime % 3600) / 60) + ' m'
							players.push(u)
						}
					}
				})
				callback()
			})
		},
		function(callback){
			async.each(players,
				function(player, cb){
					getAttacker(player)
					getDefender(player)
					cb()
				},
				function(err){
					callback()
				})
		},
		function(callback){
			async.sortBy(players,
				function(player,callback){
					callback(null, player.stats.casual.kd * -1)
				},
				function(err,result){
					players = result
					callback()
				})
		}
  ],function(err,result){
		// console.log(players)
		var rep = {
			players: players
		};

	  var pre = ""+fs.readFileSync(path.resolve(__dirname,'./public/templates/r6siege.tpl'));
		widget.html = templates.parse(pre, rep)
		// callback(null, templates.parse(pre, rep));
		callback(null, widget);
  })


};

Widget.defineWidgets = function(widgets, callback) {
  widgets = widgets.concat([
  		{
  			widget: "r6stats-vrk",
  			name: "r6stats-vrk",
  			description: "description",
  			content: Widget.templates['widget.tpl']
  		}
  	]);
    callback(null, widgets);
};

Widget.updateStats = function(){
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err)
	  console.log("Connected correctly to server")
	  getUplayIds(db, function(uplay_ids){
	    // console.dir(uplay_ids)
	    async.waterfall([
	      function(callback){
	        var oldStats = db.collection('objects')
	        oldStats.deleteMany({ _key : /.*r6stats.*/ })
	        .then(callback())
	      },
	      function(callback){
	        async.each(uplay_ids,
	          function(u, cb){
	            getPlayerStats(db, u.uplay_id, 'uplay',
	            function(err, playerStats){
	              if(!err){
	                playerStats._key = 'user:' + u._key.split(':')[1] + ':r6stats'
	                players.push(playerStats)
	                cb()
	              }
	              else{
	                cb()
	              }
	            })
	          },
	          function(err, result){
	            callback()
	          })
	      },
	      function(callback){
	        async.eachOf(players,
	          function(u, i, cb){
	            getOperatorStats(db, u.username, 'uplay',
	            function(err, operatorStats){
	              if(!err){
	                // console.log(players[i].usersname)
	                players[i].operator_records = operatorStats
	                cb()
	              }
	              else{
	                // console.log(players[i].usersname,err)
	                cb()
	              }
	            })
	          },
	          function(err, result){
	            callback()
	          })
	      },
	      function(callback){
	        async.eachOf(players,
	          function(u, i, cb){
	            var key = u._key.split(':')[0] + ':' + u._key.split(':')[1]
	            getUserInfo(db, key , function(user){
	              players[i].name = user.username
	              players[i].picture = user.picture
	              cb()
	            })
	          },
	          function(err, result){
	            callback()
	          })
	      }
	    ],
	      function (err, result){
	        insertR6Stats(db, players, function(err, result){
	          if(err){ console.error(err) }
	          db.close()
						console.log('R6Stats updated')
	        })
	      })
	  })
	})

	function getUplayIds(db, callback){
	  var collection = db.collection('objects')
	  collection.find({ uplay_id : { $exists: true, $nin: ['', null] } })
	  .toArray(function(err, docs){
	    callback(docs)
	  })
	}

	function getPlayerStats(db, usersname, platform, callback){
	  R6.stats(usersname, platform)
	  .then(response => {
	    if(!response.hasOwnProperty('status')){
	      callback(null, response.player)
	    }
	    else{
	      callback('failed')
	    }
	  })
	  .catch(error => {
	    // console.error(error)
	    callback(error)
	  })
	}

	function getOperatorStats(db, usersname, platform, callback){
	  R6.stats(usersname, platform, true)
	  .then(response => {
	    if(!response.hasOwnProperty('status')){
	      // console.dir(response.operator_records)
	      callback(null, response.operator_records)
	    }
	    else{
	      callback('failed')
	    }
	  })
	  .catch(error => {
	    callback(error)
	  })
	}

	function getUserInfo(db, userKey, callback){
	  var collection = db.collection('objects')
	  collection.find({ _key : { $exists: true, $eq: userKey } })
	  .toArray(function(err, docs){
	    callback(docs[0])
	  })
	}

	function insertR6Stats(db, data, callback){
	  var collection = db.collection('objects')
	  collection.insertMany(data,function(err,result){
	    callback(result)
	  })
	}
}

function reStartCronJobs() {
	cronJobs.forEach(function(job) {
		console.log('starting cron jobs for R6Stats')
		job.start();
	});
}

function stopCronJobs() {
	cronJobs.forEach(function(job) {
		job.stop();
	});
}

module.exports = Widget;
