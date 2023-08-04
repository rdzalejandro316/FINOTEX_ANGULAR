import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechinicalService {

  constructor(public http: HttpClient) { }

  approvalGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleApprovalTypeGet`, "");
  }

  productionPlantGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Plant/PlantGet`, "");
  }

  lineGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Line/LineGet`, "");
  }

  colourGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Colour/ColourGet`, "");
  }

  WarpLineByLineGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/WarpLine/WarpLineGetByLineId`, data);
  }


  shapeTypeGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/ShapeType/ShapeTypeGet`, "");
  }

  applicationGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Application/ApplicationGet`, "");
  }

  finishLineGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Finish/FinishLineByLineIdGet`, data);
  }

  qualityLineGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Quality/QualityLineByLineIdGet`, data);
  }

  widthLineGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Width/WidthLineByLineIdGet`, data);
  }

  subLineGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/SubLine/SubLineByLineIdGet`, data);
  }

  adhesiveLineGetByLineId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Adhesive/AdhesiveLineByLineIdGet`, data);
  }

  customerGetByIdCurrency(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleGetByCustomerId`, data);
  }

  customerProductPrefixGetByCustomerId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Customer}/Customers/CustomerProductPrefixGetByCustomerId`, data);
  }

  sampleStatusGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/Sample/SampleStatusGet`, "");
  }

  optionLineByLineIdGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Option/OptionLineByLineIdGet`, data);
  }

  cutByLineIdGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Cut/CutByLineIdGet`, data);
  }

  cutByCutIdGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Cut/CutGetById`, data);
  }

  rewindingGetGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Rewinding/RewindingGet`, "");
  }

  getRewindingGetById(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Rewinding/RewindingGetById`, data);
  }

  accountingInterfaceGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ApMaster}/DetailedConceptAp/DetailedConceptApGet`, "");
  }

  unitMeasureGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.CommonMasters}/Unit/UnitMeasureGet`, "");
  }

  stateDesignGet(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/ProductStatus/ProductStatusGet`, "");
  }

  inspectionMethod(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.InventoryMasters}/InspectionMethod/InspectionMethodGet`, "");
  }

  inventoryStatus(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.InventoryMasters}/Inventory/InventoryStatusGet`, "");
  }

  packagingReference(): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/PackagingReference/PackagingReferenceGet`, "");
  }

  productionPlanGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.ProductionMasters}/Plant/LineByPlantByPlantIdGet`, data);
  }

  getTechnicalDataByProductId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Product}/TechnicalData/TechnicalDataGetByProductId`, data);
  }

  optionLineByProductIdGet(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.MasterProduct}/Product/ProductOptionGetByProductId`, data);
    }
}
