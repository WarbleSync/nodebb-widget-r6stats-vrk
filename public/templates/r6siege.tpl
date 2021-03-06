<link rel="stylesheet" type="text/css" href="/plugins/nodebb-widget-r6stats-vrk/public/css/style.css">
<script src="/plugins/nodebb-widget-r6stats-vrk/public/scripts/r6.js"></script>
<div id="r6leaderboard">
  <div class="container-fluid">
    <!-- IF !players.length -->
    <div class="row align-middle" >
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center">
        <strong class="text-uppercase">No results at this time</strong>
      </div>
    </div>
    <!-- ENDIF !players.length -->

    <!-- IF players.length -->
    <div class="row align-middle" >
      <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong class="text-uppercase">Name</strong></div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong class="text-uppercase">Level</strong></div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong class="text-uppercase">K/D</strong></div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"><strong class="text-uppercase">W/L</strong></div>
      <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"><strong class="text-uppercase">Time Played</strong></div>
    </div>
    <!-- ENDIF players.length -->

      <!-- BEGIN players -->
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12col-lg-12"><hr/></div>
      </div>
      <div class="row align-middle statsToggle" style="padding: 10px;" onclick="showData(this)">
        <div class="col-md-1">
          <img src="{players.picture}" style="max-width: 36px;">
        </div>
        <div class="col-md-2">
          <p><strong>{players.username}</strong></p>
        </div>
        <div class="col-md-2">
          <p>{players.stats.progression.level}</p>
        </div>
        <!-- IF ranked -->
        <div class="col-md-2"><p>{players.stats.ranked.kd}</p></div>
        <div class="col-md-2"><p>{players.stats.ranked.wlr}</p></div>
        <div class="col-md-3"><p>{players.playtime}</p></div>
        <!-- ENDIF ranked -->
        <!-- IF !ranked -->
        <div class="col-md-2"><p>{players.stats.casual.kd}</p></div>
        <div class="col-md-2"><p>{players.stats.casual.wlr}</p></div>
        <div class="col-md-3"><p>{players.playtime}</p></div>
        <!-- ENDIF !ranked -->
      </div>
      <div class="container-fluid well" style="display:none;">
        <div class="row">
          <div class="col-md-12"><hr/></div>
        </div>
        <div class="row align-middle" >
          <div class="col-md-1"></div>
          <div class="col-md-1"><strong class="text-lowercase">Operator</strong></div>
          <div class="col-md-1"><strong class="text-lowercase">Time Played</strong></div>
          <div class="col-md-1"><strong class="text-lowercase">Kills</strong></div>
          <div class="col-md-1"><strong class="text-lowercase">Deaths</strong></div>
          <div class="col-md-1"><strong class="text-lowercase">Wins</strong></div>
          <div class="col-md-1"><strong class="text-lowercase">Losses</strong></div>
          <div class="col-md-5"><strong class="text-lowercase">Specials</strong></div>
        </div>

          <!-- BEGIN players.operator_records -->
          <div class="row">
            <div class="col-md-12"><hr/></div>
          </div>
          <div class="row align-middle" style="padding: 2px;">
            <div class="col-md-1">
              <img src="{players.operator_records.image}" style="max-width: 36px;">
            </div>
            <div class="col-md-1"><p>{players.operator_records.operator.name}</p></div>
            <div class="col-md-1"><p>{players.operator_records.playtime}</p></div>
            <div class="col-md-1"><p>{players.operator_records.stats.kills}</p></div>
            <div class="col-md-1"><p>{players.operator_records.stats.deaths}</p></div>
            <div class="col-md-1"><p>{players.operator_records.stats.wins}</p></div>
            <div class="col-md-1"><p>{players.operator_records.stats.losses}</p></div>
            <div class="col-md-5">
              <!-- BEGIN players.operator_records.specials -->
                  <p><small class="badge">{players.operator_records.specials.value}</small></p>
              <!-- END players.operator_records.specials -->
            </div>
          </div>
          <!-- END players.operator_records -->

      </div>
      <!-- END players -->


</div>
