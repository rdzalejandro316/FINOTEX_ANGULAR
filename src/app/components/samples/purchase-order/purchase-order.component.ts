import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DatepickerComponent } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { SampleDto } from 'src/app/shared/models/sample-dto';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
  providers: [MessageService]
})
export class PurchaseOrderComponent implements OnInit {
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  @ViewChild(DatepickerComponent) datePicker: DatepickerComponent;
  registerFormComment: FormGroup;
  registerFormDecline: FormGroup;
  form: FormGroup;
  showfilters = false;
  items: SampleDto[];
  itemsPaginate: SampleDto[];
  keyword = 'name';
  display: boolean = false;
  requireC: boolean = false;
  showItems: boolean = false;
  displayDecline: boolean = false;
  displayConfirmDecline: boolean = false;
  edit: boolean = false;
  isSetFirstRequiredDate: boolean = false;
  submitted: boolean;
  settingsDates: any;
  sample: any;
  lang = 'en';
  totalRecords: number = 0;
  currentPage: number = 1;
  firstElementPage: number = 0;
  pageLenght = environment.pageLenght;
  progressStatus = [];
  requireColor = [];
  decliningReasons = [];

  itemsBreadcrumb = [
    {label:'menu.Home', url: '/home'},
    {label:'menu.Samples', url: '/home/samples_list/pending'},
    {label:'samples.lblCreatePurchaseOrder', url: '/home/puchase_order', current: true}
  ];

