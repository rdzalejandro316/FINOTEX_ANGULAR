
import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TechinicalService } from 'src/app/core/services/technical-sheets/techinical.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';

declare var $: any;
@Component({
  selector: 'app-additional-properties',
  templateUrl: './additional-properties.component.html',
  styleUrls: ['./additional-properties.component.css']
})
export class AdditionalPropertiesComponent implements OnInit, AfterContentChecked {


  @Input() paramCustomerId: string = "";
  @Input() paramLineId: string = "";
  @Output() checkValueAutomatic: EventEmitter<any> = new EventEmitter();

  registerFormSesionfour: FormGroup;
  propertyAditionalFormIconStatus = 0;
  propertyAditionalFormStatusText = '';
  listOptionLine = [];
  checkSelect = [];

  constructor(
    private techinicalService: TechinicalService,
    private messageService: MessageService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
    this.propertyAditionalFormStatusText = this.checkSelect.length > 0 ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_optional";
    this.propertyAditionalFormIconStatus = this.checkSelect.length > 0 ? 1 : 0;
  }

  optionLineByLineIdService(paramLineId: number): void {
    const data = { lineId: paramLineId }
    this.techinicalService.optionLineByLineIdGet(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            for (let index = 0; index < response.data.length; index++) {
              const element = response.data[index];
              this.listOptionLine.push({
                lineId: element.lineId,
                optionId: element.optionId,
                optionName: element.optionName,
                checked: false,
                disable: true
              })
            }
          } else {
            this.messageService.add({ severity: 'ifnfo', summary: 'Info', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        this.listOptionLine = [];
      },
      () => { }
    );
  }

  checkValue(event: any, data: any) {
    if (event.target.checked) {
      this.checkSelect.push(data);
    } else {
      let index = this.checkSelect.indexOf(data);
      this.checkSelect.splice(index, 1);
    }
  }

  optionLineByProductIdService(paramProductId: number): void {

    const data = { productId: paramProductId }
    this.techinicalService.optionLineByProductIdGet(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            let listOptionLine = response.data;
            for (let i = 0; i < listOptionLine.length; i++) {
              let optionLine = listOptionLine[i];
              for (let index = 0; index < this.listOptionLine.length; index++) {
                const element = this.listOptionLine[index];
                if (element.optionId == optionLine.optionId) {
                  element.checked = true;
                }
              }
            }
          } else {
            this.messageService.add({ severity: 'ifnfo', summary: 'Info', detail: response.message });
          }
        } else {
          this.translate.stream('general.msgDetailResponse').subscribe((res: string) => {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: res });
          });
        }
      },
      (error) => {
        this.listOptionLine = [];
      },
      () => { }
    );

  }

  clearListOptionLine():void
  {
    this.listOptionLine = [];
  }
}
