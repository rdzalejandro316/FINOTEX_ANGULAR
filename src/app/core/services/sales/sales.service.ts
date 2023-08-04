import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permisos } from 'src/app/modules/home_sample/components/models/permisos.model';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(public http: HttpClient) { }

  createOrder(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Order/CreateOrder`,
      data
    );
  }

  createSample(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Sample/CreateSample`,
      data
    );
  }

  editSample(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Sample/UpdateSample`,
      data
    );
  }
  
  homologsGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Homologou/HomologousGetByMaterialId`,
      data
    );
  }

  qualityGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/DynamicField/DynamicFieldGet`,
      data
    );
  }

  qualityEditGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/DynamicField/DynamicFieldWithValuesGet`,
      data
    );
  }

  dieGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Die/DieGetByLineId`, data);
  }

  dataSheetGetByIdProduct(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/DataSheet/DataSheetGetByIdProduct`,
      data
    );
  }

  getOrderDetailProductsGetByOrderId(data: any){
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Order/OrderDetailProductsGetByOrderId`,
      data
    ).toPromise();
  }

  public getJSON(): Observable<Permisos> {
    return this.http.get<Permisos>("./assets/data/roles.json");
  }
}
