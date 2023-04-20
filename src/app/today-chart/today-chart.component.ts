import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Chart} from "chart.js/auto";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-today-chart',
  templateUrl: './today-chart.component.html',
  styleUrls: ['./today-chart.component.css']
})
export class TodayChartComponent implements AfterViewInit{

  @Input() gameTitle: string | undefined | boolean;

  @ViewChild("chartCanvas") myCanvas?: ElementRef<HTMLCanvasElement>;

  chart: any;

  cleaned_data: string | null | undefined;
  data: any;
  constructor(private http: HttpClient) {
  }

  async loadStats() {
    if (!localStorage.getItem(`${this.gameTitle}-24hr`)){
      this.http.post("http://localhost:3000/api/24hr", {title: this.gameTitle})
        .subscribe((stats) => {
          //console.log(this.title)
          this.data = stats
          this.cleaned_data = this.data.map((line: any) => parseInt(line.Data.Current.replaceAll(',', '')));
          //console.log(typeof this.cleaned_data);
          localStorage.setItem(`${this.gameTitle}-24hr`, JSON.stringify(this.cleaned_data!));
          this.createChart();
        })
    }
    else {
      this.cleaned_data = JSON.parse(localStorage.getItem(`${this.gameTitle}-24hr`) || '{}');
      this.createChart();
    }

  }

  createChart() {
    this.chart = new Chart(this.myCanvas?.nativeElement!, {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45',
          '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00',
          '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15',
          '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30',
          '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '15:00', '15:15', '15:30', '15:45', '16:00',
          '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15',
          '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30',
          '22:45', '23:00', '23:15', '23:30', '23:45'],
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
  ngAfterViewInit() {
    this.loadStats();

  }
}
