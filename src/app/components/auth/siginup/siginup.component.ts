import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "src/app/services/toastr.service";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { RegisterModel } from "src/app/models/register-model";
import { SignInModel } from "src/app/models/signin-model";
import UIkit from "uikit";
import { MustMatch } from "src/app/helpers/control-validators";
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {of, Subscription} from "rxjs";
import {delay} from "rxjs/operators";
import {JwtHelperService} from "../../../services/jwt-helper.service";

@Component({
  selector: "app-siginup",
  templateUrl: "./siginup.component.html",
  styleUrls: ["./siginup.component.css"],
})
export class SiginupComponent implements OnInit {
  tokenSubscription = new Subscription();
  decodedJwt;
  hasError = false;
  errors: any[];
  googleAuth: any;
  user: SocialUser;

  errorMessage: string;
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService
  ) {}
  registerForm: FormGroup;

  ngOnInit(): void {
    this.hasError = false;
    this.errors = [];
    this.errorMessage = "";
    this.registerForm = this.fb.group(
      {
        firstname: ["", [Validators.required]],
        lastname: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: MustMatch("password", "confirmPassword"),
      }
    );
    // {validator: this.ctrlValidator.MustMatch('password', 'confirmPassword')});

    this.socialAuthService.authState.subscribe(user => {
      this.user = user;
    })
  }

  get f() {
    return this.registerForm.controls;
  }

  submit(): void {
    this.errors = [];
    this.errorMessage = "";

    if (this.registerForm.invalid) {
      return;
    }

    const data: RegisterModel = {
      firstName: this.registerForm.get("firstname").value,
      lastName: this.registerForm.get("lastname").value,
      email: this.registerForm.get("email").value,
      password: this.registerForm.get("password").value,
      confirmPassword: this.registerForm.get("confirmPassword").value,
      // profileImageUrl: "",
    } as RegisterModel;
    this.ngxService.startLoader("loader-01");

    this.authService.register(data).subscribe(
      (d) => {
        const signinData = {
          email: data.email,
          password: data.password,
        } as SignInModel;
        this.login(signinData);
        console.log(d);
      },
      (err) => {
        this.errors = [];
        this.ngxService.stopLoader("loader-01");
        console.log("error", err);
        this.hasError = true;
        if (err.status == 0) {
          this.errors.push("something went wrong please try again later");
        } else {
          this.errors.push(...err.error.message.split(","));
        }
      }
    );
  }

  login(signInModel: SignInModel) {
    this.ngxService.startLoader("loader-01");

    this.ngxService.startLoader("loader-01");

    this.authService.signIn(signInModel).subscribe(
      (a) => {
        this.ngxService.stopLoader("loader-01");
        this.authService.SetAuthLocalStorage(a);
        this.decodedJwt = this.jwtHelperService.getDecodedAccessToken(a.data.auth_token);
        this.expirationCounter((this.decodedJwt.exp - this.decodedJwt.iat)*1000);
        if (a.status == "success") {
          this.toast.success("login successful", "notification");
          if (!a.data.canLogin) {
            this.router.navigate(["/confirm-email"]);
          } else {
            location.reload();
          }
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
  //   this.googleAuth
  //     .signIn({
  //       scope: "profile email",
  //       prompt: "select_account",
  //     })
  //     .then((a) => {
  //       console.log(a);
  //       const currentUser = this.googleAuth.currentUser.get();
  //       const auth = currentUser.getAuthResponse();
  //       this.ngxService.startLoader("loader-01");
  //       console.log("current user", currentUser);
  //       const token = auth.id_token;
  //       this.authService.GoogleSignIn(token).subscribe((a) => {
  //         console.log(a);

  //         this.authService.SetAuthLocalStorage(a);
  //         this.toast.success("login successful", "notification");
  //         // do other login stuff
  //         const currentUrl = location.href;
  //         UIkit.modal("#modal-auth").hide();
  //         // close the modal
  //         //
  //         //  this.store.dispatch(SIGNEDIN());
  //         this.authService.isLogin.next(true);
  //         console.log("Is login observable", this.authService.isLogin);
  //         console.log(a);
  //         this.ngxService.stopLoader("loader-01");
  //       });
  //     });
  // }
}
