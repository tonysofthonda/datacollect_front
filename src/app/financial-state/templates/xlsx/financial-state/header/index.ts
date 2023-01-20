import { Dealer } from "@models/dealer.model";
import { Workbook, Worksheet, Style } from "exceljs";


const Header = (doc: Workbook ,worksheet: Worksheet, dealer?: Dealer) => {
  const hondaLogo = doc.addImage({
    base64: "data:image/png;base64,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",
    extension: 'png',
  });
  worksheet.addImage(hondaLogo,'A1:D3');

  const titleStyle: Partial<Style> = {font: {name: 'Arial', size: 11, bold: true},
  alignment: {horizontal: 'center', vertical: 'middle'}};

  let row1 = [];
  row1[5] = 'CONFIDENCIAL';
  row1[11] = `Formato ${new Date().getFullYear()}`;
  row1[14] = "Pagina 1";
  worksheet.insertRow(1, row1);
  worksheet.getCell('E1').style = titleStyle;
  worksheet.getCell('K1').style = {
    font: {name: 'Arial', size: 12, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FFFF6699'}}
  };
  worksheet.getColumn('N').width = 16.71
  worksheet.getCell('N1').style = {
    font: {name: 'Arial', size: 10, bold: true, color: {argb: 'FF000097'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
  };
  worksheet.getCell('N1').style = {
    font: {name: 'Arial', size: 10, bold: true, color: {argb: 'FF000097'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
  };

  let row2 = [];
  row2[5] = 'ESTADO FINANCIERO DEL CONSESIONARIO';
  worksheet.insertRow(2, row2);
  worksheet.getCell('E2').style = titleStyle;
  worksheet.mergeCells('E1:J1');
  worksheet.mergeCells('K1:M1');
  worksheet.mergeCells('E2:J2');

  const placeHolderStyle: Partial<Style> = {font: {name: 'Arial', size: 10},
  alignment: {vertical: 'bottom'}};
  const inputStyle: Partial<Style> = {font: {name: 'MS Sans Serif', size: 10},
  alignment: {horizontal: 'center', vertical: 'bottom'},
  fill: {type: 'pattern', pattern:'solid', fgColor:{argb:'FFE3E3E3'}},
  border: {bottom: {style: 'thin', color: {argb: 'FF000000'}}}};

  let row4 = [];
  row4[1] = "DIVISION AUTOMÓVILES";
  row4[6] = "BALANCE GENERAL";
  row4[10] = "CONCESIONARIA No.:";
  row4[13] = dealer?.dealerNumber || '';
  worksheet.insertRow(4, row4);

  worksheet.getCell('A4').style = {
    font: {name: 'TIMES NEW ROMAN', size: 7, bold: true},
    alignment: {horizontal: 'center', vertical: 'middle'},
  };
  worksheet.getColumn('F').width = 19.57;
  worksheet.getCell('F4').style = {
    font: {name: 'Arial', size: 16, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF0000FF'}}
  };
  worksheet.getCell('J4').style = placeHolderStyle;
  worksheet.getCell('M4').style = inputStyle;
  worksheet.getCell('M4').name = "dealernumber";

  worksheet.mergeCells('A4:B4');
  worksheet.mergeCells('F4:H4');
  worksheet.mergeCells('J4:L4');
  worksheet.mergeCells('M4:N4');

  let row6 = [];
  row6[1] = "CONCESIONARIA";
  row6[6] = "CIUDAD";
  row6[9] = "ESTADO";
  row6[14] = "C.P.";
  worksheet.insertRow(6, row6);
  worksheet.getCell('A6').style = placeHolderStyle;
  worksheet.getCell('F6').style = placeHolderStyle;
  worksheet.getCell('I6').style = placeHolderStyle;
  worksheet.getCell('N6').style = placeHolderStyle;

  let row7 = [];
  row7[1] = dealer?.businessName || '';
  row7[5] = dealer?.city.name || '';
  row7[9] = dealer?.city.state.name || '';
  row7[14] = dealer?.postcode || '';
  worksheet.insertRow(7, row7);
  worksheet.getCell('A7').style = inputStyle;
  worksheet.getCell('A7').name = "dealername";
  worksheet.getCell('E7').style = inputStyle;
  worksheet.getCell('E7').name = "city";
  worksheet.getCell('I7').style = inputStyle;
  worksheet.getCell('I7').name = "state";
  worksheet.getCell('N7').style = inputStyle;
  worksheet.getCell('N7').name = "zip";

  worksheet.mergeCells('A7:C7');
  worksheet.mergeCells('E7:F7');
  worksheet.mergeCells('I7:K7');

  let row8 = [];
  row8[1] = "PERIODO DE COBERTURA DESDE:";
  row8[5] = "";
  row8[9] = "HASTA:";
  row8[10] = "";
  worksheet.insertRow(8, row8);
  worksheet.getCell('A8').style = placeHolderStyle;
  worksheet.getCell('E8').style = inputStyle;
  worksheet.getCell('E8').name = "datefrom";
  worksheet.getCell('I8').style = placeHolderStyle;
  worksheet.getCell('J8').style = inputStyle;
  worksheet.getCell('E8').name = "dateto";

  worksheet.mergeCells('E8:F8');
  worksheet.mergeCells('J8:M8');

  worksheet.views = [{state: 'frozen', ySplit: 10, showGridLines: false}];
  return 10;
}

export default Header;
