import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-price',
  templateUrl: './game-price.component.html',
  styleUrls: ['./game-price.component.css']
})
export class GamePriceComponent implements OnInit{
  @Input() game: any
  discounted: boolean;
  percentage: number;
  final_price: number;

  sale_price: string;
  original_price: string;

  constructor() {
    this.discounted = false
    this.percentage = 0;
    this.final_price = 0;
    this.sale_price = '';
    this.original_price = '';

  }

  calculateDiscount(original_price: string, sale_price: string): number {
    let original_float: number = parseFloat(original_price.substring(1));
    let sale_float: number = parseFloat(sale_price.substring(1));
    return Math.round((1 - (sale_float / original_float)) * 100);
  }

  // This method looks messy but all its doing is taking the pricing data from the api results
  // and determining which price is the intended price
  ngOnInit() {
    if (this.game.Price_Sale.Sale_Price){
      this.sale_price = this.game.Price_Sale.Sale_Price.slice();
    }
    if (this.game.Price_Sale.Original_Price) {
      this.original_price = this.game.Price_Sale.Original_Price.slice();
    }

    if (this.game.Price_No_Sale && (this.game.Price_Sale.Sale_Price === null || this.game.Price_Sale.Original_Price === null)) {
      this.discounted = false;
      this.final_price = this.game.Price_No_Sale;
    }
    else if (this.game.Price_No_Sale && this.game.Price_Sale.Sale_Price && this.game.Price_Sale.Original_Price) {
      this.discounted = true;
      this.percentage = this.calculateDiscount(this.original_price, this.sale_price);
      this.final_price = this.game.Price_Sale.Sale_Price;
    }
    else if (this.game.Price_No_Sale === null && this.game.Price_Sale.Sale_Price && this.game.Price_Sale.Original_Price) {
      this.discounted = true;
      this.percentage = this.calculateDiscount(this.original_price, this.sale_price);
      this.final_price = this.game.Price_Sale.Sale_Price;
    }
    else if (this.game.Price_No_Sale === null && this.game.Price_Sale.Sale_Price && this.game.Price_Sale.Original_Price == null) {
      this.final_price = this.game.Price_Sale.Sale_Price
    }
    this.game.final_pricing = {
      discounted: this.discounted,
      percentage: this.percentage,
      final_price: this.final_price,
      sale_price: this.sale_price,
      original_price: this.original_price
    }

  }


}



