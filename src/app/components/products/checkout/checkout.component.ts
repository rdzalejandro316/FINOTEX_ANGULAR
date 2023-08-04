import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShippingMasterService } from 'src/app/core/services/shipping-master/shipping-master.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { OrderDto } from 'src/app/shared/models/order-dto';
import { OrderDetailDto } from 'src/app/shared/models/order-detail-dto';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService, DatePipe],
})
export class CheckoutComponentProduct implements OnInit {
  registerFormcheckout: FormGroup;
  registerEditOrderSummary: FormGroup;
  listProductsCheckout = [];
  carriers = [];
  address = [];
  validateItem: number = 0;
  buttonState = false;
  displayCancelOrder = false;
  displayConfirmation = false;
  orderId = 0;
  showPrice: boolean;
  displayEditOrdenSummary: boolean = false;
  loadingService: any;
  ProductCode: string = '';
  listremove: any[];
  total: number = 0;
  lang = 'en';
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.AllProducts', url: '/home/all_product' },
    { label: 'shoppingCart.titleShoppingCart', url: '/home/product_checkout' },
    {
      label: 'checkOut.titleCheckOut',
      url: '/home/product_checkout/add',
      current: true,
    },
  ];

  constructor(
    private router: Router,
    public translate: TranslateService,
    private customerService: CustomerService,
    private salesService: SalesService,
    private shippingMasterService: ShippingMasterService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.lang = this.storageService.getLanguage();
    this.initializeForm();
    this.listProductsCheckout = this.getListProductCartLocalStorage();
    this.FormatDate(this.listProductsCheckout);
    this.showPrice = this.storageService.getShowPrice().showPrice;
    this.getCarriers();
    this.getAddress();
    this.formEdit();
    this.calculateTotal();
  }

  getListProductCartLocalStorage(): any[] {
    return this.storageService.getProductLocalStorage() == null
      ? []
      : this.storageService.getProductLocalStorage();
  }

  validateDetailCartProduct(): boolean {
    return this.storageService.getProductLocalStorage() == null
      ? true
      : this.storageService.getProductLocalStorage().length > 0
      ? false
      : true;
  }

  private initializeForm() {
    this.registerFormcheckout = this.formBuilder.group({
      Carrier: [null, [Validators.required]],
      Shipping: [null, [Validators.required]],
      PoNumber: [null, [Validators.required]],
      Comments: [null, [Validators.required]],
    });
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

  confirmPlaceYourOrder() {
    this.router.navigate(['home/all_product']);
  }

  onSubmitcheckout() {
    this.buttonState = true;
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
    order.purchaseOrderNumber = this.registerFormcheckout.get('PoNumber').value;
    order.saleTermsId = 0;
    order.shipAreaId = 0;
    order.shipViaId = 1;
    order.destinationPort = 1;
    order.shippingAddress = this.registerFormcheckout.get('Shipping').value;
    order.carrierId = this.registerFormcheckout.get('Carrier').value;
    order.orderStatusId = 3;
    order.orderNotes = this.registerFormcheckout.get('Comments').value;
    order.recordUser = user.username;
    order.modifiedByUser = user.username;
    order.detail = [];
    this.listProductsCheckout.forEach((data, index) => {
      let orderDetail: OrderDetailDto = new OrderDetailDto();
      orderDetail.companyId = this.storageService.getProfiles().businessId;
      orderDetail.orderId = 0;
      orderDetail.orderitem = index + 1;
      orderDetail.promisedDate = null;
      orderDetail.promisedDeliveryDate = null;
      orderDetail.storeHouseId = 0;
      orderDetail.productId = data.customerProductCode;
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
      orderDetail.unitPrice = data.price;
      orderDetail.unitPriceWithDiscount = null;
      orderDetail.unitCost = null;
      orderDetail.quotedUnitPrice = null;
      orderDetail.quotedSalePrice = null;
      orderDetail.specialPriceFlag = 'n';
      orderDetail.salePrice = data.price * data.quantity;
      orderDetail.proformaOrPurchaseUnit = null;
      orderDetail.proformaOrPurchasePrice = null;
      orderDetail.artValue = 0.0;
      orderDetail.sampleQuantity = data.quantity;
      orderDetail.quantityOrdered = data.quantity;
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
      orderDetail.detailNotes = this.registerFormcheckout.get('Comments').value;

      order.detail.push(orderDetail);
    });

    this.salesService.createOrder(order).subscribe(
      (result: any) => {
        if (result) {
          this.orderId = result.data.orderId;
          localStorage.removeItem('productsCart');
          this.displayConfirmation = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openModalCancel() {
    this.displayCancelOrder = true;
  }

  cancelOrder() {
    this.storageService.removeItemFinotex('productsCart');
    this.router.navigate(['/home/all_product']);
  }

  editOrder() {
    this.router.navigate(['/home/all_product']);
  }

  FormatDate(data: any) {
    moment.locale(this.storageService.getLanguage());
    var index: number = 0;
    data.forEach((item) => {
      if (item.locationDate != '') {
        this.listProductsCheckout[index].locationDate = this.formatDateTraslate(
          item.locationDate
        );
      }
      index++;
    });
    return '';
  }

  GetFormattedDate(DateParam: string) {
    moment.locale(this.storageService.getLanguage());
    let dateValidating =
      DateParam.charAt(0).toUpperCase() + DateParam.slice(1).replace('.', '');
    if (isNaN(Date.parse(dateValidating))) {
      dateValidating = this.formatDateTraslate(dateValidating);
    }
    return (
      dateValidating.charAt(0).toUpperCase() +
      dateValidating.slice(1).replace('.', '')
    );
  }

  formEdit() {
    this.registerEditOrderSummary = this.formBuilder.group({
      locationDate: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      index: [null, [Validators.required]],
    });
  }

  OpenModalEdit(data: any, index: number) {
    moment.locale(this.storageService.getLanguage());
    this.displayEditOrdenSummary = true;
    this.ProductCode = data.customerProductCode;
    let date = data.locationDate;
    if (isNaN(Date.parse(data.locationDate))) {
      date = moment(
        this.formatDateTraslate(data.locationDate),
        'MMM/DD/YYYY'
      ).format('MM-DD-YYYY');
    }
    this.registerEditOrderSummary.patchValue({
      locationDate: new Date(date),
      quantity:data.quantity,
      index: index,
    });
  }

  Cancel() {
    this.displayEditOrdenSummary = false;
    this.registerEditOrderSummary.reset();
  }

  formatDateTraslate(value: any) {
    let date = value;
    let dateTraslate = '';
    if (date !== undefined && date !== null) {
      if (!Number.isInteger(parseInt(date.charAt(0), 0))) {
        moment.locale('es');
        let getDateFormat = moment(date, 'MMM/DD/YYYY').format('MM/DD/YYYY');
        if (getDateFormat == 'Invalid date') {
          moment.locale('en');
          getDateFormat = moment(date, 'MMM/DD/YYYY').format('MM/DD/YYYY');
          moment.locale('es');
          dateTraslate = moment(date, 'MM/DD/YYYY').format('MM/DD/YYYY');
        } else {
          dateTraslate = date;
        }
      } else {
        moment.locale(this.storageService.getLanguage());
        let getDateFormat = moment(date, 'YYYY-MM-DD').format('MMM/DD/YYYY');
        if (getDateFormat == 'Invalid date') {
          dateTraslate = moment(date, 'YYYY/MM/DD').format('MMM/DD/YYYY');
        } else {
          dateTraslate = getDateFormat;
        }
      }
    }

    return dateTraslate
      ? dateTraslate.charAt(0).toUpperCase() +
          dateTraslate.slice(1).replace('.', '')
      : date;
  }

  validateRepeatedRequiredDate() {
    moment.locale(this.storageService.getLanguage());
    let items = this.listProductsCheckout;
    let itemsFilter = items;
    let validate = 0;

    for (let index = 0; index < items.length; index++) {
      const x = items[index];
      const filter = itemsFilter.filter(
        (e) =>
          e.customerProductCode === x.customerProductCode &&
          e.sizes === x.sizes &&
          e.referenceColor === x.referenceColor &&
          moment(this.formatDateTraslate(e.locationDate), 'MMM/DD/YYYY').format(
            'MMM/DD/YYYY'
          ) ==
            moment(
              this.formatDateTraslate(x.locationDate),
              'MMM/DD/YYYY'
            ).format('MMM/DD/YYYY')
      );
      if (filter.length > 1) {
        validate++;
      }
    }

    this.validateItem = validate;
    return validate > 0;
  }

  onSubmitSaveChanges() {
    moment.locale(this.storageService.getLanguage());
    let index = this.registerEditOrderSummary.get('index').value;
    let date = this.registerEditOrderSummary.get('locationDate').value
      ? moment(
          this.registerEditOrderSummary.get('locationDate').value,
          'YYYY-MM-DD'
        ).format('MMM/DD/YYYY')
      : null;
    this.listProductsCheckout[index].quantity =
      this.registerEditOrderSummary.get('quantity').value;
    this.listProductsCheckout[index].locationDate = this.GetFormattedDate(date);
    this.listProductsCheckout[index].subtotal =
      this.listProductsCheckout[index].quantity *
      this.listProductsCheckout[index].price;
    this.calculateTotal();

    this.storageService.addProductLocalStorage(this.listProductsCheckout);
    this.registerEditOrderSummary.reset();
    this.displayEditOrdenSummary = false;
  }

  removeItemEdit(product: any, index: number) {
    this.listProductsCheckout.splice(index, 1);
    this.storageService.addProductLocalStorage(this.listProductsCheckout);
    this.calculateTotal();
    this.validateDetailCartProduct();
  }

  calculateTotal() {
    var itemSubtotal: number = 0;
    var sum: number = 0;
    if (this.listProductsCheckout != null) {
      this.listProductsCheckout.forEach((element) => {
        if (element.subtotal > 0) {
          itemSubtotal = element.subtotal;
          sum += itemSubtotal;
        }
      });
    }

    this.total = sum;
  }
}
