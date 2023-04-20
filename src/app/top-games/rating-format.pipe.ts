import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingFormat'
})
export class RatingFormatPipe implements PipeTransform {

  transform(game: any): string {
    if (game.Text_Rating){
      let percent: string = game.Percent_Rating.match(/\d+?%/g);
      return `${percent} - ${game.Text_Rating}`
    }
    else {
      return 'Unreleased'
    }


  }

}
