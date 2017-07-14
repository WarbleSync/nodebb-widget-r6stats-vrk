<link rel="stylesheet" type="text/css" href="/plugins/nodebb-widget-r6stats-vrk/public/css/style.css">
<div id="r6leaderboard">
  <script>
    function showData(target){
      var tr = target.nextElementSibling
      if(tr.style.display === 'none'){
        tr.style.display = 'table-row'
      } else {
        tr.style.display = 'none'
      }
      // console.log(target.nextElementSibling.style.display)
    }
  </script>
  <table class="table table-responsive">
    <thead>
      <tr>
        <th colspan="7" class="text-center">
          <h3>Rainbow Six: Siege<br/>Leaderboard</h3>
        </th>
      </tr>
      <tr>
        <th>Name</th>
        <th>Attacker</th>
        <th>Defender</th>
        <th>K/D</th>
        <th>W/L</th>
        <th>Level</th>
        <th>Time Played</th>
      </tr>
    </thead>
    <tbody>
  <!-- IF players.length -->
    <!-- BEGIN players -->
      <tr onclick="showData(this)" class="statsToggle">
        <td style="vertical-align: middle; padding-left: 25px;"><h5 class="text-uppercase">{players.name}</h5></td>
        <td style="vertical-align: middle;">
          <!-- IF players.fav_atk.operator.images.badge -->
            <img class="op_badge img-thumbnail" src="{players.fav_atk.operator.images.badge}" />
          <!-- ENDIF players.fav_atk.operator.images.badge -->
        </td>
        <td style="vertical-align: middle;">
          <!-- IF players.fav_def.operator.images.badge -->
            <img class="op_badge img-thumbnail" src="{players.fav_def.operator.images.badge}" />
          <!-- ENDIF players.fav_def.operator.images.badge -->
        </td>
        <td style="vertical-align: middle;">{players.stats.casual.kd}</td>
        <td style="vertical-align: middle;">{players.stats.casual.wins} / {players.stats.casual.losses}</td>
        <td style="vertical-align: middle;">{players.stats.progression.level}</td>
        <td style="vertical-align: middle;">{players.playtime}</td>
      </tr>
      <tr style="display: none;">
        <td colspan="7">
          <div class="container">
            <div class="row">
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
          </diV>
        </td>
      </tr>
    <!-- END players -->
  <!-- END players.length -->
    </tbody>
  <table>
</div>
