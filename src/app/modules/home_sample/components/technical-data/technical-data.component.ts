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
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/public_api';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ProductionMastersService } from 'src/app/core/services/production-masters/production-masters.service';
import { TechinicalService } from 'src/app/core/services/technical-sheets/techinical.service';
import { TechnicalDataLines } from 'src/app/shared/constant/tecnicalDataLine';
import { Router } from '@angular/router';
@Component({
  selector: 'app-technical-data',
  templateUrl: './technical-data.component.html',
  styleUrls: ['./technical-data.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class TechnicalDataComponent implements OnInit, AfterViewInit {
  @ViewChild('tablaFinotex') someInput: Table;
  @Output() paramLongProductionUpdate = new EventEmitter<string>();
  @Input() line: any;
  @Input() productId: any;
  technicalDataForm: FormGroup;
  formTechnicalIconStatus = 2;
  formStatusText = '';
  expandedRows: {} = {};
  showModalProductionLarge: boolean = false;
  lblNumberLargeProduct: number = 0;
  updateNumberLargeProduct: number = 0;
  validateLargeproduction: boolean = false;
  linesIdShow = TechnicalDataLines.GetTechnicalDataLineg;
  btnDisplaying: boolean = false;
  countTechnicalData: number = 0;
  lineIdGet: number = 0;
  lineIdGetValid: boolean = false;
  displayInvalidForm: boolean = false;
  totalPicksHilo: number = 0;
  totalPicksColor: number = 0;
  listComponentsValidating = [
    {
      control: 'resourceModel',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.estampados +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.heatTransferLaser +
        ',' +
        this.linesIdShow.thermal +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.estampaciónSublimacion +
        ',' +
        this.linesIdShow.sinteticaScreen +
        ',' +
        this.linesIdShow.sintetico +
        ',' +
        this.linesIdShow.estampadoScreen +
        ',' +
        this.linesIdShow.troquelado +
        ',' +
        this.linesIdShow.sinteticoOtros +
        ',' +
        this.linesIdShow.kitOffset +
        ',' +
        this.linesIdShow.kitEstampadoSublimacion +
        ',' +
        this.linesIdShow.kitOrilloMexico +
        ',' +
        this.linesIdShow.cortado +
        ',' +
        this.linesIdShow.kitHeattransfer +
        ',' +
        this.linesIdShow.kitFlexoMexico +
        ',' +
        this.linesIdShow.offSet +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'alternalResourceModel',
      show: true,
      required: false,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    { control: 'resourceId', show: true, required: true, lines: '' },
    {
      control: 'speed',
      show: true,
      required: true,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'standarTime',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'stationNumber',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil +
        ',' +
        this.linesIdShow.heatTranferPiezas,
    },
    {
      control: 'picks',
      show: true,
      required: false,
      lines:
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'totalPicks',
      show: true,
      required: false,
      lines:
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'cameraPicks',
      show: true,
      required: false,
      lines:
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'machinePicks',
      show: true,
      required: false,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'defaultModel',
      show: true,
      required: false,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.tejidoOrilloCortado +
        ',' +
        this.linesIdShow.estampados +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.heatTransferLaser +
        ',' +
        this.linesIdShow.thermal +
        ',' +
        this.linesIdShow.reatasyPretinas +
        ',' +
        this.linesIdShow.mascarillasTejidas +
        ',' +
        this.linesIdShow.estampaciónSublimacion +
        ',' +
        this.linesIdShow.sinteticaScreen +
        ',' +
        this.linesIdShow.sintetico +
        ',' +
        this.linesIdShow.estampadoScreen +
        ',' +
        this.linesIdShow.troquelado +
        ',' +
        this.linesIdShow.sinteticoOtros +
        ',' +
        this.linesIdShow.kitOffset +
        ',' +
        this.linesIdShow.kitEstampadoSublimacion +
        ',' +
        this.linesIdShow.kitOrilloMexico +
        ',' +
        this.linesIdShow.cortado +
        ',' +
        this.linesIdShow.kitHeattransfer +
        ',' +
        this.linesIdShow.kitFlexoMexico +
        ',' +
        this.linesIdShow.mezclasyTintas +
        ',' +
        this.linesIdShow.offSet +
        ',' +
        this.linesIdShow.telas,
    },
    {
      control: 'stampCylinderId',
      show: true,
      required: true,
      lines:
        this.linesIdShow.estampados +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil,
    },
    {
      control: 'repetitionNumber',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.estampados +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.heatTransferLaser +
        ',' +
        this.linesIdShow.estampaciónSublimacion +
        ',' +
        this.linesIdShow.sinteticaScreen +
        ',' +
        this.linesIdShow.sintetico +
        ',' +
        this.linesIdShow.estampadoScreen +
        ',' +
        this.linesIdShow.troquelado +
        ',' +
        this.linesIdShow.sinteticoOtros +
        ',' +
        this.linesIdShow.offSet,
    },
    {
      control: 'sheettype',
      show: true,
      required: false,
      lines:
        this.linesIdShow.heatTransferLaser +
        ',' +
        this.linesIdShow.estampaciónSublimacion +
        ',' +
        this.linesIdShow.offSet,
    },
    {
      control: 'perforationType',
      show: true,
      required: true,
      lines: this.linesIdShow.offSet,
    },
    {
      control: 'perforationDiameter',
      show: true,
      required: true,
      lines: this.linesIdShow.offSet,
    },
    {
      control: 'engravedType',
      show: true,
      required: true,
      lines: this.linesIdShow.offSet,
    },
    {
      control: 'sheetTypeId',
      show: true,
      required: true,
      lines: this.linesIdShow.heatTranferPiezas,
    },
    {
      control: 'paperWidth',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.flexoPapelTextil +
        ',' +
        this.linesIdShow.flexoPapelNoTextil +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'paperRealease',
      show: true,
      required: true,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.heatTranferPiezas +
        ',' +
        this.linesIdShow.estampaciónSublimacion,
    },
    {
      control: 'quantitySheet',
      show: true,
      required: false,
      lines:
        this.linesIdShow.heattranferRollo +
        ',' +
        this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'advance',
      show: true,
      required: true,
      lines: this.linesIdShow.heattranferRollo,
    },
    {
      control: 'squeegeeTravel',
      show: true,
      required: false,
      lines: this.linesIdShow.heattranferRollo,
    },
    {
      control: 'screenPeelOff',
      show: true,
      required: false,
      lines: this.linesIdShow.heattranferRollo,
    },
    { control: 'offCont', show: true, required: false, lines: '' },
    { control: 'numberOfOutputs', show: true, required: false, lines: '' },
    {
      control: 'deweed',
      show: true,
      required: false,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'buclecontrol',
      show: true,
      required: false,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'power',
      show: true,
      required: false,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'frequency',
      show: true,
      required: false,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'bladetype',
      show: true,
      required: false,
      lines: this.linesIdShow.heatTransferLaser,
    },
    {
      control: 'viscositystandard',
      show: true,
      required: true,
      lines: this.linesIdShow.mezclasyTintas,
    },
  ];
  resourceModelLineList = [];
  shapeTypeList = [];
  sheetTypeList = [];
  bladeTypeList = [];
  stampCilinderList = [];

  perforationTypeList = [
    {
      value: 'I',
      name: this.storageService.getLanguage() == 'es' ? 'Izquierda' : 'Left',
    },
    {
      value: 'D',
      name: this.storageService.getLanguage() == 'es' ? 'Derecha' : 'right',
    },
    {
      value: 'C',
      name: this.storageService.getLanguage() == 'es' ? 'Centro' : 'Center',
    },
    {
      value: 'N',
      name: 'N/A',
    },
  ];

  engravedTypeList = [
    {
      value: 'N',
      name: 'N/A',
    },
    {
      value: 'R',
      name:
        this.storageService.getLanguage() == 'es'
          ? 'Desprendible'
          : 'Detachable',
    },
    {
      value: 'D',
      name: this.storageService.getLanguage() == 'es' ? 'Dobles' : 'Doubles',
    },
  ];
  public href: string = '';
  public details: boolean = false;
  public edit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private messageService: MessageService,
    private translate: TranslateService,
    private productionMastersService: ProductionMastersService,
    private techinicalService: TechinicalService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const thisRef = this;
    this.technicalFormCall.value.forEach(function (car) {
      thisRef.someInput.expandedRowKeys[car.id] = false;
    });
    this.expandedRows = Object.assign({}, this.expandedRows);
  }

  ngOnInit(): void {
    this._InitForms();
    this.readactionedit();
    this.readactiondetail();
    this.edit || this.details ? null : this.setcartform();
    this.getshapeType();
    this.validateFormStatus();
    this.getshapeType();
    this.formTechnicalIconStatus = 2;
  }

  getResourceModelByLineId(line: any) {
    const data = {
      lineId: line,
    };
    this.productionMastersService.getResourceModelByLineId(data).subscribe(
      (response) => {
        if (response) {
          this.resourceModelLineList = response.data;
          this.btnDisplaying = response.data.length > 1 ? true : false;
          this.countTechnicalData = response.data.length;
        } else {
          this.resourceModelLineList = [];
        }
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

  getshapeType() {
    this.techinicalService.shapeTypeGet().subscribe(
      (response) => {
        if (response) {
          this.shapeTypeList = response.data;
        } else {
          this.shapeTypeList = [];
        }
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

  getSheetTypeByLineId(line: any) {
    const data = {
      lineId: line,
    };
    this.productionMastersService.getSheetTypeByLineId(data).subscribe(
      (response) => {
        if (response) {
          this.sheetTypeList = response.data;
        } else {
          this.sheetTypeList = [];
        }
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

  getBladeTypeByLineId(line: any) {
    const data = {
      lineId: line,
    };
    this.productionMastersService.getBladeTypeByLineId(data).subscribe(
      (response) => {
        if (response) {
          this.bladeTypeList = response.data;
        } else {
          this.bladeTypeList = [];
        }
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

  getStampCylinderByLineId(line: any) {
    const data = {
      lineId: line,
    };
    this.productionMastersService.getStampCylinderByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.stampCilinderList = response.data;
          } else {
            this.stampCilinderList = [];
            this.messageService.add({
              severity: 'ifnfo',
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
      },
      () => {}
    );
  }

  private _InitForms() {
    this.technicalDataForm = this.formBuilder.group({
      header: this.formBuilder.array([], this.itemHeader()),
    });
  }

  private itemHeader(): FormGroup {
    return this.formBuilder.group(
      {
        id: ['', Validators.nullValidator],
        resourceModel: ['', Validators.nullValidator],
        alternalResourceModel: ['', Validators.nullValidator],
        resourceId: ['', Validators.required],
        speed: ['', Validators.required],
        standarTime: ['', Validators.required],
        stationNumber: ['', Validators.required],
        picks: { value: null, disabled: this.validateRolAdmonDesigner() },
        totalPicks: { value: null, disabled: this.validateRolAdmonDesigner() },
        cameraPicks: ['', Validators.nullValidator],
        machinePicks: ['', Validators.nullValidator],
        defaultModel: ['', Validators.nullValidator],
        stampCylinderId: ['', Validators.required],
        repetitionNumber: ['', Validators.required],
        sheettype: ['', Validators.nullValidator],
        perforationType: ['', Validators.required],
        perforationDiameter: ['', Validators.required],
        engravedType: ['', Validators.required],
        sheetTypeId: ['', Validators.required],
        paperWidth: ['', Validators.required],
        paperRealease: ['', Validators.required],
        quantitySheet: ['', Validators.nullValidator],
        advance: ['', Validators.required],
        squeegeeTravel: ['', Validators.nullValidator],
        screenPeelOff: ['', Validators.nullValidator],
        offCont: ['', Validators.nullValidator],
        numberOfOutputs: ['', Validators.nullValidator],
        deweed: ['', Validators.nullValidator],
        buclecontrol: ['', Validators.nullValidator],
        power: ['', Validators.nullValidator],
        frequency: ['', Validators.nullValidator],
        bladetype: ['', Validators.nullValidator],
        viscositystandard: ['', Validators.required],
      },
      { updateOn: 'change' }
    );
  }

  validateFormStatus(): void {
    this.formTechnicalIconStatus = this.technicalFormCall.valid == true ? 1 : 2;
    this.formStatusText =
      this.technicalFormCall.valid == true
        ? 'technical-sheets.session_form_completed'
        : 'technical-sheets.session_form_without_completed';

    this.technicalDataForm.valueChanges.subscribe((value) => {
      this.formTechnicalIconStatus =
        this.technicalFormCall.valid == true ? 1 : 2;
      this.formStatusText =
        this.technicalFormCall.valid == true
          ? 'technical-sheets.session_form_completed'
          : 'technical-sheets.session_form_without_completed';
    });

    this.technicalDataForm.statusChanges.subscribe(() => {
      this.formTechnicalIconStatus =
        this.technicalFormCall.valid == true ? 1 : 2;
      this.formStatusText =
        this.technicalFormCall.valid == true
          ? 'technical-sheets.session_form_completed'
          : 'technical-sheets.session_form_without_completed';
    });
  }

  get technicalFormCall() {
    return this.technicalDataForm.get('header') as FormArray;
  }

  private itemCartSet2(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, { disable: this.details }, Validators.nullValidator],
      resourceModel: ['', { disable: this.details }, Validators.nullValidator],
      alternalResourceModel: [
        '',
        { disable: this.details },
        Validators.nullValidator,
      ],
      resourceId: ['', { disable: this.details }, Validators.required],
      speed: ['', { disable: this.details }, Validators.required],
      standarTime: ['', { disable: this.details }, Validators.required],
      stationNumber: ['', { disable: this.details }, Validators.required],
      picks: { value: null, disabled: this.validateRolAdmonDesigner() },
      totalPicks: { value: null, disabled: this.validateRolAdmonDesigner() },
      cameraPicks: ['', { disable: this.details }, Validators.nullValidator],
      machinePicks: ['', { disable: this.details }, Validators.nullValidator],
      defaultModel: [data.defaultModel, Validators.nullValidator],
      stampCylinderId: ['', { disable: this.details }, Validators.required],
      repetitionNumber: ['', { disable: this.details }, Validators.required],
      sheettype: ['', { disable: this.details }, Validators.nullValidator],
      perforationType: ['', { disable: this.details }, Validators.required],
      perforationDiameter: ['', { disable: this.details }, Validators.required],
      engravedType: [data.engravedType, Validators.required],
      sheetTypeId: ['', { disable: this.details }, Validators.required],
      paperWidth: ['', { disable: this.details }, Validators.required],
      paperRealease: ['', { disable: this.details }, Validators.required],
      quantitySheet: [data.quantitySheet, Validators.nullValidator],
      advance: ['', { disable: this.details }, Validators.required],
      squeegeeTravel: ['', { disable: this.details }, Validators.nullValidator],
      screenPeelOff: ['', { disable: this.details }, Validators.nullValidator],
      offCont: ['', { disable: this.details }, Validators.nullValidator],
      numberOfOutputs: [data.numberOfOutputs, Validators.nullValidator],
      deweed: ['', { disable: this.details }, Validators.nullValidator],
      buclecontrol: ['', { disable: this.details }, Validators.nullValidator],
      power: ['', { disable: this.details }, Validators.nullValidator],
      frequency: ['', { disable: this.details }, Validators.nullValidator],
      bladetype: ['', { disable: this.details }, Validators.nullValidator],
      viscositystandard: ['', { disable: this.details }, Validators.required],
    });
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  public showHideForm(paramLineId: number) {
    try {
      this.edit || this.details ? null : this.setcartformclear();

      let lineValidating = false;
      let linesIds = JSON.parse(JSON.stringify(this.linesIdShow));
      for (const line in linesIds) {
        if (linesIds[line] == paramLineId) {
          lineValidating = true;
          break;
        }
      }

      this.lineIdGet = paramLineId;
      this.lineIdGetValid = lineValidating;
      this.showFormFields(paramLineId, lineValidating);
      this.getBladeTypeByLineId(paramLineId);
      this.getResourceModelByLineId(paramLineId);
      this.getSheetTypeByLineId(paramLineId);
      this.getStampCylinderByLineId(paramLineId);
      this.largeProductionValidate(paramLineId);
    } catch (error) {}
  }

  showFormFields(paramLineId: number, lineIdValidating: boolean): void {
    this.listComponentsValidating.forEach((Value, index) => {
      this.technicalFormCall.controls.forEach((element, ind) => {
        if (
          element.get(Value.control) !== null &&
          element.get(Value.control) !== undefined
        ) {
          if (lineIdValidating) {
            if (String(Value.lines).includes(String(paramLineId))) {
              Value.show = true;
              element
                .get(Value.control)
                .setValidators([
                  Value.required
                    ? Validators.required
                    : Validators.nullValidator,
                ]);
              element.get(Value.control).updateValueAndValidity();
            } else {
              Value.show = false;
              if (Value.required) {
                element
                  .get(Value.control)
                  .setValidators([Validators.nullValidator]);
                element.get(Value.control).updateValueAndValidity();
              }
            }
          } else {
            Value.show = true;
            element
              .get(Value.control)
              .setValidators([
                Value.required ? Validators.required : Validators.nullValidator,
              ]);
            element.get(Value.control).updateValueAndValidity();
          }
        }
      });
    });
  }

  validateRolAdmonDesigner(): Boolean {
    if (
      this.storageService.getProfiles().role == 5 ||
      this.storageService.getProfiles().role == 9
    ) {
      return false;
    } else {
      return true;
    }
  }

  onFocusOutEventPicks(event: any, index) {
    try {
      if (
        event.target.value.trim().toUpperCase() != '' &&
        this.technicalFormCall.controls[index].get('defaultModel').value
      ) {
        if (this.validateLargeproduction) {
          this.technicalFormCall.controls.forEach((element, ind) => {
            let picks;
            let cameraPicks;
            let largoProduccion;
            if (
              element.get('picks') !== null &&
              element.get('picks') !== undefined
            ) {
              picks = element.get('picks').value;
            }

            if (
              element.get('cameraPicks') !== null &&
              element.get('cameraPicks') !== undefined
            ) {
              cameraPicks = element.get('cameraPicks').value;
            }
            if (picks && cameraPicks) {
              largoProduccion = (picks / cameraPicks) * 10;
              if (largoProduccion) {
                this.updateNumberLargeProduct = parseInt(largoProduccion);
                if (parseInt(largoProduccion) != this.lblNumberLargeProduct) {
                  this.showModalProductionLarge = true;
                }
              }
            }
          });
        }
      }
    } catch (error) {}
  }

  getLargoProduccion(largoProduccion: any) {
    this.lblNumberLargeProduct = largoProduccion;
  }

  largeProductionValidate(paramLineId: any) {
    if (
      this.linesIdShow.tejidoOrilloCortado == paramLineId ||
      this.linesIdShow.telas == paramLineId ||
      this.linesIdShow.mascarillasTejidas == paramLineId
    ) {
      this.validateLargeproduction = true;
    } else {
      this.validateLargeproduction = true;
    }
  }

  btnSelectNo() {
    this.paramLongProductionUpdate.emit(
      this.updateNumberLargeProduct + '-false'
    );
    this.lblNumberLargeProduct = this.updateNumberLargeProduct;
    this.showModalProductionLarge = false;
  }

  btnSelectSi() {
    this.paramLongProductionUpdate.emit(
      this.updateNumberLargeProduct + '-true'
    );
    this.showModalProductionLarge = false;
  }

  btnAddTechnical() {
    let AuxCountItem = this.countTechnicalData - this.technicalFormCall.length;
    const idItem = this.technicalFormCall.length + 1;
    if (AuxCountItem > 1 && this.technicalFormCall.length < AuxCountItem) {
      this.technicalFormCall.push(this.itemCartSet2({ id: idItem }));
    } else if ((AuxCountItem = 1)) {
      this.btnDisplaying = false;
      this.technicalFormCall.push(this.itemCartSet2({ id: idItem }));
    }

    this.showFormFields(this.lineIdGet, this.lineIdGetValid);
  }

  removeItem(index: any) {
    let ValidateItem = false;
    if (this.technicalFormCall.controls[index].get('defaultModel').value) {
      ValidateItem = true;
    }
    this.technicalFormCall.controls.splice(index, 1);
    if (ValidateItem) {
      if (this.technicalFormCall.controls.length > 1) {
        this.technicalFormCall.controls[0].get('defaultModel').setValue(true);
        this.validateFormStatus();
      } else {
        this.technicalFormCall.controls.forEach((element, ind) => {
          if (
            element.get('defaultModel') !== null &&
            element.get('defaultModel') !== undefined
          ) {
            element.get('defaultModel').setValue(true);
          }
          this.validateFormStatus();
        });
      }
    } else {
      this.technicalFormCall.removeAt(index);
      this.technicalFormCall.controls.splice(index, 1);
      this.validateFormStatus();
    }
  }
  showHideActions() {
    if (this.technicalFormCall.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  getTotalPicksHilo(paramTotalPickHilo: any) {
    this.totalPicksHilo = paramTotalPickHilo;
  }
  getTotalPicksColor(paramTotalPickcolor: any) {
    this.totalPicksColor = paramTotalPickcolor;
  }
  validatingTotalPicks(event: any, rowIndex: any) {
    if (event.target.value.trim().toUpperCase() != '') {
      let totalPicksParam = parseInt(event.target.value);
      if (totalPicksParam != this.totalPicksHilo) {
        this.displayInvalidForm = true;
      }
    }
  }
  handleChange(event, index) {
    if (event.target.checked) {
      if (this.technicalFormCall.controls.length > 1) {
        this.technicalFormCall.controls.forEach((element, ind) => {
          if (
            element.get('defaultModel') !== null &&
            element.get('defaultModel') !== undefined
          ) {
            element.get('defaultModel').setValue(false);
          }
        });
        this.technicalFormCall.controls[index]
          .get('defaultModel')
          .setValue(true);
      } else {
        this.technicalFormCall.controls.forEach((element, ind) => {
          if (
            element.get('defaultModel') !== null &&
            element.get('defaultModel') !== undefined
          ) {
            element.get('defaultModel').setValue(true);
          }
        });
      }
    } else {
      if (this.technicalFormCall.controls.length > 1) {
        this.technicalFormCall.controls[index]
          .get('defaultModel')
          .setValue(true);
      } else {
        this.technicalFormCall.controls.forEach((element, ind) => {
          if (
            element.get('defaultModel') !== null &&
            element.get('defaultModel') !== undefined
          ) {
            element.get('defaultModel').setValue(true);
          }
        });
      }
    }
  }

  clearcameraPicks(event, index: number): void {
    if (this.technicalFormCall.controls.length > 1) {
      this.technicalFormCall.controls[index].get('cameraPicks').setValue('');
    } else {
      this.technicalFormCall.controls.forEach((element, ind) => {
        if (
          element.get('cameraPicks') !== null &&
          element.get('cameraPicks') !== undefined
        ) {
          element.get('cameraPicks').setValue('');
        }
      });
    }
  }

  onKeyPressNumber(event) {
    return /[0-9]/.test(String.fromCharCode(event.which));
  }

  onKeyPressNumberDecimal(event) {
    return /[0-9.]/.test(String.fromCharCode(event.which));
  }

  getTechnicalData(paramProductId: any) {
    const body = {
      productId: paramProductId,
    };

    this.techinicalService.getTechnicalDataByProductId(body).subscribe(
      (response) => {
        if (response && response.status) {
          let listTechnical = response.data;
          console.log(listTechnical);
          for (let i = 0; i < listTechnical.length; i++) {
            let indexRow = i + 1;
            let dataRow = listTechnical[i];
            this.technicalFormCall.push(
              this.automateGetDataAdd({
                id: indexRow,
                resourceModel: dataRow.resourceModelId,
                alternalResourceModel: Number(dataRow.altenalResourceModel),
                resourceId: dataRow.resourceId,
                speed: dataRow.speed,
                standarTime: dataRow.standarTime,
                stationNumber: dataRow.stationNumber,
                picks: dataRow.picks,
                totalPicks: dataRow.totalPicks,
                cameraPicks: dataRow.cameraPicks,
                machinePicks: dataRow.machinePicks,
                defaultModel: dataRow.defaultModel,
                stampCylinderId: dataRow.stampCylinderId,
                repetitionNumber: dataRow.repetitionNumber,
                sheettype: dataRow.sheetTypeId,
                perforationType: dataRow.perforationType,
                perforationDiameter: dataRow.perforationDiameter,
                engravedType: dataRow.engravedType,
                sheetTypeId: dataRow.sheetTypeId,
                paperWidth: dataRow.paperWidth,
                paperRealease: dataRow.paperRealease,
                quantitySheet: dataRow.quantitySheet,
                advance: dataRow.advance,
                squeegeeTravel: dataRow.squeegeeTravel,
                screenPeelOff: dataRow.screenPeelOff,
                offCont: dataRow.offCont,
                numberOfOutputs: dataRow.numberOfOutputs,
                deweed: dataRow.dewee,
                buclecontrol: dataRow.markLoop,
                power: dataRow.power,
                frequency: dataRow.frecuency,
                bladetype: dataRow.bladeTypeId,
                viscositystandard: dataRow.viscositystandard,
              })
            );
          }

          this.showFormFields(this.lineIdGet, this.lineIdGetValid);
          this.readactiondetail();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
    );
  }

  private automateGetDataAdd(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      resourceModel: [data.resourceModel, Validators.nullValidator],
      alternalResourceModel: [
        Number(data.alternalResourceModel),
        Validators.nullValidator,
      ],
      resourceId: [data.resourceId, Validators.required],
      speed: [data.speed, Validators.required],
      standarTime: [data.standarTime, Validators.required],
      stationNumber: [data.stationNumber, Validators.required],
      picks: { value: data.picks, disabled: this.validateRolAdmonDesigner() },
      totalPicks: {
        value: data.totalPicks,
        disabled: this.validateRolAdmonDesigner(),
      },
      cameraPicks: [data.cameraPicks, Validators.nullValidator],
      machinePicks: [data.machinePicks, Validators.nullValidator],
      defaultModel: [data.defaultModel, Validators.nullValidator],
      stampCylinderId: [data.stampCylinderId, Validators.required],
      repetitionNumber: [data.repetitionNumber, Validators.required],
      sheettype: [data.sheetTypeId, Validators.nullValidator],
      perforationType: [data.perforationType, Validators.required],
      perforationDiameter: [data.perforationDiameter, Validators.required],
      engravedType: [data.engravedType, Validators.required],
      sheetTypeId: [data.sheetTypeId, Validators.required],
      paperWidth: [data.paperWidth, Validators.required],
      paperRealease: [data.paperRealease, Validators.required],
      quantitySheet: [data.quantitySheet, Validators.nullValidator],
      advance: [data.advance, Validators.required],
      squeegeeTravel: [data.squeegeeTravel, Validators.nullValidator],
      screenPeelOff: [data.screenPeelOff, Validators.nullValidator],
      offCont: [data.offCont, Validators.nullValidator],
      numberOfOutputs: [data.numberOfOutputs, Validators.nullValidator],
      deweed: [data.deweed, Validators.nullValidator],
      buclecontrol: [data.buclecontrol, Validators.nullValidator],
      power: [data.power, Validators.nullValidator],
      frequency: [data.frequency, Validators.nullValidator],
      bladetype: [data.bladetype, Validators.nullValidator],
      viscositystandard: [data.viscositystandard, Validators.required],
    });
  }

  public readactiondetail() {
    this.router.url.includes('detail')
      ? (this.formsetdetails(), (this.details = true))
      : false;
  }

  public readactionedit(): boolean {
    return this.router.url.includes('edit') ? (this.edit = true) : false;
  }

  public formsetdetails() {
    for (
      let i = 0;
      i < this.technicalDataForm['controls']['header']['controls'].length;
      i++
    ) {
      Object.keys(
        this.technicalDataForm['controls']['header']['controls'][i]['controls']
      ).forEach((key, index) => {
        //this.technicalDataForm.get(key).disable();
        this.technicalDataForm['controls']['header']['controls'][i]['controls'][
          key
        ].disable();
      });
    }
  }

  public setcartform() {
    this.technicalFormCall.push(
      this.itemCartSet2({
        id: '1',
        defaultModel: true,
        quantitySheet: 0,
        numberOfOutputs: 0,
        engravedType: 'N',
      })
    );
  }

  public setcartformclear() {
    this.technicalFormCall.clear();
    this.technicalFormCall.push(
      this.itemCartSet2({
        id: '1',
        defaultModel: true,
        quantitySheet: 0,
        numberOfOutputs: 0,
        engravedType: 'N',
      })
    );
  }
}
