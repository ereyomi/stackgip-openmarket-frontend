import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductModel } from  "../../../../models/products.model";
import { ProductsService } from "../../../../services/products/products.service";
import { ToastrService } from "./../../../../services/toastr.service";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { numberWithCommas } from './../../../../helpers/number-format';
import uikit from "uikit";

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Output() productIdSend = new EventEmitter();
  @Output() viewedMore = new EventEmitter();
  numberWithCommas:Function = numberWithCommas
  user = getLoggedInUser();
  productDetails: ProductModel[];
  pageNumber: number;
  totalItemCount: number;
  maximumItem: number = 4;
  defaultPage:number = 1

  constructor(
     private productService: ProductsService,
     private toast: ToastrService
  ){ }

  ngOnInit():void{
    this.fetchNextProducts(this.defaultPage); 
  } 
  
  onDelete(productId:number):void{
    uikit.modal.confirm(
      'Are you sure that you want to remove this ?'
    ).then(()=>{
        this.productService.deleteProduct(productId).subscribe((a)=>{
          this.productDetails = this.productDetails.filter(
            (b) => b.id !== productId
          );
        });
        this.toast.success("product removed successfully");
      },()=>{});
  }

  public addProduct(product: ProductModel):void{
    this.productDetails.push(product);
  }

  public updateProduct(product: ProductModel):void{
    const index = this.productDetails.findIndex(
      (p) => p.id === product.id
    );
    this.productDetails[index] = product;
  }

  setProductId(productId:string):void{
    this.productIdSend.emit({productId});
  }

  setViewMore(productId:string):void{
    this.viewedMore.emit({productId});
  }

  fetchNextProducts(pageNumber:number){
    this.productService.getSellerProducts(this.user.id, pageNumber, this.maximumItem)
      .subscribe((productDetail) => {
        this.productDetails = productDetail.data.data;
        this.pageNumber = productDetail.data.pager.pageNumber;
        this.totalItemCount = productDetail.data.pager.totalItemCount;
      },error => console.error(error));
  }
}
