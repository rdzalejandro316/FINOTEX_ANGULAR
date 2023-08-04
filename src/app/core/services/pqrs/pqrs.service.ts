import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseBase } from 'src/app/shared/models/response-base';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PqrsService {

  constructor(public http: HttpClient) { }

  createAnwerCustomer(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/AnswerClient/CreateAnswerClient`,
      data
    );
  }

  getAnswerCustomerByDocument(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/AnswerClient/AnswerClientGetByDocumentId`,
      data
    );
  }

  createPlanAction(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/ActionPlan/CreateActionPlan`,
      data
    );
  }

  getActionPlanByDocument(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/ActionPlan/ActionPlanGetByDocumentId`,
      data
    );
  }
  
  getRequestByDocument(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/PqrGetByDocumentId`,
      data
    );
  }

  getRequestPublic(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/PqrGetByRequestNumber`,
      data
    );
  }

  postCreateRequest(data: any, isInternal: boolean): Observable<ResponseBase> {
    if (isInternal) {
      return this.http.post<ResponseBase>(
        `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/CreateRequestWithLogin`,
        data
      );
    } else {
      return this.http.post<ResponseBase>(
        `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/CreateRequest`,
        data
      );
    }
  }

  getRequestFilter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/PqrsGetByFilters`,
      data
    );
  }

  getDetailPqrs(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Detail/DetailByDocumentIdGet`,
      data
    );
  }

  getDetailOrder(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Detail/DetailProductsGetByOrderId`,
      data
    );
  }

  createDetailOrder(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Detail/CreateDetail`,
      data
    );
  }

  updateDetailOrder(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Detail/UpdateDetail`,
      data
    );
  }

  deleteDetailOrder(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Detail/DeleteDetail`,
      data
    );
  }

  getAdditionalInformation(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/AdditionalInformation/GetAdditionalInformationByDocumentId`,
      data
    );   
  }  

  createAdditionalInformation(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/AdditionalInformation/CreateAdditionalInformation`,
      data
    );      
  }  

  updateAdditionalInformation(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/AdditionalInformation/UpdateAdditionalInformationByDocumentId`,
      data
    );       
  } 
    
  getTechnicalParameter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/TechnicalParameter/TechnicalParameterGetByDocumentId`,
      data
    );       
  }

  createTechnicalParameter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/TechnicalParameter/CreateRangeTechnicalParameter`,
      data
    );       
  }

  updateTechnicalParameter(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/TechnicalParameter/UpdateRangeTechnicalParameter`,
      data
    );
  }  

  deleteTechnicalParameter(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/TechnicalParameter/DeleteRangeTechnicalParameter`,
      data
    );            
  }
 
  getRequestResponsible(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestResponsible/RequestResponsiblesGetByDocumentId`,
      data
    );       
  }

  createRequestResponsible(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestResponsible/CreateRangeRequestResponsible`,
      data
    );           
  }

  updateRequestResponsible(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestResponsible/UpdateRangeRequestResponsible`,
      data
    );           
  }  

  deleteRequestResponsible(data: any): Observable<ResponseBase> {    
    const options = { body: data};
    return this.http.delete<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RequestResponsible/DeleteRequestResponsibles`,
      options
    );           
  }

  getArea(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Area/AreaGet`,
      data
    );       
  }
  
  getResponsible(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Responsible/ResponsibleGet`,
      data
    );
  }
  
  getResponsibleGetByAreaId(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Responsible/ResponsibleGetByAreaId`,
      data
    );
  }

  getCustomerRequerimentRequest(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/CustomerRequerimentRequest/CustomerRequerimentRequestGetByDocId`,
      data
    );
  }

  createCustomerRequerimentRequest(data: any): Observable<ResponseBase> {    
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/CustomerRequerimentRequest/CreateRangeCustomerRequerimentRequest`,
      data
    );    
  }

  updateCustomerRequerimentRequest(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/CustomerRequerimentRequest/UpdateRangeCustomerRequerimentRequest`, 
      data
    );           
  }  

  deleteCustomerRequerimentRequest(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/CustomerRequerimentRequest/DeleteRangeCustomerRequerimentRequest`,
      data
    );           
  }

  getRouteRequest(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RouteRequest/RouteRequestsGetByDocumentId`,
      data
    );   
  }

  createRouteRequest(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/RouteRequest/CreateRouteRequest`,
      data
    );
  }

  updateRequestStatus(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/UpdateRequestStatus`,
      data
    );
  }  

  getAllFilesRequest(data: any): Observable<ResponseBase> {
    return this.http.post<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/FilesRequestByDocumentIdGet`,
      data
    );    
  }

  updateRequest(data: any): Observable<ResponseBase> {
    return this.http.put<ResponseBase>(
      `${environment.baseUrl.url}${environment.methods.Pqrs}/Pqrs/UpdateRequest`,
      data
    );
  }  
}
