import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject  } from 'rxjs';
import { Store } from '@ngrx/store';
import { TechinicalService } from 'src/app/core/services/technical-sheets/techinical.service';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/messageservice';
import { ProductService } from 'src/app/core/services/product/product.service';
import { RolesEnum } from '../models/role.enum';
import { Router } from '@angular/router';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-inventory-tweaks',
  templateUrl: './inventory-tweaks.component.html',
  styleUrls: ['./inventory-tweaks.component.css'],
  providers: [MessageService]
})
export class InventoryTweaksComponent implements OnInit, OnDestroy {
  @Input() paramLineId: string = "";
  registerFormSesionFour: FormGroup;
  formFourIconStatusFour = 2;
  formFourStatusTextFour = "";
  ListAccountingInterface = [];
  ListStateDesign = [];
  ListPackagingReference = [];
  ListUnitMeasure = [];
  ListAbc_method = [];
  ListSource = [];
  ListSequenceType = [];
  zoneName: Subject<string> = new Subject();
  objUnitItemWeight: string;
  Accounting_interface: boolean;
  Zone: boolean;
  Inventory_unit: boolean;
  Linear_unit: boolean;
  Sales_unit: boolean;
  Purchase_unit: boolean;
  Storage_unit: boolean;
  Packing_unit: boolean;
  Packaging_quantity: boolean;
  Packaging_reference: boolean;
  Quantity_base_weight: boolean;
  Item_weight: boolean;
  Weight_unit: boolean;
  Template: boolean;
  Active: boolean;
  Service: boolean;
  Kit: boolean;
  Stock: boolean;
  Internal_use: boolean;
  Source: boolean;
  ABC_method: boolean;
  State_design: boolean;
  Batch_control: boolean;
  Inspection_method: boolean;
  Inspection_quantity: boolean;
  InventoryStatus: boolean;
  Sample_quantity: boolean;
  //#region Variables Roles
  public rolepermission;
  public KEYPERMISSION_ROLE: string = 'inventory-tweaks';
  public href: string = "";
  public details: boolean = false;
  private RolesEnum = RolesEnum;
  //#endregion


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    public technicalService: TechinicalService,
    private productService: ProductService,
    private sales: SalesService,
    private router: Router,
    private store: Store<AppState>,
    private storageService: StorageService
  ) { 
  }




  ngOnInit(): void {
    this.showAllFieldsValidatorView();

    this.getFormSessionFour();
    this.readactiondetail();
    this.readactionedit();
    this.validateFormStatus();
    this.accountingInterfaceGetService();
    this.unitMeasureGetService();
    this.stateDesignGetService();
    this.getInspectionMethod();
    this.getInventoryStatus();
    this.packagingReferenceGetService();
    this.getAbcClassification();
    this.getSource();
    this.getSequenceType();
    this.zoneName.subscribe(val => {
      this.registerFormSesionFour.controls.Zone.setValue(val);
    });
  }

  showAllFieldsValidatorView(): void {
    this.Accounting_interface = true;
    this.Zone = true;
    this.Inventory_unit = true;
    this.Linear_unit = true;
    this.Sales_unit = true;
    this.Purchase_unit = true;
    this.Storage_unit = true;
    this.Packing_unit = true;
    this.Packaging_quantity = true;
    this.Packaging_reference = true;
    this.Quantity_base_weight = true;
    this.Item_weight = true;
    this.Weight_unit = true;
    this.Template = true;
    this.Active = true;
    this.Service = true;
    this.Kit = true;
    this.Stock = true;
    this.Internal_use = true;
    this.Source = true;
    this.ABC_method = true;
    this.State_design = true;
    this.Batch_control = true;
    this.Inspection_method = true;
    this.Inspection_quantity = true;
    this.InventoryStatus = true;
    this.Sample_quantity = true;
  }

  getFormSessionFour() {
    return (this.registerFormSesionFour = this.formBuilder.group({
      Accounting_interface: { value: null, disabled: false },
      Zone: { value: null, disabled: true },
      Inventory_unit: ['', Validators.nullValidator],
      Linear_unit: ['', Validators.nullValidator],

      Sales_unit: ['', Validators.nullValidator],
      Purchase_unit: ['', Validators.nullValidator],

      Storage_unit: ['', Validators.required],
      Packing_unit: ['', Validators.required],
      Packaging_quantity: ['', Validators.required],
      Packaging_reference: ['', Validators.required],
      Quantity_base_weight: ['', Validators.required],
      Item_weight: ['', Validators.required],
      Weight_unit: ['', Validators.required],

      Template: ['', Validators.nullValidator],
      Active: ['', Validators.nullValidator],
      Service: ['', Validators.nullValidator],

      Kit: ['', Validators.nullValidator],
      Stock: ['', Validators.nullValidator],
      Internal_use: ['', Validators.nullValidator],
      Source: { value: null, disabled: true },

      ABC_method: { value: null, disabled: true },
      State_design: ['', Validators.nullValidator],
      Batch_control: { value: null, disabled: true },
      Inspection_method: { value: null, disabled: true },

      Inspection_quantity: { value: 0, disabled: true },
      InventoryStatus: { value: null, disabled: true },
      Sample_quantity: ['', Validators.required]
    }));
  }

  validateFormStatus(): void {
    this.formFourIconStatusFour = (this.registerFormSesionFour.valid == true) ? 1 : 2;
    this.formFourStatusTextFour = (this.registerFormSesionFour.valid == true) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";

    this.registerFormSesionFour.valueChanges.subscribe(value => {
      this.formFourIconStatusFour = (this.registerFormSesionFour.valid == true) ? 1 : 2;
      this.formFourStatusTextFour = (this.registerFormSesionFour.valid == true) ? "technical-sheets.session_form_completed" : "technical-sheets.session_form_without_completed";
    });
  }

  accountingInterfaceGetService(): void {
    this.technicalService.accountingInterfaceGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListAccountingInterface = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  unitMeasureGetService(): void {
    this.technicalService.unitMeasureGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListUnitMeasure = response.data;
            this.registerFormSesionFour.patchValue(
              {
                Weight_unit: "KLG."
              });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  stateDesignGetService(): void {
    this.technicalService.stateDesignGet().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListStateDesign = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  receiveSampleQuantity(paramSampleQuantity: number) {
    this.registerFormSesionFour.patchValue({
      'Sample_quantity': paramSampleQuantity,
    });
  }

  getInspectionMethod(): void {
    this.technicalService.inspectionMethod().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.registerFormSesionFour.patchValue(
              {
                Inspection_method: response.data[0].inspectionMethodName
              });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  getInventoryStatus(): void {
    this.technicalService.inventoryStatus().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.registerFormSesionFour.patchValue(
              {
                InventoryStatus: response.data[1].inventoryStatusName
              });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  packagingReferenceGetService(): void {
    this.technicalService.packagingReference().subscribe(
      (response) => {
        if (response) {
          if (response.status) {
            this.ListPackagingReference = response.data;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        } else {
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

  public showHideForm(paramLineId: number) {
    switch (paramLineId) {

      // Heat transfer Rollo
      case 52:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsHeatTransferRollo();
        }, 3);
        break;


      // Tejidos  (orillo cortado)
      case 60:
      case 63:
      case 67:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFabrics();
        }, 3);
        break;


      // Estampados 
      case 66:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsPrint();
        }, 3);

        break;

      // Thermal
      case 68:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsThermal();
        }, 3);
        break;

      // Reatas y pretinas
      case 64:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsReatasPretinas();
        }, 3);
        break;

      // Mascarillas Tejidas
      case 67:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsMascarillasTejidas();
        }, 3);
        break;

      // Estampación por Sublimación
      case 78:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSublimationPrinting();
        }, 3);
        break;

      // Sintética Screen, Sintético, estampado Screen
      case 79:
      case 83:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSyntheticScreen();
        }, 3);
        break;

      // Troquelado, Sintético Otros
      case 82:
      case 81:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsSyntheticScreen();
        }, 3);
        break;

      // Kits: Kit Offset, Kit Estampado + Sublimacion, Kit Orillo (pendiente Mexico)
      case 86:
      case 88:
      case 89:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsKits();
        }, 3);
        break;

      // Cortado,Kit Heat transfer,Kit Flexo (Mexico)
      case 87:
      case 91:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFieldsKits();
        }, 3);
        break;

      // Mezclas y tintas
      case 30:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormMixesAndInks();
        }, 3);
        break;

      // Flexo Papel - Textil
      case 74:
      case 85:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFlexoPaperTextile();
        }, 3);
        break;

      // Flexo Papel - No Textil
      case 76:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormFlexoPaperTextile();
        }, 3);
        break;

      // Heat Transfer Piezas
      case 55:
      case 56:
      case 75:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormHeatTransferPieces();
        }, 3);
        break;

      // Heat Transfer Laser
      case 84:
        setTimeout(() => {
          this.showAllFieldsValidatorRequire();
          this.showAllFieldsValidatorView();
          this.showFormHeatTransferLaser();
        }, 3);
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
        name: "Storage_unit",
        require: Validators.required
      },
      {
        name: "Packing_unit",
        require: Validators.required
      },
      {
        name: "Packaging_quantity",
        require: Validators.required
      },
      {
        name: "Packaging_reference",
        require: Validators.required
      },
      {
        name: "Quantity_base_weight",
        require: Validators.required
      },
      {
        name: "Item_weight",
        require: Validators.required
      },
      {
        name: "Weight_unit",
        require: Validators.required
      },
      {
        name: "Sample_quantity",
        require: Validators.required
      }
    ];
    this.showFormFields(listNotRequired);
  }

  showFormFieldsHeatTransferRollo(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.State_design = false;
    this.Batch_control = false;
  }

  showFormFabrics(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
  }

  showFormFieldsPrint(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Packing_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Packing_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.State_design = false;
  }

  showFormFieldsThermal() {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Packing_unit",
        require: Validators.nullValidator
      },
      {
        name: "Packaging_reference",
        require: Validators.nullValidator
      },
      {
        name: "Quantity_base_weight",
        require: Validators.nullValidator
      },
      {
        name: "Item_weight",
        require: Validators.nullValidator
      },
      {
        name: "Weight_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_method",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_quantity",
        require: Validators.nullValidator
      },
      {
        name: "InventoryStatus",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Packing_unit = false;
    this.Packaging_reference = false;
    this.Quantity_base_weight = false;
    this.Item_weight = false;
    this.Weight_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.Inspection_method = false;
    this.Inspection_quantity = false;
    this.InventoryStatus = false;
    this.State_design = false;
  }

  showFormFieldsReatasPretinas(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Quantity_base_weight",
        require: Validators.nullValidator
      },
      {
        name: "Item_weight",
        require: Validators.nullValidator
      },
      {
        name: "Weight_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_method",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_quantity",
        require: Validators.nullValidator
      },
      {
        name: "InventoryStatus",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Quantity_base_weight = false;
    this.Item_weight = false;
    this.Weight_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.Inspection_method = false;
    this.Inspection_quantity = false;
    this.InventoryStatus = false;
    this.State_design = false;
  }

  showFormFieldsMascarillasTejidas(): void {

    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      }
    ];

    this.Accounting_interface = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
  }

  showFormFieldsSublimationPrinting(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Quantity_base_weight",
        require: Validators.nullValidator
      },
      {
        name: "Item_weight",
        require: Validators.nullValidator
      },
      {
        name: "Weight_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_method",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_quantity",
        require: Validators.nullValidator
      },
      {
        name: "InventoryStatus",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Quantity_base_weight = false;
    this.Item_weight = false;
    this.Weight_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.Inspection_method = false;
    this.Inspection_quantity = false;
    this.InventoryStatus = false;
    this.State_design = false;
  }

  showFormFieldsSyntheticScreen(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Packaging_quantity",
        require: Validators.nullValidator
      },
      {
        name: "Packaging_reference",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Packaging_quantity = false;
    this.Packaging_reference = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.State_design = false;
  }

  showFormFieldsKits(): void {
    const listNotRequired = [
      {
        name: "Packing_unit",
        require: Validators.nullValidator
      },
      {
        name: "Packaging_quantity",
        require: Validators.nullValidator
      },
      {
        name: "Packaging_reference",
        require: Validators.nullValidator
      },
      {
        name: "Quantity_base_weight",
        require: Validators.nullValidator
      },
      {
        name: "Item_weight",
        require: Validators.nullValidator
      },
      {
        name: "Weight_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "State_design",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_method",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_quantity",
        require: Validators.nullValidator
      },
      {
        name: "InventoryStatus",
        require: Validators.nullValidator
      },
      {
        name: "Sample_quantity",
        require: Validators.nullValidator
      }
    ];

    this.Packing_unit = false;
    this.Packaging_quantity = false;
    this.Packaging_reference = false;
    this.Quantity_base_weight = false;
    this.Item_weight = false;
    this.Weight_unit = false;
    this.Template = false;
    this.Internal_use = false;
    this.State_design = false;
    this.Inspection_method = false;
    this.Inspection_quantity = false;
    this.InventoryStatus = false;
    this.Sample_quantity = false;
  }

  showFormMixesAndInks(): void {

    const listNotRequired = [
      {
        name: "Packaging_reference",
        require: Validators.nullValidator
      },
      {
        name: "Quantity_base_weight",
        require: Validators.nullValidator
      },
      {
        name: "Item_weight",
        require: Validators.nullValidator
      },
      {
        name: "Weight_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_method",
        require: Validators.nullValidator
      },
      {
        name: "Inspection_quantity",
        require: Validators.nullValidator
      },
      {
        name: "InventoryStatus",
        require: Validators.nullValidator
      },
      {
        name: "Sample_quantity",
        require: Validators.nullValidator
      }
    ];

    this.Packaging_quantity = false;
    this.Packaging_reference = false;
    this.Quantity_base_weight = false;
    this.Item_weight = false;
    this.Weight_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
    this.Inspection_method = false;
    this.Inspection_quantity = false;
    this.InventoryStatus = false;
    this.Sample_quantity = false;
  }

  showFormFlexoPaperTextile(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;

  }

  showFormHeatTransferPieces(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
  }

  showFormHeatTransferLaser(): void {
    const listNotRequired = [
      {
        name: "Accounting_interface",
        require: Validators.nullValidator
      },
      {
        name: "Zone",
        require: Validators.nullValidator
      },
      {
        name: "Inventory_unit",
        require: Validators.nullValidator
      },
      {
        name: "Linear_unit",
        require: Validators.nullValidator
      },
      {
        name: "Sales_unit",
        require: Validators.nullValidator
      },
      {
        name: "Purchase_unit",
        require: Validators.nullValidator
      },
      {
        name: "Storage_unit",
        require: Validators.nullValidator
      },
      {
        name: "Template",
        require: Validators.nullValidator
      },
      {
        name: "Active",
        require: Validators.nullValidator
      },
      {
        name: "Service",
        require: Validators.nullValidator
      },
      {
        name: "Kit",
        require: Validators.nullValidator
      },
      {
        name: "Stock",
        require: Validators.nullValidator
      },
      {
        name: "Internal_use",
        require: Validators.nullValidator
      },
      {
        name: "Source",
        require: Validators.nullValidator
      },
      {
        name: "ABC_method",
        require: Validators.nullValidator
      },
      {
        name: "Batch_control",
        require: Validators.nullValidator
      }
    ];
    this.showFormFields(listNotRequired);
    this.Accounting_interface = false;
    this.Zone = false;
    this.Inventory_unit = false;
    this.Linear_unit = false;
    this.Sales_unit = false;
    this.Purchase_unit = false;
    this.Storage_unit = false;
    this.Template = false;
    this.Active = false;
    this.Service = false;
    this.Kit = false;
    this.Stock = false;
    this.Internal_use = false;
    this.Source = false;
    this.ABC_method = false;
    this.Batch_control = false;
  }

  showFormFields(data: any[]): void {
    data.forEach((currentValue, index) => {
      this.registerFormSesionFour.get(currentValue.name).setValidators([currentValue.require]);
      this.registerFormSesionFour.get(currentValue.name).updateValueAndValidity();
    });
  }

  getAbcClassification() {
    this.ListAbc_method = [{ code: '1', name: 'C' }
    ];
    this.registerFormSesionFour.controls.ABC_method.setValue(this.ListAbc_method[0].code);
  }

  getSource() {
    this.ListSource = [{ code: '1', name: 'P' }
    ];
    this.registerFormSesionFour.controls.Source.setValue(this.ListAbc_method[0].code);
  }

  getSequenceType() {
    this.ListSequenceType = [{ code: '1', name: 'W' }
    ];
    this.registerFormSesionFour.controls.Batch_control.setValue(this.ListSequenceType[0].name);
  }

  ngOnDestroy(): void {
    this.zoneName.unsubscribe();
  }

  getInventoryByProductId(paramProductId: any) {
    let data = {
      "productId": paramProductId
    }
    this.productService.getProductByProductId(data).subscribe(
      (response) => {
        if (response && response.status) {
          this.registerFormSesionFour.patchValue({
            Accounting_interface: response.data.detailedConceptApid,
            Inventory_unit: response.data.unitMeasureId,
            Linear_unit: response.data.linealUnit,
            Sales_unit: response.data.salesUnit,
            Purchase_unit: response.data.purchaseUnit,
            storageUnit: response.data.storageUnit,
            Packing_unit: response.data.packUnit,
            Packaging_quantity: response.data.packQuantity,
            Packaging_reference: response.data.packagingReferenceId,
            Quantity_base_weight: response.data.baseQuantityWeight,
            Item_weight: response.data.weight,
            Weight_unit: response.data.weightUnit,
            Template: response.data.isGenericTemplate == 'N' ? false : true,
            Active: response.data.isFixedAsset == 'N' ? false : true,
            Service: response.data.isServices == 'N' ? false : true,
            Kit: response.data.isKit == 'N' ? false : true,
            Internal_use: response.data.isCustomerProperty == 'N' ? false : true,
            State_design: response.data.productStatusId,
            Sample_quantity: response.data.Sample_quantity,
          });
          this.store.subscribe( (storeredux) => {
            this.registerFormSesionFour.patchValue({
              Sample_quantity : storeredux.listsample.sample.sampleQuantity
            });
          })
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

  /*TODO: obtiene el rol y segun el enum ex: FOPS_CUSTOMER_B2C consulta cuales campos deben estar disable al momento de editar */
  public getrole() {
    let profile = this.storageService.getProfiles();
    this.sales.getJSON().subscribe((roles) => { //servicio de json roles
      this.rolepermission = roles[this.RolesEnum[profile.role]];
      let rolemodule = this.rolepermission[2][this.KEYPERMISSION_ROLE];//array segun el formulario
      let active = rolemodule.filter(x => x.status == true);//filtra cuales segun json deben deshabilitarse
      for (let index = 0; index < active.length; index++) {
        this.registerFormSesionFour.get(active[index].components).disable();//formatea los campos a disable
      }
    })
  }

  public readactiondetail() {
    this.router.url.includes('detail') ? (this.formsetdetails(), this.details = true) : false;
  }

  public readactionedit() {
    return this.router.url.includes('edit') ? this.getrole() : false;
  }

  public formsetdetails() {
    Object.keys(this.registerFormSesionFour.controls).forEach((key, index) => {
      this.registerFormSesionFour.get(key).disable();
    });
  }

  validateMaxLen($event: any, maxLength: number): boolean {
    return $event.target.value.length != maxLength;
  }
}
