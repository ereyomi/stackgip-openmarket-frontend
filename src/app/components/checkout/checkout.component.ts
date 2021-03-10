import { ClearCartItems } from "./../../reducers/action/cart.actions";
import { Router } from "@angular/router";
import { ToastrService } from "./../../services/toastr.service";
import { ResponseStatus } from "./../../shared/models/IResponseModel";
import {
  CreateInvoiceModel,
  CreateOrderDto,
  invoiceStatusEnums,
} from "./../../models/invoice.model";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ProductCartModel } from "src/app/models/products.model";
import { getCart } from "src/app/reducers/selectors/cart.selector";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IUser } from "src/app/models/IUserModel";
import { getUser } from "src/app/reducers/selectors/auth.selector";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { environment } from "src/environments/environment";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { InvoiceService } from "src/app/services/invoice/invoice.service";
import uikit from "uikit";

declare var PaystackPop: any;
@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private notify: ToastrService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}
  user$: Observable<IUser>;
  carts$: Observable<ProductCartModel[]>;
  cartTotal: number;
  states: string[];
  checkoutForm: FormGroup;
  isSubmited = false;

  ngOnInit(): void {
    this.carts$ = this.store.select(getCart);
    this.user$ = this.store.select(getUser);
    this.carts$.subscribe((items) => {
      let total = 0;
      for (const item of items) {
        total += item.price * item.orderedUnit;
      }
      this.cartTotal = total;
    });
    this.initlizeForm();
    this.states = nigeriaSates.map((a) => a.name);
  }

  get f() {
    return this.checkoutForm.controls;
  }

  initlizeForm() {
    const user = localStorage.getItem("user");
    
    if (user) {
      const userJson: IUser = JSON.parse(user);
      this.checkoutForm = this.fb.group({
        firstname: [userJson.firstName, [Validators.required]],
        lastname: [userJson.lastName, [Validators.required]],
        email: [userJson.email, [Validators.required, Validators.email]],
        phoneNumber: [userJson.phoneNumber, [Validators.required]],
        address: [userJson.address, [Validators.required]],
        country: [userJson.alpha2CountryCode, [Validators.required]],
        state: [userJson.state, [Validators.required]],
        city: [userJson.city, [Validators.required]],
        additionalInfo: "",
      });
    } else {
      this.checkoutForm = this.fb.group({
        firstname: ["", [Validators.required]],
        lastname: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneNumber: ["", [Validators.required]],
        address: ["", [Validators.required]],
        country: ["", [Validators.required]],
        state: ["", [Validators.required]],
        city: ["", [Validators.required]],
        additionalInfo: "",
      });
    }
  }

  checkout() {
    if (!this.checkoutForm.valid) {
      return;
    }
    this.isSubmited = true;

    let createOrders: CreateOrderDto[] = [];
    this.carts$.subscribe((a) => {
      a.forEach((item) => {
        const orders: CreateOrderDto = {
          unit: item.orderedUnit,
          price: item.price,
          discount: 0,
          productId: item.id,
        };
        createOrders.push(orders);
      });
    });
    const invoiceData: CreateInvoiceModel = {
      userId: getLoggedInUser().id,
      billingAddress: this.checkoutForm.get("address").value,
      city: this.checkoutForm.get("city").value,
      country: this.checkoutForm.get("country").value,
      state: this.checkoutForm.get("state").value,
      createOrderDto: createOrders,
    };
    this.invoiceService.createInvoice(invoiceData).subscribe(
      (data) => {
        if (data.status === ResponseStatus.success) {
          this.payWithPaystack(data.data.transReferenceNo);
        }
      },
      (error) => {
        this.isSubmited = false;
        this.notify.info(
          "something went wrong please try again later, or contact support"
        );
      }
    );
  }

  payWithPaystack(ref) {
    console.log(this.cartTotal);
    let handler = PaystackPop.setup({
      key: environment.paystackPublicKey, // Replace with your public key
      email: this.checkoutForm.get("email").value,
      amount: Math.ceil(this.cartTotal) * 100,
      firstname: this.checkoutForm.get("firstname").value,
      lastname: this.checkoutForm.get("lastname").value,
      phone: this.checkoutForm.get("phoneNumber").value,
      ref: ref,
      // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: () => {
        // set order status to  payment_canceled
        uikit.modal.dialog(
          `
        <div class="uk-card uk-card-body">
        <h3> Payment canceled</h3>
        <p>Redirecting you to order page to complete the payment</p>
        </div>
      `,
          { "bg-close": false }
        );
        this.invoiceService
          .updateStatus(ref, invoiceStatusEnums.paymentCanceled)
          .subscribe((c) => {
            setTimeout(() => {
              this.store.dispatch(ClearCartItems());
              // this.router.navigate(["/orders"]);
              location.href = "/orders";
            }, 2000);
          });

        // redirect user to orders page
      },
      callback: (response) => {
        let message = "Payment complete! Reference: " + response.reference;

        uikit.modal.dialog(
          `
        <div class="uk-card uk-card-body">
        <h3> Payment complete!</h3>
        <p>Processing your transaction, please wait</p>
        </div>


      `,
          { "bg-close": false }
        );
        this.invoiceService.verifyInvoice(ref).subscribe((a) => {
          // this.router.navigate(["/orders"]);
          this.store.dispatch(ClearCartItems());
          location.href = "/orders";
        });

        // this.invoiceService.verifyInvoice(ref)
        // redirect user to orders page
      },
    });
    handler.openIframe();
  }
}
