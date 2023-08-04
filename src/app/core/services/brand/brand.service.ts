import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  constructor(public http: HttpClient) {}

  getBrandCustomers(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/MasterCustomer/MasterCustomerGet`,
      data
    );
  }

  brandFilter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandFilterGet`,
      data
    );
  }

  getAllStatus(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogStatusGet`,
      ''
    );
  }

  getBrandCatalogProduct(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogProductByBrandCatalogIdGet`,
      data
    );
  }

  getBrandCatalogPrices(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogPricesByCatalogIdGet`,
      data
    );
  }

  getFactoryLocation(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/FactoryLocation/FactoryLocationGet`,
      data
    );
  }

  getTimeUnit(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/TimeUnit/TimeUnitGet`,
      data
    );
  }

  createBrandCatalog(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/CreateBrandCatalog`,
      data
    );
  }

  updateBrandCatalog(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/UpdateBrandCatalog`,
      data
    );
  }

  getMasterCustomerPaymentType(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/MasterCustomer/MasterCustomerDetailGetById`,
      data
    );
  }

  getInternalProductCode(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogProductByInternalProductCodeGet`,
      data
    );
  }

  getBrandCatalogById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogGetById`,
      data
    );
  }

  getAllBrandCatalogRange(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Brand}/BrandCatalog/BrandCatalogRangeGet`,
      ''
    );
  }
}
