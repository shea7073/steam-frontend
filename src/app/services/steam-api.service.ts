import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SteamApiService {

  constructor(private http: HttpClient) {
  }
  loadTopGames(){
    // gets top 100 selling games of the day
    return this.http.get("http://localhost:3000/api/allTopGames")
  }

  loadCurrentPlayers(){
    // gets current player for top 100 most popular games
    return this.http.get("http://localhost:3000/api/current-players");
  }

  load24hrStats(title: string | boolean | undefined){
    // gets all player data from current calendar day for specific game
    return this.http.post("http://localhost:3000/api/24hr", {title: title})
  }

}
