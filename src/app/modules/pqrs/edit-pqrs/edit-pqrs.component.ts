import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { RequestDto } from 'src/app/modules/pqrs/edit-pqrs/components/models/PqrsModel';
import { ComponentsValidate } from './components/models/componentsValidate';
import { InformationRequestComponent } from './components/information-request/information-request.component';
import { ActionPlanComponent } from './components/action-plan/action-plan.component';
import { CustomerResponseComponent } from './components/customer-response/customer-response.component';
import { DetailRequestComponent } from './components/detail-request/detail-request.component';
import { InformationAdditionalComponent } from './components/information-additional/information-additional.component';
import { CookieService } from 'src/app/core/services/cookie/cookie.service';
import * as moment from 'moment'

@Component({
  selector: 'app-edit-pqrs',
  templateUrl: './edit-pqrs.component.html',
  styleUrls: ['./edit-pqrs.component.css'],
  providers: [MessageService],
})

export class EditPqrsComponent implements OnInit {
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.pqrs-management', url: '/home/pqrs/managment' },
    { label: '', url: '', current: true },
  ];
  activeIndex: number = 0;
  language = this.storageService.getLanguage() == null ? 'EN' : this.storageService.getLanguage();
  generalDataRequestFrom: FormGroup;
  request = new RequestDto();
  status = [];

  get generalDataRequestFromCall() {
    return this.generalDataRequestFrom.get('header') as FormArray;
  }
  documentId: string;
  requestTypeId: number = 0;
  isReadOnlyComponent: boolean = false;
  purchaseOrderId: number = 0;
  billDocumentId: number = 0;
  showaddSuccessful = false;
  showAllValidations = false;
  messageComponentValid =[];
  
  @ViewChild(InformationRequestComponent) informationRequestComponent: InformationRequestComponent;
  @ViewChild(DetailRequestComponent) detailRequestComponent: DetailRequestComponent;
  @ViewChild(InformationAdditionalComponent) informationAdditionalComponent: InformationAdditionalComponent;
  @ViewChild(ActionPlanComponent) actionPlanComponent: ActionPlanComponent;
  @ViewChild(CustomerResponseComponent) customerResponseComponent: CustomerResponseComponent;

  stateRequest: number = -1;
  chageState = false;
  currentUserAplication: any;

  title_component:string;
  description_component:string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pqrsService: PqrsService,
    private PqrsMastersService: PqrsMastersService,
    private storageService: StorageService,
    private cookieService: CookieService,    
    private translate: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: Params) => 
    {            
      if (Object.keys(params).length > 0) 
      { 
        let emailFrom = params.emailFrom;        
        let path = this.router.url.replace("?emailFrom=true","");        

        if(emailFrom)
        {
          this.cookieService.setCookie({
            name: 'pathEmail',
            value: path,
            session: true,
          });
        }                
      }             
    });


    this.currentUserAplication = this.storageService.getUser();
    this.getParameters();
    this._InitForm();
    this.loadStatus();
    this.getRequetByDocumenteId(this.documentId);
  }

  _InitForm() {
    this.generalDataRequestFrom = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });
  }

  getParameters() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.documentId = params.get('documentId');
      this.requestTypeId = Number(params.get('requestTypeId'));
      let isReadOnly = params.get('isReadOnly');
      this.isReadOnlyComponent = (isReadOnly =="true");    
      
      if(this.isReadOnlyComponent)
      {
        this.title_component = "pqrs.management-title-edit";
        this.description_component = "pqrs.management-description-edit";

        this.itemsBreadcrumb[2].label = "pqrs.management-view";
        this.itemsBreadcrumb[2].url = `/home/pqrs/edit/${this.documentId}/${this.requestTypeId}/${isReadOnly}`;
      }
      else
      {
        this.title_component = "pqrs.edit-pqrs-edit-title";
        this.description_component = "pqrs.edit-pqrs-edit-description";

        this.itemsBreadcrumb[2].label = "pqrs.edit-pqrs-edit";
        this.itemsBreadcrumb[2].url = `/home/pqrs/edit/${this.documentId}/${this.requestTypeId}/${isReadOnly}`;
      }
      
    });
  }
  
  blockFormsGeneralDataRequestFromCall()
  {        
    for (const ctrl in this.generalDataRequestFromCall.controls)        
        this.generalDataRequestFromCall.get(ctrl).disable();              
  }

  private itemsRequest(data: any): FormGroup {
    return this.formBuilder.group({
      documentId: [data.documentId, Validators.nullValidator],
      requestStatusId: [data.requestStatusId, Validators.nullValidator],
      requestStatusName: [data.requestStatusName, Validators.nullValidator],
      thirdPartyId: [data.thirdPartyId, Validators.nullValidator],
      customerName: [data.customerName, Validators.nullValidator],
      countryId: [data.countryId, Validators.nullValidator],
      countryName: [data.countryName, Validators.nullValidator],
      address: [data.address, Validators.nullValidator],
      phone1: [data.phone1, Validators.nullValidator],
      phone2: [data.phone2, Validators.nullValidator],
      email: [data.email, Validators.nullValidator],
      requestTypeId: [data.requestTypeId, Validators.nullValidator],
      requestTypeName: [data.requestTypeName, Validators.nullValidator],
      businessName: [data.businessName, Validators.nullValidator],
      purchaseOrderId: [data.purchaseOrderId, Validators.nullValidator],
      billDocumentId: [data.billDocumentId, Validators.nullValidator],
      requestDate: [data.requestDate, Validators.nullValidator],
      notes: [data.notes, Validators.nullValidator],
      fileName: [data.fileName, Validators.nullValidator],
      fileUrl: [data.fileUrl, Validators.nullValidator],
    });
  }

  getRequetByDocumenteId(numberRequest: string) {
    let data = {
      documentId: numberRequest,
    };

    this.request = new RequestDto();
    this.generalDataRequestFromCall.clear();

    this.pqrsService.getRequestByDocument(data)
      .subscribe(
        (response) => {
          if (response.status) {
            this.request = response.data;            
            this.stateRequest = response.data.requestStatusId;
            this.purchaseOrderId = response.data.purchaseOrderId;
            this.billDocumentId = response.data.billDocumentId;
            

            var find = this.status.findIndex(x => x.requestStatusId == 1);
            if(this.stateRequest>1 && find >= 0)
            {
              this.status.splice(this.status.findIndex(x => x.requestStatusId == 1),1);
            }

            this.loadDataTableRequest();
            this.informationRequestComponent.generalDataRequestFrom.controls.documentId.setValue(this.request.documentId);
            this.informationRequestComponent.generalDataRequestFrom.controls.email.setValue(this.request.email);
            this.informationRequestComponent.generalDataRequestFrom.controls.countryName.setValue(this.request.countryName);
            this.informationRequestComponent.generalDataRequestFrom.controls.businessName.setValue(this.request.businessName);
            this.informationRequestComponent.generalDataRequestFrom.controls.address.setValue(this.request.address);
            this.informationRequestComponent.generalDataRequestFrom.controls.phone1.setValue(this.request.phone1);
            this.informationRequestComponent.generalDataRequestFrom.controls.phone2.setValue(this.request.phone2);
            this.informationRequestComponent.generalDataRequestFrom.controls.notes.setValue(this.request.notes);
            this.informationRequestComponent.generalDataRequestFrom.controls.fileName.setValue(this.request.fileName);
            this.informationRequestComponent.generalDataRequestFrom.controls.fileUrl.setValue(this.request.fileUrl);

            this.customerResponseComponent.validateFormStatus(this.requestTypeId,this.stateRequest);
            this.informationAdditionalComponent.validateAdditionalInformation(this.stateRequest);
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },        
      );

  
  }

  loadDataTableRequest() {
    this.generalDataRequestFromCall.push(
      this.itemsRequest({
        documentId: this.request.documentId,
        requestStatusId: this.request.requestStatusId,
        requestDate: moment(this.request.requestDate).format(this.language == 'en' ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY'),
        requestStatusName: this.request.requestStatusName,
        thirdPartyId: this.request.thirdPartyId,
        customerName: this.request.customerName,
        countryId: this.request.countryId,
        countryName: this.request.countryName,
        address: this.request.address,
        phone1: this.request.phone1,
        phone2: this.request.phone2,
        email: this.request.email,
        businessName: this.request.businessName,
        requestTypeId: this.request.requestTypeId,
        requestTypeName: this.request.requestTypeName,
        purchaseOrderId: this.request.purchaseOrderId,
        billDocumentId: this.request.billDocumentId,
        notes: this.request.notes,
        fileName: this.request.fileName,
        fileUrl: this.request.fileUrl
      })
    );

    if(this.isReadOnlyComponent) {      
      this.blockFormsGeneralDataRequestFromCall();
    }
  }

  loadStatus() {
    var data = {};
    this.PqrsMastersService.getRequestStatus(data).subscribe(
      (response) => {
        if (response) {
          this.status = response.data;
          }
          else {
            this.translate
              .stream('general.msgDetailResponse')
              .subscribe((res: string) => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: res,
                });
              });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      );
  }

  return() {
    this.router.navigate(['home/pqrs/managment']);
  }

  save() {

    //#region validaciones

    if(this.requestTypeId != 6 && this.stateRequest == 4)
    {
      this.messageComponentValid = [];
      
      //!app-detail-request
      if (this.detailRequestComponent.detailPqrsFormCall.invalid) 
      {
        this.getMessageComponent(ComponentsValidate.detail);        
      }
      
      //!app-information-additional
      if (
        this.informationAdditionalComponent.registerFormAditional.invalid || 
        this.informationAdditionalComponent.technicalParameterFormCall.invalid || 
        this.informationAdditionalComponent.involvedFormCall.invalid || 
        this.informationAdditionalComponent.requirementFormCall.invalid)
      {
        this.getMessageComponent(ComponentsValidate.infoAditional);
      }

      //!app-Customer-Response      
      if (this.customerResponseComponent.registerFormCustomerResponse.invalid) 
      {
        this.getMessageComponent(ComponentsValidate.customerResponse);      
      }

      

      if(this.messageComponentValid.length>0)
      {
        this.showAllValidations = true;      
        return;
      }
      
    }
    
    //#endregion

    //!app-detail-request
    if(this.requestTypeId != 6) this.detailRequestComponent.saveDetail();

    //!app-information-additional
    if(this.requestTypeId != 6) this.informationAdditionalComponent.saveinfoAddtional();

    //!app-Action-Plan
    this.actionPlanComponent.savePlanAction();

    //!app-Answer-Customer
    this.customerResponseComponent.saveAnswerCustomer();

    if(this.chageState)
    {
      this.updateStatus(false);      
    }

    this.showaddSuccessful = true;
  }

  getMessageComponent(type: ComponentsValidate) 
  {        
    switch (type) {
      case ComponentsValidate.detail:
        this.messageComponentValid.push("pqrs.edit-pqrs-tab-detail-request");        
        break;
      case ComponentsValidate.infoAditional:
        this.messageComponentValid.push("pqrs.edit-pqrs-tab-information-addtional");        
        break;
      case ComponentsValidate.actionPlan:
        this.messageComponentValid.push("pqrs.edit-pqrs-tab-action-plan");        
        break;
      case ComponentsValidate.customerResponse:
        this.messageComponentValid.push("pqrs.edit-pqrs-tab-customer-response");
        break;
    }
  }

  closeSuccessful() 
  {
    this.router.navigate(['home/pqrs/managment']);
  }

  changeCondition(event: any) {
    this.stateRequest = event.value;    
    this.chageState = true;

    if(this.stateRequest != 4)
    {    
      this.updateStatus(true);
    }    
    this.customerResponseComponent.validateFormStatus(this.requestTypeId,this.stateRequest);
    this.informationAdditionalComponent.validateAdditionalInformation(this.stateRequest);
  }

  updateStatus(flag:boolean)
  {    
    let data = 
    {
      documentId: this.documentId,
      requestStatusId: this.stateRequest,
      modifiedByUser: this.currentUserAplication.email
    }

    this.pqrsService.updateRequestStatus(data)
    .subscribe(
      (response) => {
        if (response) 
        {          
          if(flag) this.getRequetByDocumenteId(this.documentId);
        }          
      },
      (error) => {          
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );  
  }


}
