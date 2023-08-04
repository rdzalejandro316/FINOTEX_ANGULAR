import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(public http: HttpClient) { }

  getAddress(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerAddressByCustomerIdGet`,
      data
    );
  }

  getCustomersZone(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomersGetByZoneSalesExecutive`,
      data
    );
  }

  getCustomersById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerGetById`,
      data
    );
  }

  getCustomersFilter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerFilterGet`,
      data
    );
  }

  getCustomers(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerGet`,
      data
    );
  }

  getCustomerStatus(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerStatusGet`,
      ""
    );
  }

  getSalesExecutives(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Sales/SalesExecutivesGet`,
      ""
    );
  }

  getZones(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Territories/ZoneGet`,
      ""
    );
  }

  getCustomerAddressIdsByCustomerId(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerAddressIdsByCustomerIdGet`,
      data
    );
  }

  setNextCustomerProductPrefix(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerProductPrefixSetNextConsecutiveByCustomerId`,
      data
    );
  }

  getCustomerForRequestResponseGet(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerForRequestResponseGet`,
      data
    );
  }
}
