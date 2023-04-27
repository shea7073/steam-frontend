import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {SteamApiService} from "../services/steam-api.service";

@Component({
  selector: 'app-genre-picker',
  templateUrl: './genre-picker.component.html',
  styleUrls: ['./genre-picker.component.css']
})
export class GenrePickerComponent implements AfterViewInit{


  top_games: any = [];
  currentPlayerStats: any;
  filtered_top_games: any = [];
  searchTag: string;
  uniqueTags: any;
  tagMatches: string[];

  selectedTags: string[];

  results: any;

  ourPicks: any[];

  constructor(private steam: SteamApiService) {
    // default values
    this.selectedTags = [];
    this.tagMatches = [];
    this.results = [];
    this.searchTag = '';
    this.ourPicks = [];
    this.load_games();
    this.current_players();
  }

  load_games(): any {
    // load top games data from steam service
    if (!localStorage.getItem('top_games')) {
      this.steam.loadTopGames()
        .subscribe((games) => {
          this.top_games = games
          // filter for games with valid title
          this.filtered_top_games = this.top_games.filter((game: any) => game.Title)
          console.log(this.filtered_top_games);
          localStorage.setItem('top_games', JSON.stringify(this.filtered_top_games));
          // pull tags from game entries
          this.uniqueTags = this.getTags();
        });
    } else {
      // get data if in local storage
      this.filtered_top_games = JSON.parse(localStorage.getItem('top_games') || '{}');
    }
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

  getTags(): any{
    // looks at all games and compiles list of unique tags
    let uniqueTags: string | any[] = [];
    for (let i = 0; i < this.filtered_top_games.length; i++){
      for (let j = 0; j < this.filtered_top_games[i].Tags.length; j++){
        if (!uniqueTags.includes(this.filtered_top_games[i].Tags[j])){
          uniqueTags.push(this.filtered_top_games[i].Tags[j]);
        }
      }
    }
    return uniqueTags.sort();
  }

  search(term: string){
    // allows for real time searching for tags via input field
    debounceTime(1000);
    distinctUntilChanged();
    let matches = [];
    for (let i = 0; i < this.uniqueTags.length; i++){
      if (this.uniqueTags[i].toUpperCase().includes(term.toUpperCase())){
        matches.push(this.uniqueTags[i]);
      }
    }
    if (term == ''){
      this.tagMatches = []
    }
    else {
      this.tagMatches = matches
    }
  }
  selectTag(tag: string): void {
    // runs when tag is added to the current state
    this.results = [];
    this.ourPicks = []
    // if tag not already added, add it
    if (!this.selectedTags.includes(tag)){
      this.selectedTags.push(tag);
    }
    console.log(this.selectedTags)
    // compile list of matching games
    for (let j = 0; j < this.filtered_top_games.length; j++){
      let match = true;
      for (let i = 0; i < this.selectedTags.length; i++){
        if (!this.filtered_top_games[j].Tags.includes(this.selectedTags[i])){
          match = false
        }
      }
      if (match){
        this.results.push(this.filtered_top_games[j]);
        this.results = this.suggestedTitle(this.results);
      }
    }
    this.searchTag = '';
    this.tagMatches = [];

  }

  removeTag(tag: string) {
    // remove tag from current state
    if (this.selectedTags.length === 1) {
      this.selectedTags = []
    } else {
      let index = this.selectedTags.indexOf(tag);
      this.selectedTags.splice(index, 1);

    }
    this.results = [];
    this.ourPicks = [];
    // compile list of matching games
    for (let j = 0; j < this.filtered_top_games.length; j++) {
      let match = true;
      for (let i = 0; i < this.selectedTags.length; i++) {
        if (!this.filtered_top_games[j].Tags.includes(this.selectedTags[i])) {
          match = false
        }
      }
      if (match) {
        this.results.push(this.filtered_top_games[j]);
        this.results = this.suggestedTitle(this.results);
      }
      if (this.selectedTags.length === 0) {
        this.results = [];
        this.ourPicks = [];
      }
    }
  }

  suggestedTitle(results: any){
    for (let i = 0; i < results.length; i++) {
      if (results[i].Price_No_Sale && results[i].Price_Sale.Sale_Price && results[i].Price_Sale.Original_Price) {
        results[i].discounted = true;
      }
      if (results[i].Price_No_Sale && results[i].Price_Sale.Sale_Price && results[i].Price_Sale.Original_Price) {
        results[i].discounted = true;
      }
      if (results[i].Price_No_Sale?.toUpperCase() === 'FREE TO PLAY'){
        results[i].discounted = false;
      }

      if (results[i].Percent_Rating !== null) {
        results[i].stripped_rating = results[i].Percent_Rating.match(/\d+?%/g);
        if (results[i].stripped_rating === null) {
          results[i].stripped_rating = ['00'];
        }
      } else {
        results[i].stripped_rating = ["00"];
      }
      let rating = parseInt(results[i].stripped_rating[0].slice(0, 2));
      if (rating >= 90) {
        results[i].highlyRated = true
      }
      let titles = this.currentPlayerStats.map((game: { Data: { Title: any; }; }) => game.Data.Title)
      if (titles.includes(results[i].Title)){
        results[i].popular = true;
      }
      if (results[i].popular && results[i].discounted && results[i].highlyRated){
        this.ourPicks.push(results[i]);
        this.ourPicks = [...new Set(this.ourPicks)];
      }
        }
    return results;
  }

  ngAfterViewInit(){
    this.uniqueTags = this.getTags();
  }

}
