import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AniloxService } from 'src/app/core/services/anilox/anilox.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/table';
import { FormProvider } from '../form-provider';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import moment from 'moment';

@Component({
  selector: 'app-anilox',
  templateUrl: './anilox.component.html',
  styleUrls: ['./anilox.component.css'],
})
export class AniloxComponent implements OnInit, AfterViewChecked {
  @ViewChild('tablaFinotexAnilox') someInput: Table;
  @ViewChild('ngForm') ngForm: FormGroupDirective;
  aniloxForm: FormGroup;
  showModalAnilox: boolean = false;
  formStatusText = '';
  formMaterialsIconStatus = 2;
  expandedRows: {} = {};
  listStationDrop = [];
  listAniloxDrop = [];
  listAniloxType = [];
  listMaterialPosition = [];
  WaterView: boolean;
  UvView: boolean;
  BCMView: boolean;
  StickyBackView: boolean;
  Delta_EView: boolean;
  Minimum_DensityView: boolean;
  Maximum_DensityVeiw: boolean;
  Photopolymeter: boolean;
  Polymer_Type: boolean;
  Photopolymer_Change_Date: boolean;
  Consumption_Grams: boolean;
  Register_StatusIdView: boolean;
  styleMobiles: any = { width: '80vw' };
  lang = 'en';
  settingsDates: any = {
    minDate: new Date(2021, 1 - 1, 1),
    required: false,
    dateFormat: this.lang == 'en' ? 'M/dd/yy' : 'dd/M/yy',
    ids: ['date'],
    labels: 'anilox.Photopolymer_Change_Date',
  };

