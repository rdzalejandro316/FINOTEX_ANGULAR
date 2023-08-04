import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SketchService {

  constructor(public http: HttpClient) { }

  CreateSketch(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/CreateSketch`,
      data
    );
  }

  SketchGetById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchGetById`,
      data
    );
  }

  UpdateSketchStatus(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/UpdateSketchStatus`,
      data
    );
  }

  UpdateSketch(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/UpdateSketch`,
      data
    );
  }

  SketchObservationHistoryGetBySketchId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchObservationHistoryGetBySketchId`,
      data
    );
  }

  SketchStatusGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchStatusGet`,
      data
    );
  }

  getAllStatusSketch(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchStatusGet`,
      ""
    );
  }

  sketchFilter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchFilterGet`,
      data
    );
  }

  saveCommentSketch(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/CreateSketchObservationHistory`,
      data
    );
  }

  SketchRejectionGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchRejectionGet`,
      data
    );
  }

  downloadFileDesigner(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/GetBySketchIdSketchDesignerFile`,
      data
    );
  }

  getSketchBasic(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Sketch}/Sketch/SketchBasicSearchGet`,
      data
    );
  }

}
