import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PqrsMastersService {

  constructor(public http: HttpClient) { }

  getRequestTypePublic(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestType/RequestTypeGet`,
      data
    );
  }

  getRequestStatus(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestStatus/RequestStatusGet`,
      data
    );
  }

  getCustomerRequeriment(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/CustomerRequeriment/CustomerRequerimentGet`,
      data
    );
  }

  getSentBy(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/SentBy/SentByGet`,
      data
    );
  }

  getProvision(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Provision/ProvisionGet`,
      data
    );
  }

  getCause(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Cause/CauseGet`,
      data
    );
  }

  getReplacement(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Replacement/ReplacementGet`,
      data
    );
  }

  getEndOfTheOrder(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/EndOfTheOrder/EndOfTheOrderGet`,
      data
    );
  }
  
  getBillType(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/BillType/BillTypeGet`,
      data
    );
  }
}
