import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product/product.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() shoppingCart: ShoppingCartComponent;
  @Input() product: any;
  @Output() detailForm: FormGroup;

  productsCart: Array<any>;
  products: Array<any>;
  didClose = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly sharedService: SharedService,
    private readonly productService: ProductService,
    private readonly storageService: StorageService) { }

  ngOnInit(): void {
    this.detailForm = this.formBuilder.group({
      quantity: [null, [Validators.required]],
    });

    $(function () {
      //this.sharedService.imageZoom();
    })
  }

  getProduct(product) {
    const body = {
      productId: product.productId.trim()
    };
    this.productService.getDetailProduct(body).subscribe(
      (response: any) => {
        this.product = response.data;
        setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip({
            animated: 'fade',
            placement: 'top',
            html: true
          });
        }, 1000);
      });
  }

  onKeyPressNumber(event) {
    return (/[0-9]/.test(String.fromCharCode(event.which)));
  }
}
