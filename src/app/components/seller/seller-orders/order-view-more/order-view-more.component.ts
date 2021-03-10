import { Component, OnInit } from '@angular/core';
import { Order } from './../../../../models/order.model';
import { formatDate } from './../../../../helpers/date-format';
import { numberWithCommas } from './../../../../helpers/number-format';

@Component({
  selector: 'app-order-view-more',
  templateUrl: './order-view-more.component.html',
  styleUrls: ['./order-view-more.component.css']
})
export class OrderViewMoreComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  formatDate:Function;
  order:Order;

  constructor() {
    this.formatDate = formatDate;
  }

  ngOnInit(): void {}

  setOrder({order}):void{
    this.order = order;
  }

}
