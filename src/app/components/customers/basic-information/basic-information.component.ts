import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.css'],
  providers: [MessageService]
})
export class BasicInformationComponent implements OnInit {
  subscription: Subscription;
  paramCustomerId: string;
  customerName: string;
  redirectLinkCustomerName: string= "";
  subtitle: string;
  basicInformationList: any = [];

  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.CustomersHistory', url: '/home/customers_list', current: true },
    { label: 'customer.basicInformation', url: '/home/basic_information', current: true },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    public translate: TranslateService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.paramCustomerId = params.get('action');
    });
    this.getInformationBasic(this.paramCustomerId);
    
    this.translate.get('customer.basicInformationSubtitle').subscribe((res: string) => {
      this.subtitle = res;
    });
    this.getCustomerName(this.paramCustomerId);

  }

  private getCustomerName(customerId: string) {
    const body = { customerId };
    this.customerService.getCustomersById(body).subscribe(
      (response) => {
        this.redirectLinkCustomerName = response.data.customerName;
        this.customerName = this.subtitle + " " + response.data.customerName;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    );
  }

  getInformationBasic(customerId: string) {
    const body = { customerId };
    this.customerService.getCustomerAddressIdsByCustomerId(body).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.basicInformationList = new Array<Object>(response.data);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        }
        else {
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

}
