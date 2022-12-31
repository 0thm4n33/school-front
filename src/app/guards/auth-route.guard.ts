import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRouteGuard implements CanActivate {

  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let requiredRole = route.data['role'];
    if(requiredRole === undefined && localStorage.getItem('role') !== undefined) return true;
    let userRole = localStorage.getItem('role');
    if(requiredRole !== userRole) return this.router.parseUrl('/forbidden') ;
    return true;
  }
}
