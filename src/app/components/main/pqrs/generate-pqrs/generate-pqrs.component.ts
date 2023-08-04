import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { fileUploadPqrs } from 'src/app/shared/models/fileUploadPqrs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { TypePqrsGenerate } from 'src/app/shared/models/pqrs';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { SalesService } from 'src/app/core/services/sales/sales.service'
import { ShippingService } from 'src/app/core/services/shipping/shipping.service'



declare var $: any;
@Component({
  selector: 'app-generate-pqrs',
  templateUrl: './generate-pqrs.component.html',
  styleUrls: ['./generate-pqrs.component.css'],
  providers: [MessageService, DatePipe]
})

export class GeneratePqrsComponent implements OnInit {

  //tipo de generacion   
  isInternal:boolean = false;
  customer = [];
  dataCustomer;
  currentUserAplication: any;
  profile = this.storageService.getProfiles();

  //menu
  itemsBreadcrumb;
  formOneIconStatusOne = 2;
  formOneStatusTextOne = "";
  registerFormPqrs: FormGroup;
  countries = [];
  plants = [];
  requestType = [];
  showAddPqrsSuccessfull = false;
  showNumberPqrs = 0;
  isRequiredInvoice: boolean = false;
  isComplain = false;

  // files
  acceptFileTypes: string;
  acceptDetailFileTypes: string;
  fileList: fileUploadPqrs[] = new Array<fileUploadPqrs>();
  file: any;

  // file validation error
  hideErrorType: boolean;
  hideErrorSize: boolean;
  displayInvalidateFileMessage: boolean = false;
  maxSize: string;


  get aw() {
    return this.registerFormPqrs.controls;
  }

  allowedFileTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'image/bmp',
    'image/gif',
    'image/tiff',
    'image/vnd.adobe.photoshop',
    'application/x-photoshop',
    'application/octet-stream',
    'image/vnd.adobe.photoshop',
    'application/postscript',
    'video/mp4',
    'video/avi',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  displayOrderNotExistMessage: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public translate: TranslateService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private pqrsMastersService: PqrsMastersService,    
    private pqrsService: PqrsService,    
    private sharedService: SharedService,
    private customerService: CustomerService,    
    private salesService: SalesService,
    private shippingService: ShippingService,    
  ) { }

  
  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((params) => {
      var type = params.get('type');
      switch(type)
      {
        case TypePqrsGenerate.internal:
          this.isInternal = true;          
        break;
        case TypePqrsGenerate.external:
          this.isInternal = false;          
        break;
      }            
    });

    if(this.isInternal)
    {
      this.itemsBreadcrumb = [
        { label: 'menu.Home', url: '/home'},
        { label: 'menu.pqrs-management', url: '/home/pqrs/managment' },
        { label: 'main.info-pqrs-btn-generate', url: '/home/generate_pqrs/internal', current: true },
      ];

      this.loadCustomer();            
      this.getRequestType(this.profile.businessId);
    }
    else
    {
      this.itemsBreadcrumb = [
        { label: 'menu.Home', url: '/main' },
        { label: 'main.menu-pqrs', url: '/main/pqrs' },
        { label: 'main.info-pqrs-btn-generate', url: '/main/generate-pqrs/external', current: true },
      ];

      this.loadCountrys();
      this.loadPlants();
    }
    
    this._InitForms();
    this.validateFormStatus();    
    this.acceptFileTypes = this.allowedFileTypes.join(',');
    this.currentUserAplication = this.storageService.getUser();    
  }

  _InitForms() {
    this.registerFormPqrs = this.formBuilder.group({
      thirdPartyId: ['', [Validators.required,Validators.maxLength(15)]],
      name_customer: ['', [Validators.required,Validators.maxLength(256)]],
      countryId: ['', [Validators.required]],
      countryName: ['', [Validators.nullValidator]],
      plant: ['', [ this.isInternal ? Validators.nullValidator : Validators.required]],
      mail: ['', [Validators.required,Validators.email,Validators.maxLength(128)]],
      address: ['', [Validators.nullValidator,Validators.maxLength(128)]],      
      phone_main: ['', [Validators.nullValidator,Validators.maxLength(20)]],
      phone_optional: ['', [Validators.nullValidator,Validators.maxLength(20)]],
      requestTypeId: ['', [Validators.required]],
      order: ['', [Validators.nullValidator,Validators.maxLength(20)]],
      invoice: ['', [Validators.nullValidator,Validators.maxLength(20)]],
      description: ['', [Validators.required,Validators.maxLength(100)]],
      uploadEvidence: [null, []],
    });
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  validateFormStatus(){
      
    this.formOneIconStatusOne = (this.registerFormPqrs.valid) ? 1 : 2;
    this.formOneStatusTextOne = (this.registerFormPqrs.valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";

    this.registerFormPqrs.valueChanges.subscribe(value => {

      this.isRequiredInvoiceAndOrder();

      if(this.isRequiredInvoice)
      {
        this.formOneIconStatusOne = (this.registerFormPqrs.valid && !this.validateInvoice()) ? 1 : 2;
        this.formOneStatusTextOne = (this.registerFormPqrs.valid && !this.validateInvoice()) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
      }
      else
      {
        this.formOneIconStatusOne = (this.registerFormPqrs.valid) ? 1 : 2;
        this.formOneStatusTextOne = (this.registerFormPqrs.valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
      }
    });
  }

  loadCustomer() 
  {
    const data = {
      zones: this.storageService.getGrupId().zoneIds,
      salesExecutives: this.storageService.getGrupId().salesExecutiveGroupIds
    }

    this.customerService.getCustomersZone(data)
      .subscribe(
        (response) => 
        {
          if (response) 
          {
            this.customer = response.data;
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

  changeCustomer(event: any) 
  {    
    this.loadCustomerForRequestResponseGet(event);
  }

  loadCustomerForRequestResponseGet(customerId:string) 
  {
    const data = {      
      customerId: customerId
    }

    this.customerService.getCustomerForRequestResponseGet(data)
      .subscribe(
        (response) => 
        {
          if (response) 
          {            
            this.dataCustomer = response.data;         
            
            if(this.dataCustomer != null)
            { 
              this.registerFormPqrs.controls.name_customer.setValue(this.dataCustomer.customerName);             
              this.registerFormPqrs.controls.countryId.setValue(this.dataCustomer.countryId);
              this.registerFormPqrs.controls.countryName.setValue(this.dataCustomer.countryName);              
              this.registerFormPqrs.controls.address.setValue(this.dataCustomer.addressLine1);              
              this.registerFormPqrs.controls.phone_main.setValue(this.dataCustomer.phone1);
              this.registerFormPqrs.controls.phone_optional.setValue(this.dataCustomer.phone2);            
            }
            
          }
          else {

            this.registerFormPqrs.controls.name_customer.setValue('');
            this.registerFormPqrs.controls.countryId.setValue('');
            this.registerFormPqrs.controls.countryName.setValue('');
            this.registerFormPqrs.controls.address.setValue('');
            this.registerFormPqrs.controls.phone_main.setValue('');
            this.registerFormPqrs.controls.phone_optional.setValue(''); 

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

  
  isRequiredInvoiceAndOrder()
  {
    var requestTypeId = this.registerFormPqrs.get('requestTypeId').value;
    
    var requirement = this.requestType.find(c => c.requestTypeId == requestTypeId);
    if (requirement != null) {
      if (requirement.isaRebill == "S" || requirement.isaBillChange == "S" || requirement.isaReturn == "S" || requirement.isaClaim == "S") 
      {
        this.isRequiredInvoice = true;
        this.isComplain = false;
      }
      else if(requirement.isaComplain == "S")
      {        
        this.isComplain = true;
        this.isRequiredInvoice = true;
      }
      else 
      {
        this.isComplain = false;
        this.isRequiredInvoice = false;
      }
    } 
  }

  loadCountrys() {
    this.sharedService.getCountryPublic()
      .subscribe(
        (response) => {
          if (response.status) {
            this.countries = response.data;
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

  changePlant(event: any) {
    this.requestType = [];
    this.getRequestType(event);
  }

  getRequestType(businessId: number) {
    let data = 
    {
      businessId: businessId,
    };

    this.pqrsMastersService.getRequestTypePublic(data)
      .subscribe(
        (response) => {
          if (response.status) {
            this.requestType = response.data;
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

  validateInvoice(): boolean {
    if (this.isRequiredInvoice) {
      var order = this.registerFormPqrs.get('order').value;
      var invoice = this.registerFormPqrs.get('invoice').value;

      if (order == '' && invoice == '')
        return this.isComplain ? false : true;
      else
        return false;
    }
    else {
      return false;
    }
  }

  changeTypeRequirement(event: any) 
  {
    this.registerFormPqrs.controls.order.setValue('');
    this.registerFormPqrs.controls.invoice.setValue('');

    var requirement = this.requestType.find(c => c.requestTypeId == event);
    if (requirement != null) {
      if (requirement.isaRebill == "S" || requirement.isaBillChange == "S" || requirement.isaReturn == "S" || requirement.isaClaim == "S") 
      {
        this.isComplain = false;
        this.isRequiredInvoice = true;
      }
      else if(requirement.isaComplain == "S")
      {
        this.isComplain = true;
        this.isRequiredInvoice = true;
      }
      else {
        this.isComplain = false;
        this.isRequiredInvoice = false;
      }
    } 
  }

  // upload file logic
  public resetFiles() {
    this.aw.uploadEvidence.setValue('');
    this.fileList = new Array<fileUploadPqrs>();
  }

  async fileChanged(e,inputFile) {
    this.file = e.target.files[0];
    await this.upload(this.file, this.allowedFileTypes);
    inputFile.value = "";
  }

  async upload(fileContent: any, validator: string[]) {
    if (await this.validateUploadedFile(fileContent, validator)) {
      await this.convertFileToBase64(fileContent);
    }
  }

  async validateUploadedFile(fileContent: any, validator: string[]) {
    this.hideErrorType = true;
    this.hideErrorSize = true;
    this.displayInvalidateFileMessage = false;

    this.maxSize = environment.max_file_size_pqrs + 'MB'

    if (validator.indexOf(fileContent.type) == -1) {
      this.hideErrorType = false;
    }

    if (fileContent.size > (environment.max_file_size_pqrs * 1000000) ||
      fileContent.size == 0) {
      this.hideErrorSize = false;
    }
    this.displayInvalidateFileMessage = !this.hideErrorSize || !this.hideErrorType;
    return !this.displayInvalidateFileMessage;
  }

  async convertFileToBase64(file) {
    var self = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let fileFU: fileUploadPqrs = {
        fileName: file.name,        
        fileTemporal: reader.result.toString().split(',')[1]
      }

      self.fileList.push(fileFU);
      self.updateFileList();
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  updateFileList() {

    let filesUpload: string = '';
    this.fileList.forEach((item, index) => {
      filesUpload += item.fileName + ' - ';
    });
    this.aw.uploadEvidence.setValue(filesUpload);
    console.log("this.fileList:", this.fileList);
  }

  back() 
  {
    if(this.isInternal)
    {
      this.router.navigate(['home/pqrs/managment']);
    }
    else
    {
      this.router.navigate(['main/pqrs']);
    }
  }

  async generatePqrs() {
    if (this.registerFormPqrs.invalid || this.validateInvoice()) {
      return;
    }
    
    var businessId = this.registerFormPqrs.get('plant').value;
    var emailCountry = this.plants.find(x => x.businessId == businessId);

    let data =
    {
      businessId: this.isInternal ? this.profile.businessId : this.registerFormPqrs.get('plant').value,
      companyId: this.isInternal ? this.profile.businessId : this.registerFormPqrs.get('plant').value,
      thirdPartyId : this.registerFormPqrs.get('thirdPartyId').value,
      requestTypeId: this.registerFormPqrs.get('requestTypeId').value,
      billDocumentId: this.registerFormPqrs.get('invoice').value,
      purchaseOrderId: this.registerFormPqrs.get('order').value,
      customerName: this.registerFormPqrs.get('name_customer').value,
      countryId: this.registerFormPqrs.get('countryId').value,
      address: this.registerFormPqrs.get('address').value,
      phone1: this.registerFormPqrs.get('phone_main').value,
      phone2: this.registerFormPqrs.get('phone_optional').value,
      email: this.registerFormPqrs.get('mail').value,
      notes: this.registerFormPqrs.get('description').value,
      customerServiceEmail: this.isInternal ? '' : (emailCountry.pqrsEmail == null ? '' : emailCountry.pqrsEmail),
      createdByUser : this.isInternal ? this.currentUserAplication.email : this.registerFormPqrs.get('mail').value,
      filesPqrs: this.fileList,
    };

    //valida si el pedido existe para generacion de pqrs intero
    if((data.purchaseOrderId != ""  || data.billDocumentId != "" ) && this.isInternal)
    {            
      var orderExist = await this.getOrderOrInvoiceExist(data.purchaseOrderId,data.billDocumentId);      
      if(!orderExist)
      {
        this.displayOrderNotExistMessage = true;
        return;
      }
    };
    
    this.pqrsService.postCreateRequest(data,this.isInternal)
      .subscribe(
        (response) => {

          if (response.status) 
          {                      

            this.showNumberPqrs = response.data.documentId;
            this.showAddPqrsSuccessfull = true;
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

  async getOrderOrInvoiceExist(purchaseOrderId,billDocumentId): Promise<boolean> {
        
    let dataOrder =
    {
      orderId: (purchaseOrderId == null || purchaseOrderId == '') ? null : Number(purchaseOrderId),
      billDocumentNumber: (billDocumentId == null || billDocumentId == '') ? null : Number(billDocumentId)
    };

    var flag : boolean = false;  
    await this.shippingService.getBillDetailProductsGetByOrderId(dataOrder)
      .then(
        (response) => {
          if (response) flag = true;            
        },
        (error) => {
          flag = false;
        }
      );

      return flag;
  }

  pqrsSuccessfull()
  {
    this.showAddPqrsSuccessfull = false;
    this.registerFormPqrs.reset();
  }
}
