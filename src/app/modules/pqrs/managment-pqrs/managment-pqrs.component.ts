import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormGroupDirective,Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { PqrsService } from 'src/app/core/services/pqrs/pqrs.service';
import { PqrsMastersService } from 'src/app/core/services/pqrs-masters/pqrs-masters.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { environment } from 'src/environments/environment';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { SortService } from 'src/app/core/services/sort/sort.service';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import * as moment from 'moment'

declare var $: any;
@Component({
  selector: 'app-managment-pqrs',
  templateUrl: './managment-pqrs.component.html',
  styleUrls: ['./managment-pqrs.component.css'],
  providers: [MessageService]
})

export class ManagmentPqrsComponent implements OnInit {

  @ViewChild('ngForm') ngForm: FormGroupDirective;
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.pqrs-management', url: '/home/pqrs/managment', current: true },
  ];

  showfiltersFinotex = false;
  language = this.storageService.getLanguage();
  submitted: boolean;
  format: string = this.language == "en" ? 'MMM/DD/YYYY' : 'DD/MMM/YYYY';
  
  settingsDate = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.language == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['dateRegistration'],
    labels: 'pqrs.management-filter-date',
  };
  notDownloadExcel = false;

  registerFormFilter: FormGroup;
  requestStatus = [];
  customer = [];

  //filters
  documentId:string;

  //tabla
  request = [];
  expandedRows: {} = {};
  requestDataForm: FormGroup;
  get requestFormCall() {
    return this.requestDataForm.get('header') as FormArray;
  }

  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;


  //filter export
  filter_number:string = "";
  filter_requirement_type:string  = "";
  filter_state:string = "";
  filter_customer:string = "";
  filter_order:string = "";
  filter_invoice:string = "";
  filter_date:string = "";
  filter_responsible:string = "";

  showNotFoundFile: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,    
    private translate: TranslateService,
    private messageService: MessageService,
    private storageService: StorageService,
    private pqrsService: PqrsService,
    private pqrsMastersService: PqrsMastersService,    
    private customerService: CustomerService,
    private sortService: SortService,
    private excelService: ExcelService
  ) { }


  ngOnInit() {
    this._InitForms();    
    this.loadCustomer();
    this.loadStatus();         
    this.loadRequest();       
  }  

  _InitForms() {
    this.registerFormFilter = this.formBuilder.group({
      status: ['', [Validators.required]],
      documentId: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      dateRegistration: ['', [Validators.required]],
      order: ['', [Validators.required]],
      invoice: ['', [Validators.required]]
    });

    this.requestDataForm = this.formBuilder.group({
      header: this.formBuilder.array([]),
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

  loadStatus() 
  {
    var data = {};    
    
    this.pqrsMastersService.getRequestStatus(data)
      .subscribe(
        (response) => 
        {
          if (response) 
          {
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

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  showPanelFilter() {
    this.showfiltersFinotex = !this.showfiltersFinotex;
  }

  onSubmitFilterSearch(data: string) 
  {
    this.documentId = data;
    this.loadRequest();
  }
  
  download() 
  {
    this.translate.stream('pqrs.management-filter-number').subscribe((res: string) => {this.filter_number = res});        
    this.translate.stream('main.generate-pqrs-requirement-type').subscribe((res: string) => {this.filter_requirement_type = res});        
    this.translate.stream('pqrs.management-filter-state').subscribe((res: string) => {this.filter_state = res});    
    this.translate.stream('pqrs.management-filter-customer').subscribe((res: string) => {this.filter_customer = res});    
    this.translate.stream('pqrs.management-filter-order').subscribe((res: string) => {this.filter_order = res});    
    this.translate.stream('pqrs.management-filter-invoice').subscribe((res: string) => {this.filter_invoice = res});    
    this.translate.stream('pqrs.management-filter-date').subscribe((res: string) => {this.filter_date = res});    
    this.translate.stream('pqrs.management-filter-responsible').subscribe((res: string) => {this.filter_responsible = res});    
        
    let requestExcel: any[] = [];
    this.request.map((s) => {
      requestExcel.push({                  
        [this.filter_number] : s.documentId,
        [this.filter_requirement_type] : s.requestTypeName,
        [this.filter_state] : s.requestStatusName,
        [this.filter_customer] : s.customerName,
        [this.filter_order] : s.purchaseOrderId,
        [this.filter_invoice] : s.billDocumentId,
        [this.filter_date] : moment(s.requestDate).format(this.language == 'en' ? 'MMM/DD/YYYY': 'DD/MMM/YYYY'),
        [this.filter_responsible] : s.responsible,
      });
    });

    this.notDownloadExcel = !(this.request.length > 0)!;
    if (this.request.length > 0) {
      this.excelService.exportAsExcelFile(requestExcel, 'Pqrs History');
    }
  }

  newRequest() {
    this.router.navigate(['home/generate_pqrs/internal']);
  }

  clearFilter() {
    this.registerFormFilter.reset();
    $('#searchRequest').val('');
    this.documentId = null;
  }

  onSubmitFilter(): void {

    var searchRequest = $('#searchRequest').val();
    if(searchRequest == null || searchRequest == '') this.documentId = null;    
    this.loadRequest();
  }

  //-------------- tabla  
  paginate(event) {        
    var currentPage = (event.first / event.rows)+1;    
    this.currentPage = currentPage;
    this.pageLenght = event.rows;    
    this.loadRequest();
  }

  onSorted($event) {
    this.request = this.sortService.sortList($event, this.request);
    this.loadDataTable();
  }

  mapDataRequest() {

    var dateIni = this.registerFormFilter.get('dateRegistration').value ?
      moment(this.registerFormFilter.get('dateRegistration').value.split(' - ')[0], this.format)
      .format('YYYY-MM-DD') : null;

    var dateFin = this.registerFormFilter.get('dateRegistration').value ?
        moment(this.registerFormFilter.get('dateRegistration').value.split(' - ')[1], this.format)
        .format('YYYY-MM-DD') : null;

    var status = this.registerFormFilter.get('status').value;
    var documentId = this.documentId == null || this.documentId == '' ? this.registerFormFilter.get('documentId').value : this.documentId;
    var customer = this.registerFormFilter.get('customer').value;
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
      documentId: (documentId == '' || documentId == null) ? null : documentId,
      thirdPartyId: (customer == '' || customer == null) ? null : customer,
      requestDateStart: (lengthDate < 25) ? null : dateIni,
      requestDateEnd: (lengthDate < 25) ? null : dateFin,
      purchaseOrderId: (order == '' || order == null) ? null : order,
      billDocumentId: (invoice == '' || invoice == null) ? null : invoice,
    };
  }

  loadRequest() 
  {

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
        (error) => 
        {

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
      editOrSave: [data.editOrSave, Validators.nullValidator],
    });
  }

 
  loadDataTable() {    
    this.requestFormCall.clear();  
    this.requestDataForm.reset();
    this.rowNoDataVisible();
        
    for (let i = 0; i < this.request.length; i++) {
      var requestDate = moment(this.request[i].requestDate).format(this.language == 'en' ? 'MMM/DD/YYYY': 'DD/MMM/YYYY');      
            
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
          requestDate: requestDate,
          responsible: this.request[i].responsible,
          editOrSave: false,
        })
      );      
    }            
  }  
  
  onItemClick(rowData: any, dt: any) 
  {    
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  rowNoDataVisible()
  {
    const rowObservations = document.getElementById("rowNoData");    
    rowObservations.style.display = this.request.length>0 ? "none" : "revert";        
  }

  editRequest(documentId,requestTypeId,isReadOnly) 
  {    
    this.router.navigate([`home/pqrs/edit/${documentId}/${requestTypeId}/${isReadOnly}`]);
  }

  viewRequest(documentId,requestTypeId,isReadOnly)
  {
    this.router.navigate([`home/pqrs/edit/${documentId}/${requestTypeId}/${isReadOnly}`]);
  }

  downloadFile(documentId)
  {
    

    var data = 
    {
      documentId : documentId
    };

    this.pqrsService.getAllFilesRequest(data)
      .subscribe(
        (response) => {
          if (response.status) 
          {            
            var data = response.data;
            if(data != null)
            {
              const byteCharacters = atob(data);
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
              a.download = "request_number_"+documentId;
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
            }
            
          }
          else
          {          
            this.showNotFoundFile = true;
          }
        },
        (error) => 
        {                              
          if(error.status == 400)
          {
            this.showNotFoundFile = true;          
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

}
