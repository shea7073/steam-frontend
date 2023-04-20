import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements AfterViewInit{

  total: number;
  constructor() {
    this.total = 0;
  }

  ngAfterViewInit() {
    let target = document.getElementById('wishlist-container');
    target?.addEventListener('dragenter', (e)=>{
      e.preventDefault();
    });
    target?.addEventListener('dragover', (e)=>{
      e.preventDefault();
    });
    // target?.addEventListener('drop', (e)=>{
    //   e.preventDefault();
    //   let newElement = document.createElement('li');
    //   let data = e.dataTransfer?.getData('text');
    //   newElement.innerHTML = JSON.parse(data!).title + ' - ' + JSON.parse(data!).price;
    //   target?.appendChild(newElement);
    //   target!.style.listStyleType = 'none';
    // });
    target?.addEventListener('drop', (e)=>{
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

      if (JSON.parse(data!).price != 'Free to Play') {
        let price = JSON.parse(data!).price;
        let price_float = parseFloat(price.slice(1));
        this.total += Math.round(price_float * 100) / 100
        this.total = Math.round(this.total * 100)/100
      }
      console.log(Math.round(this.total * 100)/100);
    });
  }

}