  submitted: boolean;
  public href: string = '';
  public details: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private aniloxService: AniloxService,
    private messageService: MessageService,
    private translate: TranslateService,
    private formProvider: FormProvider,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private responsive: BreakpointObserver,
    private router: Router,
    protected translateService: TranslateService,
    private storageService: StorageService
  ) {
    this.readactiondetail();
  }

  ngOnInit(): void {
    this.initiateForm();
    this.resizeWindow();
    window.addEventListener('resize', (e) => {
      this.resizeWindow();
    });
    this.traductorlocal();
  }

  resizeWindow(): void {
    this.responsive.observe(Breakpoints.XSmall).subscribe((result) => {
      if (result.matches) {
        this.showModalAnilox = false;
        this.styleMobiles = { width: '105vw' };
      } else {
        this.showModalAnilox = false;
        this.styleMobiles = { width: '80vw' };
      }
    });
  }

  resizeModal() {
    return this.styleMobiles;
  }

  ngAfterViewInit(): void {
    const thisRef = this;
    this.getFormAniloxHeader.value.forEach(function (_car) {
      thisRef.someInput.expandedRowKeys[_car.id] = false;
    });
    this.expandedRows = Object.assign({}, this.expandedRows);

    this.showAllFieldsValidatorView();
    this.validateFormStatus();
  }

  showAllFieldsValidatorView(): void {
    this.UvView = true;
    this.WaterView = true;
    this.BCMView = true;
    this.StickyBackView = true;
    this.Delta_EView = true;
    this.Minimum_DensityView = true;
    this.Maximum_DensityVeiw = true;
    this.Register_StatusIdView = true;
    this.Photopolymeter = true;
    this.Polymer_Type = true;
    this.Photopolymer_Change_Date = true;
    this.Consumption_Grams = true;
  }

  validateFormStatus(): void {
    this.formMaterialsIconStatus = this.aniloxForm.valid == true ? 1 : 2;
    this.formStatusText =
      this.aniloxForm.valid == true
        ? 'technical-sheets.session_form_completed'
        : 'technical-sheets.session_form_without_completed';

    this.aniloxForm.valueChanges.subscribe((value) => {
      this.formMaterialsIconStatus = this.aniloxForm.valid == true ? 1 : 2;
      this.formStatusText =
        this.aniloxForm.valid == true
          ? 'technical-sheets.session_form_completed'
          : 'technical-sheets.session_form_without_completed';
    });
  }

  public showHideForm(paramLineId: number) {
    switch (paramLineId) {
      //Estampado
      case 66:
        this.showAllFieldsValidatorNotRequire();
        this.showAllFieldsValidatorView();
        this.showFormRequireEst();

        break;

      // Flexo papel Textil No textil
      case 74:
      case 76:
        this.showAllFieldsValidatorNotRequire();
        this.showAllFieldsValidatorView();
        this.showFormRequireTextil();
        break;

      default:
        this.showAllFieldsValidatorNotRequire();
        this.showAllFieldsValidatorView();
        this.showFormRequireTextil();
        break;
    }
  }
  showFormRequireEst() {
    this.UvView = false;
    this.WaterView = false;
    this.BCMView = false;
    this.StickyBackView = false;
    this.Delta_EView = false;
    this.Minimum_DensityView = false;
    this.Maximum_DensityVeiw = false;
    this.Register_StatusIdView = false;
    this.Photopolymeter = true;
    this.Polymer_Type = true;
    this.Photopolymer_Change_Date = true;
    this.Consumption_Grams = true;
  }

  showAllFieldsValidatorNotRequire(): void {
    const listNotRequired = [
      {
        name: 'BCM',
        required: Validators.nullValidator,
      },
      {
        name: 'StickyBack',
        required: Validators.nullValidator,
      },
      {
        name: 'Delta_E',
        required: Validators.nullValidator,
      },
      {
        name: 'Minimum_Density',
        required: Validators.nullValidator,
      },
      {
        name: 'Maximum_Density',
        required: Validators.nullValidator,
      },
      {
        name: 'Register_StatusId',
        required: Validators.nullValidator,
      },
      {
        name: 'Photopolymeter',
        required: Validators.nullValidator,
      },
      {
        name: 'Polymer_Type',
        required: Validators.nullValidator,
      },
      {
        name: 'Photopolymer_Change_Date',
        required: Validators.nullValidator,
      },
      {
        name: 'Consumption_Grams',
        required: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
  }

  showFormFields(data: any[]): void {
    data.forEach((Value, index) => {
      this.getFormAniloxHeader.controls.forEach((element, ind) => {
        element.get(Value.name).setValidators(Value.required);
        element.get(Value.name).updateValueAndValidity();
      });
    });
  }

  showFormRequireTextil(): void {
    const listNotRequired = [
      {
        name: 'BCM',
        required: Validators.required,
      },
      {
        name: 'StickyBack',
        required: Validators.required,
      },
      {
        name: 'Delta_E',
        required: Validators.required,
      },
      {
        name: 'Minimum_Density',
        required: Validators.required,
      },
      {
        name: 'Maximum_Density',
        required: Validators.required,
      },
      {
        name: 'Photopolymeter',
        required: Validators.nullValidator,
      },
      {
        name: 'Polymer_Type',
        required: Validators.required,
      },
      {
        name: 'Photopolymer_Change_Date',
        required: Validators.required,
      },
      {
        name: 'Consumption_Grams',
        required: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initiateForm() {
    this.aniloxForm = this.formBuilder.group({
      header: this.formBuilder.array([], this.itemHeader({})),
    });
  }

  private itemHeader(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      Station_Number: ['', [Validators.required]],
      Material_PositionId: [data.positionMaterialId, [Validators.required]],
      Description: [data.nameItem, [Validators.nullValidator]],
      Square_Millimeter_Area: ['', [Validators.required]],
      Anilox: ['', [Validators.required]],
      //Uv: ['', [Validators.nullValidator]],
      //Water: ['', [Validators.nullValidator]],
      BCM: ['', [Validators.nullValidator]],
      StickyBack: ['', [Validators.nullValidator]],
      Delta_E: ['', [Validators.nullValidator]],
      Minimum_Density: ['', [Validators.nullValidator]],
      Maximum_Density: ['', [Validators.nullValidator]],
      Register_StatusId: ['', [Validators.nullValidator]],
      Photopolymeter: [''],
      Polymer_Type: ['', [Validators.required]],
      Photopolymer_Change_Date: ['', [Validators.required]],
      Consumption_Grams: [''],
      lineId: [data.lineId, [Validators.nullValidator]],
    });
  }

  private itemHeaderForUpdateView(data: any, lineId: number): FormGroup {
    console.log(data);
    return this.formBuilder.group({
      id: [data.materialPositionId, Validators.nullValidator],
      Station_Number: [data.stationNumber, [Validators.required]],
      Material_PositionId: [data.materialPositionId, [Validators.required]],
      Description: [data.description, [Validators.nullValidator]],
      Square_Millimeter_Area: [
        data.squareMillimeterArea,
        [Validators.required],
      ],
      Anilox: [data.aniloxRollId, [Validators.required]],
      //Uv: ['', [Validators.nullValidator]],
      //Water: ['', [Validators.nullValidator]],
      BCM: [data.bcm, [Validators.nullValidator]],
      StickyBack: [data.stickyBack, [Validators.nullValidator]],
      Delta_E: [data.deltaE, [Validators.nullValidator]],
      Minimum_Density: [
        data.minimumDensityPercentage,
        [Validators.nullValidator],
      ],
      Maximum_Density: [
        data.maximumDensityPercentage,
        [Validators.nullValidator],
      ],
      Register_StatusId: [data.registerStatusId, [Validators.nullValidator]],
      Photopolymeter: [data.photoPolymerId, [Validators.nullValidator]],
      Polymer_Type: [data.photoPolymerType, [Validators.required]],
      Photopolymer_Change_Date: [
        data.changeDatePhotoPolymer,
        [Validators.required],
      ],
      Consumption_Grams: [data.kilosOfConsumption, [Validators.nullValidator]],
      lineId: [lineId, [Validators.nullValidator]],
    });
  }

  get getFormAniloxHeader() {
    return this.aniloxForm.get('header') as FormArray;
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  setAnilloxFormForEdit(element: any, lineId: number): void {
    this.getFormAniloxHeader.push(
      this.itemHeaderForUpdateView(element, lineId)
    );
  }

  showPanelDialogAnilox(open: boolean, lineId: any, materialsForm: any): void {
    this.showModalAnilox = open;
    this.getServiceAniloxLine(lineId);
    this.getServiceAniloxType();
    this.getServiceAniloxStation();

    if (this.getFormAniloxHeader.value.length <= 0) {
      materialsForm.value
        .filter((item) => item.isPositionNumberOfColors == 'S')
        .forEach((_element, _index) => {
          this.listMaterialPosition.push({
            name: _element.positionMaterial,
            value: _element.id,
          });

          this.getFormAniloxHeader.push(this.itemHeader(_element));
        });
    }

    materialsForm.value
      .filter((item) => item.isPositionNumberOfColors == 'S')
      .forEach((_element, _index) => {
        this.getFormAniloxHeader
          .at(_index)
          .get('Description')
          .setValue(_element.nameItem);
      });

    this.showHideForm(lineId);
  }

  showPanelDialogAniloxForEdit(
   
    open: boolean,
    lineId: any,
    materialsForm: any
  ): void {
    this.showModalAnilox = open;
    if (open) {
      this.getServiceAniloxLine(lineId);
      this.getServiceAniloxType();
      this.getServiceAniloxStation();
      this.showHideForm(lineId);

      materialsForm.value
        .filter((item) => item.isPositionNumberOfColors == 'S')
        .forEach((_element, _index) => {
          this.listMaterialPosition.push({
            name: _element.positionMaterial,
            value: _element.id,
          });
          this.getFormAniloxHeader.push(this.itemHeader(_element));
        });
    }
  }

  getServiceAniloxStation() {
    this.aniloxService.getAniloxStation({}).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listStationDrop = response.data;
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });
          }
        } else {
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
        this.listAniloxDrop = [];
      },
      () => {}
    );
  }

  getServiceAniloxLine(lineId: any): void {
    var parameter = { lineId: lineId };
    this.aniloxService.getAniloxRollLine(parameter).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listAniloxDrop = response.data;
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });
          }
        } else {
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
        this.listAniloxDrop = [];
      },
      () => {}
    );
  }

  getServiceAniloxType(): void {
    this.aniloxService.getServiceAniloxType().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listAniloxType = response.data;
            this.listAniloxType.push({
              polymerId: '4',
              polymerName: 'N/A',
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: response.message,
            });
          }
        } else {
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
        this.listAniloxType = [];
      },
      () => {}
    );
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  onKeyPressNumberDecimal(event) {
    return /[0-9.]/.test(String.fromCharCode(event.which));
  }

  clearFormTable(): void {
    this.getFormAniloxHeader.clear();
    this.listMaterialPosition = [];
  }

  public readactiondetail() {
    this.router.url.includes('detail') ? (this.details = true) : false;
  }

  public formsetdetails() {
    Object.keys(this.aniloxForm.controls).forEach((key, index) => {
      this.aniloxForm.get(key).disable();
    });
  }

  //TODO : sincroniza el idioma actual junto con el localstorage
  public traductorlocal() {
    moment.locale(this.storageService.getLanguage());
    this.lang = this.storageService.getLanguage();
    let currentLang = this.translateService.currentLang;
    currentLang = this.lang;
    this.translateService.use(currentLang);
  }
}
