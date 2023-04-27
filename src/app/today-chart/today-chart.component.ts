import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Chart} from "chart.js/auto";
import {HttpClient} from "@angular/common/http";
import {D} from "@angular/cdk/keycodes";
import {SteamApiService} from "../services/steam-api.service";

@Component({
  selector: 'app-today-chart',
  templateUrl: './today-chart.component.html',
  styleUrls: ['./today-chart.component.css']
})
export class TodayChartComponent implements AfterViewInit{

  @Input() gameTitle: string | undefined | boolean;
  @Input() index: number | undefined;

  // canvas for the chart
  @ViewChild("chartCanvas") myCanvas?: ElementRef<HTMLCanvasElement>;

  chart: any;
  cleaned_data: any;
  data: any;
  averagePlayers: number | undefined

  bestPlayTime: any;
  constructor(private steam: SteamApiService) {
  }

  async loadStats() {
    // make api call to steam service and prepare data for charting
    if (!localStorage.getItem(`${this.gameTitle}-24hr`)){
      this.steam.load24hrStats(this.gameTitle)
        .subscribe((stats) => {
          this.data = stats
          this.cleaned_data = this.data.map((line: any) => {
            return {
              y: parseInt(line.Data.Current.replaceAll(',', '')),
              x: line.Updated
            }

          });
          localStorage.setItem(`${this.gameTitle}-24hr`, JSON.stringify(this.cleaned_data!));
          this.cleaned_data = this.chartPrep(this.cleaned_data);
          // create chart with data
          this.createChart();
          let data = this.cleaned_data.map((line: { x: any, y: any})=> line.y);
          // calculations based on player data
          this.averagePlayers = this.calculateAverage(data);
          this.bestPlayTime = this.bestTime(this.cleaned_data);
        })
    }
    else {
      // this.cleaned_data = JSON.parse(localStorage.getItem(`${this.gameTitle}-24hr`) || '{}');
      // this.cleaned_data = this.chartPrep(this.cleaned_data);
      // this.createChart();
      // let data = this.cleaned_data.map((line: { x: any, y: any})=> line.y);
      // this.averagePlayers = this.calculateAverage(data);
      // this.bestPlayTime = this.bestTime(this.cleaned_data);
    }

  }

  createChart() {
    this.chart = new Chart(this.myCanvas?.nativeElement!, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        datasets: [
          {
            label: "Players",
            data: this.cleaned_data,
            backgroundColor: 'black'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });

  }

  chartPrep(data: any){
    // this function makes sure chart data is ready for createChart
    let pm;
    let result;
    for (let i = 0; i < data.length; i++){
      // extract time
      let parsedTime = data[i].x.split('T')[1].slice(0, 5);
      let split = parsedTime.split('');
      // this conditional needs to be improved. It is supposed to help with issues
      // that arise from timezone differences in original dataset
      if (split[0] === '0' && !pm) {
        split[1] = (parseInt(split[1])-4).toString()
        result  = split.join('')
      }
      else if (split[0] === '0' && pm){
        let num = parseInt(split[0]  + split[1]) + 20
        result = num.toString() + split.slice(2).join('');

      }
      else {
        pm = true;
        let num = parseInt(split[0]  + split[1]) - 4
        result = num.toString() + split.slice(2).join('');
      }

      // save time stamp as x coordinate
      data[i].x = result;
    }
    return data
  }

  calculateAverage(data: any) {
    // average num of players since midnight
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return Math.round(sum / data.length)
  }

  bestTime(data: any){
    // time when the most people are playing
    let highest = 0;
    let timestamp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].y > highest){
        highest = data[i].y;
        timestamp = data[i].x;
      }
    }
    return timestamp;
  }

  ngAfterViewInit() {
    this.loadStats().then(()=> {
      // if data is in local storage load from there before rendering
      if (localStorage.getItem(`${this.gameTitle}-24hr`)){
        this.cleaned_data = JSON.parse(localStorage.getItem(`${this.gameTitle}-24hr`) || '{}');
        this.cleaned_data = this.chartPrep(this.cleaned_data);
        this.createChart();
        let data = this.cleaned_data.map((line: { x: any, y: any})=> line.y);
        this.averagePlayers = this.calculateAverage(data);
        this.bestPlayTime = this.bestTime(this.cleaned_data);
      }
    });

  }
}
