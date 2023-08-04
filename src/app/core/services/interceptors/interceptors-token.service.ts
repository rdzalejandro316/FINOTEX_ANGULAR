import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { catchError, switchMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { ProfilesService } from '../profile/profiles.service';
import { LoadingService } from '../loading/loading.service';
import { finalize } from 'rxjs/operators';
import { endpointPublics } from '../../../shared/constant/endpointPublics';

@Injectable({
  providedIn: 'root'
})
export class InterceptorsTokenService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  requestCount: number = 0;

  getEndpoint(req) {
    var n = req.split("/");
    return n[n.length - 1];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.requestCount++ ;
    let storageService = this.injector.get(StorageService);
    let loadingService = this.injector.get(LoadingService);
    
    loadingService.show();
    
    let reqToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${storageService.getUserLocal()}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },                 
      body: {
        ...req.body,                
        "language": storageService.getLanguage() == 'es' ? 'SP' : 'EN'
      }
    });
    // agrega businessId a los endpoints q no se encuentran en la lista de enpoints publicos
    var lastEndpoint = this.getEndpoint(req.url);
    if(!endpointPublics.includes(lastEndpoint)) reqToken.body["businessId"] = storageService.getProfiles() != null ? storageService.getProfiles().businessId : null;      
    return next.handle(reqToken).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 401) {
          storageService.logoutUser();
        }
        return throwError(e);
      }),
      finalize(() =>{
        this.requestCount --;
        if(this.requestCount <= 0){
          loadingService.hide();
        }
      })
    );
  }
}
