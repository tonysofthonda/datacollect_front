import { Style, Worksheet } from "exceljs";

const Header = (worksheet: Worksheet) => {
  const placeHolderStyle: Partial<Style> = {font: {name: 'Arial', size: 10},
  alignment: {vertical: 'bottom'}};
  const inputStyle: Partial<Style> = {font: {name: 'MS Sans Serif', size: 10},
  alignment: {horizontal: 'center', vertical: 'bottom'},
  fill: {type: 'pattern', pattern:'solid', fgColor:{argb:'FFE3E3E3'}},
  border: {bottom: {style: 'thin', color: {argb: 'FF000000'}}}};

  const row = worksheet.getRow(3);
  row.getCell(2).value = "CONCESIONARIA";
  row.getCell(2).style = placeHolderStyle;
  worksheet.getColumn("B").width = 30;

  row.getCell(3).value = {formula: 'dealernumber', date1904: false};
  row.getCell(3).style = inputStyle;
  worksheet.mergeCells('C3', 'D3');

  row.getCell(6).value = "AGENCIA No.:";
  row.getCell(6).style = placeHolderStyle;
  worksheet.getColumn('F').width = 14;

  row.getCell(7).value = {formula: 'dealername', date1904: false};
  row.getCell(7).style = inputStyle;
  worksheet.getColumn('G').width = 14;

  row.getCell(8).value = "HASTA:";
  row.getCell(8).style = placeHolderStyle;

  row.getCell(9).value = {formula: 'dateto', date1904: false};
  row.getCell(9).style = inputStyle;
  worksheet.mergeCells('I3', 'J3');

  row.getCell(11).value = "PAGINA 2";
  row.getCell(11).style = {
    font: {name: 'Arial', size: 7, bold: true, color: {argb: 'FF000097'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
  };

  return 4;
}

export default Header;
