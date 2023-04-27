import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {GameStatsPanelComponent} from "./game-stats-panel/game-stats-panel.component";
import {TopGamesComponent} from "./top-games/top-games.component";
import {GenrePickerComponent} from "./genre-picker/genre-picker.component";

const routes: Routes = [
  {path: '', component: TopGamesComponent},
  {path: 'stats', component: GameStatsPanelComponent},
  {path: 'genre-picker', component: GenrePickerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
