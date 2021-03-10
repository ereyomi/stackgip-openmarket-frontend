import { SharedModule } from "./shared/shared.module";
import { AppRouteModule } from "./app-route.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { SiginupComponent } from "./components/auth/siginup/siginup.component";
import { AuthComponent } from "./components/auth/auth.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./shared/auth-interceptor";
import { ErrorHandlerInterceptor } from "./shared/error-handler-interceptor";
import { AccountConfirmationComponent } from "./components/auth/account-confirmation/account-confirmation.component";

import { ToastrModule } from "ngx-toastr";
import { toastOptions } from "./services/toastr.service";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { ForgetPasswordComponent } from "./components/auth/forget-password/forget-password.component";
import { StoreModule } from "@ngrx/store";
import { counterReducer } from "./reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { storageSyncMetaReducer } from "ngrx-store-persist";
import { SliderComponent } from "./components/home/slider/slider.component";
import { IndexComponent } from "./components/home/index/index.component";
import { ProductsComponent } from "./components/products/products.component";
import { SingleProductComponent } from "./components/products/single-product/single-product.component";
import { SliderProductsComponent } from "./components/products/slider-products/slider-products.component";
import { CategoryProductsComponent } from "./components/products/category-products/category-products.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { OrderComponent } from "./components/order/order.component";
import { OrderInvoiceComponent } from "./components/order-invoice/order-invoice.component";
import { ProfileDashboardComponent } from "./components/profile-dashboard/profile-dashboard.component";
import { ProfileComponent } from "./components/profile-dashboard/profile/profile.component";
import { ChangePasswordComponent } from "./components/profile-dashboard/change-password/change-password.component";
import { DashboardComponent } from "./components/seller/dashboard/dashboard.component";
import { CategoryHomeGridComponent } from "./components/category/category-home-grid/category-home-grid.component";
import { NewProductListComponent } from "./components/home/new-product-list/new-product-list.component";
import { SellerProductComponent } from "./components/seller/seller-product/seller-product.component";
import { SellerHomeComponent } from "./components/seller/seller-home/seller-home.component";
import { MostSellingProductComponent } from "./components/seller/seller-home/most-selling-product/most-selling-product.component";
import { RecommendedProductToSellComponent } from "./components/seller/seller-home/recommended-product-to-sell/recommended-product-to-sell.component";
import { SellerOrdersComponent } from "./components/seller/seller-orders/seller-orders.component";
import { AddProductComponent } from "./components/seller/seller-product/add-product/add-product.component";
import { ViewProductComponent } from "./components/products/view-product/view-product.component";
import { ListProductComponent } from "./components/home/list-product/list-product.component";
import { SearchProductComponent } from './components/home/search-product/search-product.component';
import { EditProductComponent } from './components/seller/seller-product/edit-product/edit-product.component';
import { ProductItemComponent } from './components/seller/seller-product/product-item/product-item.component';
import { OrderDetailComponent } from './components/seller/seller-orders/order-detail/order-detail.component';
import { ViewMoreComponent } from './components/seller/seller-product/view-more/view-more.component';
import { OrderViewMoreComponent } from './components/seller/seller-orders/order-view-more/order-view-more.component';
import { UpdateDeliveryStatusComponent } from './components/seller/seller-orders/update-delivery-status/update-delivery-status.component';
import { OrderListComponent } from './components/seller/seller-orders/order-list/order-list.component';
import { ProductOptionComponent } from './components/seller/seller-product/product-option/product-option.component';
import { ProductShipmentComponent } from './components/seller/seller-product/product-shipment/product-shipment.component';
import { NgxPaginationModule } from './shared/pagination/ngx-pagination.module';
import { InfiniteScrollComponent } from './shared/infinite-scroll/Infinite-scroll.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { SellerRegisterationFormComponent } from "./components/seller/seller-registeration-form/seller-registeration-form.component";
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from "angularx-social-login";
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    LoginComponent,
    SiginupComponent,
    AuthComponent,
    AccountConfirmationComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    SliderComponent,
    IndexComponent,
    ProductsComponent,
    SingleProductComponent,
    SliderProductsComponent,
    CategoryProductsComponent,
    CartComponent,
    CheckoutComponent,
    OrderComponent,
    OrderInvoiceComponent,
    ProfileDashboardComponent,
    ProfileComponent,
    ChangePasswordComponent,
    DashboardComponent,
    CategoryHomeGridComponent,
    NewProductListComponent,
    SellerProductComponent,
    SellerHomeComponent,
    MostSellingProductComponent,
    RecommendedProductToSellComponent,
    SellerOrdersComponent,
    AddProductComponent,
    ViewProductComponent,
    ListProductComponent,
    SearchProductComponent,
    EditProductComponent,
    ProductItemComponent,
    OrderDetailComponent,
    ViewMoreComponent,
    OrderViewMoreComponent,
    UpdateDeliveryStatusComponent,
    OrderListComponent,
    ProductOptionComponent,
    ProductShipmentComponent,
    InfiniteScrollComponent,
    AddToCartComponent,
    SellerRegisterationFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouteModule,
    ToastrModule.forRoot(toastOptions),
    CommonModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,
    SocialLoginModule,
    NgxSliderModule,
    StoreModule.forRoot(
      { counterReducer },
      {
        metaReducers: [storageSyncMetaReducer],
      }
    ),

    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebookAppId
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
