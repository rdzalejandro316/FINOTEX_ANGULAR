import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public http: HttpClient) { }

  UpdateStatusBySample(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/UpdateStatusBySample`,
      data
    );
  }

  UpdateSampleForPreCheckout(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/UpdateSampleForPreCheckout`,
      data
    );
  }

  CreateSampleCombination(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/CreateSampleCombination`,
      data
    );
  }

  getSampleStatus(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleStatusGet`,
      data
    );
  }

  sendSampleObservationEmail(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SendSampleObservationEmailPost`,
      data
    );
  }

  getSamples(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/SketchManagement/SketchManagement`,
      data
    );
  }

  getSampleById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleGetById`,
      data
    );
  }

  getSamplesFilterBasic(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/SketchManagement/BasicSampleFilter`,
      data
    );
  }

  SampleRejectionGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleRejectionsGet`,
      data
    );
  }

  GetProductsFiltered(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Product/ProductFilterGet`,
      data
    );
  }

  getDetailProduct(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Product/ProductInfoGet`,
      data
    );
  }

  getProductByProductId(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Product/ProductGetById`,
      data
    );
  }

  getCustomerReference(data: any) {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/CustomerReference/CustomerReferenceGetById`,
      data
    );
  }

  GetProductsFiltereCodeName(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Product/ProductFilterGetByProductCodeName`,
      data
    );
  }

  DataSheetGetByIdProduct(data: any):  Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
    `${environment.baseUrl.url}${environment.methods.Product}/DataSheet/DataSheetGetByIdProduct`,
      data
    );
  }

  getBillOfMaterialFlexoByProductId(data: any):  Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
    `${environment.baseUrl.url}${environment.methods.Product}/BillOfMaterial/BillOfMaterialFlexoGetByProductId`,
      data
    );
  }

  getBillOfMaterialHeatTransferByProductId(data: any):  Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
    `${environment.baseUrl.url}${environment.methods.Product}/BillOfMaterial/BillOfMaterialHealtTransferGetByProductId`,
      data
    );
  }

}
