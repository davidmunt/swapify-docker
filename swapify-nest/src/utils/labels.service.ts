import { Injectable, Logger, Res } from '@nestjs/common';
import * as streamModule from 'stream';
import { BLANK_PDF } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text, image, barcodes } from '@pdfme/schemas';
import * as path from 'path';
import * as fs from 'fs/promises';

class PositionObj {
  constructor(
    public x: number,
    public y: number,
  ) {}
}

class SchemaObj {
  constructor(
    public name: string,
    public type: string,
    public position: PositionObj,
    public width: number,
    public height: number,
    public fontSize: number,
  ) {
    if (!type || !position || width === undefined || height === undefined) {
      throw new Error(
        `SchemaObj inválido: ${JSON.stringify({ type, position, width, height, fontSize })}`,
      );
    }
  }
}

const labelModel = {
  '1272': {
    colHorizontalIncrement: 70,
    colVerticalIncrement: 35,
    itemsPerPage: 24,
    cols: 3,
    rows: 8,
    qrcode: new PositionObj(5, 13),
    text_etiqueta: new PositionObj(26, 12),
    aula: new PositionObj(26, 22),
    ns: new PositionObj(26, 28),
    logo: new PositionObj(50, 10),
  },
  '11783': {
    colHorizontalIncrement: 104,
    colVerticalIncrement: 37,
    itemsPerPage: 16,
    cols: 2,
    rows: 8,
    qrcode: new PositionObj(12, 8),
    text_etiqueta: new PositionObj(36, 8),
    aula: new PositionObj(36, 16),
    ns: new PositionObj(36, 23),
    logo: new PositionObj(82, 6),
  },
};

const labelModelName = '11783';
@Injectable()
export class LabelsService {
  async generateLabels(inventory_items, @Res() res: any) {
    const colHorizontalIncrement =
      labelModel[labelModelName].colHorizontalIncrement;
    const colVerticalIncrement =
      labelModel[labelModelName].colVerticalIncrement;
    const itemLength = inventory_items.length;
    const itemsPerPage = labelModel[labelModelName].itemsPerPage;
    let itemCount = 0;
    const pagesLength = Math.ceil(itemLength / itemsPerPage);
    const inputs = [];
    const schemasObj = {};
    for (let page = 0; page < pagesLength; page++) {
      const inputsObj = {};
      let row = 0;
      let col = 0;
      while (itemCount < itemLength && row < labelModel[labelModelName].rows) {
        col = 0;
        while (
          itemCount < itemLength &&
          col < labelModel[labelModelName].cols
        ) {
          let newObjKey = '';
          // QR
          newObjKey = 'qrcode' + row + '-' + col;
          let position = {
            x:
              labelModel[labelModelName].qrcode.x +
              col * colHorizontalIncrement,
            y: labelModel[labelModelName].qrcode.y + row * colVerticalIncrement,
          };
          schemasObj[newObjKey] = new SchemaObj(
            'qrCode',
            'qrcode',
            position,
            20,
            20,
            0,
          );
          inputsObj[newObjKey] =
            process.env.INVENTORY_HOST +
            '/inventari/' +
            inventory_items[itemCount].id_inventory;
          // Text type
          newObjKey = 'etiqueta' + row + '-' + col;
          position = {
            x:
              labelModel[labelModelName].text_etiqueta.x +
              col * colHorizontalIncrement,
            y:
              labelModel[labelModelName].text_etiqueta.y +
              row * colVerticalIncrement,
          };
          let fontSizeEtiquet;
          if (
            inventory_items[itemCount].num_serie.length > 15 &&
            labelModel[labelModelName].itemsPerPage > 16
          ) {
            fontSizeEtiquet = 5;
          } else {
            fontSizeEtiquet = 10;
          }

          schemasObj[newObjKey] = new SchemaObj(
            'etiqueta',
            'text',
            position,
            60,
            7,
            fontSizeEtiquet,
          );
          inputsObj[newObjKey] = inventory_items[itemCount].text_etiqueta;

          // Text location
          newObjKey = 'aula' + row + '-' + col;
          position = {
            x: labelModel[labelModelName].aula.x + col * colHorizontalIncrement,
            y: labelModel[labelModelName].aula.y + row * colVerticalIncrement,
          };
          schemasObj[newObjKey] = new SchemaObj(
            'aula',
            'text',
            position,
            60,
            7,
            12,
          );
          inputsObj[newObjKey] =
            'Aula: ' + inventory_items[itemCount].fk_classroom.id_classroom;
          // Text NS
          newObjKey = 'num_serie' + row + '-' + col;
          position = {
            x: labelModel[labelModelName].ns.x + col * colHorizontalIncrement,
            y: labelModel[labelModelName].ns.y + row * colVerticalIncrement,
          };
          let fontSize;
          if (
            inventory_items[itemCount].num_serie.length > 15 &&
            labelModel[labelModelName].itemsPerPage > 16
          ) {
            fontSize = 9;
          } else {
            fontSize = 12;
          }
          schemasObj[newObjKey] = new SchemaObj(
            'num_serie',
            'text',
            position,
            60,
            7,
            fontSize,
          );
          inputsObj[newObjKey] = inventory_items[itemCount].num_serie;

          // Logo image
          newObjKey = 'logo' + row + '-' + col;
          position = {
            x: labelModel[labelModelName].logo.x + col * colHorizontalIncrement,
            y: labelModel[labelModelName].logo.y + row * colVerticalIncrement,
          };

          schemasObj[newObjKey] = new SchemaObj(
            'logo',
            'image',
            position,
            15,
            15,
            0,
          );

          const logoFile = path.join(
            __dirname,
            '/../../src/utils/labelsData',
            'logo_iestacio.png',
          );
          const logoImgData = await fs.readFile(logoFile, 'base64');
          const logoImgDataBase64 = 'data:image/png;base64,' + logoImgData;
          inputsObj[newObjKey] = logoImgDataBase64;

          col++;
          itemCount++;
        }
        row++;
      }
      inputs.push(inputsObj);
    }

    const templateSchemas = [];
    const rows = []; // arreglo para almacenar las filas
    for (const key in schemasObj) {
      if (schemasObj.hasOwnProperty(key)) {
        const schema = schemasObj[key];
        let row = rows.find((row) =>
          row.find((schema) => schema.position.y === schema.position.y),
        );
        if (!row) {
          row = [];
          rows.push(row);
        }
        row.push({
          name: key,
          type: schema.type,
          position: schema.position,
          width: schema.width,
          height: schema.height,
          fontSize: schema.fontSize,
        });
      }
    }
    templateSchemas.push(...rows);
    const template = {
      basePdf: BLANK_PDF,
      schemas: templateSchemas,
    };
    const plugins = { text, image, qrcode: barcodes.qrcode };

    generate({ template, inputs, plugins })
      .then((pdf) => {
        if (pdf == null) {
        } else {
          const readStream = new streamModule.PassThrough();
          readStream.end(pdf);
          res.set('Content-disposition', 'attachment; filename=etiquetes.pdf');
          res.set('Content-Type', 'application/pdf');
          readStream.pipe(res);
          return pdf;
        }
      })
      .catch((error) => {
        Logger.error('Error al generar el PDF:', error);
      });
  }
}
