import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterProductService {
  constructor(public http: HttpClient) { }

  getGroupLine(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/GroupLine/GroupLineGet`,
      ''
    );
  }

  getSketchArtistPost(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/SketchArtist/SketchArtistGet`,
      data
    );
  }

  getAllDesigner(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Designer/DesignerGet`,
      ''
    );
  }

  getAllPalleteType(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/PalleteType/PalleteTypeGet`,
      ''
    );
  }

  getAllLocationDesign(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/LocationDesign/LocationDesignGet`,
      ''
    );
  }

  getAllShapeType(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/LocationDesign/LocationDesignGet`,
      ''
    );
  }

  getMaterialCategoryByLineId(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Material/MaterialCategoryLineGetByMaterialCategoryLineId`,
      data
    );
  }

  getAllTransferSpecialty(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/TransferSpecialty/TransferSpecialtyGet`,
      ''
    );
  }

  getMaterialCode(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Material/MaterialGetByCategoryId`,
      data
    );
  }

  getMaterialPositionByLineId(data) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Material/MaterialPositionGetByLineId`,
      data
    );
  }

  getMesh(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Mesh/MeshFilterGet`,
      data
    );
  }

  getFormulaColor(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/BillOfMaterial/BillOfMaterialGetByMaterialId`,
      data
    );
  }

  getFormulaColorSpecial(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/BillOfMaterial/BillOfMaterialSpetialFormulaGetByMaterialId`,
      data
    );
  }

  getBillOfMaterialGetByProductId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/BillOfMaterial/BillOfMaterialGetByProductId`,
      data
    );
  }
}
