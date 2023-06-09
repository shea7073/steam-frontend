import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { TopGamesComponent } from './top-games/top-games.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { RatingFormatPipe } from './top-games/rating-format.pipe';
import { GamePriceComponent } from './game-price/game-price.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameStatsPanelComponent } from './game-stats-panel/game-stats-panel.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { TodayChartComponent } from './today-chart/today-chart.component';
import {FormsModule} from "@angular/forms";
import { GenrePickerComponent } from './genre-picker/genre-picker.component';


@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    TopGamesComponent,
    RatingFormatPipe,
    GamePriceComponent,
    WishlistComponent,
    GameStatsPanelComponent,
    TodayChartComponent,
    GenrePickerComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
