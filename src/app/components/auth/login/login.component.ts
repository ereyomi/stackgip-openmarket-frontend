import { Router } from "@angular/router";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

import { Component, OnInit } from "@angular/core";

import { NgxUiLoaderService } from "ngx-ui-loader";
import { SignInModel } from "src/app/models/signin-model";
import { UIkit } from "uikit";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService} from "angularx-social-login";
import {of, Subscription} from "rxjs";
import {delay} from "rxjs/operators";
import {JwtHelperService} from "../../../services/jwt-helper.service";

// declare var gapi: any;

// facebook declarations
// declare var FB: any;
// declare var  statusChangeCallback: any;
// end of facebook decla
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  hasError = false;
  errors: any[];
  errorMessage: string;
  loginForm: FormGroup;
  googleAuth: any;
  loading: false;
  tokenSubscription = new Subscription();
  decodedJwt;
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    // if( typeof gapi == 'undefined') {
    //   let infoToast = this.toast ;
    //   infoToast.toastOptions.positionClass = "toast-top-center";
    //   infoToast.toastOptions.timeOut = '10000';
    //   infoToast.info("poor internet connection, <a onclick='location.reload()'>click here to refresh page</a>");

    // }else{
    //   this.loadgoogleLogin();
    // }

    this.hasError = false;
    this.errors = [];
    this.errorMessage = "";

    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  login(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors);
      return;
    }
    const data: SignInModel = {
      email: this.loginForm.get("email").value,
      password: this.loginForm.get("password").value,
    } as SignInModel;

    this.ngxService.startLoader("loader-01");

    this.authService.signIn(data).subscribe(
      (a) => {
        // console.log("signInResponse: " + JSON.stringify(a));
        this.ngxService.stopLoader("loader-01");
        this.authService.SetAuthLocalStorage(a);
        this.decodedJwt = this.jwtHelperService.getDecodedAccessToken(a.data.auth_token);
        this.expirationCounter((this.decodedJwt.exp - this.decodedJwt.iat)*1000);
        if (a.status == "success") {
          this.toast.success("login successful", "notification");

          if (!a.data.canLogin) {
            this.router.navigate(["/confirm-email"]);
          } else {
            this.router.navigate(["/"]);
          }

          console.log(a);
        } else {
          if (a.data.isNotAllowed) {
            this.router.navigate(["/confirm-email"]);
          }
        }
        console.log(a);
      },
      (err) => {
        console.log("error", err);
        this.errors = [];
        if (err.status === 0) {
          this.errors.push("something went wrong please try");
        } else if (err.status >= 500) {
          this.errors.push("something went wrong please try");
        } else {
          this.errors.push(...err.error.message.split(","));
        }
        this.ngxService.stopLoader("loader-01");
      }
    );
  }

  expirationCounter(timeout): void {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe(() => {
      this.authService.Logout();
      this.router.navigate([""]);
    })
  }

  signInWithGoogle(): void {
    this.ngxService.startLoader("loader-01");
    this.socialAuthService.initState.subscribe(() => {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
        .then(data => {
          this.authService.GoogleSignIn(data.idToken)
            .subscribe(signInResponse => this.authService.SetAuthLocalStorage(signInResponse))
          this.router.navigate([""]);
          this.ngxService.stopLoader("loader-01");
        });
    })
  }

  signInWithFacebook(): void {
    this.ngxService.startLoader("loader-01");
    this.socialAuthService.initState.subscribe(() => {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
        .then(data => {
          this.authService.FacebookSignIn(data.id, data.authToken)
            .subscribe(signInResponse => this.authService.SetAuthLocalStorage(signInResponse))
          this.router.navigate([""]);
          this.ngxService.stopLoader("loader-01");
        })
    })
  }


  // loadgoogleLogin() {
  //   gapi.load("auth2", () => {
  //     /* Ready. Make a call to gapi.auth2.init or some other API */
  //     this.googleAuth = gapi.auth2.init({
  //       client_id:
  //         "473446857855-9fmn8dnefe3b9mvm046sdq35echrss1l.apps.googleusercontent.com",
  //     });
  //   });
  // }

  // signInWithGoogle() {
  //   this.ngxService.startLoader("loader-01");
  //   this.googleAuth
  //     .signIn({
  //       scope: "profile email",
  //       prompt: "select_account",
  //     })
  //     .then((a) => {
  //       console.log(a);
  //       const currentUser = this.googleAuth.currentUser.get();
  //       const auth = currentUser.getAuthResponse();
  //       console.log("current user", currentUser);
  //       const token = auth.id_token;
  //       this.authService.GoogleSignIn(token).subscribe((a) => {
  //         this.authService.SetAuthLocalStorage(a);
  //         this.toast.success("login successful", "notification");

  //         UIkit.modal("#modal-auth").hide();

  //         this.ngxService.stopLoader("loader-01");
  //         this.authService.isLogin.next(true);
  //         console.log("Is login observable", this.authService.isLogin);
  //         location.reload();
  //       });
  //     });
  // }

  // siginWithFacebook() {
  //   this.ngxService.startLoader("loader-01");
  //   FB.login(
  //     (response) => {
  //       // handle the response
  //       if (response.status === "connected") {
  //         this.authService
  //           .FacebookSignIn(
  //             response.authResponse.userID,
  //             response.authResponse.accessToken
  //           )
  //           .subscribe(
  //             (a) => {
  //               this.authService.SetAuthLocalStorage(a);
  //               this.authService.isLogin.next(true);
  //               this.toast.success("login successful");
  //               this.ngxService.stopLoader("loader-01");
  //               location.reload();
  //             },
  //             (err) => {
  //               console.log(err);
  //               this.toast.error(err.error.message);
  //               this.ngxService.stopLoader("loader-01");
  //             }
  //           );
  //       } else {
  //         // cant login
  //         this.toast.error("cant login", "notification");
  //         this.ngxService.stopLoader("loader-01");
  //       }
  //       console.log(response);
  //     },
  //     { scope: "email,public_profile" }
  //   );
  // }
}
