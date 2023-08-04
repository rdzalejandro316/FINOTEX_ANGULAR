import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/shared/framework-ui/primeng/api/public_api';
import { IdentificationDataComponent } from '../identification-data/identification-data.component';
import { ImageSettingsComponent } from '../image-settings/image-settings.component';
import { AdditionalPropertiesComponent } from '../additional-properties/additional-properties.component';
import { InventoryTweaksComponent } from '../inventory-tweaks/inventory-tweaks.component';
import { MaterialsComponent } from '../materials/materials.component';
import { TechnicalDataComponent } from '../technical-data/technical-data.component';
import { FormArray, FormGroup } from '@angular/forms';
import { FormProvider } from '../form-provider';
import { GeneralDataOfSampleComponent } from '../general-data-of-sample/general-data-of-sample.component';
import { CustomerReferenceComponent } from '../customer-reference/customer-reference.component';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SalesService } from 'src/app/core/services/sales/sales.service';
import moment from 'moment';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { QualityDataComponent } from '../quality-data/quality-data.component';
import { TroquelComponent } from '../troquel/troquel.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-home-samples',
  templateUrl: './home-samples.component.html',
  styleUrls: ['./home-samples.component.css'],
  providers: [
    MessageService,
    { provide: FormProvider, useExisting: HomeSamplesComponent },
  ],
})
export class HomeSamplesComponent implements OnInit, AfterViewInit {
  itemsBreadcrumb = [
    { label: 'menu.Home', url: '/home' },
    { label: 'menu.CustomersHistory', url: '/home/home_samples' },
    {
      label: 'technical-sheets.general_sales',
      url: '/home/home_samples',
      current: true,
    },
  ];
  paramCustomerId = '';
  @ViewChild(GeneralDataOfSampleComponent)
  generalDataOfSampleComponent: GeneralDataOfSampleComponent;
  @ViewChild(IdentificationDataComponent)
  identificationDataComponent: IdentificationDataComponent;
  @ViewChild(ImageSettingsComponent)
  imageSettingsComponent: ImageSettingsComponent;
  @ViewChild(AdditionalPropertiesComponent)
  additionalPropertiesComponent: AdditionalPropertiesComponent;
  @ViewChild(InventoryTweaksComponent)
  inventoryTweaksComponent: InventoryTweaksComponent;
  @ViewChild(MaterialsComponent)
  materialsComponent: MaterialsComponent;
  @ViewChild(TechnicalDataComponent)
  technicalDataComponent: TechnicalDataComponent;
  @ViewChild(CustomerReferenceComponent)
  customerReferenceComponent: CustomerReferenceComponent;
  @ViewChild(QualityDataComponent) qualityDataComponent: QualityDataComponent;
  @ViewChild(TroquelComponent) troquelComponent: TroquelComponent;

