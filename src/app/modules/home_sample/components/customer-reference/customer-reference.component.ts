import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product/product.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-reference',
  templateUrl: './customer-reference.component.html',
  styleUrls: ['./customer-reference.component.css'],
  providers: [MessageService],
})
export class CustomerReferenceComponent implements OnInit {
  @Input() paramCustomerId: string = '';

  customerReferenceForm: FormGroup;
  customerReferenceFormIconStatus = 0;
  customerReferenceFormStatusText = '';
  errorMessageText = '';
  lang = 'en';
  public href: string = "";
  public details:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.readaction();
    this.getCustomerReferenceForm();
    this.validateFormStatus();
    this.translateService.stream('technical-sheets.error_message_search_customer_reference').subscribe((res: string) => {
      this.errorMessageText = res;
    });
  }

  getCustomerReferenceForm(){
    return (this.customerReferenceForm = this.formBuilder.group({
      CustomerReference: [{ value: '',disabled: this.details}, Validators.nullValidator],
      Description: [{ value: '',disabled: this.details}, Validators.nullValidator],
      Color: [{ value: '',disabled: this.details}, Validators.nullValidator],
      SKU: [{ value: '',disabled: this.details}, Validators.nullValidator],
    }));
  }

  validateFormStatus(): void {
    this.customerReferenceFormIconStatus = this.validateFormData() ? 1 : 0;
    this.customerReferenceFormStatusText = this.validateFormData()
      ? 'technical-sheets.session_form_completed'
      : 'technical-sheets.session_form_optional';

    this.customerReferenceForm.valueChanges.subscribe((value) => {
      this.customerReferenceFormIconStatus = this.validateFormData() ? 1 : 0;
      this.customerReferenceFormStatusText = this.validateFormData()
        ? 'technical-sheets.session_form_completed'
        : 'technical-sheets.session_form_optional';
    });
  }

  validateFormData(): boolean {
    return (
      this.customerReferenceForm.controls.CustomerReference.value != '' &&
      this.customerReferenceForm.controls.Description.value != '' &&
      this.customerReferenceForm.controls.Color.value != '' &&
      this.customerReferenceForm.controls.SKU.value != ''
    );
  }

  onCustomerReferenceChange($event: any): void {
    const body = {
      customerId: this.paramCustomerId,
      productId: this.customerReferenceForm.controls.CustomerReference.value,
    };

    this.productService.getCustomerReference(body).subscribe(
      (response) => {
        if (response && response.status) {
          this.mapDataToFieldEntries(response.data);
        } else {
          this.showErrorMessage(this.paramCustomerId, this.customerReferenceForm.controls.CustomerReference.value);
        }
      },
      (error) => {
        this.showErrorMessage(this.paramCustomerId, this.customerReferenceForm.controls.CustomerReference.value);
      }
    );
  }
  showErrorMessage(customerId:string, productId:string): void {
    let message: string = this.errorMessageText;
    message = message.replace("{0}", productId);
    message = message.replace("{1}", customerId);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }
  mapDataToFieldEntries(data: any): void {
    this.customerReferenceForm.controls.Description.setValue(
      data.referenceName
    );
    if (data.referenceColor) {
      this.customerReferenceForm.controls.Color.setValue(
        data.referenceColor
      );
    }
    this.customerReferenceForm.controls.SKU.setValue(
      data.sku1 ? data.sku1 : data.referenceId
    );
  }

  onCustomerReferenceKeyUp($event: any): void {
    this.customerReferenceForm.controls.SKU.setValue(
      this.customerReferenceForm.controls.CustomerReference.value
    );
  }

  getCustomerReferenceById(paramProductId: any) {
    const body = {
      customerId: this.paramCustomerId,
      productId: paramProductId
    };

    this.productService.getCustomerReference(body).subscribe(
      (response) => {
        if (response && response.status) {
          this.mapDataToFieldEntries(response.data);
          this.customerReferenceForm.controls.CustomerReference.setValue(
            response.data.referenceId
          );

        } else {
          this.showErrorMessage(this.paramCustomerId, this.customerReferenceForm.controls.CustomerReference.value);
        }
      },
      (error) => {
        this.showErrorMessage(this.paramCustomerId, this.customerReferenceForm.controls.CustomerReference.value);
      }
    );
  }

  public readaction(){
    this.href = this.router.url;
    this.details = this.href.includes('detail') ? true : false;
  }
}
