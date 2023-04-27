import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SteamApiService} from "../services/steam-api.service";

@Component({
  selector: 'app-game-stats-panel',
  templateUrl: './game-stats-panel.component.html',
  styleUrls: ['./game-stats-panel.component.css']
})
export class GameStatsPanelComponent implements OnInit{
  panelOpenState = false;
  currentPlayerStats: any;
  chart: any;
  constructor(private steam: SteamApiService) {

  }
  current_players(): any {
    // get stats using current players method from steam service
    if (!localStorage.getItem('current_Player_Stats')) {
      this.steam.loadCurrentPlayers()
        .subscribe((stats) => {
          this.currentPlayerStats = stats
          localStorage.setItem('current_Player_Stats', JSON.stringify(this.currentPlayerStats));
        });
    } else {
      // get stats from local storage
      console.log('loading stats locally')
      this.currentPlayerStats = JSON.parse(localStorage.getItem('current_Player_Stats') || '{}');
    }
  }

  ngOnInit(){
    // load data
    this.current_players();
  }
}
