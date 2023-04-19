import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {GameStatsPanelComponent} from "./game-stats-panel/game-stats-panel.component";

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'stats', component: GameStatsPanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
