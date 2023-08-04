import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PrintPdfSales } from 'src/app/core/services/sales/printpdfsales.service';
import { DataSheetGetByRollo } from 'src/app/core/services/sales/dataSheet-Rollo';
import { DataSheetGetBySample } from "../technical-developments/dataSheet/dataSheet-sample";
import { OrilloCortadoService } from 'src/app/core/services/sales/dataSheet-OrilloCortado.service';
import { MascarillasTejidasService } from 'src/app/core/services/sales/dataSheet-mascarillastej.service';
import { TelasService } from 'src/app/core/services/sales/dataSheet-Telas.service';
import { DataSheetGetByReatas } from 'src/app/core/services/sales/dataSheet-Reatas';



declare var $: any;

@Component({
  selector: 'app-technical-developments',
  templateUrl: './technical-developments.component.html',
  styleUrls: ['./technical-developments.component.css'],
  providers: [MessageService, DatePipe],
})
export class TechnicalDevelopmentsComponent implements OnInit, AfterContentChecked {

  @ViewChild('ngForm') ngForm: FormGroupDirective;
  registerFormFilter: FormGroup;
  indicatorButton: boolean = false;
  showfilters: boolean = false;
  submitted: boolean;
  isOninitP: boolean = false;
  isfilterParameters: boolean = false;
  displayFilePreview: boolean = false;
  imageGaleryBrandDatail = '';
  isCurtomerUrl: string = '';
  lang = 'en';
  productLines: any = [];
  listSamples: any = [];
  customers: any = [];
  status: any = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  subscription: Subscription;
  landscape = window.matchMedia('(orientation: landscape)');
  rowSelect = null;
  sampleId: number = 0;
  customerId: number = 0;
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.Samples', url: '/home/samples_list/', current: false },
    {
      label: 'menu.technical-developments',
      url: '/home/technical_developments',
      current: true,
    },
  ];

  settingsDates = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['filter_date'],
    labels: 'technicalDevelopments.lblFilterSamplerequestdate',
  };

  typeOfDate = [
    {
      code: '1',
      name: 'Sample date',
    },
    {
      code: '2',
      name: 'Sample request date',
    },
    {
      code: '3',
      name: 'Promissed date',
    },
    {
      code: '4',
      name: 'Completed date',
    },
    {
      code: '5',
      name: 'Approval required by',
    },
  ];

  progressStatus = [
    {
      code: '1',
      name: 'On time',
    },
    {
      code: '2',
      name: 'In progress',
    },
    {
      code: '3',
      name: 'Tight deadline',
    },
    {
      code: '4',
      name: 'Overdue',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private productService: ProductService,
    private storageService: StorageService,
    private masterProductService: MasterProductService,
    private customerService: CustomerService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private printPdfSales: PrintPdfSales,
    private dataSheetGetByRollo: DataSheetGetByRollo,
    private dataSheetGetBySample: DataSheetGetBySample,
    private _orilloCortadoService:OrilloCortadoService,
    private _mascarillasTejidasService:MascarillasTejidasService,
    private _telasService:TelasService,
    private dataSheetGetByReatas : DataSheetGetByReatas

  ) {
    this.landscape.addEventListener('change', (_ev) => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    this.getFormFilter();
    let customerId = null;
    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('customerId')) {
        customerId = params.get('customerId');
      }
    });
    this.getSampleFilterService(true, customerId, null);
    this.getSampleStatus();
    this.groupLineGet();
    this.serviceCustomers();
    document.getElementById("contextMenuSelect").style.visibility = "hidden";
  }

  ngAfterContentChecked(): void { }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
  }

  onSubmitFilterSearch(data: string) {
    document.getElementById("contextMenuSelect").style.visibility = "hidden";
    const formDataFilterSearch = {
      filterInput: data,
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'CreationDate',
      ascending: true,
    };

    this.productService.getSamplesFilterBasic(formDataFilterSearch).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listSamples = response.data;
            this.listSamples.forEach((x) => {
              x.imageUrl =
                'https://upload.wikimedia.org/wikipedia/commons/b/b0/Zumba.png';
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
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
      },
      () => {
        $('#allTable').DataTable().destroy();
        this.reloadTableConfiguration();
      }
    );
  }

  onSubmitFilter(): void { }

  clearFilter() {
    this.registerFormFilter.reset();
  }

  getFormFilter() {
    return (this.registerFormFilter = this.formBuilder.group({
      lblFilterProgressstatus: ['', Validators.nullValidator],
      lblFilterSamplenumber: ['', Validators.nullValidator],
      lblFilterInternalproductcode: ['', Validators.nullValidator],
      lblFilterCustomer: ['', Validators.nullValidator],
      lblFilterCustomerproductcode: ['', Validators.nullValidator],
      lblFilterDescription: ['', Validators.nullValidator],
      lblFilterLine: ['', Validators.nullValidator],
      lblFilterWidth: ['', Validators.nullValidator],
      lblFilterLength: ['', Validators.nullValidator],
      lblFilterSampledate: ['', Validators.nullValidator],
      lblFilterSamplerequestdate: ['', Validators.nullValidator],
      lblFilterStatus: ['', Validators.nullValidator],
      filter_date: ['', Validators.nullValidator],
    }));
  }

  paginate(event: { page: number; rows: number }) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    this.getSampleFilterService(
      this.isOninitP,
      this.isCurtomerUrl,
      this.isfilterParameters
    );
  }

  getSampleFilterService(isOninit: boolean, getParamCustomerId: any, filterParameters: boolean): void {
    this.indicatorButton = true;
    this.isOninitP = isOninit;
    this.isCurtomerUrl = getParamCustomerId;
    this.isfilterParameters = filterParameters;
    document.getElementById("contextMenuSelect").style.visibility = "hidden";
    let datos = this.mapSampleFiler(
      this.currentPage,
      this.pageLenght,
      isOninit,
      filterParameters
    );

    this.productService.getSamples(datos).subscribe(
      (response) => {
        if (response) {
          this.listSamples = response.data;
          this.listSamples.forEach((x) => {
            x.imageUrl =
              'https://upload.wikimedia.org/wikipedia/commons/b/b0/Zumba.png';
          });
          this.totalRecords = response.quantity;
        } else {
          this.totalRecords = 0;
          this.listSamples = [];
          this.indicatorButton = false;
        }
      },
      (error) => {
        this.indicatorButton = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {
        this.indicatorButton = false;
        $('#allTable').DataTable().destroy();
        this.reloadTableConfiguration();
      }
    );
  }

  reloadTableConfiguration(): void {
    $(function () {
      var configuration = {
        destroy: true,
        searching: false,
        ordering: false,
        scrollX: false,
        scrollY: false,
        paging: false,
        info: false,
        responsive: {
          details: {
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                let control = '';
                if (col.hidden) {
                  if (col.data.includes('<img')) {
                    return (
                      '<div class="col-12 col-md-3 mb-2" >' +
                      '<label>' +
                      col.title +
                      '</label> ' +
                      col.data +
                      '</div>'
                    );
                  } else {
                    return (
                      '<div class="col-12 col-md-3 mb-2" >' +
                      '<label>' +
                      col.title +
                      '</label> ' +
                      '<input type="text" value="' +
                      col.data +
                      '" readonly class="form-control p-inputtext"/>' +
                      '</div>'
                    );
                  }
                } else {
                  return '';
                }
              }).join('');

              return data ? $('<div class="row"/>').append(data) : false;
            },
          },
        },
      };
      $('#allTable').DataTable(configuration).draw();
    });
  }

  mapSampleFiler(
    page: number,
    limit: number,
    isOninit: boolean,
    parametersFilter: boolean
  ) {
    moment.locale(this.storageService.getLanguage());
    let sampleParameters = {};
    let statusFilterparams = [1, 2, 3, 4, 5,6];
    if (isOninit) {
      sampleParameters = {
        sampleList: null,
        sampleNumber: null,
        internalProductCode: null,
        customerProductCode: null,
        description: null,
        productLine: null,
        width: null,
        lenght: null,
        status: null,
        typeOfDate: null,
        semaphoreId: null,
        startDate: null,
        endDate: null,
        page: page,
        limit: limit,
        orderBy: 'CreationDate',
        ascending: true,
        customerId: this.isCurtomerUrl ? this.isCurtomerUrl : null,
        statusFilter: statusFilterparams,
      };
    } else {
      if (parametersFilter) {
        sampleParameters = {
          sampleList: null,
          sampleNumber: this.getReturnValue(
            this.filterControlsForm.lblFilterSamplenumber.value
          ),
          internalProductCode: this.getReturnValue(
            this.filterControlsForm.lblFilterInternalproductcode.value
          ),
          customerProductCode: this.getReturnValue(
            this.filterControlsForm.lblFilterCustomerproductcode.value
          ),
          description: this.getReturnValue(
            this.filterControlsForm.lblFilterDescription.value
          ),
          productLine: this.getReturnValue(
            this.filterControlsForm.lblFilterLine.value
          ),
          width: this.getReturnValue(
            this.filterControlsForm.lblFilterWidth.value
          ),
          lenght: this.getReturnValue(
            this.filterControlsForm.lblFilterLength.value
          ),
          status: this.getReturnValue(
            this.filterControlsForm.lblFilterStatus.value
          ),
          typeOfDate: this.getReturnValue(
            this.filterControlsForm.lblFilterSampledate.value
          ),
          semaphoreId: this.getReturnValue(
            this.filterControlsForm.lblFilterProgressstatus.value
          ),
          startDate: this.filterControlsForm.filter_date.value
            ? moment(
              this.filterControlsForm.filter_date.value.split(' - ')[0],
              'MMM/DD/YYYY'
            ).format('YYYY-MM-DD') + ' 00:00:01'
            : null,
          endDate: this.filterControlsForm.filter_date.value
            ? moment(
              this.filterControlsForm.filter_date.value.split(' - ')[1],
              'MMM/DD/YYYY'
            ).format('YYYY-MM-DD') + ' 00:00:01'
            : null,
          page: page,
          limit: limit,
          orderBy: 'CreationDate',
          ascending: true,
          customerId: this.getReturnValue(
            this.filterControlsForm.lblFilterCustomer.value
          ),
          statusFilter: statusFilterparams,
        };
      }
    }

    return sampleParameters;
  }

  get filterControlsForm() {
    return this.registerFormFilter.controls;
  }

  getReturnValue(value: any) {
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
    return null;
  }

  popUpContextMenu(id: string, sampleObject: any) {
    this.sampleId = sampleObject.sampleId;
    this.customerId = sampleObject.customerId;
    if (document.getElementById("contextMenuSelect").style.visibility === "visible" &&
      this.rowSelect == id) {
      document.getElementById("contextMenuSelect").style.visibility = "hidden";
    } else {
      this.rowSelect = id;
      let contextMenu = document.getElementById('contextMenu' + id).getBoundingClientRect();
      let menu = document.getElementById("contextMenuSelect");
      let positionMenu = contextMenu.top + window.scrollY;
      menu.style.visibility = "visible";
      menu.style.top = positionMenu + 'px';
    }
  }

  getSampleStatus() {
    const data = {};
    this.productService.getSampleStatus(data).subscribe(
      (response) => {
        this.status = response
          ? response.data.filter((x) => x.sampleStatusId <= 5)
          : [];
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

  groupLineGet() {
    this.masterProductService.getGroupLine().subscribe(
      (response) => {
        this.productLines = response.data;
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

  serviceCustomers() {
    const data = {
      zones: this.storageService.getGrupId()
        ? this.storageService.getGrupId().zoneIds
        : null,
      salesExecutives: this.storageService.getGrupId()
        ? this.storageService.getGrupId().salesExecutiveGroupIds
        : null,
    };

    this.customerService.getCustomersZone(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.customers = response.data;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
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
      },
      () => { }
    );
  }

  clickImageEvent(imgUrl: string) {
    this.displayFilePreview = true;
    this.imageGaleryBrandDatail = imgUrl;
  }

  dowloadFileXLSX() {
    let datos = this.mapSampleFiler(
      this.currentPage,
      this.pageLenght,
      this.isOninitP,
      this.isfilterParameters
    );
    this.productService.getSamples(datos).subscribe(
      (response) => {
        this.exportAsXLSX(response.data);
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

  exportAsXLSX(sampleListExport: any[]): void {
    let skechtExcel: any[] = [];

    sampleListExport.forEach((s) => {
      let progressStatus: string;
      this.translate
        .get('formsGeneral.progressStatus' + s.semaphoreId)
        .subscribe((res: string) => {
          progressStatus = res;
        });

      skechtExcel.push({
        'Progress status': progressStatus,
        'Sample number': s.sampleNumber,
        'Internal product code': s.internalProductCode,
        'Customer product code': s.customerProductCode,
        Description: s.description,
        'Product line': s.groupLineName,
        Width: s.width,
        Lenght: s.lenght,
        'Sample date': s.sampleDate,
        'Sample request date': s.sampleRequestDate,
        'Promised date': s.promisedDate,
        'Completed date': s.completedDate,
        'Approved requered by': s.approvedRequeredBy,
        'Status name': s.statusName,
      });
    });
    if (this.listSamples.length > 0) {
      this.excelService.exportAsExcelFile(skechtExcel, 'Sample list');
    }
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  printPdfService(event: any): void {
    const parameter = { "sampleId": this.sampleId }
    this.callServicePdfPrint(parameter);
  }


  callServicePdfPrint(sampleId: any): void {
    this.productService.DataSheetGetByIdProduct(sampleId).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            switch (response.data.headerDto.lineId) {
              case 60: 
              this._orilloCortadoService.onCreatePDFSales(response.data, this.sampleId);
              break;
              case 63:
                this._telasService.onCreatePDFSales(response.data, this.sampleId);
                break;
              case 66:
                this.printPdfSales.onCreatePDFSales(response.data, this.sampleId);
                break;
              case 67:
                this._mascarillasTejidasService.onCreatePDFSales(response.data, this.sampleId);
                break;
              case 52:
              case 56:
              case 84:
                this.dataSheetGetByRollo.DatasheetByLine(response.data, this.sampleId)
                break;
              case 64:
                this.dataSheetGetByReatas.onCreatePDFReatas(response.data, this.sampleId);
              break;

              default:
                this.dataSheetGetBySample.DatasheetByLine(response.data);
                break;
            }

          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
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
      },
      () => { }
    );
  }

}
