import { Cell, Columns, Img, PdfMakeWrapper, QR, Stack, Table, Txt } from 'pdfmake-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProductService } from 'src/app/core/services/product/product.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Base64Imagen } from 'src/app/shared/constant/userType';


PdfMakeWrapper.setFonts(pdfFonts);
@Injectable({
  providedIn: 'root'

})
export class DataSheetLaser {

  styleHeader: string = 'tableHeader';
  backGroundColor: string = '#C8C9CB';

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private storageService: StorageService,
  ) {
  }

  async DatasheetByLineLaser(data: any, statusSample: string) {
    const pdf = new PdfMakeWrapper();

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

    var value = [];
    var valueFabricComposition = [];

    data.bodyDto.forEach((element) => {
      var dataRow = [];
      dataRow.push({
        text: element.position,
        alignment: 'center',
        fontSize: 6,
      });
      dataRow.push({
        text: element.code.trim(),
        alignment: 'center',
        fontSize: 6,
      });

      dataRow.push({
        text: element.description,
        alignment: 'center',
        fontSize: 6,
      });

      dataRow.push({
        text: element.quantity,
        alignment: 'center',
        fontSize: 6,
      });

      dataRow.push({
        text: element.commnets,
        alignment: 'center',
        fontSize: 6,
      });

      value.push(dataRow);
    });

    data.footerDto.fabricComposition.forEach(element => {
      var item = "";
      item = element.propertyId.trim()+' ' + element.variableSpecification1 +'% ,'
      valueFabricComposition.push(item)

    });
    pdf.styles({
      tableHeader: {
        fontSize: 7,
        bold: true,
      },
      tableContent: {
        fontSize: 6,
        bold: false,
      }
    });

    pdf.header(new Stack([
      //Taba contiene ficha tecnica y correccion muestra <--- por coordenadas
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
                    text: data.headerDto.lineName,
                    bold: true,
                  },
                  {
                    border: [true, true, true, false],
                    text: this.translatorFinotex("pdf-report.impresion") + " " + data.headerDto.dateRequest.substr(0, 10),
                    fontSize: 9,
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

      //tabla zona
      new Table([
        [
          {
            text: this.translatorFinotex("pdf-report.zone"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.producedBy"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.customer"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.consecutiveSystem"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.order"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.application"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.code"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.description"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
        ],
        [
          {
            text: data.headerDto.zone,
            style: 'tableContent',
            alignment: 'left',
          },
          {
            text: this.storageService.getUser().username,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.customer,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.consecutiveSystem,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.order,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.dateRequest.substr(0, 10),
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.code,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.description,
            style: 'tableContent',
            alignment: 'center',
          },

        ]
      ]).widths(['auto', '*', '*', 'auto', 'auto', 'auto', '*', '*'])
        .margin([0, -2, 0, 0])
        .style(['tableHeader', 'tableContent'])
        .end,
    ]).width("*").margin([20, 20, 20, 20]).end);

    pdf.add([

      //tabla ancho
      new Table([
        [
          {
            text: this.translatorFinotex("pdf-report.width"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.long"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.machine"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.shape"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.sizeFormat"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.RepetitionNumber"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.deweed"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.quality"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.product"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          }
        ],
        [
          {
            text: data.headerDto.width,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.long,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.resourceModelCode,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.shape,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: "Pendiente",
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.numberRepetitions,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.deweed,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.quality,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.product,
            style: 'tableContent',
            alignment: 'center',
          }
        ]
      ]).widths(['*', '*', 'auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto'])
        .margin([0, 0, 0, 0])
        .style(['tableHeader', 'tableContent'])
        .end,

      //tabla impresion
      new Table([
        [
          {
            text: this.translatorFinotex("pdf-report.impresion"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
            colSpan: 2,
          }, null,
          {
            text: this.translatorFinotex("pdf-report.machineParameters"),
            style: 'tableHeader',
            colSpan: 7,
            fillColor: '#C8C9CB',
            alignment: 'center'
          }, null, null, null, null, null, null,
        ],
        [
          {
            text: this.translatorFinotex("pdf-report.advance"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.squeegeeTravel"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.markLoop"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.speed"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.power"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.frequency"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.presion"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.angle"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
          {
            text: this.translatorFinotex("pdf-report.bladeType"),
            style: 'tableHeader',
            fillColor: '#C8C9CB',
            alignment: 'center',
          },
        ],
        [
          {
            text: data.headerDto.advance,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.squeegeeTravel,
            style: 'tableContent',
            alignment: 'center',
          },
          {
            text: data.headerDto.markloop,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.speed,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.power,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.frequency,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.pressure,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.angle,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
          {
            text: data.headerDto.bladeType,
            style: 'tableHeader',
            fontSize: 7,
            alignment: 'center',
          },
        ],
      ]).widths(['*', 'auto', '*', '*', '*', '*', '*', '*', '*'])
        .margin([0, 5, 0, 0])
        .style(['tableHeader', 'tableContent'])
        .end,

      //tabla contenido principal
      new Columns([
        new Stack([
          new Table([
            //cabecera del padre colspan
            [
              {
                text: this.translatorFinotex("pdf-report.materialsPaper"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                colSpan: 4,
                alignment: 'center'
              },
              null, null, null,

              {
                text: this.translatorFinotex("pdf-report.impresion"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center'
              },
            ],
            //cabecera de cada hijo
            [
              {
                text: this.translatorFinotex("pdf-report.positionItem"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("pdf-report.materialCode"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("pdf-report.description"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("pdf-report.materialQuantity"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center',
              },
              {
                text: this.translatorFinotex("pdf-report.comments"),
                style: 'tableHeader',
                fillColor: '#C8C9CB',
                alignment: 'center',
              }
            ],
            ...value,
          ]).widths(['auto', '*', '*', 'auto', '*',])
            .style(['tableHeader', 'tableContent']).end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, 5, 0, 0]).end,

      //grupo de tablas que contiene muestra original , finotex, aplicada,opciones,setting,EMBOBINADO
      new Columns([
        new Stack([
          new Columns([
            //columna muestra original
            new Stack([
              new Table([
                [
                  new Cell(
                    new Txt(this.translatorFinotex("pdf-report.originalSample")).bold().alignment('center').fontSize(7).end)
                    .fillColor("#C8C9CB").end,
                ],
                [
                  await new Img(Base64Imagen.NotImagen)
                    .height(115)
                    .width(100).alignment('center')
                    .build(),
                ]
              ]).widths(['*']).headerRows(1).keepWithHeaderRows(1).end
            ]).width("auto").end,
            //columna muestra finotex
            new Stack([
              new Table([
                [
                  new Cell(
                    new Txt(this.translatorFinotex("pdf-report.sampleFinotex")).bold().alignment('center').fontSize(7).end
                  ).fillColor("#C8C9CB").end,
                ],
                [
                  await new Img(data.footerDto?.graphicUrl == null || data.footerDto?.graphicUrl == "" ? Base64Imagen.NotImagen : data.footerDto?.graphicUrl)
                    .alignment('center')
                    .fit([100,115])
                    .build(),
                ]
              ]).widths(['*']).headerRows(1).keepWithHeaderRows(1).end
            ]).width("auto").end,
            //muestra aplicada
            new Stack([
              new Table(
                [
                  [
                    new Cell(new Txt(this.translatorFinotex("pdf-report.appliedFtx")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                  ],
                  [
                    await new Img(Base64Imagen.NotImagen)
                      .height(70)
                      .width(60).alignment('center')
                      .build(),
                  ],
                  [
                    {
                      table: {
                        body: [
                          //cabecera tabla
                          [
                            {
                              text: this.translatorFinotex("pdf-report.packagingUnit"),
                              style: 'tableHeader',
                              fillColor: '#C8C9CB',
                              colSpan: 2,
                              fontSize: 6,
                              bold: true,
                              alignment: 'center'
                            }, {}
                          ],
                          //contenido fila 1
                          [
                            {
                              text: this.translatorFinotex("pdf-report.quantity"),
                              style: 'tableContent',
                              alignment: 'center'
                            }, {
                              text: data.footerDto.packagingQuantity,
                              style: 'tableContent',
                              alignment: 'center'
                            }
                          ],
                          //contenido fila 2
                          [
                            {
                              text: this.translatorFinotex("pdf-report.packagingReference"),
                              style: 'tableContent',
                              alignment: 'center'
                            },
                            {
                              text: data.footerDto.packagingReference,
                              style: 'tableContent',
                              alignment: 'left'
                            },
                          ]
                        ]
                      }
                    }
                  ]
                ]).widths(['auto']).style(['tableContent']).headerRows(1).keepWithHeaderRows(1).end
            ]).width("auto").end,
            //columna setings
            new Stack([
              new Table([
                [
                  new Cell(
                    new Txt(this.translatorFinotex("pdf-report.settingAplication")).bold().alignment('center').fontSize(7).end
                  ).fillColor("#C8C9CB").colSpan(4).end,
                  {}, {}, {}
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.pressure")).bold().alignment('left').fontSize(7).end).colSpan(2).end,
                  {},
                  new Cell(new Txt(data.footerDto.pressure).alignment('center').fontSize(6).end).colSpan(2).end,
                  {}
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.temperature")).bold().alignment('left').fontSize(7).end).colSpan(2).end,
                  {},
                  new Cell(new Txt(data.footerDto.temperature).alignment('center').fontSize(6).end).colSpan(2).end,
                  {}
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.time")).bold().alignment('left').fontSize(7).end).colSpan(2).end,
                  {},
                  new Cell(new Txt(data.footerDto.time).alignment('center').fontSize(6).end).colSpan(2).end,
                  {}
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.detachment")).bold().alignment('left').fontSize(7).end).colSpan(2).end,
                  {},
                  new Cell(new Txt(data.footerDto.datachment).alignment('center').fontSize(6).end).colSpan(2).end,
                  {}
                ],

              ]).widths(['*', '*', '*', '*']).headerRows(1).keepWithHeaderRows(1).end,
              new Table([
                [
                  new Cell(
                    new Txt(this.translatorFinotex("pdf-report.notes")).bold().alignment('left').fontSize(7).end
                  ).border([true, true, true, false]).fillColor("#C8C9CB").colSpan(4).end,
                  {}, {}, {}
                ]
              ]).widths(['*', '*', '*', '*']).end,

              new Table([
                [
                  new Cell(
                    new Txt(data.footerDto.observations).bold().alignment('left').fontSize(6).end
                  ).margin(15).colSpan(4).end,
                  {}, {}, {}
                ]
              ]).widths(['*', '*', '*', '*']).end,
            ]).width("*").end,

            // columna Reverse 
            new Stack([
              new Table([
                [
                  new Cell(
                    new Txt(this.translatorFinotex("pdf-report.reverseApplication")).bold().alignment('center').fontSize(7).end
                  ).fillColor("#C8C9CB").colSpan(2).end,
                  {},
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.pressure")).bold().alignment('left').fontSize(7).end).end,
                  new Cell(new Txt(data.footerDto.pressure).bold().alignment('center').fontSize(6).end).end,
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.temperature")).bold().alignment('left').fontSize(7).end).end,
                  new Cell(new Txt(data.footerDto.temperature).bold().alignment('center').fontSize(6).end).end,
                ],
                [
                  new Cell(new Txt(this.translatorFinotex("pdf-report.time")).bold().alignment('left').fontSize(7).end).end,
                  new Cell(new Txt(data.footerDto.time).bold().alignment('center').fontSize(6).end).end,
                ]

              ]).widths(['*', '*']).headerRows(1).keepWithHeaderRows(1).end,
              //columna  corte
              new Stack([

                new Table([
                  [
                    new Cell(new Txt(this.translatorFinotex("pdf-report.cut")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
                  ],
                  [
                    await new Img(data.footerDto.cutUrlImage == null ? Base64Imagen.NotImagen : data.footerDto.cutUrlImage)
                      .height(60)
                      .width(100).alignment('center')
                      .build(),
                  ]
                ]).margin([0, 0, 0, 0]).widths(['*']).end,
              ]).width("auto").end,
            ]).width("auto").end,

          ]).columnGap(4).margin([0, 40, 0, 0]).end

        ]).width("*").end,
      ]).end,

      //Grafhic Archive
      new Columns([
        new Stack([
          new Table([
            //cabeceras padre
            [
              new Cell(new Txt(this.translatorFinotex("pdf-report.graphicArchive")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").colSpan(1).end,
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.designed")).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(2).end,
              {},
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.deliveredSales")).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(2).end,
              {},
            ],
            //cabeceras hijos
            [
              new Cell(new Txt(data.footerDto.graphicArtArchive).bold().alignment('center').fontSize(6).end).border([true, false, true, true]).rowSpan(2).end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.date")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.designer")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.date")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.deliveredBy")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            //contenido
            [
              {},
              new Cell(new Txt(data.footerDto.dateDesigned.substr(0, 10)).alignment('center').fontSize(6).end).margin(1).end,
              new Cell(new Txt(data.footerDto.designed).alignment('center').fontSize(6).margin(1).end).end,
              new Cell(new Txt(data.footerDto.sampleLastShipmentDate).alignment('center').fontSize(6).end).margin(1).end,
              new Cell(new Txt(data.footerDto.createdByUser).alignment('center').fontSize(6).end).margin(1).end,
            ]
          ]
          )
          .widths(['*', '*', '*', '*', '*']).margin([0, 20, 0, 0]).headerRows(2).keepWithHeaderRows(2).end,
        ]).width("*").end,
      ]).columnGap(3).margin([0, 20, 0, 0]).end,

      //Taba contiene ficha tecnica y correccion muestra <--- por coordenadas
      new Columns([
        new Stack([
          new Table([
            //cabecera padre
            [
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.titlefabric").toUpperCase()).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(5).end,
              null,null,null,null
            ],
            //cabeceras hijos
            [
              new Cell(new Txt(this.translatorFinotex("pdf-report.fabricComposition")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.typeoffabric")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.fabricColor")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.clienteProvided")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.willSpecial")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            //contenido
            [
              new Cell(new Txt(valueFabricComposition).alignment('center').fontSize(6).end).border([true, false, false, true]).end,
              new Cell(new Txt(data.footerDto.typeFabric).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.fabricColor).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.mesageClientProvied).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.messageWillSpecial).alignment('center').fontSize(6).end).end,
            ]
          ]
          )
            .widths(['auto', 'auto', 'auto', 'auto', 'auto']).pageBreak("before").end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, (data.bodyDto.length >= 2)? 105 : 15, 0, 0]).end,

      new Columns([
        new Stack([
          new Table([
            //cabecera padre
            [
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.titlewash").toUpperCase()).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(8).end,
              null,null,null,null,null,null,null
            ],
            //cabeceras hijos
            [
              new Cell(new Txt(this.translatorFinotex("pdf-report.numberCycles")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.washTemperature")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.numberDrying")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.dryingTemperature")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.numberApplied")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.typeWashing")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.washingTest")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.specificMethod")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,

            ],
            //contenido
            [
              new Cell(new Txt(data.footerDto.numberofWashCycles).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.washTemperature).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.numberDrying).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.dryingTemperature).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.numberApplied).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.typeWashing).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.washingTest).alignment('center').fontSize(6).end).end,
              new Cell(new Txt(data.footerDto.specificMethod).alignment('center').fontSize(6).end).end,
            ]
          ]
          )
            .widths(['*', '*', '*', '*', '*', '*', '*', '*']).end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, 15, 0, 0]).end,

      new Columns([
        new Stack([
          new Table([
            //cabecera padre
            [
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.timetitle").toUpperCase()).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(2).end,
              {}
            ],
            //cabeceras hijos
            [
              new Cell(new Txt(this.translatorFinotex("pdf-report.timeHeat")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(this.translatorFinotex("pdf-report.temperatureHeat")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
            ],
            //contenido
            [
              new Cell(new Txt(data.footerDto.timeHeat).alignment('center').fontSize(6).end).border([true, false, false, true]).end,
              new Cell(new Txt(data.footerDto.temperatureHeat).alignment('center').fontSize(6).end).end,
            ]
          ]
          )
            .widths(['*', '*']).end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, 15, 0, 0]).end,

      new Columns([
        new Stack([
          new Table([
            //cabecera padre
            [
              new Cell(
                new Txt(this.translatorFinotex("pdf-report.titlelspecifictitle").toUpperCase()).bold().alignment('center').fontSize(7).end
              ).fillColor("#C8C9CB").colSpan(2).end,
              {}
            ],
            //cabeceras hijos
            [
              new Cell(new Txt(this.translatorFinotex("pdf-report.enterRequirements")).bold().alignment('center').fontSize(7).end).fillColor("#C8C9CB").end,
              new Cell(new Txt(data.footerDto.specificRequirements).bold().alignment('center').fontSize(6).end).end,
            ],
          ]
          )
            .widths(['*', '*']).end,
        ]).width("*").end,

      ]).columnGap(3).margin([0, 15, 0, 0]).end,

    ]);

    pdf.pageSize('A4');
    pdf.pageOrientation("landscape")
    pdf.pageMargins([20, 120, 20, 20]);
    pdf.create().open();
    pdf.footer(docDefinition.footer);

  }

  private translatorFinotex(data: string): string {
    return this.translate.instant(data);
  }

}
