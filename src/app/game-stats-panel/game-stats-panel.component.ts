import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-game-stats-panel',
  templateUrl: './game-stats-panel.component.html',
  styleUrls: ['./game-stats-panel.component.css']
})
export class GameStatsPanelComponent{
  panelOpenState = false;

  currentPlayerStats: any;
  chart: any;

  constructor(private http: HttpClient) {
    this.current_players();
  }
  current_players(): any {
    if (!localStorage.getItem('current_Player_Stats')) {
      this.http.get("http://localhost:3000/api/current-players")
        .subscribe((stats) => {
          this.currentPlayerStats = stats

          localStorage.setItem('current_Player_Stats', JSON.stringify(this.currentPlayerStats));
        });
    } else {
      console.log('loading stats locally')
      this.currentPlayerStats = JSON.parse(localStorage.getItem('current_Player_Stats') || '{}');
    }
  }




}
