import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Params,Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'src/app/core/services/cookie/cookie.service';
import { ProfilesService } from '../services/profile/profiles.service';

@Injectable({
  providedIn: 'root'
})
export class PqrsGuard implements CanActivate {
  
  constructor(
    private profilesService: ProfilesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,    
    private cookieService: CookieService,    
    ) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean
  {    
    return this.checkUser(route);
  }

  checkUser(route: ActivatedRouteSnapshot): boolean {
    let role = "";
    if(this.profilesService.validateUserType())
    {    
      role = "customer";
    }
    else{    
      role = "internal";
    }
    if (role == route.data.role) {
      return true;
    }
    
    return false;
  }
}
