import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customers-cards',
  templateUrl: './customers-cards.component.html',
  styleUrls: ['./customers-cards.component.css'],
  providers: [MessageService]
})
export class CustomersCardsComponent implements OnInit {

  paramCustomerId: string;
  customerName: string = ""

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.Customers', url: '/home/customers_list' },
    { label: 'customer.InfoClient', url: '/home/customers_list/add', current: true }
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paramCustomerId = params.get('action');
      this.customerName = params.get('customerName');
      this.translate.get('artWork.description').subscribe((res: string) => {
        this.customerName = res + this.customerName;
      })
    });
  }

  routerLinkAction(event: string): void {
    switch (event) {
      case "01":
        this.router.navigate(['home/artworks_history', this.paramCustomerId]);
        break;

      case "02":
        this.router.navigate(['home/technical_developments_by_customer', this.paramCustomerId]);
        break;

      case "03":
        break;

      case "04":
        this.router.navigate(['home/brandProducts/', this.paramCustomerId]);
        break;

      case "05":
        this.router.navigate(['home/basic_information', this.paramCustomerId]);
        break;
    }
  }

}
