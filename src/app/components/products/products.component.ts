import { ProductModel } from "./../../models/products.model";
import { ProductsService } from "../../services/products/products.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  constructor(private productService: ProductsService) {}
  products: ProductModel[] = [];

  ngOnInit(): void {
    this.productService.getProducts(1, 20).subscribe((data) => {
      this.products = data.data.data;
    });
  }
}
