import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Output,
  HostListener,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MasterProductService } from 'src/app/core/services/masterProduct/master-product.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'src/app/shared/framework-ui/primeng/tablafinotex/public_api';
import { MallasComponent } from '../mallas/mallas.component';
import { TechnicalDataLines } from 'src/app/shared/constant/tecnicalDataLine';
import { AniloxComponent } from '../anilox/anilox.component';
import { HomologsComponent } from '../homologs/homologs.component';
import { FormulaColorsComponent } from '../color-formula/color-formula.component';
import { FormProvider } from '../form-provider';
import { Store } from '@ngrx/store';
import {
  addMAterial,
  loadtest,
} from 'src/app/store/actions/materials.actions';
import { AppState } from 'src/app/store/app.state';
import { Observable } from 'rxjs';
import { Materials } from './models/MaterialPositionDTO';
import { Router } from '@angular/router';
import { MaterialsDto } from 'src/app/shared/models/materials-dto';

declare var $: any;

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class MaterialsComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() paramLineId: string = '';
  @Output() paramTotalPickHilo = new EventEmitter<number>();
  @Output() paramTotalPickcolor = new EventEmitter<number>();

  @ViewChild('tablaFinotex') someInput: Table;
  @ViewChild(MallasComponent) mallasComponent: MallasComponent;
  @ViewChild(AniloxComponent) aniloxComponent: AniloxComponent;
  @ViewChild(HomologsComponent) homologsComponent: HomologsComponent;
  @ViewChild(FormulaColorsComponent)
  formulaColorsComponent: FormulaColorsComponent;

  materialsForm: FormGroup;
  showModalMallas: boolean = false;
  linesIdShow = TechnicalDataLines.GetTechnicalDataLineg;
  btnDisplaying: boolean = false;
  materialsFormList: MaterialsDto[] = [];

  baseType = [
    {
      baseId: '0',
      baseName: 'N/A',
    },
    {
      baseId: '1',
      baseName: 'Estandar',
    },
    {
      baseId: '2',
      baseName: 'Trama',
    },
    {
      baseId: '3',
      baseName: 'Teñida',
    },
  ];

  printout = [
    {
      printoutId: 'F',
      printoutName: 'Frente/Tiro',
    },
    {
      printoutId: 'R',
      printoutName: 'Post/Retiro',
    },
    {
      printoutId: 'C',
      printoutName: 'Cuerpo',
    },
    {
      printoutId: 'N',
      printoutName: ' N/A ',
    },
  ];

  expandedRows: {} = {};
  formMaterialsIconStatus = 2;
  formStatusText = '';
  listMaterialCategory = [];
  positionMaterial: boolean;
  category: boolean;
  material: boolean;
  nameItem: boolean;
  pick_hilo: boolean;
  description: boolean;
  color: boolean;
  print_run_by_color: boolean;
  print: boolean;
  specialty: boolean;
  border: boolean;
  base: boolean;
  standard_quantity: boolean;
  real_quantity: boolean;
  unit_code: boolean;
  formula: boolean;
  formula_quantity: boolean;
  listTransferSpecialty = [];
  listMaterialPosition = [];
  listMaterialCode = [];
  listDataIdentification = [];
  lineId: number = 0;
  aniloxF = false;
  formredux$: Observable<any> = new Observable();
  public href: string = '';
  public details: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private masterProductService: MasterProductService,
    private messageService: MessageService,
    private translate: TranslateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private formProvider: FormProvider,
    private store: Store<AppState>,
    private router: Router
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!$(event.target).hasClass('fa-ellipsis-h')) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const thisRef = this;
    this.materialsFormCall.value.forEach(function (_car) {
      thisRef.someInput.expandedRowKeys[_car.id] = false;
    });
    this.expandedRows = Object.assign({}, this.expandedRows);
  }

  ngOnInit(): void {
    this._InitForms();
    this.showAllFieldsValidatorView();
    this.validateFormStatus();
    this.transferSpecialty();
    this.store.dispatch(loadtest());
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  private _InitForms() {
    this.materialsForm = this.formBuilder.group({
      header: this.formBuilder.array([], this.itemHeader()),
    });
  }

  setAnilloxForEdit(flexo: any):void{
    flexo.map(x=>{
      this.aniloxComponent.setAnilloxFormForEdit(x, this.lineId);
    });
  }
  private itemHeader(): FormGroup {
    return this.formBuilder.group({
      id: ['', Validators.nullValidator],
      positionMaterial: ['', [Validators.nullValidator]],
      positionMaterialId: ['', [Validators.nullValidator]],
      category: ['', [Validators.nullValidator]],
      material: ['', [Validators.nullValidator]],
      listMaterials: this.formBuilder.array([], this.listControlDrop({})),
      nameItem: ['', [Validators.nullValidator]],
      pick_hilo: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator]],
      color: ['', [Validators.nullValidator]],
      print_run_by_color: [
        '',
        [Validators.nullValidator, Validators.maxLength(4)],
      ],
      print: ['', [Validators.nullValidator]],
      specialty: ['', [Validators.nullValidator]],
      border: ['', [Validators.nullValidator]],
      base: ['', [Validators.nullValidator]],
      standard_quantity: ['', [Validators.nullValidator]],
      real_quantity: ['', [Validators.nullValidator]],
      unit_code: ['', [Validators.nullValidator]],
      formula: ['', [Validators.nullValidator]],
      formula_quantity: ['', [Validators.nullValidator]],
      categorydefault: ['', [Validators.nullValidator]],
      isPositionNumberOfColors: ['', [Validators.nullValidator]],
      lineId: ['', [Validators.nullValidator]],
    });
  }

  private setItemMaterials(data: any): FormGroup {
    return this.formBuilder.group({
      id: [
        data.materialPositionId ? data.materialPositionId : data.id,
        Validators.nullValidator,
      ],
      positionMaterial: [
        data.positionName ? data.positionName : data.positionMaterial,
        [Validators.nullValidator],
      ],
      positionMaterialId: [
        data.materialPositionId
          ? data.materialPositionId
          : data.positionMaterialId,
        [Validators.nullValidator],
      ],
      category: [data.category, [Validators.required]],
      material: [
        data.productName ? data.productName : data.material,
        [Validators.nullValidator],
      ],
      listMaterials: this.formBuilder.array([], this.listControlDrop({})),
      nameItem: [
        data.nameItem ? data.nameItem : '',
        [Validators.nullValidator],
      ],
      pick_hilo: [data.picksByColor??data.pick_hilo, [Validators.nullValidator]],
      description: [data.description, [Validators.nullValidator]],
      color: [data.color, [Validators.nullValidator]],
      print_run_by_color: [data.print_run_by_color, [Validators.nullValidator]],
      print: [data.print, [Validators.nullValidator]],
      specialty: [data.transferSpecialtyId, [Validators.nullValidator]],
      border: [data.border, [Validators.nullValidator]],
      base: [data.base, [Validators.nullValidator]],
      standard_quantity: { value: null, disabled: true },
      real_quantity: { value: null, disabled: true },
      unit_code: { value: null, disabled: true },
      formula: ['', [Validators.nullValidator]],
      formula_quantity: { value: null, disabled: true },
      categorydefault: [data.categorydefault, [Validators.nullValidator]],
      isPositionNumberOfColors: [
        data.isPositionNumberOfColors,
        [Validators.nullValidator],
      ],
      lineId: [data.lineId, [Validators.nullValidator]],
    });
  }

  private listControlDrop(data: any): FormGroup {
    return this.formBuilder.group({
      materialId: [data.materialId, [Validators.nullValidator]],
      productName: [data.productName, [Validators.nullValidator]],
      colourName: [data.colourName, [Validators.nullValidator]],
      unitMeasureId: [data.unitMeasureId, [Validators.nullValidator]],
      materialName: [data.materialName, [Validators.nullValidator]],
    });
  }

  validateLen($event: any): boolean {
    return $event.target.value.length != 4;
  }
  get materialsFormCall() {
    return this.materialsForm.get('header') as FormArray;
  }

  get getHeatTransfer() {
    return this.mallasComponent.mallasFormCall.getRawValue();
  }

  get getFlexo() {
    return this.aniloxComponent.getFormAniloxHeader.getRawValue();
  }

  get isHeatTransferValid() {
    return (
      this.mallasComponent.mallasFormCall.valid ||
      this.mallasComponent.mallasFormCall.length == 0
    );
  }

  get isFlexoValid() {
    return (
      this.aniloxComponent.getFormAniloxHeader.valid ||
      this.aniloxComponent.getFormAniloxHeader.length == 0
    );
  }

  proccessSettings(paramLineId: number) {
    if (
      paramLineId == this.linesIdShow.heattranferRollo ||
      paramLineId == this.linesIdShow.heatTranferPiezas ||
      paramLineId == this.linesIdShow.sinteticaScreen ||
      paramLineId == this.linesIdShow.sintetico ||
      paramLineId == this.linesIdShow.estampadoScreen ||
      paramLineId == this.linesIdShow.troquelado ||
      paramLineId == this.linesIdShow.sinteticoOtros
    ) {
      return true;
    }
    return false;
  }

  onItemClick(rowData: any, dt: any) {
    if (dt.expandedRowKeys[rowData.id]) {
      dt.expandedRowKeys[rowData.id] = false;
    } else {
      dt.expandedRowKeys[rowData.id] = true;
    }
  }

  validateFormStatus(): void {
    this.formMaterialsIconStatus =
      this.materialsFormCall.valid == false ? 1 : 2;
    this.formStatusText =
      this.materialsFormCall.valid == false
        ? 'technical-sheets.session_form_completed'
        : 'technical-sheets.session_form_without_completed';

    this.materialsForm.valueChanges.subscribe((value) => {
      this.formMaterialsIconStatus =
        this.materialsFormCall.valid == true ? 1 : 2;
      this.formStatusText =
        this.materialsFormCall.valid == true
          ? 'technical-sheets.session_form_completed'
          : 'technical-sheets.session_form_without_completed';
    });
  }

  materialCategoryByLineIdService(paramLineId: number): void {
    const data = { lineId: paramLineId };
    this.lineId = paramLineId;
    this.aniloxComponent.clearFormTable();
    this.masterProductService.getMaterialCategoryByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listMaterialCategory = response.data;
          } else {
            this.listMaterialCategory = [];
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
        this.listMaterialCategory = [];
      },
      () => { }
    );
  }

  changeCategory(event: any, _rowIndex): void {
    this.materialsFormCall.at(_rowIndex).get('nameItem').setValue('');
    this.store.dispatch(
      addMAterial({ materials: this.materialsForm.value.header })
    );
    event.value == undefined
      ? this.materialCodeByCategory(event, _rowIndex)
      : this.materialCodeByCategory(event.value, _rowIndex);
  }

  changeMaterialCode(event: any, rowIndex2): void {
    let nameItem = this.materialsFormCall
      .at(rowIndex2)
      .get('listMaterials')
      .value.filter((item) => item.materialId == event.value)[0];
    this.materialsFormCall
      .at(rowIndex2)
      .get('nameItem')
      .setValue(nameItem.productName);
    this.store.dispatch(
      addMAterial({ materials: this.materialsForm.value.header })
    );
  }

  materialCodeByCategory(materialCategoryId: number, rowIndex: number): void {
    const data = { materialCategoryId: materialCategoryId };
    this.masterProductService.getMaterialCode(data).subscribe(
      (response) => {
        if (response.status) {
          (
            this.materialsFormCall
              .at(rowIndex)
              .get('listMaterials') as FormArray
          ).clear();
          response.data.forEach((element) => {
            (
              this.materialsFormCall
                .at(rowIndex)
                .get('listMaterials') as FormArray
            ).push(this.listControlDrop(element));
          });
          this.getSumTotalPicks();
        }
      },
      (error) => {
        this.validateError(error, rowIndex);
      },
      () => { }
    );
  }

  validateError(error: any, _rowIndex) {
    if (error.error.message != null) {
      (
        this.materialsFormCall.at(_rowIndex).get('listMaterials') as FormArray
      ).clear();

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
  }

  transferSpecialty(): void {
    this.masterProductService.getAllTransferSpecialty().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.listTransferSpecialty = response.data;
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
        this.listTransferSpecialty = [];
      },
      () => { }
    );
  }

  materialPositionByLineId(_listDataIdentification): void {
    
    let data = { LineId: _listDataIdentification.value.Line };
    this.masterProductService.getMaterialPositionByLineId(data).subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.materialsFormCall.value.forEach((_item, _index) => {
              this.materialsFormCall
                .at(_index)
                .get('category')
                .setValue(_item.categorydefault);

              if (_item.categorydefault != "") {
                this.store.dispatch(
                  addMAterial({ materials: this.materialsForm.value.header })
                );
                this.materialCodeByCategory(this.materialsFormCall.at(_index).get('categorydefault').value, _index)
              }

              if (_item.category != "" && _item.categorydefault == "") {
                this.materialsFormCall
                  .at(_index)
                  .get('category')
                  .setValue(_item.category);

                this.materialCodeByCategory(this.materialsFormCall
                  .at(_index)
                  .get('category').value, _index)

                this.materialsFormCall
                  .at(_index)
                  .get('nameItem')
                  .setValue(_item.nameItem);
              }

            });
            this.getSumTotalPicks();
            this.showHideForm(_listDataIdentification.value.Line);
            this.materialsDeleteNewItems(
              response.data,
              _listDataIdentification
            );
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
        this.listMaterialCategory = [];
      },
      () => { }
    );
  }

  materialsDeleteNewItems(data: any, _listDataIdentification: any, isEdit = false): void {
    data.forEach((element) => {
      element.categorydefault = element.materialCategoryIdDefault;
    });
    let accesoriesValidation = !(
      _listDataIdentification.controls.Number_accessories.value == '' ||
      _listDataIdentification.controls.Number_accessories.value == 0
    );
    let colorValidation = !(
      _listDataIdentification.controls.Number_colors.value == '' ||
      _listDataIdentification.controls.Number_colors.value == 0
    );
    let adhesiveValidation = !(
      _listDataIdentification.controls.Number_stickers.value == '' ||
      _listDataIdentification.controls.Number_stickers.value == 0
    );
    let papersValidation = !(
      _listDataIdentification.controls.Number_papers.value == '' ||
      _listDataIdentification.controls.Number_papers.value == 0
    );
    let auxValidation = !(
      _listDataIdentification.controls.Auxiliary_numbers.value == '' ||
      _listDataIdentification.controls.Auxiliary_numbers.value == 0
    );
    let reductiveValidation = !(
      _listDataIdentification.controls.Reductive_numbers.value == '' ||
      _listDataIdentification.controls.Reductive_numbers.value == 0
    );

    let automaticList = data.filter((item) => item.isAutomaticPosition === 'S');
    let colorList = data.filter(
      (item) =>
        item.isPositionNumberOfColors === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        colorValidation
    );
    let adhesiveList = data.filter(
      (item) =>
        item.isPositionNumberOfAdhesives === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        adhesiveValidation
    );
    let accesoriesList = data.filter(
      (item) =>
        item.isPositionNumberOfAccessories === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        accesoriesValidation
    );
    let papersList = data.filter(
      (item) =>
        item.isPositionNumberOfPapers === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        papersValidation
    );
    let auxList = data.filter(
      (item) =>
        item.IsPositionNumberOfAuxiliaries === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        auxValidation
    );
    let reductiveList = data.filter(
      (item) =>
        item.IsPositionNumberOfReductive === 'S' &&
        item.isAutomaticPosition !== 'S' &&
        reductiveValidation
    );

    colorList.splice(
      _listDataIdentification.controls.Number_colors.value,
      colorList.length
    );
    adhesiveList.splice(
      _listDataIdentification.controls.Number_stickers.value,
      adhesiveList.length
    );
    papersList.splice(
      _listDataIdentification.controls.Number_papers.value,
      papersList.length
    );
    accesoriesList.splice(
      _listDataIdentification.controls.Number_accessories.value,
      accesoriesList.length
    );
    auxList.splice(
      _listDataIdentification.controls.Auxiliary_numbers.value,
      auxList.length
    );
    reductiveList.splice(
      _listDataIdentification.controls.Reductive_numbers.value,
      reductiveList.length
    );
    
    this.materialsFormList = [];

    automaticList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    colorList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    adhesiveList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    papersList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    accesoriesList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    auxList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
    reductiveList.map((item) =>
      this.materialsFormList.push(this.setItemMaterials(item).value)
    );
   
    let antMaterialData = this.materialsFormCall.value;
    let finalMat = this.materialsFormList.map((item, index) => {
      let matIndex = antMaterialData.findIndex((x) => (x.id == item.id));
      let returnItem = matIndex > -1 ? antMaterialData[matIndex] : item
      if(isEdit && matIndex > -1)
      {
        returnItem.pick_hilo = Number(item.pick_hilo);
      }
      return returnItem;
    });
    this.materialsFormList = finalMat;
    this.materialsFormCall.clear();
    this.materialsFormCall.reset();

    this.materialsFormList.map((item) => {
      this.materialsFormCall.push(this.setItemMaterials({
        id: item.id,
        positionMaterial: item.positionMaterial,
        positionMaterialId: item.positionMaterialId
          ? item.positionMaterialId.trim()
          : null,
        category: item.category,
        material: item.material,
        nameItem: item.nameItem,
        pick_hilo: item.pick_hilo,
        description: item.description,
        color: item.color,
        print_run_by_color: item.print_run_by_color,
        print: item.print,
        specialty: item.specialty,
        border: item.border,
        base: item.base,
        standard_quantity: item.standard_quantity,
        real_quantity: item.real_quantity,
        unit_code: item.unit_code,
        formula: item.formula,
        formula_quantity: item.formula_quantity,
        categorydefault: item.categorydefault,
        isPositionNumberOfColors: item.isPositionNumberOfColors,
        lineId: item.lineId,
      }));
      this.materialsFormCall.updateValueAndValidity();      
    });
  }

  cleanltrim(arrayresponse: Materials[]) {
    return arrayresponse.sort((a, b) =>
      a.materialPositionId.trim() < b.materialPositionId.trim() ? -1 : 1
    );
  }

  showAllFieldsValidatorView(): void {
    this.positionMaterial = true;
    this.category = true;
    this.material = true;
    this.nameItem = true;
    this.pick_hilo = true;
    this.description = true;
    this.color = true;
    this.print_run_by_color = true;
    this.print = true;
    this.specialty = true;
    this.border = true;
    this.base = true;
    this.standard_quantity = true;
    this.real_quantity = true;
    this.unit_code = true;
    this.formula = true;
    this.formula_quantity = true;
  }

  public showHideForm(paramLineId: number) {
    this.btnDisplaying = this.proccessSettings(paramLineId);
    this.mallasComponent.showHideForm(paramLineId);
    switch (paramLineId) {
      //Heat transfer rollo
      case 52:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormHeartRollo();

        break;

      // Tejido/orillo cortado - mascarilla tejida
      case 60:
      case 63:
      case 67:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormTejido();
        break;

      //Estampados
      case 66:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormEstampado();
        break;

      //Flexo Papel Textil/No Textil
      case 74:
      case 76:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormFlexoPapel();
        break;

      //Heat Tranfer Piezas
      case 56:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormTranferPiezas();

        break;

      //Heat Tranfer Laser
      case 84:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormTranferLaser();

        break;

      //Thermal
      case 68:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormThermal();

        break;

      //Reatas y Pretinas
      case 64:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormReatas();

        break;

      case 63:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormEstampacion();
        break;

      //Reatas y Pretinas
      case 78:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormEstampacion();

        break;

      case 79:
      case 81:
      case 82:
      case 83:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormSinteticoScreen();

        break;

      case 30:
      case 86:
      case 87:
      case 88:
      case 89:
      case 91:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        this.showFormKits();

        break;

      default:
        this.showAllFieldsValidatorRequire();
        this.showAllFieldsValidatorView();
        break;
    }
  }

  showAllFieldsValidatorRequire(): void {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.nullValidator,
      },
      {
        name: 'material',
        required: Validators.nullValidator,
      },
      {
        name: 'nameItem',
        required: Validators.nullValidator,
      },
      {
        name: 'pick_hilo',
        required: Validators.nullValidator,
      },
      {
        name: 'description',
        required: Validators.nullValidator,
      },
      {
        name: 'color',
        required: Validators.nullValidator,
      },
      {
        name: 'print_run_by_color',
        required: Validators.nullValidator,
      },
      {
        name: 'print',
        required: Validators.nullValidator,
      },
      {
        name: 'specialty',
        required: Validators.nullValidator,
      },
      {
        name: 'border',
        required: Validators.nullValidator,
      },
      {
        name: 'base',
        required: Validators.nullValidator,
      },
      {
        name: 'standard_quantity',
        required: Validators.nullValidator,
      },
      {
        name: 'real_quantity',
        required: Validators.nullValidator,
      },
      {
        name: 'unit_code',
        required: Validators.nullValidator,
      },
      {
        name: 'formula',
        required: Validators.nullValidator,
      },
      {
        name: 'formula_quantity',
        required: Validators.nullValidator,
      },
      {
        name: 'positionMaterial',
        required: Validators.nullValidator,
      },
    ];
    this.showFormFields(listNotRequired);
  }

  showFormFields(data: any[]): void {
    data.forEach((Value, index) => {
      this.materialsFormCall.controls.forEach((element, ind) => {
        element.get(Value.name).setValidators(Value.required);
        element.get(Value.name).updateValueAndValidity();
      });
    });
  }

  showFormHeartRollo() {
    const listRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.border = false;
    this.base = false;
  }

  showFormTejido() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
      {
        name: 'pick_hilo',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.description = false;
    this.color = false;
    this.print = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormEstampado() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];

    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormFlexoPapel() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
  }

  showFormTranferPiezas() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.border = false;
    this.base = false;
  }

  showFormTranferLaser() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.print = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormThermal() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormReatas() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
      {
        name: 'pick_hilo',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.print_run_by_color = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
    this.unit_code = false;
  }

  showFormEstampacion() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.print = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormSinteticoScreen() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.pick_hilo = false;
    this.print = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
    this.standard_quantity = false;
    this.real_quantity = false;
    this.unit_code = false;
    this.formula = false;
    this.formula_quantity = false;
  }

  showFormKits() {
    const listNotRequired = [
      {
        name: 'category',
        required: Validators.required,
      },
      {
        name: 'material',
        required: Validators.required,
      },
    ];
    this.showFormFields(listNotRequired);
    this.description = false;
    this.color = false;
    this.print_run_by_color = false;
    this.pick_hilo = false;
    this.print = false;
    this.specialty = false;
    this.border = false;
    this.base = false;
  }

  showPanelDialog(): void {
    try {
      let getValueMaterials = [];
      this.materialsFormCall.controls.forEach((element, ind) => {
        let positionMaterial = '';
        let positionMaterialId = '';
        let description = '';
        if (
          element.get('nameItem') !== null &&
          element.get('nameItem') !== undefined
        ) {
          description = element.get('nameItem').value;
        }

        if (
          element.get('positionMaterial') !== null &&
          element.get('positionMaterial') !== undefined
        ) {
          positionMaterial = element.get('positionMaterial').value;
        }

        if (
          element.get('positionMaterialId') !== null &&
          element.get('positionMaterialId') !== undefined
        ) {
          positionMaterialId = element.get('positionMaterialId').value;
        }

        getValueMaterials.push({
          positionMaterial: positionMaterial,
          description: description,
          materialPositionId: positionMaterialId,
        });
      });
      this.mallasComponent.receiveParamsMaterials(getValueMaterials);
      this.getSumTotalPicks();
      this.mallasComponent.showPanelDialogMallas(true);
    } catch (error) {
      console.error(error);
    }
  }

  getSumTotalPicks() {
    let totalPicksforHilo = 0;
    let totalPicksforColor = 0;
    this.materialsFormCall.controls.forEach((element, ind) => {
      if (
        element.get('pick_hilo') !== null &&
        element.get('pick_hilo') !== undefined
      ) {
        let pick_hilo_value = 0;
        if (
          element.get('pick_hilo').value != null &&
          element.get('pick_hilo').value != ''
        ) {
          pick_hilo_value = isNaN(parseFloat(element.get('pick_hilo').value))
            ? 0
            : parseFloat(element.get('pick_hilo').value);
        }
        totalPicksforHilo += pick_hilo_value;
      }

      if (
        element.get('print_run_by_color') !== null &&
        element.get('print_run_by_color') !== undefined
      ) {
        let print_run_by_color = 0;
        if (
          element.get('print_run_by_color').value != null &&
          element.get('print_run_by_color').value != ''
        ) {
          print_run_by_color = isNaN(
            parseFloat(element.get('print_run_by_color').value)
          )
            ? 0
            : parseFloat(element.get('print_run_by_color').value);
        }
        totalPicksforColor += print_run_by_color;
      }
    });
    this.paramTotalPickHilo.emit(totalPicksforHilo);
    this.paramTotalPickcolor.emit(totalPicksforColor);
  }

  receiverDataOfIdentification(dataArticleIdentification: any) {
    this.materialPositionByLineId(dataArticleIdentification);
  }

  popUpContextMenu(id: string) {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    document.getElementById(id).classList.toggle('show');
  }

  popUpContextMenuAnilox() {
    this.aniloxComponent.showPanelDialogAniloxForEdit(
      true,
      this.lineId,
      this.materialsFormCall
    );
  }

  popUpContextMenuFormulaColor(index: number) {
    let isSpecialFormulaColor = false;
    let materialId = '';
    let description: '';
    if (this.materialsFormCall.controls.length > 1) {
      isSpecialFormulaColor =
        this.materialsFormCall.controls[index].get('formula').value;
      if (
        this.materialsFormCall.controls[index].get('material') !== null &&
        this.materialsFormCall.controls[index].get('material') !== undefined
      ) {
        if (
          this.materialsFormCall.controls[index].get('material').value !==
          null &&
          this.materialsFormCall.controls[index].get('material').value !==
          undefined
        ) {
          materialId = this.materialsFormCall.controls[index]
            .get('material')
            .value.trim();
        }
      }

      if (
        this.materialsFormCall.controls[index].get('nameItem') !== null &&
        this.materialsFormCall.controls[index].get('nameItem') !== undefined
      ) {
        description =
          this.materialsFormCall.controls[index].get('nameItem').value;
      }
    } else {
      this.materialsFormCall.controls.forEach((element, ind) => {
        if (
          element.get('formula') !== null &&
          element.get('formula') !== undefined
        ) {
          isSpecialFormulaColor = element.get('formula').value;
        }

        if (
          element.get('material') !== null &&
          element.get('material') !== undefined
        ) {
          if (
            element.get('material').value !== null &&
            element.get('material').value !== undefined
          ) {
            materialId = element.get('material').value.trim();
          }
        }

        if (
          element.get('nameItem') !== null &&
          element.get('nameItem') !== undefined
        ) {
          description = element.get('nameItem').value;
        }
      });
    }

    this.formulaColorsComponent.showPanelDialogFormulaColors(true);
    this.formulaColorsComponent.GetDataFormulaColors(
      isSpecialFormulaColor,
      materialId,
      materialId.concat(' ', description)
    );
  }

  popUpHomologs(rowIndex: number) {
    var materialId = this.materialsFormCall.at(rowIndex).get('material').value;
    this.homologsComponent.showPanelDialogHomologs(true, materialId);
  }

  validateLinePosition(): boolean {
    return this.lineId == 66 || this.lineId == 74 || this.lineId == 76;
  }
  
  materialsGetByData(dataComplete: any, paramProductId: any) {
    let datos = {
      productId: paramProductId.trim(),
    };

    this.masterProductService.getBillOfMaterialGetByProductId(datos).subscribe(
      (response) => {
        let listMaterialsData=[];
        if (response && response.status) {
          this.materialsFormCall.clear();
          this.materialsFormCall.reset();
          listMaterialsData = response.data;

          listMaterialsData.forEach( (item, i) =>{
            let dataRow = item;
            const categoryParam = dataRow.materialCategoryIdDefault
              ? dataRow.materialCategoryIdDefault
              : dataRow.materialCategoryId;
            this.materialsFormCall.push(
              this.automateGetMaterialsData({
                id: dataRow.materialPositionId,
                positionMaterial: dataRow.positionName,
                positionMaterialId: dataRow.materialPositionId,
                category: categoryParam,
                material: dataRow.materialId,
                /* nameItem: dataRow.nameItem, */
                pick_hilo: dataRow.picksByColor, 
                description: dataRow.description,
                /* color: dataRow.color, */
                print_run_by_color: dataRow.runByColor,
                print: dataRow.printout,
                specialty: dataRow.transferSpecialtyId,
                border: dataRow.border,
                base: dataRow.baseSource,
                standard_quantity: dataRow.standarQuantity,
                real_quantity: dataRow.realQuantity,
                unit_code: dataRow.unitMeasureId,
                formula: dataRow.standarFormula,
                formula_quantity: dataRow.quantityStandarFormula,
                /* categorydefault: dataRow.categorydefault, */
                /* isPositionNumberOfColors: dataRow.isPositionNumberOfColors, */
                lineId: dataRow.lineId,
              })
            );
            this.materialCodeByCategoryData(
              categoryParam,
              i,
              dataRow.materialId
            );
            this.readactiondetail();
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
        this.materialsDeleteNewItems(listMaterialsData, dataComplete, true);
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

  private automateGetMaterialsData(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id, Validators.nullValidator],
      positionMaterial: [data.positionMaterial, [Validators.nullValidator]],
      positionMaterialId: [data.positionMaterialId, [Validators.nullValidator]],
      category: [data.category, [Validators.required]],
      material: [data.productName, [Validators.nullValidator]],
      listMaterials: this.formBuilder.array([], this.listControlDrop({})),
      nameItem: [data.nameItem, [Validators.nullValidator]],
      pick_hilo: [data.picksByColor, [Validators.nullValidator]],
      description: [data.description, [Validators.nullValidator]],
      color: [data.color, [Validators.nullValidator]],
      print_run_by_color: [data.print_run_by_color, [Validators.nullValidator]],
      print: [data.print, [Validators.nullValidator]],
      specialty: [data.transferSpecialtyId, [Validators.nullValidator]],
      border: [data.border, [Validators.nullValidator]],
      base: [data.base, [Validators.nullValidator]],
      standard_quantity: { value: data.standard_quantity, disabled: true },
      real_quantity: { value: data.real_quantity, disabled: true },
      unit_code: { value: data.unit_code, disabled: true },
      formula: [data.formula, [Validators.nullValidator]],
      formula_quantity: { value: data.formula_quantity, disabled: true },
      categorydefault: [data.categorydefault, [Validators.nullValidator]],
      isPositionNumberOfColors: [
        data.isPositionNumberOfColors,
        [Validators.nullValidator],
      ],
      lineId: [data.lineId, [Validators.nullValidator]],
    });
  }

  materialCodeByCategoryData(
    materialCategoryId: number,
    rowIndex: number,
    valueParam: any
  ): void {
    const data = { materialCategoryId: materialCategoryId };
    this.masterProductService.getMaterialCode(data).subscribe(
      (response) => {
        if (response.status) {
          response.data.forEach((element) => {
            (
              this.materialsFormCall
                .at(rowIndex)
                .get('listMaterials') as FormArray
            ).push(this.listControlDrop(element));
          });

          let nameItem = this.materialsFormCall
            .at(rowIndex)
            .get('listMaterials')
            .value.filter((item) => item.materialId == valueParam)[0];
          this.materialsFormCall
            .at(rowIndex)
            .get('nameItem')
            .setValue(nameItem.productName);

          this.materialsFormCall
            .at(rowIndex)
            .get('material')
            .setValue(valueParam);
        }
      },
      (error) => {
        this.validateError(error, rowIndex);
      },
      () => { }
    );
  }

  public readactiondetail() {
    this.router.url.includes('detail')
      ? (this.formsetdetails(), (this.details = true))
      : false;
  }

  public formsetdetails() {
    for (
      let i = 0;
      i < this.materialsForm['controls']['header']['controls'].length;
      i++
    ) {
      Object.keys(
        this.materialsForm['controls']['header']['controls'][i]['controls']
      ).forEach((key, index) => {
        if (key != 'positionMaterial') {
          this.materialsForm['controls']['header']['controls'][i]['controls'][
            key
          ].disable();
        }
      });
    }
  }
}
