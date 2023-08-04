import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(public http: HttpClient) { }

  getBillDetailProductsGetByOrderId(data: any){
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Shipping}/BillHeader/BillDetailProductsGetByOrderId`,
      data
    ).toPromise();
  }
}
