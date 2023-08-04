import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { TechinicalService } from 'src/app/core/services/technical-sheets/techinical.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { ProductService } from 'src/app/core/services/product/product.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { addSample } from 'src/app/store/actions/sample.actions';

@Component({
  selector: 'app-general-data-of-sample',
  templateUrl: './general-data-of-sample.component.html',
  styleUrls: ['./general-data-of-sample.component.css'],
  providers: [MessageService, DatePipe],
})
export class GeneralDataOfSampleComponent implements OnInit {

  @Output() checkValueAutomatic: EventEmitter<any> = new EventEmitter();
  @Input() paramCustomerId: string = "";
  @Input() paramSampleId: string = "";
  @Output() paramProductionPlanId = new EventEmitter<number>();
  @Output() paramSampleQuantity = new EventEmitter<number>();
  @Output() paramZone = new EventEmitter<number>();
  @Output() productId = new EventEmitter<string>();
  registerFormSesionOne: FormGroup;

  formOneIconStatusOne = 2;
  formOneStatusTextOne = "";
  lang = 'en';

  ListApprovalType = [];
  ListProductionPlan = [];
  ListSampleStatus = [];

  settingsCreationDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['CreationDate'],
    labels: 'artWork.creationDate',
  };
  designerList: any = [];

  settingsReceptionDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['ReceptionDate'],
    labels: 'technical-sheets.receptionDate',
  };

  settingsRequestDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['RequestDate'],
    labels: 'technical-sheets.requestDate',
  };

  settingsPromisedDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['PromisedDate'],
    labels: 'technical-sheets.promisedDate',
  };

  settingsCompletedDate = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['CompletedDate'],
    labels: 'technical-sheets.completedDate',
  };
  public href: string = "";
  public details: boolean = false;
  public edit:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private techinicalService: TechinicalService,
    private messageService: MessageService,
    private translate: TranslateService,
    private productService: ProductService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    moment.locale(this.storageService.getLanguage());
    this.lang = this.storageService.getLanguage();
    this.getFormSessionOne();
    this.readactiondetail();
    this.readactionedit();
    this.validateFormStatus();
    this.approvalGetService();
    this.productionPlantGetService();
    this.sampleGetparamSampleIdService(this.paramSampleId);
    this.customerGetByIdCurrencyService(this.paramCustomerId);
    this.sampleStatusGetService();
  }

  getFormSessionOne(): FormGroup {
    return (this.registerFormSesionOne = this.formBuilder.group({
      Customer: { value: null, disabled: true },
      Currency: { value: null, disabled: true },
      Sample_number: { value: null, disabled: true },
      ReceptionDate: ['', Validators.required],
      CreationDate: { value: null, disabled: true },
      Form_number: ['', Validators.required],
      Purchase_order: ['', Validators.required],
      Approval_type: ['', Validators.required],
      RequestDate: ['', Validators.required],
      PromisedDate: { value: null, disabled: true },
      CompletedDate: { value: null, disabled: true },
      Sample_status: { value: null, disabled: true },
      Production_plan: ['', Validators.required],
      User_Id: { value: null, disabled: true },
      Code: ['', Validators.nullValidator],
      Print: ['', Validators.nullValidator],
      Note: ['', Validators.nullValidator],
    }));
  }

  validateFormStatus(): void {
    this.formOneIconStatusOne = (this.registerFormSesionOne.valid == true) ? 1 : 2;
    this.formOneStatusTextOne = (this.registerFormSesionOne.valid == true) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";

    this.registerFormSesionOne.valueChanges.subscribe(value => {
      this.formOneIconStatusOne = (this.registerFormSesionOne.valid == true) ? 1 : 2;
      this.formOneStatusTextOne = (this.registerFormSesionOne.valid == true) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
    });
  }

  customerGetByIdCurrencyService(customerId: string): void {
    const data = { customerId: customerId };
    this.techinicalService.customerGetByIdCurrency(data).subscribe(
      (response) => {
        if (response) {
          this.paramZone.emit(response.data.zoneName);
          if (response.status) {
            this.registerFormSesionOne.patchValue({
              Customer: response.data.customerName,
              Currency: response.data.currencyName,
              CreationDate: moment(new Date(), 'YYYY-MM-DD').format('MMM/DD/YYYY'),
              Sample_number: response.data.sampleId,
              Sample_status: 2,
              RequestDate: moment(response.data.promisedDate, 'YYYY-MM-DD').format('MMM/DD/YYYY'),
              PromisedDate: moment(response.data.promisedDate, 'YYYY-MM-DD').format('MMM/DD/YYYY'),
              User_Id: this.storageService.getUser().username
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }

      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  sampleGetparamSampleIdService(sampleId: string): void {
    const data = {
      "sampleId": sampleId,
      "companyId": this.storageService.getProfiles().businessId
    };

    if (this.edit || this.details){
    this.productService.getSampleById(data).subscribe(

      (response) => {
        this.store.dispatch(addSample({ sample:response.data }));
        if (response) {
          this.registerFormSesionOne.patchValue({
            ReceptionDate: moment(response.data.placementDate, 'YYYY-MM-DD').format('MMM/DD/YYYY'),
            Form_number: response.data.formNumber,
            Purchase_order: response.data.purchaseNumber,
            Approval_type: response.data.sampleApprovalTypeId,
            RequestDate: moment(response.data.promisedDate, 'YYYY-MM-DD').format('MMM/DD/YYYY'),
            Sample_status: response.data.sampleStatusId,
            Production_plan: response.data.plantId,
            Code: response.data.fulfilledManual == 'N' ? false : true,
            Print: response.data.samplePendingToPrint == 'N' ? false : true,
            Note: response.data.samplesNotes
          });
          this.productId.emit(response.data.productId);
          this.paramProductionPlanId.emit(response.data.plantId);
          this.paramSampleQuantity.emit(response.data.sampleQuantity);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
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
      }
    );
    }


  }

  approvalGetService(): void {
    this.techinicalService.approvalGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListApprovalType = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  productionPlantGetService(): void {
    this.techinicalService.productionPlantGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListProductionPlan = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }

      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  changeProductionPlan(event: any): void {
    this.paramProductionPlanId.emit(event.value);
  }

  sampleStatusGetService(): void {
    this.techinicalService.sampleStatusGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListSampleStatus = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }

      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  checkValue(event: any) {
    this.checkValueAutomatic.emit(event.checked);
  }

  public readactiondetail() {
    this.router.url.includes('detail') ? (this.formsetdetails(), this.details = true,this.inactiveeditother()) : false;
  }

  public readactionedit() {
    return this.router.url.includes('edit') ? (this.inactiveeditother(),this.edit=true): false;
  }

  public formsetdetails() {
    Object.keys(this.registerFormSesionOne.controls).forEach((key, index) => {
      this.registerFormSesionOne.get(key).disable();
    });
  }

    //se realiza para el momento de editar no se deje cambiar itemcode
    public inactiveeditother(){
      this.registerFormSesionOne.get('Code').disable();
    }

    validateMaxLen($event: any, maxLength: number): boolean {
      return $event.target.value.length != maxLength;
    }
}
