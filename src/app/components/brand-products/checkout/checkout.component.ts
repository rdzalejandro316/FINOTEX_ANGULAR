import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  itemsBreadcrumb = [
    {label:'menu.Home', url: '/home'},
    {label:'menu.AllProducts', url: '/home/all_product'},
    {label:'product-brand.lblProductsByBrand', url: '/home/brandProducts'},
    {label:'product-brand-new.titleMain', url: '/home/brandProductsNew', current: true}
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
