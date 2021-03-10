import { IPage } from "./../../models/products.model";
import { getLoggedInUser } from "./../../helpers/userUtility";
import { InvoiceService } from "src/app/services/invoice/invoice.service";
import {
  InvoiceModel,
  OrderModel,
  invoiceStatus,
} from "./../../models/invoice.model";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

import * as _ from "lodash";
import { numberWithCommas } from './../../helpers/number-format';
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  filteredInvoice: InvoiceModel[];
  filterType = invoiceStatus;
  invoices: InvoiceModel[];
  page: IPage;
  
  constructor(private invoiceService: InvoiceService) {}
  ngOnInit(): void {
    const user = getLoggedInUser();
    if (user) {
      this.invoiceService.getUserInvoices(user.id).subscribe((data) => {
        this.invoices = data.data.data;
        this.filteredInvoice = this.invoices;
        this.page = data.data.pager;
      });
    }
  }
  sumOrders(orders: OrderModel[]) {
    return _.sumBy(orders, (o) => o.total)
      .toFixed(2)
      .toLocaleString();
  }
  formatDate(date) {
    return new Date(date).toLocaleString();
  }

  filter(filter) {
    if (filter == invoiceStatus.paid) {
      this.filteredInvoice = this.invoices.filter(
        (a) => a.status == invoiceStatus.paid
      );
    } else if (filter == invoiceStatus.pending) {
      this.filteredInvoice = this.invoices.filter(
        (a) => a.status == invoiceStatus.pending
      );
    } else if (filter == "others") {
      this.filteredInvoice = this.invoices.filter(
        (a) =>
          a.status != invoiceStatus.pending &&
          a.status != invoiceStatus.paid &&
          a.status != invoiceStatus.pending
      );
    } else if (filter == "all") {
      this.filteredInvoice = this.invoices;
    }
  }
}
