import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtworksService {

  constructor(public http: HttpClient) { }
  
  getSubstractByGroupLine(datos: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Substrate/SubstrateGetByGroupLine`,
      datos
    );
  }

  GetCut(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Cut/CutGroupByLineIdGet`, data
    );
  }

}
