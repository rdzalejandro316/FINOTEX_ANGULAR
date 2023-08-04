import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterSalesService {

  constructor(public http: HttpClient) { }

  getProductPrice(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterSales}/Price/CustomerProductByCustomerIdsProductIdsGet`,
      data
      );
  }
}
