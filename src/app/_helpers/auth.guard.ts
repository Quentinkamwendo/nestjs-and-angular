import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private router: Router,
    private accountService: AccountService

  ) {}

  canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const user = this.accountService.userValue;
    if (user) {
      return true
    }
    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    return false;
  };
}




