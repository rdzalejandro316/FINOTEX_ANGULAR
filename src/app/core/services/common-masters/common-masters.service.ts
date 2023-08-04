import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonMastersService {

  constructor(public http: HttpClient) { }

  exchangeRateGetById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.CommonMasters}/ExchangeRate/ExchangeRateGetById`,
      data
    );
  }

  getAllPackageUnitFromUnitMeasure(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.CommonMasters}/Unit/PackageUnitFromUnitMeasureGet`,
      ''
    );
  }
}
