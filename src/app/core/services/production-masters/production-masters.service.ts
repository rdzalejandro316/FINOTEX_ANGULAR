import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionMastersService {

  constructor(public http: HttpClient) { }
  
  getResourceModelByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Resource/ResourceModelGetByLineId`,
      data
    );
  }

  getSheetTypeByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/SheetType/SheetTypeGetByLineId`,
      data
    );
  }

  getBladeTypeByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/BladeType/BladeTypeGetByLineId`,
      data
    );
  }

  getStampCylinderByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/StampCylinder/StampCylinderGetByLineId`,
      data
    );
  }
}
