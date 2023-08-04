import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { ShippingService } from 'src/app/core/services/shipping/shipping.service'
import { TypePqrsGenerate } from '../../models/generatePqrs';
import { fileUploadPqrs } from 'src/app/shared/models/fileUploadPqrs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'src/app/core/services/cookie/cookie.service';
import * as moment from 'moment'
import * as zip from "@zip.js/zip.js";

@Component({
  selector: 'app-generate-customer-pqrs',
  templateUrl: './generate-customer-pqrs.component.html',
  styleUrls: ['./generate-customer-pqrs.component.css'],
  providers: [MessageService]
})
export class GenerateCustomerPqrsComponent implements OnInit {

  urlCurrent: string = window.location.href.substring(window.location.href.indexOf('#') + 1);

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.pqrs-management-customer', url: '/home/pqrs/managment_customer' },
    { label: 'main.info-pqrs-btn-generate', url: this.urlCurrent, current: true },
  ];
  currentUserAplication: any;
  profile = this.storageService.getProfiles();

  formOneIconStatusOne = 2;
  formOneStatusTextOne = "";

  registerFormPqrs: FormGroup;
  requestType = [];
  requestByDocument;
  dataCustomer;

  language = this.storageService.getLanguage();
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';
  title_component: string;
  description_component: string;
  title_form: string;
  title_button: string;

  typePqrsGenerate: TypePqrsGenerate;
  documentId: number;
  customerId: number;

  isRequiredInvoice: boolean = true;
  isComplain = false;

  // files
  acceptFileTypes: string;
  acceptDetailFileTypes: string;
  fileList: fileUploadPqrs[] = new Array<fileUploadPqrs>();
  file: any;
  showNotFoundFile: boolean = false;

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
  showNumberPqrs = 0;
  showAddPqrsSuccessfull = false;
  _typePqrsGenerate = TypePqrsGenerate;
  showUpdatePqrsSuccessfull = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private translate: TranslateService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,    
    private cookieService: CookieService,
    private pqrsMastersService: PqrsMastersService,
    private pqrsService: PqrsService,
    private shippingService: ShippingService,
    private customerService: CustomerService,    
  ) { }

  ngOnInit() {

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



    this.loadParms();
    this._InitForms();
    this.validateFormStatus();
    this.getRequestType();
    this.validateFormStatus();
    this.acceptFileTypes = this.allowedFileTypes.join(',');
    this.currentUserAplication = this.storageService.getUser();    
  }

  loadParms() {
    this.activatedRoute.paramMap.subscribe((params) => {
      var type = params.get('type');
      switch (type) {
        case TypePqrsGenerate.new:
          this.typePqrsGenerate = TypePqrsGenerate.new;
          this.customerId = Number(params.get('customerId'));
          this.title_component = "main.info-pqrs-btn-generate";
          this.description_component = "pqrs.generate-pqrs-new";
          this.itemsBreadcrumb[2].label = "main.info-pqrs-btn-generate";
          this.title_form = "pqrs.management-new-request";
          this.title_button = "main.info-pqrs-btn-generate";
          this.loadCustomer(this.customerId);
          break;
        case TypePqrsGenerate.edit:
          this.typePqrsGenerate = TypePqrsGenerate.edit;
          this.customerId = Number(params.get('customerId'));
          this.documentId = Number(params.get('documentId'));
          this.title_component = "pqrs.edit-pqrs-edit-title";
          this.description_component = "pqrs.generate-pqrs-edit";
          this.itemsBreadcrumb[2].label = "pqrs.edit-pqrs-edit-title";
          this.title_form = "pqrs.generate-pqrs-title-form-search";
          this.title_button = "main.info-pqrs-btn-update";
          this.loadDetailRequest(this.documentId);
          break;
        case TypePqrsGenerate.search:
          this.typePqrsGenerate = TypePqrsGenerate.search;
          this.customerId = Number(params.get('customerId'));
          this.documentId = Number(params.get('documentId'));
          this.title_component = "main.info-pqrs-btn-consult";
          this.description_component = "pqrs.generate-pqrs-search";
          this.itemsBreadcrumb[2].label = "main.info-pqrs-btn-consult";
          this.title_form = "pqrs.generate-pqrs-title-form-search";
          this.loadDetailRequest(this.documentId);
          break;
      }
    });
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  validateFormStatus() {
    if (this.typePqrsGenerate == TypePqrsGenerate.search) {
      this.formOneIconStatusOne = 0;
      this.formOneStatusTextOne = "";
    }
    else {
      this.formOneIconStatusOne = (this.registerFormPqrs.valid) ? 1 : 2;
      this.formOneStatusTextOne = (this.registerFormPqrs.valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";

      this.registerFormPqrs.valueChanges.subscribe(value => {

        this.isRequiredInvoiceAndOrder();

        if (this.isRequiredInvoice) 
        {          
          var valid = !this.validateInvoice();          
          this.formOneIconStatusOne = (this.registerFormPqrs.valid && valid) ? 1 : 2;
          this.formOneStatusTextOne = (this.registerFormPqrs.valid && valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
        }
        else 
        {          
          this.formOneIconStatusOne = (this.registerFormPqrs.valid) ? 1 : 2;
          this.formOneStatusTextOne = (this.registerFormPqrs.valid) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
        }
      });
    }
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
    else 
      return false;    
  }

  isRequiredInvoiceAndOrder() {
    var requestTypeId = this.registerFormPqrs.get('requestTypeId').value;

    var requirement = this.requestType.find(c => c.requestTypeId == requestTypeId);

    if (requirement != null) {
      if (requirement.isaRebill == "S" || requirement.isaBillChange == "S" || requirement.isaReturn == "S" || requirement.isaClaim == "S") {
        this.isRequiredInvoice = true;
        this.isComplain = false;
      }
      else if (requirement.isaComplain == "S") {
        this.isComplain = true;
        this.isRequiredInvoice = true;
      }
      else {
        this.isComplain = false;
        this.isRequiredInvoice = false;
      }
    }
  }

  _InitForms() {
    this.registerFormPqrs = this.formBuilder.group({
      thirdPartyId: ['', [Validators.nullValidator]],
      documentId: ['', [Validators.nullValidator]],
      requestStatusName: ['', [Validators.nullValidator]],
      requestDate: ['', [Validators.nullValidator]],
      requestTypeName: ['', [Validators.nullValidator]],      
      fileUrl: ['', [Validators.nullValidator]],
      name_customer: ['', [Validators.nullValidator, Validators.maxLength(256)]],
      countryId: ['', [Validators.nullValidator]],
      countryName: ['', [Validators.nullValidator]],
      plant: ['', [Validators.nullValidator]],
      mail: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
      address: ['', [Validators.nullValidator, Validators.maxLength(128)]],
      phone_main: ['', [Validators.nullValidator, Validators.maxLength(20)]],
      phone_optional: ['', [Validators.nullValidator, Validators.maxLength(20)]],
      requestTypeId: ['', [Validators.required]],
      order: ['', [Validators.nullValidator, Validators.maxLength(20)]],
      invoice: ['', [Validators.nullValidator, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      uploadEvidence: [null, []],
    });
  }

  blockFormsGeneralDataRequestSearch(typePqrsGenerate: TypePqrsGenerate) {
    if(typePqrsGenerate == TypePqrsGenerate.search){
      this.registerFormPqrs.controls.requestTypeName.disable();
      this.registerFormPqrs.controls.requestStatusName.disable();
      this.registerFormPqrs.controls.mail.disable();
      this.registerFormPqrs.controls.order.disable();
      this.registerFormPqrs.controls.invoice.disable();
      this.registerFormPqrs.controls.requestDate.disable();
      this.registerFormPqrs.controls.description.disable();
      this.registerFormPqrs.controls.documentId.disable();
      this.registerFormPqrs.controls.uploadEvidence.setValue(this.requestByDocument.fileName);
      this.registerFormPqrs.controls.fileUrl.setValue(this.requestByDocument.fileUrl);
    }
    else if(typePqrsGenerate == TypePqrsGenerate.edit){
      this.registerFormPqrs.controls.requestStatusName.disable();
      this.registerFormPqrs.controls.requestDate.disable();
      this.registerFormPqrs.controls.documentId.disable();
      this.registerFormPqrs.controls.requestTypeName.disable();
      this.unzipFile(this.requestByDocument.fileUrl);
    }
  } 

  getRequestType() {

    let data =
    {
      businessId: this.profile.businessId,
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

  loadCustomer(customerId: number) {
    const data = {
      customerId: customerId
    }

    this.customerService.getCustomerForRequestResponseGet(data)
      .subscribe(
        (response) => {
          if (response) {
            this.dataCustomer = response.data;

            if (this.dataCustomer != null) {
              this.registerFormPqrs.controls.thirdPartyId.setValue(customerId);
              this.registerFormPqrs.controls.name_customer.setValue(this.dataCustomer.customerName);
              this.registerFormPqrs.controls.countryId.setValue(this.dataCustomer.countryId);
              this.registerFormPqrs.controls.countryName.setValue(this.dataCustomer.countryName);
              this.registerFormPqrs.controls.address.setValue(this.dataCustomer.addressLine1);
              this.registerFormPqrs.controls.phone_main.setValue(this.dataCustomer.phone1);
              this.registerFormPqrs.controls.phone_optional.setValue(this.dataCustomer.phone2);
            }

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

  loadDetailRequest(documentId: number) {
    let data = {
      documentId: documentId,
    };
    this.pqrsService.getRequestByDocument(data)
      .subscribe(
        (response) => {
          if (response.status) {

            this.requestByDocument = response.data;
            var requestDate = moment(this.requestByDocument.RequestDate).format(this.format);

            this.registerFormPqrs.controls.mail.setValue(this.requestByDocument.email);
            this.registerFormPqrs.controls.requestStatusName.setValue(this.requestByDocument.requestStatusName);
            this.registerFormPqrs.controls.requestDate.setValue(requestDate);
            this.registerFormPqrs.controls.requestTypeName.setValue(this.requestByDocument.requestTypeName);
            this.registerFormPqrs.controls.requestTypeId.setValue(this.requestByDocument.requestTypeId);
            this.registerFormPqrs.controls.order.setValue(this.requestByDocument.purchaseOrderId);
            this.registerFormPqrs.controls.invoice.setValue(this.requestByDocument.billDocumentId);
            this.registerFormPqrs.controls.description.setValue(this.requestByDocument.notes);
            this.registerFormPqrs.controls.documentId.setValue(this.requestByDocument.documentId);
            this.blockFormsGeneralDataRequestSearch(this.typePqrsGenerate);                     
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

  changeTypeRequirement(event: any) {
    this.registerFormPqrs.controls.order.setValue('');
    this.registerFormPqrs.controls.invoice.setValue('');
    this.isRequiredInvoiceAndOrder();
  }

  // upload file logic
  public resetFiles() {
    this.aw.uploadEvidence.setValue('');
    this.fileList = new Array<fileUploadPqrs>();
  }

  async fileChanged(e, inputFile) {
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
    let filesUpload: string = "";
    this.fileList.forEach((item, index) => {
      filesUpload += item.fileName + ' - ';
    });
    this.aw.uploadEvidence.setValue(filesUpload);
  }

  dowload() {    
    var urlAttachment = this.registerFormPqrs.controls.fileUrl.value;    

    if (urlAttachment == null || urlAttachment == '') {
      this.showNotFoundFile = true;
    }
    else {      
      const byteCharacters = atob(this.registerFormPqrs.controls.fileUrl.value);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/x-zip-compressed' });
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.registerFormPqrs.controls.uploadEvidence.value;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  pqrsSuccessfull() {
    this.showAddPqrsSuccessfull = false;
    this.showUpdatePqrsSuccessfull  = false;
    this.back();
  }

  back() {
    this.router.navigate(['home/pqrs/managment_customer']);
  }

  save() {

    if (this.registerFormPqrs.invalid || this.validateInvoice() || this.formOneIconStatusOne != 1) {
      return;
    }

    switch (this.typePqrsGenerate) {
      case TypePqrsGenerate.new:
        this.generatePqrs();
        break;
      case TypePqrsGenerate.edit:
        this.updatePqrs();
        break;
    }
  }

  async generatePqrs() {

    let data =
    {
      businessId: this.profile.businessId,
      companyId: this.profile.businessId,
      thirdPartyId: this.registerFormPqrs.get('thirdPartyId').value,
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
      customerServiceEmail: '',
      createdByUser: this.currentUserAplication.email,
      filesPqrs: this.fileList,
    };

    //valida si el pedido o factura existe para generacion de pqrs intero
    if (data.purchaseOrderId != "" || data.billDocumentId != "") {
      var orderExist = await this.getOrderOrInvoiceExist(data.purchaseOrderId, data.billDocumentId);
      if (!orderExist) {
        this.displayOrderNotExistMessage = true;
        return;
      }
    };

    this.pqrsService.postCreateRequest(data, true)
      .subscribe(
        (response) => {

          if (response.status) {

            this.showNumberPqrs = response.data.documentId;
            this.showAddPqrsSuccessfull = true;
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

  async updatePqrs() {

    let data =
    {
      businessId: this.profile.businessId,
      documentId: this.documentId,
      requestTypeId: this.registerFormPqrs.get('requestTypeId').value,
      billDocumentId: this.registerFormPqrs.get('invoice').value,
      purchaseOrderId: this.registerFormPqrs.get('order').value,
      email: this.registerFormPqrs.get('mail').value,
      notes: this.registerFormPqrs.get('description').value,
      modifiedByUser: this.currentUserAplication.email,
      filesPqrs: this.fileList
    };

    //valida si el pedido o factura existe para generacion de pqrs intero
    if (data.purchaseOrderId != "" || data.billDocumentId != "") {
      var orderExist = await this.getOrderOrInvoiceExist(data.purchaseOrderId, data.billDocumentId);
      if (!orderExist) {
        this.displayOrderNotExistMessage = true;
        return;
      }
    };

    this.pqrsService.updateRequest(data)
      .subscribe(
        (response) => {

          if (response.status) {

            this.showNumberPqrs = response.data.documentId;
            this.showUpdatePqrsSuccessfull = true;
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

  async getOrderOrInvoiceExist(purchaseOrderId, billDocumentId): Promise<boolean> {

    let dataOrder =
    {
      orderId: (purchaseOrderId == null || purchaseOrderId == '') ? null : Number(purchaseOrderId),
      billDocumentNumber: (billDocumentId == null || billDocumentId == '') ? null : Number(billDocumentId)
    };
    var flag: boolean = false;

    await this.shippingService.getBillDetailProductsGetByOrderId(dataOrder)
      .then(
        (response) => {
          if (response) flag = true;
        },
        () => {
          flag = false;
        }
      );

    return flag;
  }

  async unzipFile(file:any){
    let that = this;
    let options: any = "cp437";
    let byteCharacters = atob(file);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], {
      type: 'application/x-zip-compressed',
    });
    let files = await (new zip.ZipReader(new zip.BlobReader(blob))).getEntries(options);
    files.forEach(async file => {
      let fileData = await file.getData(new zip.BlobWriter());
      var reader = new window.FileReader();
      reader.readAsDataURL(fileData);
      reader.onloadend = function () {
          let fileFU: fileUploadPqrs = {
            fileName: file.filename,
            fileTemporal: reader.result.toString().split(',')[1]
          }
          that.fileList.push(fileFU);
          that.updateFileList();
      }
   });
  }
}