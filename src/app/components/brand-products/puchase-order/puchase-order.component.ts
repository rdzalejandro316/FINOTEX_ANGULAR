import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BrandService } from 'src/app/core/services/brand/brand.service';
import { CommonMastersService } from 'src/app/core/services/common-masters/common-masters.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { ShippingMasterService } from 'src/app/core/services/shipping-master/shipping-master.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { UtilitiesService } from 'src/app/core/services/utilities/utilities.service';
import { DatepickerComponent } from 'src/app/shared/framework-ui/custom/datepicker/datepicker.component';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { BrandCatalogPrice } from 'src/app/shared/models/brand-catalog-price';
import { BrandProductDto } from 'src/app/shared/models/brandproducto-dto';
import { ProductDetailDto } from 'src/app/shared/models/product-detail-dto';
import { ProductItemCartBrandDto } from 'src/app/shared/models/product-item-cart-brand-dto';
import { ProductDto } from 'src/app/shared/models/producto-dto';
import { TranslateService } from '@ngx-translate/core';
import { OrderDto } from 'src/app/shared/models/order-dto';
import { OrderDetailDto } from 'src/app/shared/models/order-detail-dto';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-puchase-order',
  templateUrl: './puchase-order.component.html',
  styleUrls: ['./puchase-order.component.css'],
  providers: [DatePipe, MessageService],
})
export class PuchaseOrderComponent implements OnInit {
  lang = 'en';
  items: ProductDto[];
  checkoutForm: FormGroup;
  subtotal: number;
  submitted: boolean;
  carriers: Array<any> = [];
  address: Array<any> = [];
  brandCatalogPrice: Array<BrandCatalogPrice> = [];
  shoppingCart: Array<ProductItemCartBrandDto> = [];
  displayConfirmCancel: Boolean = false;
  displaysuccess: boolean = false;
  selectedBrandProduct: BrandProductDto;
  priceType: number;
  currencyCustomer: number;
  rate: number;
  form: FormGroup;
  display: boolean = false;
  disabledSelectSize: boolean;
  disabledSelectColor: boolean = false;
  isSetFirstRequiredDate: boolean = false;
  displayNoContentSizeAndColor: boolean = false;
  indicatorButton = false;
  displayInvalidItem: boolean = false;
  productsDetail: Array<ProductDetailDto> = [];
  productsSizes: Array<ProductDetailDto> = [];
  productsColor: Array<ProductDetailDto> = [];
  settingsDates: any;
  selectedItem: any;
  orderId: number;

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'shoppingCart.titleShoppingCart', url: '/home/brandProducts' },
    {
      label: 'preCheckOut.titlePurchaseOrder',
      url: '/home/brandProduct_puchase',
      current: true,
    },
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private messageService: MessageService,
    private shippingMasterService: ShippingMasterService,
    private brandService: BrandService,
    private customerService: CustomerService,
    private commonMastersService: CommonMastersService,
    private utilitiesService: UtilitiesService,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    this._InitForms();
    this.getForm();
    this.selectedBrandProduct = this.storageService.getProductBrand();
    this.shoppingCart =
      this.storageService.getItemFromBrandProductShoppingCart();
    this.getCarriers();
    this.getAddress();
    this.loadShoppingCart();

    $(function () {
      $('#search input').css('border-radius', '10px 0px 0px 10px ');
    });

    this.settingsDates = {
      minDate: 0,
      isRange: false,
      required: true,

      dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
      ids: ['requiredDate'],
      labels: 'samples.lblDate',
    };
  }

  private _InitForms() {
    this.checkoutForm = this.formBuilder.group({
      PoNumber: [null, [Validators.required]],
      Carrier: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      Comments: [null, [Validators.required]],
    });
  }

  getForm() {
    return (this.form = this.formBuilder.group({
      productId: [null, [Validators.required]],
      size: new FormControl({ disabled: true }, Validators.required),
      colorVariation: new FormControl({ disabled: true }, Validators.required),
      quantity: ['', [Validators.required]],
      requiredDate: new FormControl({ disabled: true }, Validators.required),
      firstRequiredDate: [null, [Validators.nullValidator]],
    }));
  }

  get controlsForm() {
    return this.form.controls;
  }

  onChangeQuantityEvent(event: any) {
    if (event.target.value < 0) {
      this.controlsForm.quantity.setValue(null);
    }
  }

  showCart() {
    this.selectedBrandProduct = this.storageService.getProductBrand();
    this.productsColor = [];
    this.productsSizes = [];
    let datos = {
      brandCatalogId: this.selectedBrandProduct.brandCatalogId,
    };
    this.brandService.getBrandCatalogProduct(datos).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.displayNoContentSizeAndColor = false;
            this.clearShoppingCartForm(response.data);
          } else {
            this.displayNoContentSizeAndColor = true;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        } else {
          this.productsDetail = [];
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
        this.display = true;
        this.disabledSelectColor = this.productsColor.length == 0;
        this.disabledSelectSize = this.productsSizes.length == 0;
        setTimeout(function () {
          if (!this.datePicker) {
            this.datePicker = new DatepickerComponent(
              this.translate,
              this.storageService
            );
          }
          this.settingsDates = {
            minDate: 0,
            isRange: false,
            required: true,

            dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
            ids: ['requiredDate'],
            labels: 'samples.lblDate',
          };
          this.datePicker.settings = this.settingsDates;
          this.datePicker._SingleDatePicker();
        }, 500);
      }
    );
  }

  clearShoppingCartForm(detail: Array<ProductDetailDto>) {
    detail.map((x) => {
      x.size = x.size ? x.size : 'N/A';
      x.color = x.color ? x.color : 'N/A';
    });

    let arrayUniqueBySize = [
      ...new Map(detail.map((item) => [item['size'], item])).values(),
    ];

    this.productsDetail = detail;
    this.productsSizes = arrayUniqueBySize;

    var colors = this.utilitiesService.groupBy(this.productsDetail, 'color');
    this.productsColor = colors[this.controlsForm.colorVariation.value];

    this.disabledSelectColor = this.productsColor.length == 0;
    this.disabledSelectSize = this.productsSizes.length == 0;
  }

  getColorsBySize(event: any) {
    var sizes = this.utilitiesService.groupBy(this.productsDetail, 'size');
    this.productsColor = sizes[event.value];
    this.disabledSelectColor = this.productsColor.length == 0;
    if (this.disabledSelectColor) {
      this.controlsForm.colorVariation.disable();
    } else {
      this.controlsForm.colorVariation.enable();
    }
  }

  getSizesByColor(event: any) {
    var colors = this.utilitiesService.groupBy(this.productsDetail, 'color');
    this.productsSizes = colors[event.value];
    this.disabledSelectSize = this.productsSizes.length == 0;
    if (this.disabledSelectSize) {
      this.controlsForm.size.disable();
    } else {
      this.controlsForm.size.enable();
    }
  }

  setFirstRequiredDate() {
    if (this.isSetFirstRequiredDate) {
      this.controlsForm.requiredDate.setValue(null);
      this.isSetFirstRequiredDate = false;
      $('#requiredDate').prop('disabled', false);
    } else {
      this.shoppingCart =
        this.storageService.getItemFromBrandProductShoppingCart();
      if (this.shoppingCart.length > 0) {
        this.controlsForm.requiredDate.setValue(
          this.shoppingCart[0].requiredDate
        );
        this.isSetFirstRequiredDate = true;
        $('#requiredDate').prop('disabled', true);
      }
    }
  }

  addOrEditItem() {
    if (this.form.valid) {
      let index = this.shoppingCart.findIndex(
        (x) =>
          x.brandCatalogId == this.selectedItem.brandCatalogId &&
          x.color == this.selectedItem.color &&
          x.size == this.selectedItem.size &&
          x.requiredDate == this.selectedItem.requiredDate &&
          x.quantity == this.selectedItem.quantity
      );

      this.shoppingCart[index].color = this.controlsForm.colorVariation.value;
      this.shoppingCart[index].size = this.controlsForm.size.value;
      this.shoppingCart[index].requiredDate =
        this.controlsForm.requiredDate.value;
      this.shoppingCart[index].quantity = this.controlsForm.quantity.value;
      this.loadShoppingCart();
      this.storageService.addItemToBrandProductShoppingCart(this.shoppingCart);
      this.display = false;
    }
  }

  loadItemForEdit(item: any) {
    this.display = true;
    this.selectedItem = item;
    this.controlsForm.productId.setValue(item.brandCatalogCode);
    this.controlsForm.size.setValue(item.size);
    this.controlsForm.colorVariation.setValue(item.color);
    this.controlsForm.requiredDate.setValue(item.requiredDate);
    this.controlsForm.quantity.setValue(item.quantity);
    this.showCart();
  }

  IsValid(control: string): boolean {
    return this.checkoutForm.get(control).valid;
  }

  openModalCancel() {
    this.displayConfirmCancel = true;
  }

  cancelOrder() {
    this.displayConfirmCancel = false;
    this.storageService.removeBrandProductShoppingCart();
    this.router.navigate(['home/brandProducts']);
  }

  createOrder() {
    this.submitted = true;
    let user = this.storageService.getUser();
    let order: OrderDto = new OrderDto();
    order.companyId = this.storageService.getProfiles().businessId;
    order.securityUsersId = this.storageService.getSecurityUsersId();
    order.customerId = this.storageService.getGrupId();
    order.orderId = 0;
    order.formNumber = 0;
    order.registerType = '';
    order.orderTypeId = 2;
    order.orderSourceId = 1;
    order.plantId = 0;
    order.purchaseOrderNumber = this.checkoutForm.controls.PoNumber.value;
    order.saleTermsId = 0;
    order.shipAreaId = 0;
    order.shipViaId = 1;
    order.destinationPort = 1;
    order.shippingAddress = this.checkoutForm.controls.Address.value;
    order.carrierId = this.checkoutForm.controls.Carrier.value;
    order.orderStatusId = 3;
    order.orderNotes = this.checkoutForm.controls.Comments.value;
    order.recordUser = user.username;
    order.modifiedByUser = user.username;
    order.detail = [];
    this.shoppingCart.forEach((x, index) => {
      let orderDetail: OrderDetailDto = new OrderDetailDto();
      orderDetail.companyId = this.storageService.getProfiles().businessId;
      orderDetail.orderId = 0;
      orderDetail.orderitem = index + 1;
      orderDetail.promisedDate = null;
      orderDetail.promisedDeliveryDate = null;
      orderDetail.storeHouseId = 0;
      orderDetail.productId = x.brandCatalogCode;
      orderDetail.cutId = 1;
      orderDetail.adhesiveId = 1;
      orderDetail.finishId = 1;
      orderDetail.unitMeasureId = null;
      orderDetail.salesUnit = null;
      orderDetail.conversionFactor = 0.0;
      orderDetail.inverseFactor = 0.0;
      orderDetail.priceListId = null;
      orderDetail.basicUnitPrice = 0.0;
      orderDetail.markupPercentage = 0.0;
      orderDetail.additionalChargeValue = 0.0;
      orderDetail.chargeByMinimunOrder = 0.0;
      orderDetail.cutPriceByUnit = 0.0;
      orderDetail.unitPrice = x.price;
      orderDetail.unitPriceWithDiscount = null;
      orderDetail.unitCost = null;
      orderDetail.quotedUnitPrice = null;
      orderDetail.quotedSalePrice = null;
      orderDetail.specialPriceFlag = 'n';
      orderDetail.salePrice = x.price * x.quantity;
      orderDetail.proformaOrPurchaseUnit = null;
      orderDetail.proformaOrPurchasePrice = null;
      orderDetail.artValue = 0.0;
      orderDetail.sampleQuantity = x.quantity;
      orderDetail.quantityOrdered = x.quantity;
      orderDetail.quantityReserved = 0.0;
      orderDetail.quantityPackingList = 0.0;
      orderDetail.quantityInvoiced = 0.0;
      orderDetail.lastInvoiceDate = null;
      orderDetail.requestedProduction = null;
      orderDetail.productionFinished = null;
      orderDetail.productionInProcess = null;
      orderDetail.isAuthorizedDelivery = 'n';
      orderDetail.fulfilledManual = null;
      orderDetail.orderStatusId = 3;
      orderDetail.modifiedByUser = null;
      orderDetail.customerExternalOrder = null;
      orderDetail.customerExternaLote = null;
      orderDetail.customerOrderId = null;
      orderDetail.customerItemOrder = null;
      orderDetail.loanCodeId = null;
      orderDetail.contract = null;
      orderDetail.detailNotes = this.checkoutForm.controls.Comments.value;

      order.detail.push(orderDetail);
    });

    this.salesService.createOrder(order).subscribe(
      (result: any) => {
        if (result) {
          this.orderId = result.data.orderId;
          this.displaysuccess = true;
          this.storageService.removeBrandProductShoppingCart();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCarriers() {
    this.shippingMasterService.getAllCarriers().subscribe(
      (response) => {
        this.carriers = response.data;
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

  getAddress() {
    const customerId = this.storageService.getGrupId();
    const body = {
      customerId,
    };
    this.customerService.getAddress(body).subscribe(
      (response) => {
        this.address = response.data;
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

  goToProductBrandList() {
    this.displaysuccess = false;
    this.router.navigate(['home/brandProducts']);
  }

  removeItemFromShoppingCart(brandCatalogId: number) {
    this.shoppingCart.forEach((value, index) => {
      if (value.brandCatalogId == brandCatalogId) {
        this.shoppingCart.splice(index, 1);
      }
    });
    this.storageService.addItemToBrandProductShoppingCart(this.shoppingCart);
    if (this.shoppingCart == null || this.shoppingCart.length == 0) {
      this.router.navigate(['home/brandProducts']);
    }
  }

  loadShoppingCart() {
    const shoppingCart$ = from(this.shoppingCart);
    this.getBrandCatalogPrices()
      .pipe(
        mergeMap((res1: any) => {
          this.brandCatalogPrice = res1.data;
          return this.getMasterCustomerPaymentType();
        }),
        mergeMap((res2: any) => {
          this.priceType = res2.data;
          return this.getCustomerById();
        }),
        mergeMap((res3: any) => {
          this.currencyCustomer = res3.data?.currencyId;
          return this.loadShoppingCartExchangeRate();
        })
      )
      .subscribe((final) => {
        this.rate = final;
        this.subtotal = 0;
        shoppingCart$.subscribe((x) => {
          x.price = this.getPriceByRange(x.quantity) * this.rate;
          this.subtotal = this.subtotal + x.price * x.quantity;
        });
      });
  }

  loadShoppingCartExchangeRate() {
    moment.locale(this.storageService.getLanguage());
    if (this.currencyCustomer != this.brandCatalogPrice[0].currencyId) {
      let body = {
        companyId:
          this.storageService.getProfiles() != null
            ? this.storageService.getProfiles().businessId
            : null,
        sourceCurrencyId: this.brandCatalogPrice[0].currencyId,
        targetCurrencyId: this.currencyCustomer,
        rateDate: `${moment(new Date(), 'YYYY-MM-DD').format(
          'MMM/DD/YYYY'
        )}T00:00:00.000`,
      };

      return this.commonMastersService.exchangeRateGetById(body).pipe(
        map((response) => {
          return response.data.rateValue;
        })
      );
    } else {
      return of(1);
    }
  }

  getPriceByRange(quantity: number): number {
    let price: number = 0;
    this.brandCatalogPrice.forEach((x) => {
      if (price == 0) {
        price = this.getValidationRate(quantity, x);
      }
    });

    return price;
  }

  getBrandCatalogPrices() {
    let body = {
      brandCatalogId: this.selectedBrandProduct.brandCatalogId,
    };
    return this.brandService.getBrandCatalogPrices(body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getMasterCustomerPaymentType() {
    const customerId = this.storageService.getGrupId();
    const body = {
      customerId,
    };

    return this.brandService.getMasterCustomerPaymentType(body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCustomerById() {
    const customerId = this.storageService.getGrupId();
    const body = {
      customerId,
    };
    return this.customerService.getCustomersById(body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getValidationRate(quantity: number, x: BrandCatalogPrice): number {
    let price: number = 0;
    if (
      quantity >= x.brandCatalogRangeInitial &&
      quantity <= x.brandCatalogRangeFinal
    ) {
      switch (this.priceType) {
        case 1:
          price = x.salePrice;
          break;
        case 2:
          price = x.fobprice;
          break;
        case 3:
          price = x.intercompanyPrice;
          break;
        default:
          price = 0;
          break;
      }
    }
    return price;
  }
}
