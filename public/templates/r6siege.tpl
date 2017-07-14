<link rel="stylesheet" type="text/css" href="/plugins/nodebb-widget-r6stats-vrk/public/css/style.css">
<div id="r6leaderboard">
  <script>
    function showData(target){
      var tr = target.nextElementSibling
      if(tr.style.display === 'none'){
        tr.style.display = 'block'
      } else {
        tr.style.display = 'none'
      }
      // console.log(target.nextElementSibling.style.display)
    }
  </script>

  <div class="container">
    <div class="row table-header">
      <div class="col-md-12 text-center">
        <h3>Rainbow Six: Siege Leaderboard</h3>
        <hr/>
      </div>

    </div>

    <div class="row table-title">
      <div class="col-md-3 text-uppercase text-center"><strong>Name</strong></div>
      <div class="col-md-2 text-uppercase"><strong>Attacker</strong></div>
      <div class="col-md-2 text-uppercase"><strong>Defender</strong></div>
      <div class="col-md-1 text-uppercase"><strong>K/D</strong></div>
      <div class="col-md-1 text-uppercase"><strong>W/L</strong></div>
      <div class="col-md-1 text-uppercase"><strong>Level</strong></div>
      <div class="col-md-2 text-uppercase"><strong>Time Played</strong></div>
    </div>
    <hr/>
    <!-- IF players.length -->
      <!-- BEGIN players -->
      <div class="row table-row">

        <div class="row statsToggle" onclick="showData(this)">
          <div>
            <div class="col-md-1">
              <!-- IF players.name -->
              <img class="player-image" src="{players.picture}" />
              <!-- END players.name -->
            </div>
            <div class="col-md-2">
              <h5 class="text-uppercase">{players.name}</h5>

            </div>
            <div class="col-md-2">
              <!-- IF players.fav_atk.operator.images.badge -->
                <img class="op_badge img-thumbnail" src="{players.fav_atk.operator.images.badge}" />
              <!-- ENDIF players.fav_atk.operator.images.badge -->
            </div>
            <div class="col-md-2">
              <!-- IF players.fav_def.operator.images.badge -->
                <img class="op_badge img-thumbnail" src="{players.fav_def.operator.images.badge}" />
              <!-- ENDIF players.fav_def.operator.images.badge -->
            </div>
            <div class="col-md-1">{players.stats.casual.kd}</div>
            <div class="col-md-1">{players.stats.casual.wins} / {players.stats.casual.losses}</div>
            <div class="col-md-1">{players.stats.progression.level}</div>
            <div class="col-md-2">{players.playtime}</div>
          </div>
        </div>

        <div class="row" style="display: none;">
          <div class="col-md-2">
            <!-- IF players.fav_atk.operator.images.bust -->
              <img class="op_bust img-thumbnail" src="{players.fav_atk.operator.images.bust}" />
            <!-- ENDIF players.fav_atk.operator.images.bust -->
          </div>
          <div class="col-md-4">
            <h4 class="media-heading"><span class="label label-default">{players.fav_atk.operator.name} [{players.fav_atk.operator.ctu}]</span></h4>
            <p><span class="label label-default">Wins</span> <span class="badge">{players.fav_atk.stats.wins}</span></p>
            <p><span class="label label-default">Losses</span> <span class="badge">{players.fav_atk.stats.losses}</span></p>
            <p><span class="label label-default">Kills</span> <span class="badge">{players.fav_atk.stats.kills}</span></p>
            <p><span class="label label-default">Deaths</span> <span class="badge">{players.fav_atk.stats.deaths}</span></p>
          </div>
          <div class="col-md-2">
            <!-- IF players.fav_def.operator.images.bust -->
              <img class="op_bust img-thumbnail" src="{players.fav_def.operator.images.bust}" />
            <!-- ENDIF players.fav_def.operator.images.bust -->
          </div>
          <div class="col-md-4">
            <h4 class="media-heading"><span class="label label-default">{players.fav_def.operator.name} [{players.fav_def.operator.ctu}]</span></h4>
            <p><span class="label label-default">Wins</span> <span class="badge">{players.fav_def.stats.wins}</span></p>
            <p><span class="label label-default">Losses</span> <span class="badge">{players.fav_def.stats.losses}</span></p>
            <p><span class="label label-default">Kills</span> <span class="badge">{players.fav_def.stats.kills}</span></p>
            <p><span class="label label-default">Deaths</span> <span class="badge">{players.fav_def.stats.deaths}</span></p>
          </div>
        </div>

        <hr/>
      </div>
      <!-- END players -->
    <!-- END players.length -->


</div>
