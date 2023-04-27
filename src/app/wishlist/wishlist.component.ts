import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements AfterViewInit{

  total: number;
  totalString: string;
  empty: boolean;
  constructor() {
    // initial values
    this.total = 0;
    this.totalString = '0'
    this.empty = true;
  }

  ngAfterViewInit() {
    // create listeners for the drag events
    let target = document.getElementById('wishlist-container');
    target?.addEventListener('dragenter', (e)=>{
      e.preventDefault();
    });
    target?.addEventListener('dragover', (e)=>{
      e.preventDefault();
    });
    target?.addEventListener('drop', (e)=>{
      this.empty = false
      let table = document.getElementById('wishlist-table')
      e.preventDefault();
      let newElement = document.createElement('tr');
      let data = e.dataTransfer?.getData('text');
      let titleTd = document.createElement('td');
      let priceTd = document.createElement('td');
      titleTd.innerHTML = JSON.parse(data!).title;
      priceTd.innerHTML = JSON.parse(data!).price;
      newElement.appendChild(titleTd);
      newElement.appendChild(priceTd);
      target?.appendChild(newElement);
      target!.style.listStyleType = 'none';

      // if game isn't free then update total
      if (JSON.parse(data!).price != 'Free to Play' && JSON.parse(data!).price!= 'Free To Play') {
        let price = JSON.parse(data!).price;
        let price_float = parseFloat(price.slice(1));
        this.total += Math.round(price_float * 100) / 100
        this.total = (Math.round(this.total * 100)/100);
        this.totalString = this.total.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
      }
      console.log(Math.round(this.total * 100)/100);
    });
  }

}
