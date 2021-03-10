import { Component, OnInit } from "@angular/core";
import { MostSelling } from "../../../../models/products.model";
import { ProductsService } from "../../../../services/products/products.service";
import { getLoggedInUser } from "../../../../helpers/userUtility"
import { IUser } from "../../../../models/IUserModel";
import { numberWithCommas } from './../../../../helpers/number-format';

@Component({
  selector: "app-most-selling-product",
  templateUrl: "./most-selling-product.component.html",
  styleUrls: ["./most-selling-product.component.css"],
})
export class MostSellingProductComponent implements OnInit {

  numberWithCommas:Function = numberWithCommas
  productDetails: MostSelling[];
  user = getLoggedInUser();
  
  constructor( private productService: ProductsService) {}
  
  ngOnInit(): void {
    const users = this.user;
    this.productService.getMostSelling(users.id).subscribe((productDetail) => {
      this.productDetails = productDetail.data;
    })
  }
  
}