  constructor(private formBuilder: FormBuilder, public translate: TranslateService,
    private productService: ProductService, private messageService: MessageService,
    private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.items = JSON.parse(localStorage.getItem('SamplesItems'));
    this.getForm();
    this.getFormDecline();
    this.llenarSelectores();
    this.SampleRejectionGet();
    this.getFormComment();
    this.totalRecords = this.items ? this.items.length : 0;
    this.itemsPaginate = this.items ? this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght) : [];
    this.sample = JSON.parse(localStorage.getItem('SelectedSampleItem'));
    this.settingsDates = {
      minDate: 0,
      isRange: false,
      required: true,

      dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
      ids: ['requiredDate'],
      labels: 'samples.lblDate'
    };
    if (this.itemsPaginate?.length == 0) {
      this.showPanelDialog();
    }
  }

  onChangeQuantityEvent(event: any) {

    if (event.target.value < 0) {
      this.variationsForm.quantity.setValue(null);
    }
  }

  SampleRejectionGet() {
    const data = {}
    this.productService.SampleRejectionGet(data).subscribe(
      (response) => {
        this.decliningReasons = response.data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getFormComment() {
    return (this.registerFormComment = this.formBuilder.group({
      sample_number: ['', []],
      internal_product_code: ['', []],
      description: ['', []],
      customer_product_code: ['', []],
      product_line: ['', []],
      width: ['', []],
      length: ['', []],
      comments: ['', Validators.required],
    }));
  }

  llenarSelectores(): void {
    this.progressStatus = [
      { name: 'Activo', code: '1' },
      { name: 'Inactivo', code: '0' },
    ];

    this.requireColor = [
      { name: 'Yes', code: '1' },
      { name: 'No', code: '0' },
    ];

  }

  changeRequireColor() {
    if (this.variationsForm.requireC.value == '1') {
      this.requireC = true;
      this.variationsForm.colorVariation.setValidators([Validators.required]);
    } else {
      this.requireC = false;
      this.variationsForm.colorVariation.setValidators([]);
      this.variationsForm.colorVariation.setValue('');
    }
  }

  public showPanelFilter() {
    this.showfilters = !this.showfilters;
  }

  showPanelDialog(edit = false) {
    this.edit = edit;
    if (!this.edit) {
      this.resetForm();
      this.variationsForm.items.setValue('1');
    }
    if (this.variationsForm.customerProductCode.value || this.variationsForm.customerProductCode.value == 'N/A') {
      this.variationsForm.customerProductCode.setValue(this.sample.customerProductCode);
    }

    this.display = true;

    setTimeout(function () {
      if (!this.datePicker) {
        this.datePicker = new DatepickerComponent(this.translate, this.storageService);
      }
      this.settingsDates = {
        minDate: 0,
        isRange: false,
        required: true,

        dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
        ids: ['requiredDate'],
        labels: 'samples.lblDate'
      };
      this.datePicker.settings = this.settingsDates;
      this.datePicker._SingleDatePicker();
    }, 500);
  }

  setFirstRequiredDate() {
    if (this.isSetFirstRequiredDate) {
      this.variationsForm.requiredDate.setValue(null);
      this.isSetFirstRequiredDate = false;
    } else {
      this.items = JSON.parse(localStorage.getItem('SamplesItems'));
      if (this.items.length > 0) {
        this.variationsForm.requiredDate.setValue(this.items[0].requiredDate);
        this.isSetFirstRequiredDate = true;
      }
    }
  }
  showPanelDialogEdit(item: SampleDto) {
    this.resetForm();
    this.variationsForm.sampleId.setValue(item.sampleId);
    this.variationsForm.items.setValue(item.items);
    this.variationsForm.requireC.setValue(item.requireC);
    this.variationsForm.size.setValue(item.size);
    this.variationsForm.colorVariation.setValue(item.colorVariation);
    this.variationsForm.colorObservation.setValue(item.colorObservation);
    this.variationsForm.customerProductCode.setValue(item.customerProductCode);
    this.variationsForm.quantity.setValue(item.quantity);
    this.variationsForm.requiredDate.setValue(item.requiredDate);
    this.showHideItems();
    this.changeRequireColor();
    this.showPanelDialog(true);
  }

  showHideItems() {
    this.showItems = this.variationsForm.items.value == '2';
  }

  getFormDecline() {
    return (this.registerFormDecline = this.formBuilder.group({
      declining_reason: ['', Validators.required],
    }));
  }

  getForm() {
    return (this.form = this.formBuilder.group({
      sampleId: [null, []],
      items: ['1', []],
      requireC: ['', []],
      customerProductCode: ['', []],
      size: ['', []],
      colorVariation: ['', []],
      colorObservation: ['', []],
      quantity: ['', [Validators.required, Validators.min(1)]],
      requiredDate: [null, [Validators.required]]
    }));
  }

  get variationsForm() {
    return this.form.controls;
  }

  addOrEditItem() {
    if (this.edit) {
      this.editItem();
    } else {
      this.addItem();
    }
    this.itemsPaginate = this.items ? this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght) : [];
  }

  addItem() {
    if (this.form.valid) {
      this.items = JSON.parse(localStorage.getItem('SamplesItems'));
      if (!this.items) {
        this.items = new Array<SampleDto>();
      }

      const sample = this.mapSample();
      this.items.push(sample);
      localStorage.setItem('SamplesItems', JSON.stringify(this.items));
      this.totalRecords = this.items.length;
      this.itemsPaginate = this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght);
      this.resetForm();
    }
  }

  resetForm() {
    this.form.reset();
    this.display = false;
    this.changeRequireColor();
    this.showHideItems();
  }

  showDecline() {
    this.display = false;
    this.displayDecline = true;
  }

  get rf() {
    return this.registerFormComment.controls;
  }
  get ad() {
    return this.registerFormDecline.controls;
  }

  showConfirmDecline() {
    const user = this.storageService.getUser();
    let datos = {
      "sampleId": this.sample.sampleId,
      "sampleRejectionId": this.ad.declining_reason.value,
      "companyId": 1,
      "sampleStatusId": 7,
      "samplesNotes": this.rf.comments.value,
      "modifiedByUser": user.username
    }
    this.productService.UpdateStatusBySample(datos).subscribe(
      (response) => {
        this.displayDecline = false;
        this.displayConfirmDecline = true;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  confirmDecline() {
    this.displayConfirmDecline = false;
    this.router.navigate(['home/samples_list/all']);
  }

  mapSample() {
    const sample = new SampleDto();
    sample.sampleId = this.items.length + 1;
    sample.items = this.variationsForm.items.value;
    sample.requireC = this.variationsForm.requireC.value;
    sample.customerProductCode = this.variationsForm.customerProductCode.value ? this.variationsForm.customerProductCode.value : this.sample.customerProductCode;
    sample.size = this.variationsForm.size.value ? this.variationsForm.size.value : 'N/A';
    sample.colorVariation = this.variationsForm.colorVariation.value ? this.variationsForm.colorVariation.value : 'N/A';
    sample.colorObservation = this.variationsForm.colorObservation.value ? this.variationsForm.colorObservation.value : 'N/A';
    sample.quantity = this.variationsForm.quantity.value ? this.variationsForm.quantity.value : 'N/A';
    sample.requiredDate = this.variationsForm.requiredDate.value ? this.variationsForm.requiredDate.value : 'N/A';

    return sample;
  }

  paginate(event) {
    this.currentPage = event.page + 1;
    this.firstElementPage = event.first;
    this.itemsPaginate = this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght);
  }

  removeItem(sampleId) {
    this.items = JSON.parse(localStorage.getItem('SamplesItems'));
    if (sampleId != 0) {
      if (!this.items) {
        this.items = new Array<SampleDto>();
      }
      this.items = this.items.filter(x => x.sampleId != sampleId);
      localStorage.setItem('SamplesItems', JSON.stringify(this.items));
    }
    this.totalRecords = this.items.length;
    this.itemsPaginate = this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght);
  }

  editItem() {
    if (this.form.valid) {
      const sampleId = this.variationsForm.sampleId.value;
      this.items = JSON.parse(localStorage.getItem('SamplesItems'));
      if (sampleId != 0) {
        if (!this.items) {
          this.items = new Array<SampleDto>();
        }
        const itemMap = this.mapSample();
        const itemIndex = this.items.findIndex(x => x.sampleId == sampleId);
        this.items[itemIndex].items = itemMap.items;
        this.items[itemIndex].requireC = itemMap.requireC;
        this.items[itemIndex].customerProductCode = itemMap.customerProductCode;
        this.items[itemIndex].size = itemMap.size;
        this.items[itemIndex].colorVariation = itemMap.colorVariation;
        this.items[itemIndex].colorObservation = itemMap.colorObservation;
        this.items[itemIndex].quantity = itemMap.quantity;
        this.items[itemIndex].requiredDate = itemMap.requiredDate;

        localStorage.setItem('SamplesItems', JSON.stringify(this.items));
        this.resetForm();
      }
    }
  }

}
