'use strict';

var async =  module.parent.require('async'),
fs = require('fs'),
path = require('path'),
templates = module.parent.require('templates.js'),
db = require.main.require('./src/database'),
util = require("util"),
players = [],
app;

var Widget = {
	templates: {}
};

Widget.init = function(params, callback) {
  console.log('[' + new Date().toISOString() + '][R6STATS] 🔫 WIDGET INIT')
  app = params.app;
  var templatesToLoad = [
    'widget.tpl',
    'r6siege.tpl'
  ];

  function loadTemplate(template, next){
    fs.readFile(path.resolve(__dirname,'./public/templates/' + template), function(err,data){
      if(err){
        console.log('[' + new Date().toISOString() + '][R6STATS] 🔫 ' + err.message);
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
						if(u.stats.casual.playtime  >= 3600 || u.stats.ranked.playtime >= 3600){
							if(widget.data.ranked){
								u.playtime = Math.floor(u.stats.ranked.playtime / 3600 ) + ' h ' + Math.floor((u.stats.ranked.playtime % 3600) / 60) + ' m'
							}
							else{
								u.playtime = Math.floor(u.stats.casual.playtime / 3600 ) + ' h ' + Math.floor((u.stats.casual.playtime % 3600) / 60) + ' m'
							}
							if(u.picture == ''){ //set to recruit if no profile pic
								u.picture = 'https://i.imgur.com/hb1oGHW.png'
							}
							u.operator_records.forEach(function(o){
								o.playtime = Math.floor(o.stats.playtime / 3600 ) + ' h ' + Math.floor((o.stats.playtime % 3600) / 60) + ' m'
								if(widget.data.badge){
									o.image = o.operator.images.badge
								}
								else{
									o.image = o.operator.images.bust
								}
								o.specials = []
								if(o.operator.name == 'Thermite'){
									o.specials.push({value :'Exo-Thermic Charge Deployed: ' + o.stats.specials.operatorpvp_thermite_chargedeployed })
									o.specials.push({value :'Exo-Thermic Charge Kills: ' + o.stats.specials.operatorpvp_thermite_chargekill })
									o.specials.push({value :'Reinforcements Breached by Exo-Thermic Charge: ' + o.stats.specials.operatorpvp_thermite_reinforcementbreached })
								}
								if(o.operator.name == 'Valkyrie'){
									o.specials.push({value :'Black Eye cameras deployed: ' + o.stats.specials.operatorpvp_valkyrie_camdeployed })
								}
								if(o.operator.name == 'Jackal'){
									o.specials.push({value :'Cazador Kill Assists: ' + o.stats.specials.operatorpvp_cazador_assist_kill })
								}
								if(o.operator.name == 'Blackbeard'){
									o.specials.push({value :'Bullets Stopped by Shield: ' + o.stats.specials.operatorpvp_blackbeard_gunshieldblockdamage })
								}
								if(o.operator.name == 'Kapkan'){
									o.specials.push({value :'Entry Denial Device Deployed: ' + o.stats.specials.operatorpvp_kapkan_boobytrapdeployed })
									o.specials.push({value :'Entry Denial Device Kills: ' + o.stats.specials.operatorpvp_kapkan_boobytrapkill })
								}
								if(o.operator.name == 'Pulse'){
									o.specials.push({value :'Cardiac Sensor Assist Kills: ' + o.stats.specials.operatorpvp_pulse_heartbeatassist })
									o.specials.push({value :'Heartbeats Spotted: ' + o.stats.specials.operatorpvp_pulse_heartbeatspot })
								}
								if(o.operator.name == 'Thatcher'){
									o.specials.push({value :'Gadgets Destroyed by EMP: ' + o.stats.specials.operatorpvp_thatcher_gadgetdestroywithemp })
								}
								if(o.operator.name == 'Hibana'){
									o.specials.push({value :'X-Kairos Pellets Detonated: ' + o.stats.specials.operatorpvp_hibana_detonate_projectile })
								}
								if(o.operator.name == 'Ash'){
									o.specials.push({value :'Kills by Breaching Round: ' + o.stats.specials.operatorpvp_ash_bonfirekill })
									o.specials.push({value :'Destruction by Breaching Round: ' + o.stats.specials.operatorpvp_ash_bonfirewallbreached })
								}
								if(o.operator.name == 'Twitch'){
									o.specials.push({value :'Gadgets Destroyed by Shock Drone: ' + o.stats.specials.operatorpvp_twitch_gadgetdestroybyshockdrone })
									o.specials.push({value :'Shock Drone Kills: ' + o.stats.specials.operatorpvp_twitch_shockdronekill })
								}
								if(o.operator.name == 'Rook'){
									o.specials.push({value :'Armor Pack Deployed: ' + o.stats.specials.operatorpvp_rook_armorboxdeployed })
									o.specials.push({value :'Armor Plate Employed: ' + o.stats.specials.operatorpvp_rook_armortakenourself })
									o.specials.push({value :'Armor Plate Taken by Teammates: ' + o.stats.specials.operatorpvp_rook_armortakenteammate })
								}
								if(o.operator.name == 'Mira'){
									o.specials.push({value :'Mirrors Deployed: ' + o.stats.specials.operatorpvp_black_mirror_gadget_deployed })
								}
								if(o.operator.name == 'Frost'){
									o.specials.push({value :'Enemies caught in Welcome Mats: ' + o.stats.specials.operatorpvp_frost_dbno })
								}
								if(o.operator.name == 'Smoke'){
									o.specials.push({value :'Poison gas kills: ' + o.stats.specials.operatorpvp_smoke_poisongaskill })
								}
								if(o.operator.name == 'Mute'){
									o.specials.push({value :'Gadget Jammed: ' + o.stats.specials.operatorpvp_mute_gadgetjammed })
									o.specials.push({value :'Signal Disruptor Deployed: ' + o.stats.specials.operatorpvp_mute_jammerdeployed })
								}
								if(o.operator.name == 'Castle'){
									o.specials.push({value :'Armor Panel Deployed: ' + o.stats.specials.operatorpvp_castle_kevlarbarricadedeployed })
								}
								if(o.operator.name == 'Jäger'){
									o.specials.push({value :'Gadget Destroyed by Active Defense: ' + o.stats.specials.operatorpvp_jager_gadgetdestroybycatcher })
								}
								if(o.operator.name == 'Glaz'){
									o.specials.push({value :'Sniper Kills: ' + o.stats.specials.operatorpvp_glaz_sniperkill })
									o.specials.push({value :'Sniper Penetration Kills: ' + o.stats.specials.operatorpvp_glaz_sniperpenetrationkill })
								}
								if(o.operator.name == 'Echo'){
									o.specials.push({value :'Yokai Stuns: ' + o.stats.specials.operatorpvp_echo_enemy_sonicburst_affected })
								}
								if(o.operator.name == 'Sledge'){
									o.specials.push({value :'Destruction by Breaching Hammer: ' + o.stats.specials.operatorpvp_sledge_hammerhole })
									o.specials.push({value :'Kills by Breaching Hammer: ' + o.stats.specials.operatorpvp_sledge_hammerkill })
								}
								if(o.operator.name == 'Fuze'){
									o.specials.push({value :'Cluster Charge Kills: ' + o.stats.specials.operatorpvp_fuze_clusterchargekill })
								}
								if(o.operator.name == 'Buck'){
									o.specials.push({value :'Kills with the Skeleton Key: ' + o.stats.specials.operatorpvp_buck_kill })
								}
								if(o.operator.name == 'Doc'){
									o.specials.push({value :'Assets Revived: ' + o.stats.specials.operatorpvp_doc_hostagerevive })
									o.specials.push({value :'Revive Self: ' + o.stats.specials.operatorpvp_doc_selfrevive })
									o.specials.push({value :'Teammates Revived: ' + o.stats.specials.operatorpvp_doc_teammaterevive })
								}
								if(o.operator.name == 'Blitz'){
									o.specials.push({value :'Enemies Blinded by Flash Shield: ' + o.stats.specials.operatorpvp_blitz_flashedenemy })
									o.specials.push({value :'Flash Shield Blinded Kills: ' + o.stats.specials.operatorpvp_blitz_flashshieldassist })
									o.specials.push({value :'Flash Shield Blinded Enemies Killed by Teammate: ' + o.stats.specials.operatorpvp_blitz_flashfollowupkills })
								}
								if(o.operator.name == 'Bandit'){
									o.specials.push({value :'Shock Wire Kills: ' + o.stats.specials.operatorpvp_bandit_batterykill })
								}
								if(o.operator.name == 'Tachanka'){
									o.specials.push({value :'Mounted LMG Deployed: ' + o.stats.specials.operatorpvp_tachanka_turretdeployed })
									o.specials.push({value :'Mounted LMG Kills: ' + o.stats.specials.operatorpvp_tachanka_turretkill })
								}
								if(o.operator.name == 'IQ'){
									o.specials.push({value :'Gadgets Spotted by Electronics Detector: ' + o.stats.specials.operatorpvp_iq_gadgetspotbyef })
								}
								if(o.operator.name == 'Montagne'){
									o.specials.push({value :'Bullets Blocked by Extended Shield: ' + o.stats.specials.operatorpvp_montagne_shieldblockdamage })
								}
								if(o.operator.name == 'Caveira'){
									o.specials.push({value :'Interrogations: ' + o.stats.specials.operatorpvp_caveira_interrogations })
								}
								if(o.operator.name == 'Capitão'){
									o.specials.push({value :'Lethal Dart Kills: ' + o.stats.specials.operatorpvp_capitao_lethaldartkills })
								}
							})
							players.push(u)
						}
					}

				})
				callback()
			})
		},
		// function(callback){
		// 	async.each(players,
		// 		function(player, cb){
		// 			getAttacker(player)
		// 			getDefender(player)
		// 			cb()
		// 		},
		// 		function(err){
		// 			callback()
		// 		})
		// },
		function(callback){
			async.each(players,function(player,cb){
				async.sortBy(player.operator_records,function(ops,callback){
					callback(null, ops.stats.playtime * -1)
				},
				function(err,result){
					player.operator_records = result
					cb()
				})
			},function(err){
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
			'players': players
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

module.exports = Widget;
