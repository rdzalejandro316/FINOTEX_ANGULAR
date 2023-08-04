import { DatePipe } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { SketchService } from 'src/app/core/services/sketch/sketch.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ProfilesService } from 'src/app/core/services/profile/profiles.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-artworks-history',
  templateUrl: './artworks-history.component.html',
  styleUrls: ['./artworks-history.component.css'],
  providers: [MessageService, DatePipe],
})
export class ArtworksHistoryComponent implements OnInit, AfterContentChecked {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  @ViewChild('ngFormFinotex') ngFormFinotex: FormGroupDirective;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.ArtWorks', url: '/home/artworks_history' },
    {
      label: 'artWork.title_principal',
      url: '/home/artworks_history',
      current: true,
    },
  ];

  registerFormComment: FormGroup;
  registerFormFilter: FormGroup;
  registerFormFilterUserFinotex: FormGroup;
  subscription: Subscription;
  showfilters = false;
  showfiltersFinotex = false;
  listSkecht = [];
  keyword = 'name';
  display: boolean = false;
  displayConfirmComment = false;
  indicatorButtonComment = false;
  statusListFilter = [];
  productType = [];
  lang = 'en';
  submitted: boolean;
  sketchStatusId = 0;
  createdByUser = '';
  commentSketchResponse: any = {};
  description = '';
  indicatorButton = false;
  customers = [];
  indicatorCommentPublic = true;
  roleProfileCustomer = true;
  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;
  notDownloadExcel = false;
  statusDefault = [1, 2, 3, 6];
  paramCustomerId: string;

  settingsDates = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['filter_date'],
    labels: 'samples.lblDate',
  };

  settingsDatesFinotex = {
    minDate: new Date(2021, 1 - 1, 1),
    isRange: true,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['filter_date_fonotex'],
    labels: 'samples.lblDate',
  };

  typeOfDate = [];

  progressStatus = [];

  landscape = window.matchMedia("(orientation: landscape)");

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private sketchService: SketchService,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private profilesService: ProfilesService,
    private excelService: ExcelService,
    private ref: ChangeDetectorRef,
  ) {
    this.landscape.addEventListener("change", _ev => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    //From
    this.getFormFilter();
    this.getFormFilterFinotex();
    this.getFormComment();

    //Services
    this.getStatusFilter();
    this.getTypeDate();
    this.loadArtworksInformationByQueryStringParameter();
    this.getProgressStatus();

  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  loadArtworksInformationByQueryStringParameter() {
    this.subscription = this.activatedRoute.paramMap.subscribe((params) => {
      this.paramCustomerId = params.get('customerId');

      if (!this.profilesService.validateUserType()) {
        this.serviceCustomers();
        this.registerFormFilterUserFinotex.patchValue({
          CustomerId:
            this.paramCustomerId != null ? this.paramCustomerId : null,
          RequestNumber: null,
          Description: null,
          Status: this.statusDefault,
          TypeOfDate: null,
          StartDate: null,
          EndDate: null,
          SemaphoreId: null,
          page: this.currentPage,
          limit: this.pageLenght,
          orderBy: 'SketchId',
          ordAscendingerBy: false,
        });
        this.callDefaultArtworks();
      } else {
        this.roleProfileCustomer = false;
        this.registerFormFilter.patchValue({
          CustomerId: this.storageService.getGrup(),
          RequestNumber: null,
          Description: null,
          Status: this.statusDefault,
          TypeOfDate: null,
          StartDate: null,
          EndDate: null,
          SemaphoreId: null,
          page: this.currentPage,
          limit: this.pageLenght,
          orderBy: 'SketchId',
          ordAscendingerBy: false,
        });
        this.callDefaultArtworks();
      }
    });
  }

  getProgressStatus() {
    this.progressStatus = [
      {
        progressStatusId: '1',
        name: '',
      },
      {
        progressStatusId: '2',
        name: '',
      },
      {
        progressStatusId: '3',
        name: '',
      },
      {
        progressStatusId: '4',
        name: '',
      },
    ];

    this.translate.stream('formsGeneral.progressStatus1').subscribe((res: string) => {
      this.progressStatus[0].name = res;
    });

    this.translate.stream('formsGeneral.progressStatus2').subscribe((res: string) => {
      this.progressStatus[1].name = res;
    });

    this.translate.stream('formsGeneral.progressStatus3').subscribe((res: string) => {
      this.progressStatus[2].name = res;
    });

    this.translate.stream('formsGeneral.progressStatus4').subscribe((res: string) => {
      this.progressStatus[3].name = res;
    });

  }

  getTypeDate() {
    this.typeOfDate = [
      {
        code: '1',
        name: '', //'Update date'
      },
      {
        code: '2',
        name: '', //'Promised date'
      },
    ];

    this.translate.stream('artWork.Update_date').subscribe((res: string) => {
      this.typeOfDate[0].name = res;
    });

    this.translate.stream('artWork.Promised_date').subscribe((res: string) => {
      this.typeOfDate[1].name = res;
    });
  }

  getFormComment() {
    return (this.registerFormComment = this.formBuilder.group({
      sketchId: { value: null, disabled: true },
      description: { value: null, disabled: true },
      sketchStatusId: ['', Validators.nullValidator],
      businessId: ['', Validators.nullValidator],
      language: ['', Validators.nullValidator],
      createdByUser: ['', Validators.nullValidator],
      observation: ['', Validators.required],
      sketchObservationId: ['', Validators.nullValidator],
      public: ['', Validators.nullValidator],
      typeComment: ['', Validators.nullValidator],
    }));
  }

  getFormFilter() {
    return (this.registerFormFilter = this.formBuilder.group({
      CustomerId: ['', Validators.nullValidator],
      progress_status: ['', Validators.nullValidator],
      RequestNumber: ['', Validators.nullValidator],
      Description: ['', Validators.nullValidator],
      Status: ['', Validators.nullValidator],
      TypeOfDate: ['', Validators.nullValidator],
      filter_date: ['', Validators.nullValidator],
      StartDate: ['', Validators.nullValidator],
      EndDate: ['', Validators.nullValidator],
      SemaphoreId: ['', Validators.nullValidator],
      businessId: ['', Validators.nullValidator],
      language: ['', Validators.nullValidator],
      page: [0, Validators.nullValidator],
      limit: [10, Validators.nullValidator],
      orderBy: ['', Validators.nullValidator],
      ordAscendingerBy: [false, Validators.nullValidator],
    }));
  }

  getFormFilterFinotex() {
    return (this.registerFormFilterUserFinotex = this.formBuilder.group({
      CustomerId: ['', Validators.nullValidator],
      Status: ['', Validators.nullValidator],
      TypeOfDate: ['', Validators.nullValidator],
      Description: ['', Validators.nullValidator],
      RequestNumber: ['', Validators.nullValidator],
      filter_date_fonotex: ['', Validators.nullValidator],
      StartDate: ['', Validators.nullValidator],
      EndDate: ['', Validators.nullValidator],
      businessId: ['', Validators.nullValidator],
      language: ['', Validators.nullValidator],
      page: [0, Validators.nullValidator],
      limit: [10, Validators.nullValidator],
      orderBy: ['', Validators.nullValidator],
      ordAscendingerBy: [false, Validators.nullValidator],
    }));
  }

  openNewComment(): void {
    this.router.navigate(['home/artworks_new', 'add']);
  }

  showDetails(skecht: any): void {
    this.router.navigate(['home/artworks_details', skecht.sketchId]);
  }

  showEdit(skecht: any): void {
    this.router.navigate(['home/artworks_edit', skecht.sketchId]);
  }

  closeConfirmation(): void {
    this.displayConfirmComment = false;
  }

  onSubmitCommet(): void {
    this.display = false;
    this.indicatorButtonComment = true;
    const user = this.storageService.getUser();
    this.createdByUser = user.username;
    this.registerFormComment.patchValue({
      sketchObservationId: 0,
      public:
        this.registerFormComment.get('public').value == '1' ? true : false,
      createdByUser: this.createdByUser,
      sketchStatusId: this.sketchStatusId,
    });

    this.sketchService
      .saveCommentSketch(this.registerFormComment.getRawValue())
      .subscribe(
        (response) => {
          if (response.status) {
            this.displayConfirmComment = true;
            this.commentSketchResponse = response.data;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          this.indicatorButtonComment = false;
        },
        () => {
          this.indicatorButtonComment = false;
        }
      );
  }

  public showPanelFilter() {
    if (!this.profilesService.validateUserType()) {
      this.showfiltersFinotex = !this.showfiltersFinotex;
    } else {
      this.showfilters = !this.showfilters;
    }
  }

  showPanelDialog(dato: any) {
    this.display = true;
    this.registerFormComment.reset();
    this.registerFormComment.patchValue({
      sketchId: dato.sketchId,
      description: dato.sketchName,
    });
    this.sketchStatusId = dato.sketchStatusId;
    this.createdByUser = dato.createdByUser;
    this.description = dato.sketchName;
    this.registerFormComment.get('public').setValue('1');
    if (this.profilesService.validateUserType()) {
      this.indicatorCommentPublic = false;
    }
  }

  getStatusFilter() {
    this.sketchService.getAllStatusSketch().subscribe(
      (response) => {
        if (response) {
          this.statusListFilter = response.data;
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

  sketchFilterService(): void {
    this.indicatorButton = true;
    let parameterFilter: any;
    if (!this.profilesService.validateUserType()) {
      parameterFilter = this.registerFormFilterUserFinotex.value;
    } else {
      parameterFilter = this.registerFormFilter.value;
    }

    this.sketchService.sketchFilter(parameterFilter).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listSkecht = response.data;
            this.totalRecords = response.quantity;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.listSkecht = [];
          this.totalRecords = 0;
          this.translate
            .stream('general.msgDetailResponse')
            .subscribe((res: string) => {
              this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
            });
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

  filterStatus(id: number): string {
    const filtro = this.statusListFilter.filter((lista) => lista.sketchStatusId === id);
    return filtro[0].sketchStatusName;
  }

  public formatDate(fecha: any) {
    moment.locale(this.storageService.getLanguage());
    return moment(fecha, 'YYYY-MM-DD').format('MMM/DD/YYYY');
  }

  clearFilter() {
    this.registerFormFilter.reset();
  }

  clearFilterFinotex() {
    this.registerFormFilterUserFinotex.reset();
  }

  onSubmitFilter(): void {
    moment.locale(this.storageService.getLanguage());

    this.registerFormFilter.patchValue({
      CustomerId: this.storageService.getGrup(),
      RequestNumber: this.registerFormFilter.get('RequestNumber').value
        ? this.registerFormFilter.get('RequestNumber').value
        : null,
      Description: this.registerFormFilter.get('Description').value
        ? this.registerFormFilter.get('Description').value
        : null,
      Status: this.registerFormFilter.get('Status').value
        ? this.registerFormFilter.get('Status').value
        : null,
      TypeOfDate: this.registerFormFilter.get('TypeOfDate').value
        ? this.registerFormFilter.get('TypeOfDate').value
        : null,
      StartDate: this.registerFormFilter.get('filter_date').value
        ? moment(
          this.registerFormFilter
            .get('filter_date')
            .value.split(' - ')[0],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 00:00:01'
        : null,
      EndDate: this.registerFormFilter.get('filter_date').value
        ? moment(
          this.registerFormFilter
            .get('filter_date')
            .value.split(' - ')[1],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 23:59:59'
        : null,
      SemaphoreId: this.registerFormFilter.get('progress_status').value
        ? this.registerFormFilter.get('progress_status').value
        : null,
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'SketchId',
      ordAscendingerBy: false,
    });

    this.sketchFilterService();
  }

  onSubmitFilterFinotex(): void {
    moment.locale(this.storageService.getLanguage());
    this.registerFormFilterUserFinotex.patchValue({
      CustomerId: this.registerFormFilterUserFinotex.get('CustomerId').value
        ? this.registerFormFilterUserFinotex.get('CustomerId').value
        : null,
      RequestNumber: this.registerFormFilterUserFinotex.get('RequestNumber')
        .value
        ? this.registerFormFilterUserFinotex.get('RequestNumber').value
        : null,
      Description: this.registerFormFilterUserFinotex.get('Description').value
        ? this.registerFormFilterUserFinotex.get('Description').value
        : null,
      Status: this.registerFormFilterUserFinotex.get('Status').value
        ? this.registerFormFilterUserFinotex.get('Status').value
        : null,
      TypeOfDate: this.registerFormFilterUserFinotex.get('TypeOfDate').value
        ? this.registerFormFilterUserFinotex.get('TypeOfDate').value
        : null,
      StartDate: this.registerFormFilterUserFinotex.get('filter_date_fonotex')
        .value
        ? moment(
          this.registerFormFilterUserFinotex
            .get('filter_date_fonotex')
            .value.split(' - ')[0],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 00:00:01'
        : null,
      EndDate: this.registerFormFilterUserFinotex.get('filter_date_fonotex')
        .value
        ? moment(
          this.registerFormFilterUserFinotex
            .get('filter_date_fonotex')
            .value.split(' - ')[1],
          'MMM/DD/YYYY'
        ).format('YYYY-MM-DD') + ' 23:59:59'
        : null,
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'SketchId',
      ordAscendingerBy: false,
    });
    this.sketchFilterService();
  }

  serviceCustomers() {
    const data = {
      zones: this.storageService.getGrupId() ? this.storageService.getGrupId().zoneIds : null,
      salesExecutives: this.storageService.getGrupId() ? this.storageService.getGrupId().salesExecutiveGroupIds : null,
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

  downloadFileDesigner(sketchId: any) {
    let designerFile: any;
    const data = {
      sketchId: sketchId,
    };
    this.sketchService.downloadFileDesigner(data).subscribe(
      (response) => {
        if (response.status) {
          designerFile = response.data;
          this.downloadFile(designerFile);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
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

  downloadFile(file: { fileTemporal: string; fileName: string; }) {
    if (file) {
      const link = document.createElement('a');
      if (file.fileTemporal) {
        link.href = file.fileTemporal;
        link.download = file.fileName;
        link.click();
      }
    }
  }

  paginate(event: { page: number; rows: number; }) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    if (!this.profilesService.validateUserType()) {
      this.onSubmitFilterFinotex();
    } else {
      this.onSubmitFilter();
    }
  }

  callDefaultArtworks() {
    this.sketchFilterService();
  }

  exportAsXLSX(): void {
    let skechtExcel: any[] = [];

    this.listSkecht.map((s) => {
      skechtExcel.push({
        'Progress status': '',
        'Request number': s.sketchId,
        Description: s.sketchName,
        'Creation date': s.creationDate,
        Status: this.filterStatus(s.sketchStatusId),
        Days: s.days,
        'Product type': s.groupLineName,
        'Update user': s.modifiedByUser,
        Date: s.modifiedDate,
        Designer: s.designerName,
        'Promised date': s.promisedDate,
      });
    });
    this.notDownloadExcel = !(this.listSkecht.length > 0)!;
    if (this.listSkecht.length > 0) {
      this.excelService.exportAsExcelFile(skechtExcel, 'Artworks History');
    }
  }

  onSubmitFilterSearch(data: string) {
    const formDataFilterSearch = {
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: '',
      ordAscendingerBy: true,
      textToFilter: data,
    };

    this.sketchService.getSketchBasic(formDataFilterSearch).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listSkecht = response.data;
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

  reloadTableConfiguration(): void {
    $(function () {
      var configuration = {
        destroy: true,
        retrieve: true,
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
    });
  }

}
