import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/public_api';
import { TechnicalDataLines } from 'src/app/shared/constant/tecnicalDataLine';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-troquel',
  templateUrl: './troquel.component.html',
  styleUrls: ['./troquel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class TroquelComponent implements OnInit, AfterViewInit {
  @ViewChild('tablaFinotex') someInput: Table;
  @Input() line: any;
  troquelDataForm: FormGroup;
  formTroquelIconStatus = 0;
  formStatusText = '';
  expandedRows: {} = {};
  countTroquelData: number = 0;
  btnDisplaying: boolean = true;
  maxTroquel: number = 2;
  linesIdShow = TechnicalDataLines.GetTechnicalDataLineg;
  showComponents: boolean = true;
  showTroquel: boolean = false;
  showExpand: boolean = false;
  listTroquels: any = [];
  public href: string = "";
  public details: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private messageService: MessageService,
    private salesService: SalesService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._InitForms();
    this.readactiondetail()
    this.troquelFormCall.push(this.itemCartSet2({ id: '1', mainDie: true }));
  }


  ngAfterViewInit(): void {
    const thisRef = this;
    this.formStatusText = "technical-sheets.session_form_optional";
    if (thisRef.someInput !== undefined && thisRef.someInput !== null) {
      this.troquelFormCall.value.forEach(function (car) {
        thisRef.someInput.expandedRowKeys[car.id] = false;
      });
    }

    this.expandedRows = Object.assign({}, this.expandedRows);
  }

  onKeyPressNumberDecimal(event) {
    return /[0-9.]/.test(String.fromCharCode(event.which));
  }

  get troquelFormCall() {
    return this.troquelDataForm.get('header') as FormArray;
  }

  private _InitForms() {
    this.troquelDataForm = this.formBuilder.group({
      header: this.formBuilder.array([], this.itemCartSet2({})),
    });
  }

  /*private itemHeader(): FormGroup {
    return this.formBuilder.group({
      id: ['', Validators.nullValidator],
      listTroquel: ['', [Validators.nullValidator]],
      paperWidth: ['', Validators.nullValidator],
      labelsAcross: ['', Validators.nullValidator],
      labelsAround: ['', Validators.nullValidator],
      cornerRadius: ['', Validators.nullValidator],
      imperialPerforation: ['', Validators.nullValidator],
      mainDie: ['', Validators.nullValidator]
    });
  }*/

  dieGetservice(paramLineId: number) {
    let data = { LineId: paramLineId };
    this.salesService.dieGetByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listTroquels = response.data;
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });
          }
        } else {
          this.troquelFormCall.clear();
          this.translate
            .stream('general.msgDetailResponse')
            .subscribe((res: string) => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: res,
              });
            });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      () => { }
    );

  }

  selectDie(_event, _data, _rowIndex) {
    _data.forEach(_element => {
      if (_element.dieId == _event.value) {
        this.troquelFormCall.at(_rowIndex).get('paperWidth').setValue(_element.paperWidth)
        this.troquelFormCall.at(_rowIndex).get('labelsAcross').setValue(_element.labelsAcross)
        this.troquelFormCall.at(_rowIndex).get('labelsAround').setValue(_element.labelsAround)
        this.troquelFormCall.at(_rowIndex).get('cornerRadius').setValue(_element.cornerRadius)
        this.troquelFormCall.at(_rowIndex).get('imperialPerforation').setValue(_element.imperialPerforation)
      }
    });

  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  removeItem(index: any) {
    /*     if (this.troquelFormCall.controls.length == 1) {
          this.troquelFormCall.reset();
          this.troquelFormCall.controls[0].get('mainDie').setValue(true);
          this.troquelFormCall.controls[0].get('listTroquel').setValue('');
          return;
        } */

    let ValidateItem = false;
    if (this.troquelFormCall.controls[index].get('mainDie').value) {
      ValidateItem = true;
    }
    this.troquelFormCall.controls.splice(index, 1);
    if (ValidateItem) {
      if (this.troquelFormCall.controls.length > 1) {
        this.troquelFormCall.controls[0].get('mainDie').setValue(true);
      } else {
        this.troquelFormCall.controls.forEach((element, ind) => {
          if (
            element.get('mainDie') !== null &&
            element.get('mainDie') !== undefined
          ) {
            element.get('mainDie').setValue(true);
          }
        });
      }
    }

    if (this.troquelFormCall.length < this.maxTroquel) {
      this.btnDisplaying = true;
    }
  }

  btnAddTroquel() {
    const idItem = this.troquelFormCall.length + 1;
    if (this.troquelFormCall.length + 1 >= this.maxTroquel) {
      this.btnDisplaying = false;
    }

    this.troquelFormCall.push(this.itemCartSet2({ id: idItem }));
    if (this.troquelFormCall.controls.length == 1) {
      this.troquelFormCall.reset();
      this.troquelFormCall.controls[0].get('mainDie').setValue(true);
    }
  }

  handleChange(event, index) {
    if (event.target.checked) {
      if (this.troquelFormCall.controls.length > 1) {
        this.troquelFormCall.controls.forEach((element, ind) => {
          if (
            element.get('mainDie') !== null &&
            element.get('mainDie') !== undefined
          ) {
            element.get('mainDie').setValue(false);
          }
        });
        this.troquelFormCall.controls[index]
          .get('mainDie')
          .setValue(true);
      } else {
        this.troquelFormCall.controls.forEach((element, ind) => {
          if (
            element.get('mainDie') !== null &&
            element.get('mainDie') !== undefined
          ) {
            element.get('mainDie').setValue(true);
          }
        });
      }
    } else {
      if (this.troquelFormCall.controls.length > 1) {
        this.troquelFormCall.controls[index]
          .get('mainDie')
          .setValue(true);
      } else {
        this.troquelFormCall.controls.forEach((element, ind) => {
          if (
            element.get('mainDie') !== null &&
            element.get('mainDie') !== undefined
          ) {
            element.get('mainDie').setValue(true);
          }
        });
      }
    }
  }

  public paramLine(paramLineId?: number) {
    this.troquelFormCall.clear();
    if (paramLineId === this.linesIdShow.flexoPapelTextil || paramLineId === this.linesIdShow.flexoPapelNoTextil) {
      this.showComponents = true;
      this.showTroquel = true;
      this.showExpand = true;
      this.btnDisplaying = true;
      this.dieGetservice(paramLineId);
      this.troquelFormCall.push(
        this.itemCartSet2({
          id: '1',
          mainDie: true,
        })
      );
    } else if (paramLineId === this.linesIdShow.offSet) {
      this.showComponents = false;
      this.showTroquel = true;
      this.showExpand = false;
      this.btnDisplaying = false;
      this.troquelFormCall.push(
        this.itemCartSet2({
          id: '1',
          mainDie: false,
        })
      );
    } else {
      this.showComponents = false;
      this.showTroquel = false;
      this.showExpand = false;
      this.btnDisplaying = false;
    }
  }

  private itemCartSet2(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      dieId: ['', Validators.nullValidator],
      paperWidth: ['', Validators.nullValidator],
      labelsAcross: ['', Validators.nullValidator],
      labelsAround: ['', Validators.nullValidator],
      cornerRadius: ['', Validators.nullValidator],
      imperialPerforation: ['', Validators.nullValidator],
      mainDie: [data.mainDie, Validators.nullValidator]
    });
  }

  public readactiondetail() {
    this.router.url.includes('detail') ? (this.formsetdetails(), this.details = true) : false;
  }

  public formsetdetails() {
    Object.keys(this.troquelDataForm.controls).forEach((key, index) => {
      this.troquelDataForm.get(key).disable();
    });
  }

}
