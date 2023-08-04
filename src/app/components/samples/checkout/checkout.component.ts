import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { MasterSalesService } from 'src/app/core/services/master-sales/master-sales.service';
import { ShippingMasterService } from 'src/app/core/services/shipping-master/shipping-master.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ProductService } from 'src/app/core/services/product/product.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { ProductPriceDto } from 'src/app/shared/models/product-price-dto';
import { SampleDto } from 'src/app/shared/models/sample-dto';
import { environment } from 'src/environments/environment';
import { SampleCombinationDto } from 'src/app/shared/models/sample-combination';
import * as moment from 'moment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  customerCode: string;
  submitted: boolean;
  subtotal: number;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  lang = 'es';
  items: SampleDto[];
  itemsPaginate: SampleDto[];
  displayConfirmApproved: boolean;
  displayConfirmOrder: boolean;
  settingsFechas: any;
  carriers: Array<any>;
  address: Array<any>;
  orderId: number;
  selectedSample: any;
  totalRecords: number = 0;
  currentPage: number = 1;
  firstElementPage: number = 0;
  pageLenght = environment.pageLenght;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private customerService: CustomerService,
    private masterSalesService: MasterSalesService,
    private shippingMasterService: ShippingMasterService,
    private storageService: StorageService,
    private productService: ProductService) { }

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.Samples', url: '/home/samples_list/all' },
    { label: 'shoppingCart.titleShoppingCart', url: '/home/samples_list/pending' },
    { label: 'preCheckOut.titleCheckOut', url: '/home/sample_checkout', current: true }
  ];

  ngOnInit(): void {
    this.lang = this.storageService.getLanguage();
    this.items = this.storageService.getSamplesItems();
    this.totalRecords = this.items ? this.items.length : 0;
    this.itemsPaginate = this.items ? this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght) : [];
    this.selectedSample = this.storageService.getSelectedSampleItem();
    this.subtotal = 0;
    this._InitForms();
    this.loadItems();
    this.getCarriers();
    this.getAddress();
  }

  private _InitForms() {
    this.checkoutForm = this.formBuilder.group({
      PoNumber: [null, [Validators.required]],
      Carrier: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      Comments: [null, [Validators.required]],
    });
  }

  get checkoutFormControls() {
    return this.checkoutForm.controls;
  }

  IsValid(control: string): boolean {
    return this.checkoutForm.get(control).valid;
  }

  getCarriers() {

    this.shippingMasterService.getAllCarriers().subscribe(
      (response) => {
        this.carriers = response.data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getAddress() {
    const customerId = this.storageService.getGrupId();
    const body = {
      customerId
    };
    this.customerService.getAddress(body).subscribe(
      (response) => {
        this.address = response.data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  loadItems() {
    var body = {
      "customerId": [
        this.storageService.getGrupId()
      ],
      "productId": [
        this.selectedSample.internalProductCode
      ]
    }
    this.masterSalesService.getProductPrice(body).subscribe(
      (response) => {
        if (response) {
          var price = (response.data as ProductPriceDto[]);
          this.items.map(x => x.price = this.getPrice(x.quantity, price));
          this.subtotal = this.items.map(x => x.quantity * x.price).reduce(function (a, b) {
            return a + b;
          });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
      () => { }
    );
  }

  getPrice(quantity: number, range: ProductPriceDto[]): number {
    let price: number = 0;
    range.forEach(x => {
      if (quantity >= x.lowerLimit && quantity < x.upperLimit) {
        price = x.salesPrice
      }
    });
    return price;
  }

  createOrder() {
    this.submitted = true;
    if (!this.checkoutForm.valid) {
      this.messageService.add({ severity: 'warning', summary: 'Warning', detail: 'Existen campos obligatorios sin diligenciar.' });
    } else {

      let updateSample = {
        "language": this.storageService.getLanguage() == 'es' ? "SP" : "EN",
        "sampleId": this.selectedSample.sampleId,
        "purchaseNumber": this.checkoutFormControls.PoNumber.value,
        "carrierId": this.checkoutFormControls.Carrier.value,
        "shippingAddress": this.checkoutFormControls.Address.value,
        "samplesNotes": this.checkoutFormControls.Comments.value,
        "modifiedByUser": this.storageService.getUser().username
      }

      this.productService.UpdateSampleForPreCheckout(updateSample).subscribe(
        (result: any) => {
          if (result) {
            this.CreateSampleCombinations();
            this.orderId = this.selectedSample.sampleId;
          }
        },
        (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      );
    }
  }

  CreateSampleCombinations() {
    let sampleCombinationDto: SampleCombinationDto = new SampleCombinationDto();
    let detail: Array<SampleCombinationDto> = new Array<SampleCombinationDto>();
    this.items.map(x => {
      moment.locale('es');

      sampleCombinationDto.companyId = 1;
      sampleCombinationDto.sampleId = this.selectedSample.sampleId;
      sampleCombinationDto.externalProductId = x.customerProductCode;
      sampleCombinationDto.internalProductId = this.selectedSample.internalProductCode;
      sampleCombinationDto.requestDate = moment(x.requiredDate, "DD/MMM/YYYY").format("YYYY-MM-DD");
      sampleCombinationDto.unitPrice = x.price;
      sampleCombinationDto.salePrice = x.price * x.quantity;
      sampleCombinationDto.salesUnit = 'UND.';
      sampleCombinationDto.quantity = x.quantity;
      sampleCombinationDto.combinationTypeId = 1;
      sampleCombinationDto.sampleStatusId = 6;
      sampleCombinationDto.unitMeasureId = 'UND.';
      detail.push(sampleCombinationDto);
    });
    let combinationRequest = {
      "sampleCombinations": detail,
    }

    this.productService.CreateSampleCombination(combinationRequest).subscribe(
      (result: any) => {
        if (result) {
          this.orderId = result.data.orderId;
          this.storageService.removeSamplesItems();
          this.displayConfirmOrder = true;
        }
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    );
  }
  openModalCancel() {
    this.displayConfirmApproved = true;
  }

  cancelOrder() {
    this.storageService.removeSamplesItems();
    this.router.navigate(['/home/samples_list/all']);
  }

  paginate(event) {
    this.currentPage = event.page + 1;
    this.firstElementPage = event.first;
    this.itemsPaginate = this.items.slice(this.firstElementPage, this.firstElementPage + this.pageLenght);
  }
}
