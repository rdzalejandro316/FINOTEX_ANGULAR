import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Canvas, Cell, Columns, Img, PdfMakeWrapper, QR, Rect, Stack, Table, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Base64Imagen } from 'src/app/shared/constant/userType';
import { ProductService } from '../product/product.service';
import { StorageService } from '../storage/storage.service';
import { DataSheetGetByRollo } from './dataSheet-Rollo';

PdfMakeWrapper.setFonts(pdfFonts);

@Injectable({
  providedIn: 'root',
})
export class PrintPdfSales {

  constructor(
    private datePipe: DatePipe,
    private translate: TranslateService,
    private dataSheetGetByRollo: DataSheetGetByRollo,
    private storageService: StorageService,
    private productService: ProductService) { }

  onCreatePDFSales(data: any, sampleId: number) {
    this.datasheetByLine(data, sampleId);
  }

  datasheetByLine(data: any, sampleId: number) {
    const dataSampleById = {
      "companyId": this.storageService.getProfiles().businessId,
      "sampleId": sampleId,
    };
    this.productService.getSampleById(dataSampleById).subscribe(
      (response) => {
        var statusSample: string
        if (response.data.sampleStatusId == 6) {
          statusSample = this.translatorFinotex("pdf-report.statusSample");
        } else {
          statusSample = this.translatorFinotex("pdf-report.statusSample2");
        }
        this.buildPDFStamp(statusSample, data)
      },
      (error) => {

      },
      () => { }
    );

  }

