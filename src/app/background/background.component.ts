import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: 'background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements AfterViewInit {

  ballInfo: {x: number, y: number, speed: number, radius: number}[];
  width: number;
  height: number;
  ballColor: string = '#c7d5e0';
  intervalID: number | undefined;

  canvas: HTMLCanvasElement | undefined;

  context: any;

  @ViewChild('myCanvas', { static: true })
  myCanvas!: ElementRef<HTMLCanvasElement>;


  init() {
    // get size for canvas
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
    this.width = this.context.canvas.width;
    this.height = this.context.canvas.height;

    // create data for the balls
    for (let i = 0; i < 10; i++) {
      let radius = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
      let spawnX = Math.floor(Math.random() * ((this.width - radius) - radius + 1)) + radius;
      let spawnY = this.height + radius;
      let speed = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
      this.ballInfo.push({x: spawnX, y: spawnY, speed: speed, radius: radius});
    }
    // redraw the canvas on interval
    this.intervalID = setInterval(()=>{this.drawBallOnCanvas()}, 33);

  }

  drawBallOnCanvas() {

    // Clear the canvas

    this.context.fillStyle = '#2a475e';
    this.context.fillRect(0, 0, this.width, this.height);

    // render the ball

    for (let i = 0; i < this.ballInfo.length; i++) {
      let gradient = this.context.createRadialGradient(this.ballInfo[i].x, this.ballInfo[i].y, this.ballInfo[i].radius, (this.ballInfo[i].x - 3), (this.ballInfo[i].y - 3), 0);
      gradient.addColorStop(.66, this.ballColor)
      gradient.addColorStop(1, "#9999ff");
      this.context.strokeStyle = 'black';
      this.context.fillStyle = gradient;
      this.context.beginPath();
      this.context.arc(this.ballInfo[i].x, this.ballInfo[i].y, this.ballInfo[i].radius, 0, 2 * Math.PI);
      this.context.fill();
      this.context.closePath();
    }

    // update ball position
    for (let i = 0; i < this.ballInfo.length; i++) {
      this.ballInfo[i].y -= this.ballInfo[i].speed;

      if (this.ballInfo[i].y < 0) {
        this.ballInfo[i].y = this.height - this.ballInfo[i].radius;
        this.ballInfo[i].x = Math.floor(Math.random() * ((this.width - this.ballInfo[i].radius) - this.ballInfo[i].radius + 1)) + this.ballInfo[i].radius;
        this.ballInfo[i].speed = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
      }

    }
  }

  constructor() {
    this.ballInfo = [];
    this.width = window.innerWidth
    this.height = window.innerHeight;

  }
  // restart animation on window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    this.ballInfo = [];
    clearInterval(this.intervalID);
    this.init();
  }

  ngAfterViewInit() {
    // get canvas and run init
    this.canvas = this.myCanvas.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.init();
  }



}

