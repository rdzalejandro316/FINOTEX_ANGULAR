import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ProductDto } from 'src/app/shared/models/producto-dto';

declare var $: any;


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  @ViewChild('ngForm') ngForm: FormGroupDirective;
  @ViewChild("modalShoppingCart") modalShoppingCart: ElementRef;
  @Output() subtotal: EventEmitter<number> = new EventEmitter<number>();
  requiredDatesForm: FormGroup;
  productsCart: Array<ProductDto> = [];
  lang = 'en';
  settingsDates = {
    minDate: new Date(2021, 1, 1),
    isRange: false,
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['date'],
    labels: 'samples.lblDate'
  };


  constructor(private readonly formBuilder: FormBuilder, private storageService: StorageService, private renderer: Renderer2) { }

  showPrice: boolean;
  displayComment: boolean = false;
  displayShoppingCart: boolean = false;

  ngOnInit(): void {
    this.productsCart = JSON.parse(localStorage.getItem('productsCart'));
    this.lang = this.storageService.getLanguage();
    this.requiredDatesForm = this.formBuilder.group({
      date: ['', Validators.nullValidator]
    });
  }

  reloadProductCart() {
    this.productsCart = JSON.parse(localStorage.getItem('productsCart'));
    if (this.productsCart) {
      let subt = 0;
      this.productsCart.forEach(function (product) {
        subt += product.price * product.quantity
      });
      this.subtotal.emit(subt);
    }

  }

  updateQuantity(productId) {
    this.productsCart = JSON.parse(localStorage.getItem('productsCart'));
    const pr = this.productsCart.filter(x => x.productId == productId)[0];
    //TODO: Find price in range.
    let priceRange = 1000;
    pr.quantity = $('#txtQuantity' + productId).val();
    pr.price = priceRange;
    localStorage.setItem('productsCart', JSON.stringify(this.productsCart));
    this.reloadProductCart();
  }

  removeProductCart(productid) {
    this.productsCart = JSON.parse(localStorage.getItem('productsCart'));
    if (productid != 0) {
      if (!this.productsCart) {
        this.productsCart = new Array<ProductDto>();
      }
      this.productsCart = this.productsCart.filter(x => x.productId != productid);
      localStorage.setItem('productsCart', JSON.stringify(this.productsCart));
    }
    this.reloadProductCart();
  }

  onKeyPressNumber(event) {
    return (/[0-9]/.test(String.fromCharCode(event.which)));
  }

  showprice(showPrice: boolean) {
    this.showPrice = showPrice;
  }

  display(displayShopping: boolean) {
    this.displayShoppingCart = !displayShopping;
  }

  showPanelDialog() {
    this.displayComment = true;
    this.requiredDatesForm.reset();
    // this.modalShoppingCart.nativeElement.style.display = 'none';
  }
}
