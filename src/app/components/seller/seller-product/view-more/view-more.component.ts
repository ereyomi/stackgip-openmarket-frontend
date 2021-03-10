import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../../../../services/products/products.service';
import { numberWithCommas } from './../../../../helpers/number-format';
import { ProductResponse } from 'src/app/models/products.model';
import { formatDate } from './../../../../helpers/date-format';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  product$:Observable<ProductResponse>;
  formatDate:Function;

  constructor(private productService:ProductsService) { 
    this.formatDate = formatDate;
  }

  ngOnInit(): void {}

  setProduct({productId}):void{
    this.product$ = this.productService.getProductById(productId);
  }
}
