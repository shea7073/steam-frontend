import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SteamApiService} from "../services/steam-api.service";

@Component({
  selector: 'app-top-games',
  templateUrl: './top-games.component.html',
  styleUrls: ['./top-games.component.css']
})
export class TopGamesComponent implements AfterViewInit, OnInit {

  @ViewChildren('gameRow') rows?: QueryList<any>

  constructor(private steam: SteamApiService) {
    this.load_games();
  }

  top_games: any = [];
  filtered_top_games: any = [];

  load_games(): any {
    // get top 100 games from steam api
    if (!localStorage.getItem('top_games')) {
      this.steam.loadTopGames()
        .subscribe((games) => {
          this.top_games = games
          // filter for games with valid title
          this.filtered_top_games = this.top_games.filter((game: any) => game.Title)
          console.log(this.filtered_top_games);
          localStorage.setItem('top_games', JSON.stringify(this.filtered_top_games));
        });
    } else {
      //console.log('loading locally')
      this.filtered_top_games = JSON.parse(localStorage.getItem('top_games') || '{}');
    }
  }


  ngOnInit(){

  }
  ngAfterViewInit() {
    // makes sure event listeners for drags are active
    this.rebind_listeners();
    this.rows?.changes.subscribe(element => {
      this.rebind_listeners()
    })
  }

  sort_control(value: any) {
    // controls which sort is being run
    if (value.target.value === 'most-discount') {
      this.sort_discount();
    }
    else if (value.target.value === 'highest-rated') {
      this.sort_rating();
    }
    else if (value.target.value == 'newest') {
      this.sort_date();
    }
  }
  sort_rating(): void {
    // sorts based on best average rating of games
    this.filtered_top_games.forEach((game: any) => {
      if (game.Percent_Rating !== null) {
        game.stripped_rating = game.Percent_Rating.match(/\d+?%/g);
        if (game.stripped_rating === null) {
          game.stripped_rating = ['00'];
        }
      } else {
        game.stripped_rating = ["00"];
      }
    })
    this.filtered_top_games.sort((game1: any, game2: any) => {
      let rating1 = parseInt(game1.stripped_rating[0].slice(0, 2));
      let rating2 = parseInt(game2.stripped_rating[0].slice(0, 2));
      if (rating1 > rating2) {
        return -1;
      } else {
        return 1;
      }
    });
    this.rebind_listeners();
  }

  sort_discount(){
    // sorts by largest discount
    let discount1;
    let discount2;

    this.filtered_top_games.sort((game1: any, game2: any) => {
      if (game1.final_pricing.discounted) {
        discount1  = game1.final_pricing.percentage;
      } else {
        discount1 = 0;
      }
      if (game2.final_pricing.discounted) {
        discount2 = game2.final_pricing.percentage;
      } else {
        discount2 = 0;
      }
      if (discount1 > discount2) {
        return -1;
      } else {
        return 1;
      }
    });
    this.rebind_listeners();
  }

  sort_date() {
    // sorts by release date
    this.filtered_top_games.sort((game1: any, game2: any) => {
      let date1 = new Date(game1.Release_Date).getTime();
      let date2 = new Date(game2.Release_Date).getTime();
      return date2 - date1;
    });
    this.rebind_listeners();
  }

  rebind_listeners() {
    // loops through all table elements and adds correct listeners
    console.log('running')
    const gameElements: HTMLTableElement = <HTMLTableElement>document.getElementById('game-table');
    for (let i = 0; i < gameElements.rows.length; i++) {
      gameElements.rows[i].addEventListener('dragstart', (e: DragEventInit) => {
        console.log('Dragging');
        let title = gameElements.rows[i].cells[1].innerHTML;
        let price = gameElements.rows[i].cells[4].children[0].children[0].children[0].innerHTML;
        let data = {title: title, price: price};
        e.dataTransfer?.setData('text', JSON.stringify(data));
      });
    }
  }


}
