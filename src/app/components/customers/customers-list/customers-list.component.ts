import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/core/services/excel/excel.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { DatepickerComponent } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { CustomerFilterResult } from 'src/app/shared/models/customer-filter-result';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';

declare var $: any;

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
  providers: [MessageService]
})
export class CustomersListComponent implements OnInit {

  @ViewChild('ngForm') ngForm: FormGroupDirective;
  @ViewChild(DatepickerComponent) datePicker: DatepickerComponent;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.CustomersHistory', url: '/home/customers_list/add', current: true }
  ];

  registerFormFilter: FormGroup;
  showfilters: boolean;
  lang = 'en';
  submitted: boolean;

  zoneList: any = [];
  salesExecutivesList: any = [];
  customerStatusList: any = [];
  customerListFilter: any = [];

  customersListTable: CustomerFilterResult[] = [];
  indicatorButton = false;
  totalRecords: number = 0;
  currentPage: number = 1;
  pageLenght = environment.pageLenght;

  artworks: boolean = false;
  sample: boolean = false;
  order: boolean = false;
  filterName: string = "";

  state = "";
  customerName = "";
  zoneName = "";
  salesExecutiveName = "";
  customerCode = "";

  constructor(
    private excelService: ExcelService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private storageService: StorageService,) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!$(event.target).hasClass('fa-plus')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i: number;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  ngOnInit(): void {
    this.getFormFilter();
    $(function () {
      $('#search input').css('border-radius', '10px 0px 0px 10px');
    });
    this.getCustomerStatus();
    this.getSalesExecutives();
    this.getZones();
    this.getCustomersListFilter();
    this.getCustomersListTable();
    this.getTranslations();
  }

  getCustomersListFilter(): void {
    const data = {
      zones: this.storageService.getGrupId().zoneIds,
      salesExecutives: this.storageService.getGrupId().salesExecutiveGroupIds
    }
    this.customerService.getCustomersZone(data).subscribe(
      (response) => {
        if (response.status) {
          this.customerListFilter = response.data;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getCustomersListTable(): void {
    this.onSubmitFilter();
  }

  getCustomerStatus(): void {
    this.customerService.getCustomerStatus().subscribe(
      (response) => {
        if (response) {
          let statusResponse = response.data;
          this.customerStatusList = statusResponse.filter((x) => x.customerStatusId == 0 || x.customerStatusId == 1 || x.customerStatusId == 8);
        }
        else {
          this.customerStatusList = [];
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
      }
    );
  }

  getSalesExecutives(): void {
    this.customerService.getSalesExecutives().subscribe(
      (response) => {
        if (response) {
          this.salesExecutivesList = response.data;
        }
        else {
          this.salesExecutivesList = [];
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
      }
    );
  }

  getZones(): void {
    this.customerService.getZones()
      .subscribe(
        (response) => {
          if (response) {
            this.storageService.getGrupId().zoneIds.forEach((currentValue, index) => {
              response.data.forEach((zones, index) => {
                if (currentValue == zones.zoneId) {
                  this.zoneList.push(zones)
                }
              });
            });
          }
          else {
            this.zoneList = [];
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
        }
      );
  }

  getFormFilter() {
    return (this.registerFormFilter = this.formBuilder.group({
      page: [0, Validators.nullValidator],
      limit: [10, Validators.nullValidator],
      orderBy: ['', Validators.nullValidator],
      ascending: [true, Validators.nullValidator],
      customerCode: ['', Validators.nullValidator],
      customerId: ['', Validators.nullValidator],
      zoneId: ['', Validators.nullValidator],
      salesExecutiveId: ['', Validators.nullValidator],
      customerStatusId: ['', Validators.nullValidator],
      salesExecutives: ['', Validators.nullValidator],
      zones: ['', Validators.nullValidator],
    }));
  }

  popUpContextMenu(customerId: string) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i: number;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    document.getElementById(customerId).classList.toggle("show");
  }

  onSubmitFilter() {
    this.registerFormFilter.patchValue({
      page: this.currentPage,
      limit: this.pageLenght,
      orderBy: 'CustomerId',
      ascending: true,
      zones: this.storageService.getGrupId().zoneIds,
      salesExecutives: this.storageService.getGrupId().salesExecutiveGroupIds
    });
    this.indicatorButton = true;
    this.customerService.getCustomersFilter(this.registerFormFilter.value).subscribe(
      (response) => {
        if (response) {
          this.customersListTable = response.data;
          this.totalRecords = response.quantity;
        }
        else {
          this.customersListTable = [];
          this.totalRecords = 0;
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
      }
    );
  }

  customerFilter() {
    this.customerService
      .getCustomersFilter(this.registerFormFilter.value)
      .subscribe(
        (response) => {
          if (response.status) {
            this.customersListTable = response.data;
            this.customersListTable = this.customersListTable.filter((x) => x.customerName.includes(this.filterName))
            if (this.customersListTable.length == 0) {
              this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
              });
            }
            this.totalRecords = response.quantity;
          }
          else {
            this.customersListTable = [];
            this.totalRecords = 0;
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
        }
      );
  }

  exportAsXLSX() {
    let excelData: any[] = [];
    if (this.customersListTable.length > 0) {
      this.customersListTable.map((data) => {
        excelData.push({
          [this.state]: data.customerStatusName,
          [this.customerName]: data.customerName,
          [this.zoneName]: data.zoneName,
          [this.salesExecutiveName]: data.salesExecutiveName,
          [this.customerCode]: data.customerCode,
        });
      });
      this.excelService.exportAsExcelFile(excelData, 'Customers');
    }
  }

  getTranslations() {
    this.translate.stream('artWork.status').subscribe((res: string) => {
      this.state = res;
    });
    this.translate.stream('artWork.Customer').subscribe((res: string) => {
      this.customerName = res;
    });
    this.translate.stream('artWork.Zone').subscribe((res: string) => {
      this.zoneName = res;
    });
    this.translate.stream('artWork.Salesexecutive').subscribe((res: string) => {
      this.salesExecutiveName = res;
    });
    this.translate.stream('artWork.Customercode').subscribe((res: string) => {
      this.customerCode = res;
    });
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
    if (this.showfilters) {
      $('.main').css('margin-top', '16px');
    } else {
      $('.main').css('margin-top', '0px');
    }
  }

  clearFilter() {
    this.registerFormFilter.reset();
  }

  paginate(event) {
    this.currentPage = event.page + 1;
    this.pageLenght = event.rows;
    this.onSubmitFilter();
  }

  getSemaphore(item: CustomerFilterResult): number {
    let semaphoreId: number;
    switch (item.customerStatusId) {
      case 0:
        semaphoreId = 1;
        this.artworks = true;
        this.sample = true;
        this.order = true;
        break;
      case 1:
        semaphoreId = 3;
        this.artworks = true;
        this.sample = false;
        this.order = false;
        break;
      default:
        semaphoreId = 2;
        this.artworks = true;
        this.sample = false;
        this.order = false;
        break;
    }
    this.translate.get('customer.semaphoreStatus' + semaphoreId).subscribe((res: string) => {
      item.customerStatusName = res;
    });
    return semaphoreId;
  }
}


