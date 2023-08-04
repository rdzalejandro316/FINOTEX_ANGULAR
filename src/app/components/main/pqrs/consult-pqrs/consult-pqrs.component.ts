import { Component, OnInit } from '@angular/core'; import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-consult-pqrs',
  templateUrl: './consult-pqrs.component.html',
  styleUrls: ['./consult-pqrs.component.css'],
  providers: [MessageService]
})
export class ConsultPqrsComponent implements OnInit {

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/main' },
    { label: 'main.menu-pqrs', url: '/main/pqrs' },
    { label: 'main.info-pqrs-btn-consult', url: '/main/consult-pqrs', current: true }
  ];

  language = this.storageService.getLanguage() == null ? "EN" : this.storageService.getLanguage();
  parameterFormPqrs: FormGroup;
  plants = [];
  request = new RequestDto();  
  listPqrsForm: FormGroup;
  get flistPqrs() { return this.listPqrsForm.controls; }
  get clistPqrs() { return this.flistPqrs.items as FormArray; }
  get hola() { return this.listPqrsForm.controls.itemsAlf as FormArray; }

  showConsultFail = false;
  
  constructor(
    private readonly formBuilder: FormBuilder,
    public translate: TranslateService,      
    private messageService: MessageService,
    private storageService: StorageService,    
    private sharedService: SharedService,
    private pqrsService: PqrsService
  ) { }

  ngOnInit(): void {
    this._InitForms();
    this.loadPlants();        
  }

  _InitForms() {
    this.listPqrsForm = this.formBuilder.group({
      itemsAlf: new FormArray([])
    });

    this.parameterFormPqrs = this.formBuilder.group({
      businessId: ['', Validators.required],
      searchRequest: ['', Validators.required],
      mail: ['', Validators.required],
    });
  }


  loadPlants() {

    this.sharedService.getPlantsPublic()
      .subscribe(
        (response) => {
          if (response.status) {
            this.plants = response.data;
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

  onSubmitFilterSearch(numberRequest: string) {

    var businessId = this.parameterFormPqrs.get('businessId').value;
    var mail = this.parameterFormPqrs.get('mail').value;

    if(businessId == '' || numberRequest == '' || mail == '') return;
        
    let data =
    {
      businessId: this.parameterFormPqrs.get('businessId').value,
      documentId: numberRequest,
      email: mail
    };
        
    this.pqrsService.getRequestPublic(data)
      .subscribe(
        (response) => 
        {          
          if(response != null)
          {      
            if (response.status) 
            {
             
              this.request = response.data;

              this.clistPqrs.clear();
              if (response.quantity > 0) {

                var requestDate = moment(this.request.requestDate).format(this.language == 'en' ? 'MMM/DD/YYYY': 'DD/MMM/YYYY');
                var closedDate = this.request.closedDate == null ?  '' : moment(this.request.closedDate).format(this.language == 'en' ? 'MMM/DD/YYYY': 'DD/MMM/YYYY');
                var answer =  this.request.requestStatusId == 4 ? this.request.answer : '';

                this.clistPqrs.push(this.formBuilder.group({
                  documentId: [this.request.documentId, []],
                  requestStatusId: [this.request.requestStatusId, []],                  
                  requestStatusName: [this.request.requestStatusName, []],                
                  requestDate: [ requestDate, []],
                  closedDate: [ closedDate, []],
                  answer: [answer, []],                  
                  thirdPartyId: [this.request.thirdPartyId, []],
                  customerName: [this.request.customerName, []],
                  countryId: [this.request.countryId, []],
                  countryName: [this.request.countryName, []],
                  address: [this.request.address, []],
                  phone1: [this.request.phone1, []],
                  phone2: [this.request.phone2, []],
                  email: [this.request.email, []],
                  requestTypeId: [this.request.requestTypeId, []],
                  requestTypeName: [this.request.requestTypeName, []],
                  purchaseOrderId: [this.request.purchaseOrderId, []],
                  billDocumentId: [this.request.billDocumentId, []],
                  notes: [this.request.notes, []],
                  fileName: [this.request.fileName, []],
                  fileUrl: [this.request.fileUrl, []],
                }));
              }            

            }
            else 
            {
              this.request = new RequestDto();
              this.clistPqrs.clear();
              this.showConsultFail = true;
            }
          }
          else 
          {
            this.request = new RequestDto();
            this.clistPqrs.clear();
            this.showConsultFail = true;
          }
        },
        (error) => {

          if(error.status == 400)
          {
            this.request = new RequestDto();
            this.clistPqrs.clear();
            this.showConsultFail = true;
          }
          else
          {          
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        }
    );
  }

  Dowload() {
        if(this.request.fileUrl != null){
          const byteCharacters = atob(this.request.fileUrl);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: 'application/x-zip-compressed'});
          
          let fileRequest = document.getElementById("fileRequest");
          fileRequest.setAttribute("href", URL.createObjectURL(blob));
          fileRequest.setAttribute("download", this.request.fileName);
          fileRequest.click();
        }
        else
        {
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
  }

  clear() {
    $('#searchRequest').val('');
    this.parameterFormPqrs.reset();
  }

  openDetail() {
    const rowDetail = document.getElementById("rowDetail");
    var display = rowDetail.style.display;
    rowDetail.style.display = display == "inherit" ? "none" : "inherit";
  }
}

export class RequestDto {
  constructor(
    public documentId: number = 0,
    public requestStatusId: number = 0,    
    public requestStatusName: string = "",
    public requestDate: string = "",
    public closedDate: string = "",
    public answer: string = "",
    public thirdPartyId: string = "",
    public customerName: string = "",
    public countryId: string = "",
    public countryName: string = "",
    public address: string = "",
    public phone1: string = "",
    public phone2: string = "",
    public email: string = "",
    public requestTypeId: string = "",
    public requestTypeName: string = "",
    public purchaseOrderId: string = "",
    public billDocumentId: string = "",
    public notes: string = "",
    public fileName: string = "",
    public fileUrl: string = "",
  ) { }
}

export class FileInfomationDTO {
  constructor(
    public FileName: string = "",
    public ContainerName: string = "",
  ) { }
}