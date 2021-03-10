import { AuthService } from "src/app/services/auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import {SocialAuthService, SocialUser} from "angularx-social-login";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private socialAuthService: SocialAuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let isLogin = false;
    let socialUser: SocialUser = null;

    this.socialAuthService.authState.subscribe(user => socialUser = user);
    const siginData = this.authService.GetSignInData();
    console.log(siginData);
    if (siginData || socialUser) {
      isLogin = siginData.canLogin;
      isLogin = socialUser != null;
    }
    if (!isLogin) {
      location.href = "/auth";
    }
    return isLogin;
  }
}