  async buildPDFStamp(statusSample: string, data: any): Promise<void> {

    const pdf = new PdfMakeWrapper();
    var value = [];

    data.bodyDto.forEach((element) => {
      var dataRow = [];
      dataRow.push({
        text: element.position,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.colorClass.trim(),
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.description,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.code.trim(),
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.aniloxXl,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.aniloxL6,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.fr,
        alignment: 'center',
        fontSize: 7,
      });

      dataRow.push({
        text: element.quantity,
        alignment: 'center',
        fontSize: 7,
      });

      value.push(dataRow);
    });

    var options = " ";

    data.footerDto.options.forEach((element) => {
      options += element + ", "
    });

    var docDefinition = {
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + ' of ' + pageCount,
          alignment: 'right',
          fontSize: 8,
          margin: ([5, 5, 15, 5])
        }
      },
    };

    pdf.header(
      new Stack([
        new Table([
          [
            new Cell(
              await new Img("https://finotex.blob.core.windows.net/imagereports/FinotexLogo.png?sp=r&st=2022-07-14T18:11:59Z&se=2023-07-15T02:11:59Z&spr=https&sv=2021-06-08&sr=b&sig=SH7rV1n%2BuG%2BANtY%2BGxugjpDe%2BZkPUebe8cBwWOq1Fgs%3D")
                .height(40)
                .width(90)
                .build(),
            ).rowSpan(2).border([false, false, false, false]).end,

            new Cell(new Txt(statusSample).bold().alignment('center').fontSize(15).end).margin(8).border([false, false, false, false]).end,

            new Cell(
              new QR('898555').fit(50).end,
            ).border([false, false, false, false]).end,
          ],
          [
            {},
            {
              border: [true, true, true, false],
              text: data.headerDto?.lineName == null ? " " : data.headerDto.lineName,
              bold: true,
              colSpan: 2
            },
            {}
          ]
        ]).widths(['auto', '*', 'auto']).end,

        new Table([
          [
            {
              text: this.translatorFinotex("stamped-report.zone").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'center',
            },
            {
              text: this.translatorFinotex("stamped-report.coordinator").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'center',
            },
            {
              text: this.translatorFinotex("stamped-report.customer").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'left',
            },
            {
              text: 'CONS.SIST',
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'left',
            },
            {
              text: this.translatorFinotex("stamped-report.order").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'left',
            },
            {
              text: this.translatorFinotex("stamped-report.request").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              bold: true,
              fillColor: '#C8C9CB',
              alignment: 'left',
            },
            {
              text: this.translatorFinotex("stamped-report.Print").toUpperCase(),
              style: 'tableHeader',
              fontSize: 9,
              fillColor: '#C8C9CB',
              bold: true,
              alignment: 'center',
            },
          ],
          [
            {
              text: data.headerDto.zone == null ? " " : data.headerDto.zone.trim(),
              fontSize: 9,
              bold: false,
              alignment: 'center',
            },
            {
              text: this.storageService.getUser().username,
              fontSize: 9,
              bold: false,
              alignment: 'center',
            },
            {
              text: data.headerDto.customer.trim(),
              fontSize: 9,
              bold: false,
              alignment: 'left',
            },
            {
              text: data.headerDto.consecutiveSystem,
              fontSize: 9,
              bold: false,
              alignment: 'left',
            },
            {
              text: data.headerDto.order,
              fontSize: 9,
              bold: false,
              alignment: 'left',
            },
            {
              text: this.datePipe.transform(data.headerDto?.dateRequest, 'dd/MM/yyyy'),
              fontSize: 9,
              bold: false,
              alignment: 'left',
            },
            {
              text: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
              fontSize: 9,
              bold: false,
              alignment: 'center',
            },
          ]
        ]).widths(['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto']).margin([0, 0, 0, 0]).end,
      ]).width("*").margin([20, 20, 20, 20]).end
    );

    pdf.add([
      new Table([
        [
          {
            text: this.translatorFinotex("stamped-report.code").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("stamped-report.description").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("stamped-report.products").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          /*{
            text: this.translatorFinotex("stamped-report.quality").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },*/
          {
            text: this.translatorFinotex("stamped-report.width").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },
          {
            text: this.translatorFinotex("stamped-report.long").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },
          {
            text: this.translatorFinotex("stamped-report.front").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },
          {
            text: this.translatorFinotex("stamped-report.shape").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },
          {
            text: this.translatorFinotex("stamped-report.size").toUpperCase(),
            style: 'tableHeader',
            fontSize: 9,
            bold: true,
            fillColor: '#C8C9CB',
            alignment: 'left',
          },
        ],
        [
          {
            text: data.headerDto.code.trim(),
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.description.trim(),
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.product.trim(),
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.width,
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.long,
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.fold,
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.shape,
            fontSize: 9,
            bold: false,
            alignment: 'center',
          },
          {
            text: data.headerDto.size,
            fontSize: 9,
            bold: false,
            alignment: 'center'
          },
        ]
      ]).widths(['auto', '*', '*', 'auto', 'auto', 'auto', 'auto', 'auto']).margin([0, 5, 0, 0]).end,

      new Columns([
        new Stack([
          new Table([
            [
              new Cell(new Txt(this.translatorFinotex("stamped-report.negative").toUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").colSpan(4).end,
              {}, {}, {}
            ],
            [
              {
                text: this.translatorFinotex("stamped-report.number_of_separations").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.Machine").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.NCilindro").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.NRepetitions").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
            ],
            [
              {
                text: data.headerDto.numberOfSeparations,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              },
              {
                text: data.headerDto.resourceModelCode,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              },
              {
                text: data.headerDto.numberCylinder,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              },
              {
                text: data.headerDto.numberRepetitions,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              },
            ]
          ]).widths(['*', 'auto', 'auto', 'auto']).end,
        ]).width("*").end,

        new Stack([
          new Table([
            [
              new Cell(new Txt(this.translatorFinotex("stamped-report.Print").toUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").colSpan(2).end,
              {},
            ],
            [
              {
                text: this.translatorFinotex("stamped-report.Finish").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },

              {
                text: this.translatorFinotex("stamped-report.Reinforcement").toUpperCase(),
                style: 'tableHeader',
                fontSize: 9,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              }
            ],
            [
              {
                text: data.headerDto.finish,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              },
              {
                text: data.headerDto.reinforcement,
                fontSize: 9,
                bold: false,
                alignment: 'center',
              }
            ]
          ]).widths(['auto', 'auto']).end,
        ]).width("auto").end,

      ]).columnGap(3).margin([0, 5, 0, 0]).end,

      new Columns([
        new Stack([
          new Table([
            [
              new Cell(new Txt(this.translatorFinotex("stamped-report.Print").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").colSpan(8).end,
              {}, {}, {}, {}, {}, {}, {}
            ],
            [
              {
                text: this.translatorFinotex("stamped-report.Position").toUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.ColorClass").toUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.description").toUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.code").toUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: new String('Anilox LX').toLocaleUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: new String('Anilox L6').toLocaleUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: 'F/R',
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("stamped-report.Quantity").toUpperCase(),
                style: 'tableHeader',
                fontSize: 7,
                bold: true,
                fillColor: '#C8C9CB',
                alignment: 'center',
              }
            ],
            ...value,
          ]).widths(['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto']).end,

        ]).width("auto").end,

        //PhysicalSample
        new Stack([
          new Table([
            [
              new Cell(new Txt(this.translatorFinotex("stamped-report.PhysicalSample").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").end,
            ],
            [
              await new Img(data.footerDto?.graphicUrl == null || data.footerDto?.graphicUrl == "" ? Base64Imagen.NotImagen : data.footerDto?.graphicUrl)
                .fit([205, 303],).alignment('center')
                .build(),
            ],
            [
              new Table([
                [
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Customer_property").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).fillColor("#C8C9CB").colSpan(2).end,
                  {}
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Entry").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).end,
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Exit").toLocaleUpperCase()).bold().alignment('center').fontSize(9).end).end,
                ],
                [
                  new Cell(
                    new Columns([
                      new Canvas(data.footerDto?.isCustomerProperty == null ?
                        [this.pixelRound(0, 1, "#ffffff", "#000000")] : data.footerDto?.isCustomerProperty == 'S' ?
                          [this.pixelRound(0, 1, "#000000", "#000000")] : [this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('Si').bold().alignment('left').fontSize(9).end,
                      new Canvas(data.footerDto?.isCustomerProperty == null ?
                        [this.pixelRound(0, 1, "#ffffff", "#000000")] : data.footerDto?.isCustomerProperty == 'N' ?
                          [this.pixelRound(0, 1, "#000000", "#000000")] : [this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('No').bold().alignment('left').fontSize(7).end,
                    ]).columnGap(1).width("auto").end
                  ).end,

                  new Cell(
                    new Columns([
                      new Canvas([this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('Si').bold().alignment('left').fontSize(7).end,
                      new Canvas([this.pixelRound(0, 1, "#ffffff", "#000000")]).end,
                      new Txt('No').bold().alignment('left').fontSize(7).end,
                      new Stack([
                        new Txt(this.translatorFinotex("stamped-report.Date").toLocaleUpperCase()).bold().alignment('center').fontSize(7).end,
                        new Columns([
                          new Canvas([this.pixel(0, 1, "#ffffff", "#000000")]).end,
                          new Canvas([this.pixel(0, 1, "#ffffff", "#000000")]).end,
                          new Canvas([this.pixel(0, 1, "#ffffff", "#000000")]).end,
                        ]).width("auto").end

                      ]).width("auto").end
                    ]).columnGap(1).width("auto").end
                  ).end,
                ]
              ]).margin([0, 6, 0, 0]).widths([55, 130]).end,
            ]
          ]).widths([205]).alignment('center').height(303).end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, 5, 0, 0]).end,

      //  Tabla 6 - Observaciones
      new Columns([
        new Stack([
          new Table([
            [
              //Titulo Padre
              //Observaciones
              new Cell(new Txt(this.translatorFinotex("stamped-report.Notes").toLocaleUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(5).end,
              null, null, null, null
            ],
            [
              //Contenido 
              //Observaciones Contenido
              new Cell(new Txt(data.footerDto.observations).bold().alignment('center').fontSize(7).end).colSpan(5).end,
              null, null, null, null
            ],
            [
              //Titulos Hijos
              //Opciones
              new Cell(new Txt(this.translatorFinotex("stamped-report.Options").toUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              //Blade
              new Cell(new Txt(this.translatorFinotex("stamped-report.blade").toUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              //Embobinado
              new Cell(new Txt(this.translatorFinotex("stamped-report.Winding").toUpperCase()).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              //Packaging Reference
              new Cell(new Txt(this.translatorFinotex("stamped-report.Packaging").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              //Corte 
              new Cell(new Txt(this.translatorFinotex("stamped-report.Cut").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
            ],
            [
              //Opciones
              new Cell(new Txt(data.footerDto.options.join(' , ')).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
              //Blade
              new Cell(new Txt(data.headerDto.bladeType).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).end,
              //Embobinado
              new Cell(await new Img(data.footerDto.windingUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.windingUrlImage).fit([160, 50]).alignment('center').build()).colSpan(1).end,
              //Packaging
              new Table([
                [
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Quantity").toUpperCase()).bold().alignment('left').fontSize(7).end).end,
                  new Cell(new Txt(data.footerDto.packagingQuantity).bold().alignment('center').fontSize(7).end).end,
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("stamped-report.Packaging").toUpperCase()).bold().alignment('left').fontSize(7).end).end,
                  new Cell(new Txt(data.footerDto.packagingReference).bold().alignment('center').fontSize(7).end).end,
                ]
              ]).widths(['auto', 'auto']).end,
              //Corte 
              new Cell(await new Img(data.footerDto.cutUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.cutUrlImage).fit([90, 50]).alignment('center').build()).colSpan(1).end,
            ]

          ]).widths(['*', '*', '*', '*', '*']).end
        ]).width("*").end,

      ]).columnGap(2).margin([0, 1, 0, 0]).end,

      //Tabla 7 Archivos de diseño
      new Columns([
        new Stack([
          new Table([
            [
              //Titulo Padres 
              //Archivo Grafico
              new Cell(new Txt(this.translatorFinotex("stamped-report.Graphic").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
              //Diseno  
              new Cell(new Txt(this.translatorFinotex("stamped-report.Designed").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).colSpan(2).fillColor("#C8C9CB").end,
              null,
              //UpdatedSeal 
              new Cell(new Txt(this.translatorFinotex("stamped-report.UpdatedSeal").toLocaleUpperCase()).font("Roboto").bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            [
              //Archivo Grafico
              new Cell(new Txt(data.footerDto.graphicArtArchive).alignment('center').fontSize(7).end).rowSpan(2).end,
              //Diseno  
              new Cell(new Txt(this.translatorFinotex("dataSheetCutedge.other_date").toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
              new Cell(new Txt("Diseñador".toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).fillColor("#C8C9CB").end,
              //Tejeduria 
              new Cell(new Txt("").alignment('center').fontSize(7).end).rowSpan(2).end,
            ],
            [
              //Archivo Grafico
              null,
              //Diseno  
              new Cell(new Txt(data.footerDto.dateDesigned.substr(0, 10)).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
              new Cell(new Txt(data.footerDto.designed.trim().toLocaleUpperCase()).font("Roboto").bold().alignment('left').fontSize(7).end).colSpan(1).end,
              //Tejeduria 
              null,

            ]
          ]).widths(['auto', 'auto', 'auto', '*']).end,
        ]).width("*").end,
      ]).columnGap(3).margin([0, 5, 0, 0])
        .style(['tableHeader', 'tableContent']).end,

      //Registro Calidad 
      new Columns([
        new Stack([
          new Table([
            [
              new Cell(new Txt('Registro de Calidad').bold().alignment('right').fontSize(10).end).end,
              new Cell(new Txt('FOC03-06').bold().alignment('left').fontSize(10).end).end,
            ]
          ]).layout('noBorders').margin([0, 1, 0, 0]).widths(['*', '*']).end
        ]).width('*').end
      ]).columnGap(3).margin([0, 15, 0, 0]).end,

    ]);

    pdf.pageSize('A4');
    pdf.pageMargins([20, 120, 20, 20]);
    pdf.footer(docDefinition.footer);
    pdf.create().open();
  }



  private pixelRound(x: number, y: number, colorBackground: string, colorLine: string) {
    return new Rect([x, y], 10).color(colorBackground).lineColor(colorLine).round(50).end;
  }

  private pixel(x: number, y: number, colorBackground: string, colorLine: string) {
    return new Rect([x, y], [20, 10]).color(colorBackground).lineColor(colorLine).end;
  }

  private translatorFinotex(data: string): string {
    return this.translate.instant(data);
  }
}
