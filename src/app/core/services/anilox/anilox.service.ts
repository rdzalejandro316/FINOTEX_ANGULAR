import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AniloxService {

  constructor(public http: HttpClient) { }

  getAniloxRollLine(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/AniloxRoll/AniloxRollGetByLineId`,
      data
    );
  }

  getServiceAniloxType(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Polymer/PolymerGet`,null
    );
  }

  getAniloxStation(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sales}/Station/StationGet`, data
    );
  }
  
}
