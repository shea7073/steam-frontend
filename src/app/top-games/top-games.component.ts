import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-top-games',
  templateUrl: './top-games.component.html',
  styleUrls: ['./top-games.component.css']
})
export class TopGamesComponent implements AfterViewInit {

  constructor(private http: HttpClient) {
    this.load_games();
  }

  top_games: any = [];
  filtered_top_games: any = [];

  load_games(): any {
    if (!localStorage.getItem('top_games')) {
      this.http.get("http://localhost:3000/api/allTopGames")
        .subscribe((games) => {
          this.top_games = games
          this.filtered_top_games = this.top_games.filter((game: any) => game.Title)
          console.log(this.filtered_top_games);

          localStorage.setItem('top_games', JSON.stringify(this.filtered_top_games));
        });
    } else {
      //console.log('loading locally')
      this.filtered_top_games = JSON.parse(localStorage.getItem('top_games') || '{}');
    }
  }

  ngAfterViewInit() {
    this.rebind_listeners()
  }

  sort_control(value: any) {
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

    this.filtered_top_games.forEach((game: any) => {
      if (game.Percent_Rating !== null) {
        game.stripped_rating = game.Percent_Rating.match(/\d+?%/g);
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
  }

  sort_discount(){

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

  }

  sort_date() {
    this.filtered_top_games.sort((game1: any, game2: any) => {
      let date1 = new Date(game1.Release_Date).getTime();
      let date2 = new Date(game2.Release_Date).getTime();
      return date2 - date1;
    });
  }

  rebind_listeners() {
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
