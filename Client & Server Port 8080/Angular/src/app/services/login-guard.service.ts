import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgRedux } from '../../../node_modules/ng2-redux';
import { Store } from '../redux/store';
@Injectable({
    providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

    constructor(private redux: NgRedux<Store>, private router: Router) { }

    public canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot,
        routerStateSnapshot: RouterStateSnapshot): boolean {

        if (this.redux.getState().isLoggedIn) {
            return true;
        }
        this.router.navigate(["/login"]);// , { queryParams: { redirect: routerStateSnapshot.url } } 
        return false;
    }
}

