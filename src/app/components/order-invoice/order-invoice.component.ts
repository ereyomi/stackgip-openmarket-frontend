import { getLoggedInUser } from "./../../helpers/userUtility";
import { InvoiceService } from "src/app/services/invoice/invoice.service";
import { InvoiceModel, invoiceStatus } from "./../../models/invoice.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
declare var PaystackPop: any;
import uikit from "uikit";
import { numberWithCommas } from './../../helpers/number-format';

@Component({
  selector: "app-order-invoice",
  templateUrl: "./order-invoice.component.html",
  styleUrls: ["./order-invoice.component.css"],
})
export class OrderInvoiceComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  user = getLoggedInUser();
  invoice: InvoiceModel;
  total: number;
  filterType = invoiceStatus;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.invoiceService.getById(id).subscribe((d) => {
      this.invoice = d.data;
      this.total = 0;
      this.invoice.orders.forEach((a) => {
        this.total += a.total;
      });
    });
  }

  pay(id) {
    this.payWithPaystack(id);
  }

  payWithPaystack(ref) {
    let handler = PaystackPop.setup({
      key: environment.paystackPublicKey, // Replace with your public key
      email: this.user.email,
      amount: Math.ceil(this.total) * 100,
      firstname: this.user.firstName,
      lastname: this.user.lastName,
      phone: this.user.phoneNumber,
      ref: ref,
      // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: () => {
        // set order status to  payment_canceled
        uikit.modal.dialog(
          `<div class="uk-card uk-card-body">
        <h3> Payment canceled</h3>
        <p>Redirecting you to order page to complete the payment</p>
        </div>`,
          { "bg-close": false }
        );


        // redirect user to orders page
      },
      callback: (response) => {
        let message = "Payment complete! Reference: " + response.reference;

        uikit.modal.dialog(
          `<div class="uk-card uk-card-body">
        <h3> Payment complete!</h3>
        <p>Processing your transaction, please wait</p>
        </div>`,
          { "bg-close": false }
        );
        this.invoiceService.verifyInvoice(ref).subscribe((a) => {
          // this.router.navigate(["/orders"]);
          location.href = "/orders";
        });

        // this.invoiceService.verifyInvoice(ref)
        // redirect user to orders page
      },
    });
    handler.openIframe();
  }
}
