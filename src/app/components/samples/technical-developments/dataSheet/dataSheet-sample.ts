import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Base64Imagen } from 'src/app/shared/constant/userType';
import { Cell, Columns, Img, PdfMakeWrapper, QR, Stack, Table, Txt } from 'pdfmake-wrapper';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
PdfMakeWrapper.setFonts(pdfFonts);
@Injectable({
  providedIn: 'root'
})
export class DataSheetGetBySample {

  styleHeader: string = 'tableHeader';
  backGroundColor: string = '#C8C9CB';
  fontSizeHeader: number = 9;

  constructor(
    private productService: ProductService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private storageService: StorageService,
  ) {
  }

  async DatasheetByLine(data: any) {
    const dataSampleById = {
      "companyId": this.storageService.getProfiles().businessId,
      "sampleId": data.bodyDto[0].generalData?.sampleId,
    };
    this.productService.getSampleById(dataSampleById).subscribe(
      (response) => {
        var statusSample: string
        if (response.data.sampleStatusId == 6) {
          statusSample = this.translateText("pdf-report.statusSample");
        } else {
          statusSample = this.translateText("pdf-report.statusSample2");
        }
        this.Reports(statusSample, data)
      },
      (error) => {

      },
      () => { }
    );
  }

  async Reports(statusSample: string, data: any) {
    let headerDto = data.headerDto;
    let bodyDto = data.bodyDto;
    const pdf = new PdfMakeWrapper();
    var docDefinition = {
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + ' of ' + pageCount,
          alignment: 'right',
          fontSize: 7,
          margin: ([5, 5, 15, 5])
        }
      },
    };

    pdf.styles({
      tableHeader: {
        fontSize: 7,
        bold: true,
      },
      tableContent: {
        fontSize: 6,
        bold: false,
      },
      tableHeaderBody: {
        fontSize: 5,
        bold: true,
      }
    });


    pdf.header(new Stack([
      new Table([
        [
          new Cell(
            await new Img("https://finotex.blob.core.windows.net/imagereports/FinotexLogo.png?sp=r&st=2022-07-14T18:11:59Z&se=2023-07-15T02:11:59Z&spr=https&sv=2021-06-08&sr=b&sig=SH7rV1n%2BuG%2BANtY%2BGxugjpDe%2BZkPUebe8cBwWOq1Fgs%3D")
              .height(40)
              .width(130)
              .build(),
          ).rowSpan(2).border([false, false, false, false]).end,

          new Cell(new Txt(statusSample).bold().fontSize(15).end).margin(5).border([false, false, false, false]).alignment('center').end,

          new Cell(
            new QR('898555').fit(50).end,
          ).border([false, false, false, false]).alignment('right').end,
        ],
        [
          {},
          {
            stack: [
              new Table([
                [
                  {
                    border: [true, true, true, false],
                    text: headerDto.nameLine.toUpperCase(),
                    bold: true,
                  },
                  {
                    border: [true, true, true, false],
                    text: this.translateText("dataSheetSample.dateprint") + " " + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
                    fontSize: 7,
                    bold: false,
                  }
                ]
              ]).widths([420, 130]).absolutePosition(158, 48).end
            ],
            colSpan: 2

          },
          {}
        ]
      ]).widths(['auto', '*', '*'])
        .layout('noBorders').end,
      new Table([
        [
          this.typeTHeaderCell(this.translateText('dataSheetSample.zone'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.coordinator'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.customer'), 'left'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.consecutiveSystems'), 'left'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.order'), 'left'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.application'), 'left'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.code'), 'left'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.descripcion'), 'center'),
        ],
        [
          this.typeTBodyCellSimple(headerDto?.zone ? headerDto?.zone.trim() : '', 'center'),
          this.typeTBodyCellSimple(this.storageService.getUser().username, 'center'),
          this.typeTBodyCellSimple(headerDto?.customer ? headerDto?.customer.trim() : '', 'left'),
          this.typeTBodyCellSimple(headerDto?.consecutiveSystem, 'left'),
          this.typeTBodyCellSimple(headerDto?.order, 'left'),
          this.typeTBodyCellSimple(this.datePipe.transform(headerDto?.applicationDate, 'dd/MM/yyyy'), 'left'),
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.productId ? bodyDto[0].identificationData?.productId.trim() : '', 'center'),
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.productName, 'left'),
        ]
      ]).widths(['auto', '*', '*', 'auto', 'auto', 'auto', 'auto', '*'])
        .margin([0, -2, 0, 0])
        .style(['tableHeader', 'tableContent'])
        .end,
    ]).width("*").margin([20, 20, 20, 0]).end);

    pdf.add([
      new Table([
        [
          this.typeTHeaderCell(this.translateText('dataSheetSample.width'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.long'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.machine'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.shape'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.sizeFormat'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.repetitionNumber'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.size'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.quantityToProduce'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.quality'), 'center'),
          this.typeTHeaderCell(this.translateText('dataSheetSample.approvalType'), 'center'),
        ], [
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.widthId, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.productionLenght, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].technicalData?.resourceModelName, 'center'),
          this.typeTBodyCellSimple('', 'center'),
          this.typeTBodyCellSimple('', 'center'),
          this.typeTBodyCellSimple(bodyDto[0].technicalData?.repetitionNumber, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.sizes, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].generalData?.sampleQuantity, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].identificationData?.qualityName, 'center'),
          this.typeTBodyCellSimple(bodyDto[0].generalData?.sampleApprovalTypeName, 'center'),
        ]
      ]).widths(['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', '*', 'auto']).margin([0, 5, 0, 0]).end,

      new Columns([
        new Stack([
          new Table(
            
            this.getContainerLineId(bodyDto[0]),
          ).widths(bodyDto[0].identificationData?.lineId == 82 ? ['auto', 'auto', 'auto', '*', 'auto', 'auto', '*'] :
            ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto',
            ]).headerRows(2).end,
        ]).width("*").end,
       
      ]).columnGap(3).margin([0, 5, 0, 0]).end,

      


      new Columns([
        new Stack([
          new Columns([
            new Stack([
              new Table(
                
                [
                [
                  
                  this.typeTHeaderCell(this.translateText('dataSheetSample.originalSample'), 'center'),
                  this.typeTHeaderCell(this.translateText('dataSheetSample.sampleFinotex'), 'center'),
                  this.typeTHeaderCell(this.translateText('dataSheetSample.appliedFTXsample'), 'center'),
                ],
                [
                  await new Img(Base64Imagen.NotImagen)
                    .height(120)
                    .width(120).alignment('center')
                    .build(),
                  await new Img(Base64Imagen.NotImagen)
                    .height(120)
                    .width(120).alignment('center')
                    .build(),
                  await new Img(data.bodyDto[0].identificationData?.graphicFileUrl == null || data.bodyDto[0].identificationData?.graphicFileUrl == "" ? Base64Imagen.NotImagen : data.bodyDto[0].identificationData?.graphicFileUrl)
                    .alignment('center')
                    .fit([120,120])
                    .build(),
                ]
              ]).widths(['*', '*', '*']).headerRows(1).end,
              new Table([
                [
                  {
                    text: this.translateText('dataSheetSample.graphicArtArchive'),
                    style: this.styleHeader,
                    fillColor: this.backGroundColor,
                    rowSpan: 2,
                    fontSize: this.fontSizeHeader,
                    bold: true,
                    alignment: 'center'
                    
                  },
                  {
                    text: this.translateText('dataSheetSample.designedTitle'),
                    style: this.styleHeader,
                    fillColor: this.backGroundColor,
                    colSpan: 2,
                    fontSize: this.fontSizeHeader,
                    bold: true,
                    alignment: 'center'
                  }, null,
                  {
                    text: this.translateText('dataSheetSample.deliveredToSales'),
                    style: this.styleHeader,
                    fillColor: this.backGroundColor,
                    colSpan: 2,
                    fontSize: this.fontSizeHeader,
                    bold: true,
                    alignment: 'center'
                  }, null,
                ],
                [
                  null,
                  this.typeTHeaderCell(this.translateText('dataSheetSample.dateTime'), 'center'),
                  this.typeTHeaderCell(this.translateText('dataSheetSample.designed'), 'center'),
                  this.typeTHeaderCell(this.translateText('dataSheetSample.dateTime'), 'center'),
                  this.typeTHeaderCell(this.translateText('dataSheetSample.deliveredBy'), 'center'),
                ],
                [
                  this.typeTBodyCellSimple(bodyDto[0].identificationData?.graphicFile, 'left'),
                  this.typeTBodyCellSimple(this.datePipe.transform(headerDto?.applicationDate, 'dd/MM/yyyy'), 'left'),
                  this.typeTBodyCellSimple(bodyDto[0].identificationData?.designerName, 'left'),
                  this.typeTBodyCellSimple(bodyDto[0].generalData?.sampleLastShipmentDate, 'left'),
                  this.typeTBodyCellSimple(bodyDto[0].generalData?.createdByUser, 'left'),
                ]
              ]).widths(['auto', '*', '*', '*', '*']).margin([0, 10]).end,

            ]).width("*").end,

            new Stack([
              new Table([
                [
                  {
                    text: this.translateText('dataSheetSample.packingUnit'),
                    style: this.styleHeader,
                    fillColor: this.backGroundColor,
                    colSpan: 2,
                    fontSize: this.fontSizeHeader,
                    bold: true,
                    alignment: 'center'
                  },
                  null
                ],
                [
                  this.typeTBodyCellSimple(this.translateText('dataSheetSample.quantity'), 'center'),
                  this.typeTBodyCellSimple(bodyDto[0].generalData?.sampleQuantity, 'center')
  
                ],
                [
                  this.typeTBodyCellSimple(this.translateText('dataSheetSample.packagingReference'), 'center'),
                  this.typeTBodyCellSimple(bodyDto[0].identificationData?.packUnit, 'center')
   
                ],
              ]).widths(['*', '*',]).headerRows(1).end,

              
              new Table([
                [
                  {
                    text: this.translateText('dataSheetSample.notes'),
                    style: this.styleHeader,
                    fillColor: this.backGroundColor,
                    colSpan: 4,
                    fontSize: this.fontSizeHeader,
                    bold: true,
                    alignment: 'center'
                  },
                  null,null,null
                ],
              ]).widths(['*', '*', '*', '*']).margin([0, 10, 0, 0]).end,

              new Table([
                [
                  new Cell(
                    new Txt(bodyDto[0].generalData?.samplesNotes).bold().fontSize(7).end
                  ).colSpan(4).end,
                  null, null, null
                ]
              ]).widths(['*', '*', '*', '*']).heights([50, 40, 140, 140]).end,
            ]).width("auto").end,
          ]).margin([0, 30, 0, 0]).columnGap(3).end

        ]).width("auto").end,
      ]).columnGap(6).margin([0, (bodyDto[0].materials.length > 6) ? 250 : 5, 0, 0]).end,
    ]);

    pdf.pageSize('A4');
    pdf.pageOrientation("landscape")
    pdf.pageMargins([20, 110, 20, 40]);
    pdf.create().open();
    pdf.footer(docDefinition.footer);
  }

  typeTHeaderCell(paramText: string, paramAligment: string) {
    return {
      text: paramText,
      style: this.styleHeader,
      fontSize: this.fontSizeHeader,
      bold: true,
      fillColor: this.backGroundColor,
      alignment: paramAligment,
    }
  }

  typeTBodyCellSimple(paramText: string, paramAligment: string) {
    return {
      text: paramText,
      fontSize: this.fontSizeHeader,
      bold: false,
      alignment: paramAligment,
    }
  }

  translateText(text: string) {
    return this.translate.instant(text);
  }


  getContainerLineId(paramData: any):any[] {
    if (paramData.identificationData?.lineId == 82) {
      return this.getSyntheticOthers(paramData);
    }
    return this.getDataTablePrincipal(paramData);
  }

  getDataTablePrincipal(paramData: any) :any[]{
    let principalIndex = []
    principalIndex.push([
      {
        text: this.translateText('dataSheetSample.materialsTitle'),
        style: this.styleHeader,
        fillColor: this.backGroundColor,
        colSpan: 6,
        fontSize: this.fontSizeHeader,
        bold: true,
        alignment: 'center'
      },
      null, null, null, null, null,
      {
        text: this.translateText('dataSheetSample.prepress'),
        style: this.styleHeader,
        colSpan: 6,
        fontSize: this.fontSizeHeader,
        bold: true,
        fillColor: this.backGroundColor,
        alignment: 'center'
      },
      null, null, null, null, null,
      {
        text: this.translateText('dataSheetSample.dateprint'),
        style: this.styleHeader,
        colSpan: 3,
        fontSize: this.fontSizeHeader,
        bold: true,
        fillColor: this.backGroundColor,
        alignment: 'center'
      },
      null, null,
    ]);

    principalIndex.push([
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialType'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.colormaterial'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialCode'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.descripcion'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.PrintRunByColor'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialQuantity'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.meshNumber'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.frameNumber'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.tension'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.layersFront'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.emulsionreverse'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.emulsionType'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.heatingOutlet'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.fpmSpeed'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.commentsMesh'), 'center'),
    ]);
      

    for (var i = 0; i < paramData.materials.length; i++) {
      let dataRow = [];
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.positionName, 'center'));
      dataRow.push(this.typeTBodyCellSimple('', 'center'));
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.materialId, 'center'));
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.description, 'center'));
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.runByColor, 'center'));
      dataRow.push(this.typeTBodyCellSimple('', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.meshId : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.frameNumber : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.mesh.meshTension : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.mesh.numberOfLayersFrontEmulsion : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.mesh.numberOfLayersBackEmulsion : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.mesh.emulsionType : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.outletHeat : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.fpmSpeed : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ? paramData.processSettings[i]?.commnets : '', 'center'));

      principalIndex.push(dataRow)
    }

    return principalIndex;
  }

  getSyntheticOthers(paramData: any) {
    let principalIndex = []
    principalIndex.push([
      {
        text: this.translateText('dataSheetSample.materialsTitle'),
        style: this.styleHeader,
        fillColor: this.backGroundColor,
        colSpan: 5,
        fontSize: this.fontSizeHeader,
        bold: true,
        alignment: 'center'
      },
      null, null, null, null,
      {
        text: this.translateText('dataSheetSample.dateprint'),
        style: this.styleHeader,
        colSpan: 2,
        fontSize: this.fontSizeHeader,
        bold: true,
        fillColor: this.backGroundColor,
        alignment: 'center'
      },
      null,
    ]);

    principalIndex.push([
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialType'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.colormaterial'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialCode'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.descripcion'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.materialQuantity'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.fpmSpeed'), 'center'),
      this.typeTHeaderCell(this.translateText('dataSheetSample.commentsMesh'), 'center'),
    ]);

    for (var i = 0; i < paramData.materials.length; i++) {
      let dataRow = [];
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.positionName, 'center'));
      dataRow.push(this.typeTBodyCellSimple('', 'center'));
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.materialId, 'center'));
      dataRow.push(this.typeTBodyCellSimple(paramData.materials[i]?.description, 'center'));
      dataRow.push(this.typeTBodyCellSimple('', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ?
        paramData.processSettings[i]?.fpmSpeed : '', 'center'));
      dataRow.push(this.typeTBodyCellSimple((i < paramData.processSettings.length) ?
        paramData.processSettings[i]?.commnets : '', 'center'));

      principalIndex.push(dataRow);
    }
    return principalIndex;
  }
}
