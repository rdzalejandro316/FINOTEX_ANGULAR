import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/core/services/sort/sort.service';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { TypePqrsGenerate } from '../../models/generatePqrs';
import { CookieService } from 'src/app/core/services/cookie/cookie.service';
import * as moment from 'moment'

declare var $: any;
@Component({
  selector: 'app-managment-customer-pqrs',
  templateUrl: './managment-customer-pqrs.component.html',
  styleUrls: ['./managment-customer-pqrs.component.css'],
  providers: [MessageService]
})
export class ManagmentCustomerPqrsComponent implements OnInit {

  @ViewChild('ngForm') ngForm: FormGroupDirective;
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.pqrs-management-customer', url: '/home/managment_customer', current: true },
  ];
  showfiltersFinotex = false;
  language = this.storageService.getLanguage();
  submitted: boolean;
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';
  profile = this.storageService.getProfiles();
  securityUsersId = this.storageService.getSecurityUsersId();


  settingsDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.language == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['dateRegistration'],
    labels: 'pqrs.edit-pqrs-tab-information-general-registration-date',
  };

  registerFormFilter: FormGroup;
  requestStatus = [];
  requestType = [];
  customerId = null;

  //tabla
  request = [];
  expandedRows: {} = {};
  requestDataForm: FormGroup;
  dowloadDocument;
  get requestFormCall() {
    return this.requestDataForm.get('header') as FormArray;
  }

  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  showNotFoundFile: boolean = false;

  //filters
  documentId: string;

  //filter export
  notDownloadExcel = false;
  filter_documentId: string = "";
  filter_request_type_name: string = "";
  filter_request_date: string = "";
  filter_closing_date: string = "";
  filter_state: string = "";
  filter_order: string = "";
  filter_invoice: string = "";
  filter_responsible: string = "";

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,    
    private translate: TranslateService,
    private messageService: MessageService,
    private sortService: SortService,
    private storageService: StorageService,
    private cookieService: CookieService,    
    private pqrsMastersService: PqrsMastersService,
    private pqrsService: PqrsService,
    private sharedService: SharedService,
    private excelService: ExcelService
  ) { }

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

    this._InitForms();
    this.loadStatus();
    this.loadRequestType();
    this.loadCustomerId();
  }

  _InitForms() {
    this.registerFormFilter = this.formBuilder.group({
      documentId: [null, [Validators.nullValidator]],
      status: [null, [Validators.nullValidator]],
      requestTypeId: [null, [Validators.nullValidator]],
      dateRegistration: [null, [Validators.nullValidator]],
      order: [null, [Validators.nullValidator]],
      invoice: [null, [Validators.nullValidator]]
    });

    this.requestDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
    });
  }

  loadStatus() {
    var data = {};

    this.pqrsMastersService.getRequestStatus(data)
      .subscribe(
        (response) => {
          if (response) {
            this.requestStatus = response.data;
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

  loadRequestType() {
    let data =
    {
      businessId: this.profile.businessId,
    };

    this.pqrsMastersService.getRequestTypePublic(data)
      .subscribe(
        (response) => {
          if (response) {
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

  loadCustomerId() {
    this.sharedService.customerIdGet(this.profile.businessId, this.securityUsersId)
      .subscribe(
        (response) => {
          if (response) {
            this.customerId = response.data;
            this.loadRequest();
          }
        }
      );
  }

  showPanelFilter() {
    this.showfiltersFinotex = !this.showfiltersFinotex;
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  onSubmitFilterSearch(data: string) {
    this.documentId = data;
    this.loadRequest();
  }

  paginate(event) {
    var currentPage = (event.first / event.rows) + 1;
    this.currentPage = currentPage;
    this.pageLenght = event.rows;
    this.loadRequest();
  }

  onSorted($event) {
    this.request = this.sortService.sortList($event, this.request);
    this.loadDataTable();
  }

  onSubmitFilter(): void {
    var searchRequest = $('#searchRequest').val();
    if (searchRequest == null || searchRequest == '') this.documentId = null;
    this.loadRequest();
  }

  clearFilter() {
    this.registerFormFilter.reset();
    $('#searchRequest').val('');
    this.documentId = null;
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  mapDataRequest() {

    var dateIni = this.registerFormFilter.get('dateRegistration').value ?
      moment(this.registerFormFilter.get('dateRegistration').value.split(' - ')[0], this.format)
        .format('YYYY-MM-DD') : null;

    var dateFin = this.registerFormFilter.get('dateRegistration').value ?
      moment(this.registerFormFilter.get('dateRegistration').value.split(' - ')[1], this.format)
        .format('YYYY-MM-DD') : null;

    var status = this.registerFormFilter.get('status').value;
    var requestTypeId = this.registerFormFilter.get('requestTypeId').value;
    var documentId = this.documentId == null || this.documentId == '' ? this.registerFormFilter.get('documentId').value : this.documentId;
    var customer = this.customerId;
    var order = this.registerFormFilter.get('order').value;
    var invoice = this.registerFormFilter.get('invoice').value;
    var lengthDate = this.registerFormFilter.get('dateRegistration').value == null ?
      0 : this.registerFormFilter.get('dateRegistration').value.length;

    return {
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: "documentId",
      ascending: true,
      requestStatusId: (status == '' || status == null) ? null : status,
      requestTypeId: requestTypeId,
      documentId: (documentId == '' || documentId == null) ? null : documentId,
      thirdPartyId: (customer == '' || customer == null) ? null : customer,
      requestDateStart: (lengthDate < 25) ? null : dateIni,
      requestDateEnd: (lengthDate < 25) ? null : dateFin,
      purchaseOrderId: (order == '' || order == null) ? null : order,
      billDocumentId: (invoice == '' || invoice == null) ? null : invoice,
    };
  }

  loadRequest() {
    var data = this.mapDataRequest();

    this.pqrsService.getRequestFilter(data)
      .subscribe(
        (response) => {
          if (response) {

            this.request = response.data;
            this.totalRecords = response.quantity;
            this.loadDataTable();
          }
          else {

            this.request = [];
            this.totalRecords = 0;
            this.requestFormCall.clear();
            this.rowNoDataVisible();

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
          this.request = [];
          this.totalRecords = 0;
          this.requestFormCall.clear();

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      );
  }

  private items(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      documentId: [data.documentId, Validators.nullValidator],
      requestTypeId: [data.requestTypeId, Validators.nullValidator],
      requestTypeName: [data.requestTypeName, Validators.nullValidator],
      requestStatusId: [data.requestStatusId, Validators.nullValidator],
      requestStatusName: [data.requestStatusName, Validators.nullValidator],
      thirdPartyId: [data.thirdPartyId, Validators.nullValidator],
      customerName: [data.customerName, Validators.nullValidator],
      purchaseOrderId: [data.purchaseOrderId, Validators.nullValidator],
      billDocumentId: [data.billDocumentId, Validators.nullValidator],
      requestDate: [data.requestDate, Validators.nullValidator],
      responsible: [data.responsible, Validators.nullValidator],
      closingDate: [data.closingDate, Validators.nullValidator],
      email: [data.email, Validators.nullValidator],      
      editOrSave: [data.editOrSave, Validators.nullValidator],
    });
  }

  loadDataTable() {
    this.requestFormCall.clear();
    this.requestDataForm.reset();
    this.rowNoDataVisible();

    for (let i = 0; i < this.request.length; i++) {
      var email = this.request[i].requestStatusId == 4 ?  this.request[i].email : '';

      this.requestFormCall.push(
        this.items({
          id: i,
          documentId: this.request[i].documentId,
          requestTypeId: this.request[i].requestTypeId,
          requestTypeName: this.request[i].requestTypeName,
          requestStatusId: this.request[i].requestStatusId,
          requestStatusName: this.request[i].requestStatusName,
          thirdPartyId: this.request[i].thirdPartyId,
          customerName: this.request[i].customerName,
          purchaseOrderId: this.request[i].purchaseOrderId,
          billDocumentId: this.request[i].billDocumentId,
          requestDate: this.request[i].requestDate,
          responsible: this.request[i].responsible,
          closingDate: this.request[i].closingDate,
          email: email,          
          editOrSave: false,
        })
      );
    }
  }

  rowNoDataVisible() {
    const rowObservations = document.getElementById("rowNoData");
    rowObservations.style.display = this.request.length > 0 ? "none" : "revert";
  }

  download() {
    this.translate.stream('pqrs.management-filter-number').subscribe((res: string) => { this.filter_documentId = res });
    this.translate.stream('main.generate-pqrs-requirement-type').subscribe((res: string) => { this.filter_request_type_name = res });
    this.translate.stream('pqrs.edit-pqrs-tab-information-general-registration-date').subscribe((res: string) => { this.filter_request_date = res });
    this.translate.stream('main.consult-pqrs-col-asnwer-date').subscribe((res: string) => { this.filter_closing_date = res });
    this.translate.stream('pqrs.management-filter-state').subscribe((res: string) => { this.filter_state = res });
    this.translate.stream('pqrs.management-filter-order').subscribe((res: string) => { this.filter_order = res });
    this.translate.stream('pqrs.management-filter-invoice').subscribe((res: string) => { this.filter_invoice = res });
    this.translate.stream('pqrs.management-filter-responsible').subscribe((res: string) => { this.filter_responsible = res });

    let requestExcel: any[] = [];
    this.request.map((s) => {
      requestExcel.push({
        [this.filter_documentId]: s.documentId,
        [this.filter_request_type_name]: s.requestTypeName,
        [this.filter_request_date]: s.requestDate == null ? '' : moment(s.requestDate).format(this.format),
        [this.filter_closing_date]: s.closingDate == null ? '' : moment(s.closingDate).format(this.format),
        [this.filter_state]: s.requestStatusName,
        [this.filter_order]: s.purchaseOrderId,
        [this.filter_invoice]: s.billDocumentId,
        [this.filter_responsible]: s.responsible,
      });
    });

    this.notDownloadExcel = !(this.request.length > 0)!;
    if (this.request.length > 0) {
      this.excelService.exportAsExcelFile(requestExcel, 'Pqrs History');
    }
  }

  getFileByDocument(documentId: number) {
    let data = {
      documentId: documentId,
    };
    this.pqrsService.getRequestByDocument(data)
      .subscribe(
        (response) => {
          if (response.status) {
       
              this.dowloadDocument = response.data;
              var fileUrl = this.dowloadDocument.fileUrl;
              var fileName = this.dowloadDocument.fileName;
              this.dowloadDoc(fileUrl,fileName);
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
        () => { }
      );
  }

  dowloadDoc(uri : string, fileName : string) 
  {      
    var urlAttachment = uri;    
    if (urlAttachment == null || urlAttachment == '') {
      this.showNotFoundFile = true;
    }
    else{
      const byteCharacters = atob(uri);
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
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  newRequest() {
    this.router.navigate([`home/pqrs/generate_pqrs_customer/${TypePqrsGenerate.new}/${this.customerId}`]);
  }

  editRequest(documentId:number) {
    this.router.navigate([`home/pqrs/generate_pqrs_customer/${TypePqrsGenerate.edit}/${this.customerId}/${documentId}`]);
  }

  viewRequest(documentId) {
    this.router.navigate([`home/pqrs/generate_pqrs_customer/${TypePqrsGenerate.search}/${this.customerId}/${documentId}`]);
  }
}
