import * as moment from 'moment';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { ProductDto } from 'src/app/shared/models/producto-dto';
import { environment } from 'src/environments/environment';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-samples-list',
  templateUrl: './samples-list.component.html',
  styleUrls: ['./samples-list.component.css'],
  providers: [MessageService],
})
export class SamplesListComponent implements OnInit {
  registerFormComment: FormGroup;
  registerFormDecline: FormGroup;
  registerFormSimpleComment: FormGroup;
  indicatorButton = false;
  products = new Array<ProductDto>();
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  selectedProgressStatus: string;
  display: boolean = false;
  displayComment: boolean = false;
  displayDecline: boolean = false;
  displayConfirmDecline: boolean = false;
  displayConfirmApproved: boolean = false;
  displayFilePreview: boolean = false;
  urlImage: string = '';
  filterForm: FormGroup;
  submitted: boolean;
  samplesList: any[] = [];
  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  sample: any;
  lang = 'en';
  paramCustomerId: string;
  settingsDates: any = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['date'],
    labels: 'samples.lblDate',
  };

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home', current: false },
    { label: 'menu.Samples', url: '/home/samples_list/', current: false },
    { label: 'All sample', url: '/home/samples_list/add', current: true },
  ];

  route = '';
  status = [];
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
  showfilters = false;
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
  samples = [
    {
      code: '1',
      name: 'All samples',
    },
    {
      code: '2',
      name: 'Developing samples',
    },
    {
      code: '3',
      name: 'Pending samples',
    },
  ];
  productLines = [];
  decliningReasons = [];
  subscription: Subscription;
  action: boolean;
  actionDescription: string;
  actionTraduction: string;
  tabla: any;
  displayConfirmComment = false;
  commentResponse: any = {};
  commentDialog = '';

  landscape = window.matchMedia('(orientation: landscape)');

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private storageService: StorageService,
    private excelService: ExcelService,
    private translate: TranslateService,
    private masterProductService: MasterProductService,
    private activatedRoute: ActivatedRoute
  ) {
    this.landscape.addEventListener('change', (_ev) => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    this.getForm();
    this.getFormDecline();
    this.getCommentForm();
    this.route = this.router.url;
    this._InitForms();
    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      this.setTranslateTitle(params.get('action'), params.get('customerId'));
    });

    this.SampleRejectionGet();
    this.groupLineGet();
    this.getSampleStatus();
    $(function () {
      $('#search input').css('border-radius', '10px 0px 0px 10px ');
    });
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
                return col.hidden
                  ? '<div class="col-12 col-md-3 mb-2" >' +
                      '<label>' +
                      col.title +
                      '</label> ' +
                      '<input type="text" value="' +
                      col.data +
                      '" readonly class="form-control p-inputtext"/>' +
                      '</div>'
                  : '';
              }).join('');

              return data ? $('<div class="row"/>').append(data) : false;
            },
          },
        },
      };
      $('#allTable').DataTable(configuration).draw();
      $('#developingTable').DataTable(configuration).draw();
      $('#pendingTable').DataTable(configuration).draw();
    });
  }

  changeAtcivePageInBreadcrumb(traduction: string, activePage: string) {
    this.actionTraduction = traduction;
    this.itemsBreadcrumb.forEach((value, index) => {
      if (value.current) {
        this.itemsBreadcrumb.splice(index, 1);
      }
    });
    this.itemsBreadcrumb.push({
      label: traduction,
      url: `/home/samples_list/${activePage}`,
      current: true,
    });
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
      () => {}
    );
  }

  setTranslateTitle(action: string, customerId: string) {
    this.action = action == 'all';
    this.actionDescription = action;
    this.paramCustomerId = customerId;
    this.resetFilterForm();
    this.onSubmitFilter(this.pageLenght);
    switch (this.actionDescription) {
      case 'pending':
        this.translate.get('menu.PendingSamples').subscribe((res: string) => {
          this.changeAtcivePageInBreadcrumb(res, this.actionTraduction);
        });
        break;
      case 'developing':
        this.translate
          .get('menu.DevelopingSamples')
          .subscribe((res: string) => {
            this.changeAtcivePageInBreadcrumb(res, this.actionTraduction);
          });
        break;
      default:
        this.translate.get('menu.AllSamples').subscribe((res: string) => {
          this.changeAtcivePageInBreadcrumb(res, this.actionTraduction);
        });
        break;
    }
  }

  SampleRejectionGet() {
    const data = {};
    this.productService.SampleRejectionGet(data).subscribe(
      (response) => {
        this.decliningReasons = response.data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }

  get filterControlsForm() {
    return this.filterForm.controls;
  }
  get registerControlFormComment() {
    return this.registerFormComment.controls;
  }
  get registerControlFormSimpleComment() {
    return this.registerFormSimpleComment.controls;
  }
  get registerDeclineFormDecline() {
    return this.registerFormDecline.controls;
  }
  private _InitForms() {
    this.filterForm = this.formBuilder.group({
      samples_list: [null, []],
      progress_status: [null, []],
      sample_number: ['', []],
      internal_product_code: ['', []],
      customer_product_code: ['', []],
      description: ['', []],
      product_line: [null, []],
      width: ['', []],
      length: ['', []],
      status: [null, []],
      type_date: [null, []],
      date: ['', []],
    });
  }

  mapSampleFiler(page: number, limit: number) {
    let selected_sample_list: number;
    switch (this.actionDescription) {
      case 'all':
        selected_sample_list = this.filterControlsForm.samples_list.value
          ? Number(this.filterControlsForm.samples_list.value)
          : null;
        break;
      case 'pending':
        selected_sample_list = 3;
        break;
      case 'developing':
        selected_sample_list = 2;
        break;
      default:
        selected_sample_list = null;
        break;
    }

    moment.locale(this.storageService.getLanguage());
    return {
      page: 1,
      limit: limit,
      orderBy: 'Width',
      ascending: true,
      semaphoreId: this.filterControlsForm.progress_status.value
        ? Number(this.filterControlsForm.progress_status.value.code)
        : null,
      sampleList: selected_sample_list == 1 ? null : selected_sample_list,
      sampleNumber: this.filterControlsForm.sample_number.value
        ? Number(this.filterControlsForm.sample_number.value)
        : null,
      internalProductCode: this.filterControlsForm.internal_product_code.value,
      customerProductCode: this.filterControlsForm.customer_product_code.value,
      description: this.filterControlsForm.description.value,
      productLine: this.filterControlsForm.product_line.value
        ? Number(this.filterControlsForm.product_line.value)
        : null,
      width: this.filterControlsForm.width.value
        ? Number(this.filterControlsForm.width.value)
        : null,
      lenght: this.filterControlsForm.length.value
        ? Number(this.filterControlsForm.length.value)
        : null,
      status: this.filterControlsForm.status.value
        ? Number(this.filterControlsForm.status.value)
        : null,
      typeOfDate: this.filterControlsForm.type_date.value
        ? Number(this.filterControlsForm.type_date.value)
        : null,
      startDate: this.filterControlsForm.date.value
        ? moment(
            this.filterControlsForm.date.value.split(' - ')[0],
            'MMM/DD/YYYY'
          ).format('YYYY-MM-DD') + ' 00:00:01'
        : null,
      endDate: this.filterControlsForm.date.value
        ? moment(
            this.filterControlsForm.date.value.split(' - ')[1],
            'MMM/DD/YYYY'
          ).format('YYYY-MM-DD') + ' 23:59:59'
        : null,
    };
  }

  paginate(event) {
    this.currentPage = event.page + 1;
    this.onSubmitFilter(event.rows);
  }

  resetFilterForm() {
    this.filterForm.reset();
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
      () => {}
    );
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
  }

  showPanelDialog(dato: any) {
    this.display = true;
    localStorage.setItem('SelectedSampleItem', JSON.stringify(dato));
    this.registerFormComment.reset();
    this.sample = dato;
    localStorage.setItem('sampleSelect', JSON.stringify(dato));
    this.registerFormComment.patchValue({
      sample_number: dato.sampleNumber,
      internal_product_code: dato.internalProductCode,
      description: dato.description,
      customer_product_code: dato.customerProductCode,
      product_line: dato.groupLineName,
      width: dato.width,
      length: dato.lenght,
    });
  }

  onSubmitFilter(limit: number): void {
    this.indicatorButton = true;
    let datos = this.mapSampleFiler(this.currentPage, limit);
    this.productService.getSamples(datos).subscribe(
      (response) => {
        if (response) {
          this.samplesList = response.data;
          this.samplesList.forEach((x) => {
            x.imageUrl =
              'https://upload.wikimedia.org/wikipedia/commons/b/b0/Zumba.png';
          });
          this.totalRecords = response.quantity;
        } else {
          this.totalRecords = 0;
          this.samplesList = [];
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

  showPanelCommentDialog(dato: any) {
    this.displayComment = true;
    localStorage.setItem('SelectedSampleItem', JSON.stringify(dato));
    this.registerFormSimpleComment.reset();
    this.sample = dato;
    localStorage.setItem('sampleSelect', JSON.stringify(dato));
    this.registerFormSimpleComment.patchValue({
      sample_number: dato.sampleNumber,
      description: dato.description,
    });
  }

  showDecline() {
    this.display = false;
    this.displayDecline = true;
    this.registerDeclineFormDecline.declining_reason.setValue(null);
  }

  showConfirmDecline() {
    this.displayDecline = false;
    const user = this.storageService.getUser();
    let datos = {
      sampleId: this.sample.sampleId,
      sampleRejectionId: this.registerDeclineFormDecline.declining_reason.value,
      companyId: 1,
      sampleStatusId: 7,
      samplesNotes: this.registerControlFormComment.comments.value,
      modifiedByUser: user.username,
      internalProductCode: this.sample.internalProductCode,
      customerProductCode: this.sample.customerProductCode,
      description: this.sample.description,
      groupLine: this.sample.groupLineName,
    };
    this.productService.UpdateStatusBySample(datos).subscribe(
      (response) => {
        this.displayDecline = false;
        this.displayConfirmDecline = true;
        this.onSubmitFilter(this.pageLenght);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }
  finalizeDecline() {
    this.displayConfirmDecline = false;
    window.location.reload();
  }
  showConfirmApproved() {
    const user = this.storageService.getUser();
    this.display = false;
    let datos = {
      sampleId: this.sample.sampleId,
      companyId: 1,
      sampleStatusId: 6,
      samplesNotes: this.registerControlFormComment.comments.value,
      modifiedByUser: user.username,
      internalProductCode: this.sample.internalProductCode,
      customerProductCode: this.sample.customerProductCode,
      description: this.sample.description,
      groupLine: this.sample.groupLineName,
    };
    this.productService.UpdateStatusBySample(datos).subscribe(
      (response) => {
        this.displayConfirmApproved = true;
        this.onSubmitFilter(this.pageLenght);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {}
    );
  }
  finalizeConfirmApproved() {
    this.displayConfirmApproved = false;
    window.location.reload();
  }

  getFormDecline() {
    this.registerFormDecline = this.formBuilder.group({
      declining_reason: ['', Validators.required],
    });
    return this.registerFormDecline;
  }

  getForm() {
    this.registerFormComment = this.formBuilder.group({
      sample_number: ['', []],
      internal_product_code: ['', []],
      description: ['', []],
      customer_product_code: ['', []],
      product_line: ['', []],
      width: ['', []],
      length: ['', []],
      comments: ['', Validators.required],
    });
    return this.registerFormComment;
  }

  getCommentForm() {
    this.registerFormSimpleComment = this.formBuilder.group({
      sample_number: ['', []],
      description: ['', []],
      comments: ['', Validators.required],
    });
    return this.registerFormSimpleComment;
  }

  onSubmitCommet() {
    this.displayComment = false;
    let datos = {
      sampleId: this.sample.sampleId,
      description: this.sample.description,
      observations: this.registerFormSimpleComment.get('comments').value,
      internalProductCode: this.sample.internalProductCode,
      customerProductCode: this.sample.customerProductCode,
      groupLine: this.sample.groupLineName,
      statusName: this.sample.statusName,
    };
    this.productService.sendSampleObservationEmail(datos).subscribe(
      (response) => {
        this.commentDialog =
          this.registerFormSimpleComment.get('comments').value;
        this.commentResponse = response.data;
        this.displayConfirmComment = true;
      },
      (error) => {
        this.displayComment = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => {
        this.displayComment = false;
      }
    );
  }

  downloadFilterData() {
    let datos = this.mapSampleFiler(1, this.totalRecords);
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
      () => {}
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
    if (this.samplesList.length > 0) {
      this.excelService.exportAsExcelFile(skechtExcel, 'Sample list');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewFileData(img: any) {
    this.urlImage = img;
    this.displayFilePreview = true;
  }
}