  paramSampleId: any = '';
  activeIndex: number = 0;
  parameterCheckAutomaticCode: Observable<boolean>;
  showHideForm: Observable<boolean>;
  receiverDataOfIdentification: Observable<FormArray>;
  displayConfirmPartialCreate: boolean;
  displayConfirmCreate: boolean;
  sampleNumber: boolean;
  id: any;
  productId: any;
  sampleQuantity: any;
  lang: any;
  //#region Variables Roles
  public href: string = '';
  public details: boolean = false;
  public edit: boolean = false;
  public create: boolean = false;
  public profile: number;
  //#endregion
  ImgDefault: string = '../../../../assets/images/imgDefault.png';

  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
    private salesService: SalesService,
    private router: Router,
    private customerService: CustomerService,
    protected translateService: TranslateService,
    protected productService: ProductService
  ) {
    this.readurl();
  }

  ngOnInit(): void {
    moment.locale(this.storageService.getLanguage());
    this.lang = this.storageService.getLanguage();
    let currentLang = this.translateService.currentLang;
    currentLang = this.lang;
    this.translateService.use(currentLang);
  }

  ngAfterViewInit(): void {
    moment.locale(this.storageService.getLanguage());
  }

  createSample(): void {
    moment.locale(this.storageService.getLanguage());
    this.sampleNumber =
      this.generalDataOfSampleComponent.registerFormSesionOne.controls.Form_number.value;
    var data = {
      emailUser: this.storageService.getUser().username,
      product: {
        productStatusId: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.State_design.value
          ? 2
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .State_design.value,
        isGenericTemplate: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Template.value
          ? 'S'
          : 'N',
        standardProduction: !this.imageSettingsComponent.registerFormSesionthree
          .controls.standar_production.value
          ? 0
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .standar_production.value,
        fold: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Length_front.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Length_front.value,
        customerName:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Customer.value,
        palleteTypeId: this.imageSettingsComponent.registerFormSesionthree
          .controls.equal_color.value
          ? this.imageSettingsComponent.registerFormSesionthree.controls
              .equal_color.value
          : 0,
        lineId: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Line.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls.Line
              .value,
        subLineId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Subline.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Subline.value,
        qualityId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Quality.value
          ? this.identificationDataComponent.ListQuality[0].qualityId
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Quality.value,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        sourceProductId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Origin_code.value,
        technicalProductId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Technical_origin.value,
        barCode:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .WMS_barcode.value,
        productName:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_name.value,
        widthId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Broad.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Broad.value,
        numberOfColors: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Number_colors.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_colors.value,
        numberOfAdhesives: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_stickers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_stickers.value,
        numberOfAccessories: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_accessories.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_accessories.value,
        numberOfPapers: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Number_papers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_papers.value,
        numberOfColorants: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_colors.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_colors.value,
        numberOfAuxiliaries: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Auxiliary_numbers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Auxiliary_numbers.value,
        numberOfReductive: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Reductive_numbers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Reductive_numbers.value,
        commercialLenght: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Commercial_length.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Commercial_length.value,
        productionLenght: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Long_production.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Long_production.value,
        warpId: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Urdimbre.value
          ? '0000'
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Urdimbre.value,
        shapeTypeId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Shape.value
          ? 'H'
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Shape.value,
        sizes:
          this.identificationDataComponent.registerFormSesionTwo.controls.Size
            .value,
        cutId: !this.imageSettingsComponent.registerFormSesionthree.controls
          .cutId.value
          ? this.imageSettingsComponent.cutTypes[0].cutId
          : this.imageSettingsComponent.registerFormSesionthree.controls.cutId
              .value,
        adhesiveId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Adhesive.value
          ? 1
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Adhesive.value,
        finishId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Finish.value
          ? 19
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Finish.value,
        unitMeasureId:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Inventory_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Inventory_unit.value,
        salesUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Sales_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Sales_unit.value,
        purchaseUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Purchase_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Purchase_unit.value,
        linealUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Linear_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Linear_unit.value,
        storageUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Storage_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Storage_unit.value,
        sequenceType:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Batch_control.value,
        onlyUsedByCustomer: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Stock.value
          ? 'S'
          : 'N',
        abcClassification:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .ABC_method.value,
        origin:
          this.inventoryTweaksComponent.registerFormSesionFour.controls.Source
            .value,
        customerId: this.paramCustomerId,
        approvedDate: null,
        drawedBy: !this.imageSettingsComponent.registerFormSesionthree.controls
          .drawing.value
          ? 1
          : this.imageSettingsComponent.registerFormSesionthree.controls.drawing
              .value,
        drawedDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .drawingDate.value?
            moment(
              this.imageSettingsComponent.registerFormSesionthree.controls
            .drawingDate.value,
              'MMM/DD/YYYY'
            ).format():null,
        designerId: !this.imageSettingsComponent.registerFormSesionthree
          .controls.designedby.value
          ? 1
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .designedby.value,
        designedDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .designDate.value?
         
            moment(
              this.imageSettingsComponent.registerFormSesionthree.controls
              .designDate.value,
              'MMM/DD/YYYY'
            ).format():null,

        rewindingId: !this.imageSettingsComponent.registerFormSesionthree
          .controls.rewindingId.value
          ? 0
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .rewindingId.value,
        packUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Packing_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Packing_unit.value,
        packQuantity: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Packaging_quantity.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Packaging_quantity.value,
        isCustomerProperty: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Internal_use.value
          ? 'S'
          : 'N',
        locationUpdateDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .locationDate.value?
        moment(
          this.imageSettingsComponent.registerFormSesionthree.controls
          .locationDate.value,
          'MMM/DD/YYYY'
        ).format():null,
          
        isKit: this.inventoryTweaksComponent.registerFormSesionFour.controls.Kit
          .value
          ? 'S'
          : 'N',
        isServices: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Service.value
          ? 'S'
          : 'N',
        isFixedAsset: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Active.value
          ? 'S'
          : 'N',
        inspectionMethodId: 0,
        inspectionQuantity:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Inspection_quantity.value,
        baseQuantityWeight: !this.inventoryTweaksComponent
          .registerFormSesionFour.controls.Quantity_base_weight.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Quantity_base_weight.value,
        weight: !this.inventoryTweaksComponent.registerFormSesionFour.controls
          .Item_weight.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Item_weight.value,
        weightUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Weight_unit.value,
        inventoryStatusId: 0,
        graphicFile:
          this.imageSettingsComponent.registerFormSesionthree.controls
            .graphicFileImage.value,
        FileType:
          this.imageSettingsComponent.registerFormSesionthree.controls
            .graphicFileType.value,
        applicationId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Application.value,
        packagingReferenceId:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Packaging_reference.value,
      },
      sample: {
        companyId: this.storageService.getProfiles().businessId,
        sampleId: 0,
        formNumber:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Form_number.value,
        purchaseNumber:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Purchase_order.value,
        plantId:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Production_plan.value,
        customerId: this.paramCustomerId,
        storeHouseId: 0,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        sampleQuantity: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Sample_quantity.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Sample_quantity.value,
        placementDate: !this.generalDataOfSampleComponent.registerFormSesionOne
          .controls.ReceptionDate.value
          ? new Date()
          : moment(
              this.generalDataOfSampleComponent.registerFormSesionOne.controls
                .ReceptionDate.value,
              'MMM/DD/YYYY'
            ).format(),
        requestDate: moment(
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .RequestDate.value,
          'MMM/DD/YYYY'
        ).format(),
        sampleModifiedDate: new Date(),
        sampleApprovalTypeId:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Approval_type.value,
        samplePendingToPrint: this.generalDataOfSampleComponent
          .registerFormSesionOne.controls.Print.value
          ? 'S'
          : 'N',
        AutomaticCode: !this.generalDataOfSampleComponent.registerFormSesionOne
          .controls.Code.value
          ? false
          : this.generalDataOfSampleComponent.registerFormSesionOne.controls
              .Code.value,

        samplesNotes:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls.Note
            .value,
        fulfilledBy:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .User_Id.value,
      },
      customerReference: {
        customerId: this.paramCustomerId,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        referenceId:
          this.customerReferenceComponent.customerReferenceForm.controls
            .CustomerReference.value,
        referenceName:
          this.customerReferenceComponent.customerReferenceForm.controls
            .Description.value,
        referenceColor:
          this.customerReferenceComponent.customerReferenceForm.controls.Color
            .value,
        sku1: this.customerReferenceComponent.customerReferenceForm.controls.SKU
          .value,
      },
      billOfMaterial: [],
      billOfMaterialFlexo: this.materialsComponent.getFlexo,
      billOfMaterialHeatTransfer: this.materialsComponent.getHeatTransfer,
      productOption: [],
      technicalData: [],
      createdByUser:
        this.generalDataOfSampleComponent.registerFormSesionOne.controls.User_Id
          .value,
      creationDate: new Date(),
      modifiedByUser: null,
      modifiedDate: new Date(),
    };
    this.materialsComponent.materialsFormCall.controls.forEach(
      (element: FormGroup) => {
        if (element.valid) {
          data.billOfMaterial.push({
            productId:
              this.identificationDataComponent.registerFormSesionTwo.controls
                .Item_code.value,
            materialPositionId: element.controls.positionMaterialId.value,
            materialId: element.controls.material.value,
            description: element.controls.nameItem.value,
            picksByColor: element.controls.pick_hilo.value,
            runByColor: !element.controls.print_run_by_color.value
              ? 0
              : element.controls.print_run_by_color.value,
            transferSpecialtyId: !element.controls.specialty.value
              ? 0
              : element.controls.specialty.value,
            printout: element.controls.print.value,
            border: element.controls.border.value ? 'S' : 'N',
            baseSource: element.controls.base.value,
            standarQuantity: !element.controls.standard_quantity.value
              ? 0
              : element.controls.standard_quantity.value,
            realQuantity: !element.controls.real_quantity.value
              ? 0
              : element.controls.real_quantity.value,
            unitMeasureId: element.controls.unit_code.value,
            standarFormula: element.controls.formula.value ? 'S' : 'N',
            quantityStandarFormula: element.controls.formula_quantity.value,
          });
        }
      }
    );

    this.additionalPropertiesComponent.checkSelect.forEach((element) => {
      data.productOption.push({
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        optionId: element.optionId,
        registerStatusId: 0,
      });
    });

    this.technicalDataComponent.technicalFormCall.controls.forEach(
      (element: FormGroup) => {
        if (element.valid) {
          data.technicalData.push({
            productId:
              this.identificationDataComponent.registerFormSesionTwo.controls
                .Item_code.value,
            resourceModelId: element.controls.resourceModel.value,
            altenalResourceModel: element.controls.alternalResourceModel.value,
            resourceId: element.controls.resourceId.value,
            speed: element.controls.speed.value,
            standarTime: element.controls.standarTime.value,
            stationNumber: element.controls.stationNumber.value,
            picks: !element.controls.picks.value
              ? 0
              : element.controls.picks.value,
            totalPicks: !element.controls.totalPicks.value
              ? 0
              : element.controls.totalPicks.value,
            cameraPicks: !element.controls.cameraPicks.value
              ? 0
              : element.controls.cameraPicks.value,
            machinePicks: !element.controls.machinePicks.value
              ? 0
              : element.controls.machinePicks.value,
            defaultModel: element.controls.defaultModel.value ? 'S' : 'N',
            stampCylinderId: element.controls.stampCylinderId.value,
            repetitionNumber: element.controls.repetitionNumber.value,
            perforationType: element.controls.perforationType.value,
            perforationDiameter: element.controls.perforationDiameter.value,
            engravedType: element.controls.engravedType.value,
            sheetTypeId: element.controls.sheetTypeId.value,
            paperWidth: element.controls.paperWidth.value,
            paperRealease: element.controls.paperRealease.value,
            quantitySheet: element.controls.quantitySheet.value,
            advance: element.controls.advance.value,
            squeegeeTravel: element.controls.squeegeeTravel.value,
            screenPeelOff: element.controls.screenPeelOff.value,
            offCont: element.controls.offCont.value,
            numberOfOutputs: element.controls.numberOfOutputs.value,
            dewee: !element.controls.deweed.value
              ? null
              : element.controls.deweed.value,
            markLoop: !element.controls.buclecontrol.value
              ? null
              : element.controls.buclecontrol.value,
            power: !element.controls.power.value
              ? null
              : element.controls.power.value,
            frecuency: !element.controls.frequency.value
              ? null
              : element.controls.frequency.value,
            bladeTypeId: !element.controls.bladetype.value
              ? null
              : element.controls.bladetype.value,
          });
        }
      }
    );

    if (!this.customerReferenceComponent.validateFormData()) {
      data.customerReference = null;
    }

    if (
      this.generalDataOfSampleComponent.registerFormSesionOne.valid &&
      this.identificationDataComponent.registerFormSesionTwo.valid &&
      this.imageSettingsComponent.registerFormSesionthree.valid &&
      this.inventoryTweaksComponent.registerFormSesionFour.valid &&
      this.materialsComponent.materialsForm.valid &&
      this.technicalDataComponent.technicalDataForm.valid &&
      this.customerReferenceComponent.customerReferenceForm.valid
    ) {
      this.salesService.createSample(data).subscribe(
        (result: any) => {
          if (result) {
            this.displayConfirmCreate = true;
            if (
              this.generalDataOfSampleComponent.registerFormSesionOne.controls
                .Code.value
            ) {
              this.setNextCustomerProductPrefix();
            }
            this.generalDataOfSampleComponent.registerFormSesionOne.reset();
            this.identificationDataComponent.registerFormSesionTwo.reset();
            this.imageSettingsComponent.registerFormSesionthree.reset();
            this.imageSettingsComponent.urlCutImg = this.ImgDefault;
            this.imageSettingsComponent.urlRewindingImg = this.ImgDefault;
            this.inventoryTweaksComponent.registerFormSesionFour.reset();
            this.inventoryTweaksComponent.getInspectionMethod();
            this.materialsComponent.materialsForm.reset();
            this.technicalDataComponent.technicalDataForm.reset();
            this.customerReferenceComponent.customerReferenceForm.reset();
            this.materialsComponent.mallasComponent.mallasFormCall.reset();
            this.materialsComponent.aniloxComponent.aniloxForm.reset();
            this.generalDataOfSampleComponent.customerGetByIdCurrencyService(
              this.paramCustomerId
            );
            this.additionalPropertiesComponent.clearListOptionLine();
          } else {
            this.displayConfirmCreate = false;
          }
        },
        (err) => {
          this.displayConfirmCreate = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        }
      );
    }
  }

  setNextCustomerProductPrefix() {
    let data = {
      customerId: this.paramCustomerId,
    };
    this.customerService.setNextCustomerProductPrefix(data).subscribe(
      (result: any) => {},
      (err) => {
        this.displayConfirmCreate = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      }
    );
  }

  validForm(): boolean {
    return (
      this.generalDataOfSampleComponent?.registerFormSesionOne?.valid &&
      this.identificationDataComponent?.registerFormSesionTwo?.valid &&
      this.imageSettingsComponent?.registerFormSesionthree?.valid &&
      this.inventoryTweaksComponent?.registerFormSesionFour?.valid &&
      this.materialsComponent?.materialsForm?.valid &&
      this.materialsComponent?.isFlexoValid &&
      this.materialsComponent?.isHeatTransferValid &&
      this.technicalDataComponent?.technicalDataForm?.valid &&
      this.customerReferenceComponent?.customerReferenceForm?.valid
    );
  }

  validEditForm(): boolean {
    return (this.generalDataOfSampleComponent?.registerFormSesionOne?.valid &&
      this.identificationDataComponent?.registerFormSesionTwo?.valid &&
      this.imageSettingsComponent?.registerFormSesionthree?.valid &&
      this.inventoryTweaksComponent?.registerFormSesionFour?.valid &&
      this.materialsComponent?.materialsForm?.valid &&
      this.materialsComponent?.isFlexoValid &&
      this.materialsComponent?.isHeatTransferValid &&
      this.technicalDataComponent?.technicalDataForm?.valid &&
      this.customerReferenceComponent?.customerReferenceForm?.valid &&
      this.qualityDataComponent.myForm?.valid);
  }
  automaticCode(response: any) {
    this.identificationDataComponent.parameterCheckAutomaticCode(response);
  }

  receiveLineId(paramLineId: any) {
    this.imageSettingsComponent.showHideForm(paramLineId);
    this.additionalPropertiesComponent.optionLineByLineIdService(paramLineId);
    this.imageSettingsComponent.cutByLineId(paramLineId);
    this.inventoryTweaksComponent.showHideForm(paramLineId);
    this.materialsComponent.materialCategoryByLineIdService(paramLineId);
    this.technicalDataComponent.showHideForm(paramLineId);
    this.id = paramLineId;
    this.qualityDataComponent.paramLine(
      paramLineId,
      this.create,
      this.productId
    );
    this.troquelComponent.paramLine(paramLineId);
    this.materialsComponent.showHideForm(paramLineId);
  }

  receiveLargeProduction(paramLongProduction: any) {
    this.technicalDataComponent.getLargoProduccion(paramLongProduction);
  }

  receiveLargeProductionUpdate(paramLongProductionUpdate: any) {
    let validating = paramLongProductionUpdate.split('-');
    this.identificationDataComponent.updateLargeProduction(validating[0]);

    if (validating[1] === 'true') {
      this.activeIndex = 0;
      this.identificationDataComponent.autoFocusLongproduction();
    }
  }

  receiveTotalPickHilo(paramTotalPickHilo: any) {
    this.technicalDataComponent.getTotalPicksHilo(paramTotalPickHilo);
  }

  receiveTotalPickcolor(paramTotalPickcolor: any) {
    this.technicalDataComponent.getTotalPicksColor(paramTotalPickcolor);
  }

  receiveproductId(productId: any) {
    this.productId = productId;
    if (productId != null && productId != undefined && productId != '') {
      this.identificationDataComponent.receiveParameterProductId(
        productId.trim()
      );
      this.imageSettingsComponent.getCutAndRewind(productId.trim());
      this.customerReferenceComponent.getCustomerReferenceById(
        productId.trim()
      );
      this.technicalDataComponent.getTechnicalData(productId.trim());
      this.inventoryTweaksComponent.getInventoryByProductId(productId.trim());
      this.additionalPropertiesComponent.optionLineByProductIdService(
        productId.trim()
      );
      this.getBillOfMaterialFlexoByProductId(productId.trim());
      this.getBillOfMaterialHeatTransferByProductId(productId.trim());
    }
  }
  getBillOfMaterialFlexoByProductId(productId: string) {
    var data = {
      productId
    };
    this.productService.getBillOfMaterialFlexoByProductId(data)
    .subscribe(
      (result: any) => {
        if (result && result.status) {
          this.materialsComponent.setAnilloxForEdit(result.data);
        }
      },
      (err) => {
        this.displayConfirmCreate = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      }
    );
  }
  getBillOfMaterialHeatTransferByProductId(productId: string) {
    var data = {
      productId
    };
    this.productService
      .getBillOfMaterialHeatTransferByProductId(data)
      .subscribe(
        (result: any) => {
          if (result && result.status) {

          }
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        }
      );
  }

  receiveProductionPlanId(paramProductionPlanId: number) {
    this.identificationDataComponent.receiveParameterProductionPlan(
      paramProductionPlanId
    );
  }

  getZoneName(paramZoneName: string) {
    this.inventoryTweaksComponent.zoneName.next(paramZoneName);
  }

  receiveDataIdentification(dataComplete: any) {
    this.href = this.router.url;
    let arr = this.href.split('/');
    arr.includes('create')
      ? this.materialsComponent.receiverDataOfIdentification(dataComplete)
      : arr.includes('edit')
      ? this.materialsComponent.materialsGetByData(dataComplete, this.productId)
      : this.materialsComponent.showHideForm(dataComplete.value.Line);
  }

  public readurl() {
    this.href = this.router.url;
    let arr = this.href.split('/');
    arr.includes('create')
      ? ((this.paramCustomerId = arr[4]), (this.create = true))
      : '';
    arr.includes('edit')
      ? ((this.paramCustomerId = arr[4]),
        (this.paramSampleId = arr[5]),
        (this.edit = true))
      : '';
    arr.includes('detail')
      ? ((this.paramCustomerId = arr[4]),
        (this.paramSampleId = arr[5]),
        (this.details = true))
      : '';
  }

  public iduser(): number {
    let profilearray = this.storageService.getProfiles();
    return (this.profile = profilearray.role);
  }

  public sampleemitter(data) {
    this.sampleQuantity = data;
  }

  fixDate(date: string) {
    moment.locale(this.storageService.getLanguage());
    return moment(date, 'MMM/DD/YYYY').format('YYYY-MM-DD');
  }
  //#region Metodo edicion
  public editSample(): void {
    let userid = this.iduser();
    moment.locale(this.storageService.getLanguage());
    var data = {
      emailUser: this.storageService.getUser().username,
      product: {
        productStatusId: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.State_design.value
          ? 2
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .State_design.value,
        isGenericTemplate: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Template.value
          ? 'S'
          : 'N',
        standardProduction: !this.imageSettingsComponent.registerFormSesionthree
          .controls.standar_production.value
          ? 0
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .standar_production.value,
        fold: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Length_front.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Length_front.value,
        customerName:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Customer.value,
        palleteTypeId: this.imageSettingsComponent.registerFormSesionthree
          .controls.equal_color.value
          ? this.imageSettingsComponent.registerFormSesionthree.controls
              .equal_color.value
          : 0,
        lineId: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Line.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls.Line
              .value,
        subLineId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Subline.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Subline.value,
        qualityId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Quality.value
          ? this.identificationDataComponent.ListQuality[0].qualityId
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Quality.value,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        sourceProductId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Origin_code.value,
        technicalProductId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Technical_origin.value,
        barCode:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .WMS_barcode.value,
        productName:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_name.value,
        widthId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Broad.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Broad.value,
        numberOfColors: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Number_colors.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_colors.value,
        numberOfAdhesives: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_stickers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_stickers.value,
        numberOfAccessories: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_accessories.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_accessories.value,
        numberOfPapers: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Number_papers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_papers.value,
        numberOfColorants: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Number_colors.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Number_colors.value,
        numberOfAuxiliaries: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Auxiliary_numbers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Auxiliary_numbers.value,
        numberOfReductive: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Reductive_numbers.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Reductive_numbers.value,
        commercialLenght: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Commercial_length.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Commercial_length.value,
        productionLenght: !this.identificationDataComponent
          .registerFormSesionTwo.controls.Long_production.value
          ? 0
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Long_production.value,
        warpId: !this.identificationDataComponent.registerFormSesionTwo.controls
          .Urdimbre.value
          ? '0000'
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Urdimbre.value,
        shapeTypeId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Shape.value
          ? 'H'
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Shape.value,
        sizes:
          this.identificationDataComponent.registerFormSesionTwo.controls.Size
            .value,
        cutId: !this.imageSettingsComponent.registerFormSesionthree.controls
          .cutId.value
          ? this.imageSettingsComponent.cutTypes[0].cutId
          : this.imageSettingsComponent.registerFormSesionthree.controls.cutId
              .value,
        adhesiveId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Adhesive.value
          ? 1
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Adhesive.value,
        finishId: !this.identificationDataComponent.registerFormSesionTwo
          .controls.Finish.value
          ? 19
          : this.identificationDataComponent.registerFormSesionTwo.controls
              .Finish.value,
        unitMeasureId:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Inventory_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Inventory_unit.value,
        salesUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Sales_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Sales_unit.value,
        purchaseUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Purchase_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Purchase_unit.value,
        linealUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Linear_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Linear_unit.value,
        storageUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Storage_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Storage_unit.value,
        sequenceType:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Batch_control.value,
        onlyUsedByCustomer: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Stock.value
          ? 'S'
          : 'N',
        abcClassification:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .ABC_method.value,
        origin:
          this.inventoryTweaksComponent.registerFormSesionFour.controls.Source
            .value,
        customerId: this.paramCustomerId,
        approvedDate: null,
        drawedBy: !this.imageSettingsComponent.registerFormSesionthree.controls
          .drawing.value
          ? 1
          : this.imageSettingsComponent.registerFormSesionthree.controls.drawing
              .value,
        drawedDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .drawingDate.value?
            moment(
              this.imageSettingsComponent.registerFormSesionthree.controls
              .drawingDate.value,
              'MMM/DD/YYYY'
            ).format():null,
        designerId: !this.imageSettingsComponent.registerFormSesionthree
          .controls.designedby.value
          ? 1
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .designedby.value,
        designedDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .designDate.value?
            moment( 
              this.imageSettingsComponent.registerFormSesionthree.controls
            .designDate.value,
              'MMM/DD/YYYY'
            ).format():null,
        rewindingId: !this.imageSettingsComponent.registerFormSesionthree
          .controls.rewindingId.value
          ? 0
          : this.imageSettingsComponent.registerFormSesionthree.controls
              .rewindingId.value,
        packUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Packing_unit.value == ''
            ? 'UND.'
            : this.inventoryTweaksComponent.registerFormSesionFour.controls
                .Packing_unit.value,
        packQuantity: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Packaging_quantity.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Packaging_quantity.value,
        isCustomerProperty: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Internal_use.value
          ? 'S'
          : 'N',
        locationUpdateDate:this.imageSettingsComponent.registerFormSesionthree.controls
        .locationDate.value?
        moment(
          this.imageSettingsComponent.registerFormSesionthree.controls
          .locationDate.value,
          'MMM/DD/YYYY'
        ).format(): null,
        isKit: this.inventoryTweaksComponent.registerFormSesionFour.controls.Kit
          .value
          ? 'S'
          : 'N',
        isServices: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Service.value
          ? 'S'
          : 'N',
        isFixedAsset: this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Active.value
          ? 'S'
          : 'N',
        inspectionMethodId: 0,
        inspectionQuantity:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Inspection_quantity.value,
        baseQuantityWeight: !this.inventoryTweaksComponent
          .registerFormSesionFour.controls.Quantity_base_weight.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Quantity_base_weight.value,
        weight: !this.inventoryTweaksComponent.registerFormSesionFour.controls
          .Item_weight.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Item_weight.value,
        weightUnit:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Weight_unit.value,
        inventoryStatusId: 0,
        graphicFile:
          this.imageSettingsComponent.registerFormSesionthree.controls
            .graphicFileImage.value,
        FileType:
          this.imageSettingsComponent.registerFormSesionthree.controls
            .graphicFileType.value,
        applicationId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Application.value,
        packagingReferenceId:
          this.inventoryTweaksComponent.registerFormSesionFour.controls
            .Packaging_reference.value,
      },
      sample: {
        companyId: this.storageService.getProfiles().businessId,
        sampleId: this.paramSampleId,
        formNumber:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Form_number.value,
        purchaseNumber:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Purchase_order.value,
        plantId:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Production_plan.value,
        customerId: this.paramCustomerId,
        storeHouseId: 0,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        sampleQuantity: !this.inventoryTweaksComponent.registerFormSesionFour
          .controls.Sample_quantity.value
          ? 0
          : this.inventoryTweaksComponent.registerFormSesionFour.controls
              .Sample_quantity.value,
        placementDate: !this.generalDataOfSampleComponent.registerFormSesionOne
          .controls.ReceptionDate.value
          ? new Date()
          : moment(
              this.generalDataOfSampleComponent.registerFormSesionOne.controls
                .ReceptionDate.value,
              'MMM/DD/YYYY'
            ).format(),
        requestDate: moment(
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .RequestDate.value,
          'MMM/DD/YYYY'
        ).format(),
        sampleModifiedDate: new Date(),
        sampleApprovalTypeId:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .Approval_type.value,
        samplePendingToPrint: this.generalDataOfSampleComponent
          .registerFormSesionOne.controls.Print.value
          ? 'S'
          : 'N',
        AutomaticCode: !this.generalDataOfSampleComponent.registerFormSesionOne
          .controls.Code.value
          ? false
          : this.generalDataOfSampleComponent.registerFormSesionOne.controls
              .Code.value,

        samplesNotes:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls.Note
            .value,
        fulfilledBy:
          this.generalDataOfSampleComponent.registerFormSesionOne.controls
            .User_Id.value,
      },
      customerReference: {
        customerId: this.paramCustomerId,
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        referenceId:
          this.customerReferenceComponent.customerReferenceForm.controls
            .CustomerReference.value,
        referenceName:
          this.customerReferenceComponent.customerReferenceForm.controls
            .Description.value,
        referenceColor:
          this.customerReferenceComponent.customerReferenceForm.controls.Color
            .value,
        sku1: this.customerReferenceComponent.customerReferenceForm.controls.SKU
          .value,
      },
      billOfMaterial: [],
      billOfMaterialFlexo: this.materialsComponent.getFlexo,
      billOfMaterialHeatTransfer: this.materialsComponent.getHeatTransfer,
      productOption: [],
      technicalData: [],
      productProperties: [],
      createdByUser:
        this.generalDataOfSampleComponent.registerFormSesionOne.controls.User_Id
          .value,
      creationDate: new Date(),
      modifiedByUser:
        this.generalDataOfSampleComponent.registerFormSesionOne.controls.User_Id
          .value,
      modifiedDate: new Date(),
      userRole: userid,
    };
    this.materialsComponent.materialsFormCall.controls.forEach(
      (element: FormGroup) => {
        if (element.valid) {
          data.billOfMaterial.push({
            productId:
              this.identificationDataComponent.registerFormSesionTwo.controls
                .Item_code.value,
            materialPositionId: element.controls.positionMaterialId.value,
            materialId: element.controls.material.value,
            description: element.controls.nameItem.value,
            picksByColor: element.controls.pick_hilo.value,
            runByColor: !element.controls.print_run_by_color.value
              ? 0
              : element.controls.print_run_by_color.value,
            transferSpecialtyId: !element.controls.specialty.value
              ? 0
              : element.controls.specialty.value,
            printout: element.controls.print.value,
            border: element.controls.border.value ? 'S' : 'N',
            baseSource: element.controls.base.value,
            standarQuantity: !element.controls.standard_quantity.value
              ? 0
              : element.controls.standard_quantity.value,
            realQuantity: !element.controls.real_quantity.value
              ? 0
              : element.controls.real_quantity.value,
            unitMeasureId: element.controls.unit_code.value,
            standarFormula: element.controls.formula.value ? 'S' : 'N',
            quantityStandarFormula: element.controls.formula_quantity.value,
          });
        }
      }
    );

    this.additionalPropertiesComponent.checkSelect.forEach((element) => {
      data.productOption.push({
        productId:
          this.identificationDataComponent.registerFormSesionTwo.controls
            .Item_code.value,
        optionId: element.optionId,
        registerStatusId: 0,
      });
    });
    this.technicalDataComponent.technicalFormCall.controls.forEach(
      (element: FormGroup) => {
        if (element.valid) {
          data.technicalData.push({
            productId:
              this.identificationDataComponent.registerFormSesionTwo.controls
                .Item_code.value,
            resourceModelId: element.controls.resourceModel.value,
            altenalResourceModel: element.controls.alternalResourceModel.value,
            resourceId: element.controls.resourceId.value,
            speed: element.controls.speed.value,
            standarTime: element.controls.standarTime.value,
            stationNumber: element.controls.stationNumber.value,
            picks: !element.controls.picks.value
              ? 0
              : element.controls.picks.value,
            totalPicks: !element.controls.totalPicks.value
              ? 0
              : element.controls.totalPicks.value,
            cameraPicks: !element.controls.cameraPicks.value
              ? 0
              : element.controls.cameraPicks.value,
            machinePicks: !element.controls.machinePicks.value
              ? 0
              : element.controls.machinePicks.value,
            defaultModel: element.controls.defaultModel.value ? 'S' : 'N',
            stampCylinderId: element.controls.stampCylinderId.value,
            repetitionNumber: element.controls.repetitionNumber.value,
            perforationType: element.controls.perforationType.value,
            perforationDiameter: element.controls.perforationDiameter.value,
            engravedType: element.controls.engravedType.value,
            sheetTypeId: element.controls.sheettype.value,
            paperWidth: element.controls.paperWidth.value,
            paperRealease: element.controls.paperRealease.value,
            quantitySheet: element.controls.quantitySheet.value,
            advance: element.controls.advance.value,
            squeegeeTravel: element.controls.squeegeeTravel.value,
            screenPeelOff: element.controls.screenPeelOff.value,
            offCont: element.controls.offCont.value,
            numberOfOutputs: element.controls.numberOfOutputs.value,
            dewee: !element.controls.deweed.value
              ? null
              : element.controls.deweed.value,
            markLoop: !element.controls.buclecontrol.value
              ? null
              : element.controls.buclecontrol.value,
            power: !element.controls.power.value
              ? null
              : element.controls.power.value,
            frecuency: !element.controls.frequency.value
              ? null
              : element.controls.frequency.value,
            bladeTypeId: element.controls.bladetype.value,
          });
        }
      }
    );

    if (!this.customerReferenceComponent.validateFormData()) {
      data.customerReference = null;
    }

    this.qualityDataComponent.sesionsFormCall.value.forEach((value) => {
      for (var key1 in value.controlsFix) {
        for (var key2 in value.controlsFix[key1]) {
          let propertieValue: string;
          if (Array.isArray(value.controlsFix[key1][key2])) {
            propertieValue = value.controlsFix[key1][key2].join('|');
          } else {
            propertieValue = value.controlsFix[key1][key2];
          }

          data.productProperties.push({
            productId: data.product.productId,
            propertyId: key2,
            variableSpecification1: propertieValue,
            variableSpecification2: null,
            user: this.generalDataOfSampleComponent.registerFormSesionOne
              .controls.User_Id.value,
          });
        }
      }
    });

    if (
      this.generalDataOfSampleComponent.registerFormSesionOne?.valid &&
      this.identificationDataComponent.registerFormSesionTwo?.valid &&
      this.imageSettingsComponent.registerFormSesionthree?.valid &&
      this.inventoryTweaksComponent.registerFormSesionFour?.valid &&
      this.materialsComponent.materialsForm?.valid &&
      this.technicalDataComponent.technicalDataForm?.valid &&
      this.customerReferenceComponent.customerReferenceForm?.valid &&
      this.qualityDataComponent.myForm?.valid
    ) {
      this.salesService.editSample(data).subscribe(
        (result: any) => {
          this.router.navigate(['home/technical_developments']);
        },
        (err) => {
          this.displayConfirmCreate = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message,
          });
        }
      );
    }
  }
  //#endregion

  confirmSampleCreation(): void {
    window.location.reload();
  }
}
