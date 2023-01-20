import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account } from "@models/account.model";
import { Border, Style, Worksheet } from "exceljs";
import { ContinuousIteration } from "../../model/continuous-iteration.model";
import { getAccountValueByTypeValueName } from "../../util";

const fullBorder: Partial<Border> = {style: 'thin', color: {argb: 'FF000000'}};
const accountStyle: Partial<Style> = {
  font: {name: 'Arial', size: 8},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle'}
};
const accountStyleDisabled: Partial<Style> = {
  ...accountStyle,
  fill: { type: 'pattern', pattern:'solid', fgColor: {argb: 'FF000000'}}
};

const Header = (worksheet: Worksheet, startRow: number): ContinuousIteration => {
  let nextRow = startRow;

  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 7, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF969696'}},
    border: {top: {style: 'thin', color: {argb: 'FFFFFFFF'}}, left: {style: 'thin', color: {argb: 'FFFFFFFF'}}, right: {style: 'thin', color: {argb: 'FFFFFFFF'}}}
  };
  const headerStyleWrapped: Partial<Style> = {
    ...headerStyle, alignment: {...headerStyle.alignment, wrapText: true},
  };

  let row1 = worksheet.getRow(nextRow);
  let headers = [row1.getCell(1), row1.getCell(2), row1.getCell(3), row1.getCell(4), row1.getCell(6), row1.getCell(7), row1.getCell(8), row1.getCell(9), row1.getCell(10), row1.getCell(11)];

  headers[0].value = "Linea No.";
  headers[0].style = headerStyleWrapped;
  worksheet.getColumn("A").width = 5;
  worksheet.mergeCells(`A${nextRow}`,`A${nextRow+3}`);

  headers[1].value = "NOMBRE DE LA CUENTA";
  headers[1].style = headerStyle;
  worksheet.getColumn("B").width = 25;
  worksheet.mergeCells(`B${nextRow}`,`B${nextRow+3}`);

  headers[2].value = "No. de la cuenta";
  headers[2].style = headerStyleWrapped;
  worksheet.getColumn("C").width = 7;
  worksheet.mergeCells(`C${nextRow}`,`C${nextRow+3}`);

  headers[3].value = "TOTAL DE INGRESOS Y EGRESOS DE LA CONCESIONARIA";
  headers[3].style = headerStyleWrapped;
  worksheet.getColumn("D").width = 15;
  worksheet.getColumn("E").width = 15;
  worksheet.mergeCells(`D${nextRow}`,`E${nextRow+1}`);

  headers[4].value = "A Depto Honda Nuevos";
  headers[4].style = headerStyleWrapped;
  worksheet.getColumn("F").width = 15;
  worksheet.mergeCells(`F${nextRow}`,`F${nextRow+1}`);

  headers[5].value = "B Otros Vehiculos Nuevos";
  headers[5].style = headerStyleWrapped;
  worksheet.getColumn("G").width = 15;
  worksheet.mergeCells(`G${nextRow}`,`G${nextRow+1}`);

  headers[6].value = "C Depto Vehiculos Usados";
  headers[6].style = headerStyleWrapped;
  worksheet.getColumn("H").width = 15;
  worksheet.mergeCells(`H${nextRow}`,`H${nextRow+1}`);

  headers[7].value = "D Depto De Servicio";
  headers[7].style = headerStyleWrapped;
  worksheet.getColumn("I").width = 15;
  worksheet.mergeCells(`I${nextRow}`,`I${nextRow+1}`);

  headers[8].value = "E Depto Taller De Carroceria";
  headers[8].style = headerStyleWrapped;
  worksheet.getColumn("J").width = 15;
  worksheet.mergeCells(`J${nextRow}`,`J${nextRow+1}`);

  headers[9].value = "F Depto Refacciones Y Accesorios";
  headers[9].style = headerStyleWrapped;
  worksheet.getColumn("K").width = 15;
  worksheet.mergeCells(`K${nextRow}`,`K${nextRow+1}`);

  nextRow += 2;

  const row2 = worksheet.getRow(nextRow);
  headers = [row2.getCell(4), row2.getCell(5), row2.getCell(6), row2.getCell(7), row2.getCell(8), row2.getCell(9), row2.getCell(10), row2.getCell(11)];

  headers[0].value = "MES";
  headers[0].style = headerStyleWrapped;
  worksheet.mergeCells(`D${nextRow}`,`D${nextRow+1}`);

  headers[1].value = "GANANCIA BRUTAS VENTAS %";
  headers[1].style = headerStyleWrapped;
  worksheet.mergeCells(`E${nextRow}`,`E${nextRow+1}`);

  headers[2].value = "MES";
  headers[2].style = headerStyleWrapped;
  worksheet.mergeCells(`F${nextRow}`,`F${nextRow+1}`);

  headers[3].value = "MES";
  headers[3].style = headerStyleWrapped;
  worksheet.mergeCells(`G${nextRow}`,`G${nextRow+1}`);

  headers[4].value = "MES";
  headers[4].style = headerStyleWrapped;
  worksheet.mergeCells(`H${nextRow}`,`H${nextRow+1}`);

  headers[5].value = "MES";
  headers[5].style = headerStyleWrapped;
  worksheet.mergeCells(`I${nextRow}`,`I${nextRow+1}`);

  headers[6].value = "MES";
  headers[6].style = headerStyleWrapped;
  worksheet.mergeCells(`J${nextRow}`,`J${nextRow+1}`);

  headers[7].value = "MES";
  headers[7].style = headerStyleWrapped;
  worksheet.mergeCells(`K${nextRow}`,`K${nextRow+1}`);
  nextRow += 2;
  return {nextRow};
}

const IncomeExpCoccesionaire = (worksheet: Worksheet, accountsIncomeExpCoccesionaireChildren: Account[], startRow: number) => {
  let {nextRow, numberLine = 1} = Header(worksheet, startRow);

  accountsIncomeExpCoccesionaireChildren.forEach(account => {
    let row = worksheet.getRow(nextRow);
    let columns = [row.getCell(1), row.getCell(2), row.getCell(3), row.getCell(4), row.getCell(5), row.getCell(6), row.getCell(7), row.getCell(8), row.getCell(9), row.getCell(10), row.getCell(11)];

    columns[0].value = numberLine;
    columns[0].style = accountStyle;

    columns[1].value = account.name || '';
    columns[1].style = {...accountStyle, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}};

    columns[2].value = account.accountNumber || '';
    columns[2].style = accountStyle;

    const totalIncExpMonth = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.TOTAL_INC_EXP);
    if(totalIncExpMonth){
      columns[3].addName(`account${totalIncExpMonth.id}`);
      columns[3].style = accountStyle;
    }else{
      columns[3].style = accountStyleDisabled;
    }

    const grossProfitSales = getAccountValueByTypeValueName(account, TypeAccountValueEnum.GROSS_PROFIT_SALES, TypeAccountValueEnum.TOTAL_INC_EXP);
    if(grossProfitSales){
      columns[4].addName(`account${grossProfitSales.id}`);
      columns[4].style = accountStyle;
    }else{
      columns[4].style = accountStyleDisabled;
    }

    const monthADept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.A_DEPT);
    if(monthADept){
      columns[5].addName(`account${monthADept.id}`);
      columns[5].style = accountStyle;
    }else{
      columns[5].style = accountStyleDisabled;
    }

    const monthBDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.B_DEPT);
    if(monthBDept){
      columns[6].addName(`account${monthBDept.id}`);
      columns[6].style = accountStyle;
    }else{
      columns[6].style = accountStyleDisabled;
    }

    const monthCDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.C_DEPT);
    if(monthCDept){
      columns[7].addName(`account${monthCDept.id}`);
      columns[7].style = accountStyle;
    }else{
      columns[7].style = accountStyleDisabled;
    }

    const monthDDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.D_DEPT);
    if(monthDDept){
      columns[8].addName(`account${monthDDept.id}`);
      columns[8].style = accountStyle;
    }else{
      columns[8].style = accountStyleDisabled;
    }

    const monthEDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.E_DEPT);
    if(monthEDept){
      columns[9].addName(`account${monthEDept.id}`);
      columns[9].style = accountStyle;
    }else{
      columns[9].style = accountStyleDisabled;
    }

    const monthFDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH, TypeAccountValueEnum.F_DEPT);
    if(monthFDept){
      columns[10].addName(`account${monthFDept.id}`);
      columns[10].style = accountStyle;
    }else{
      columns[10].style = accountStyleDisabled;
    }

    nextRow++;
    numberLine++;
  });

  return nextRow;
}


export default IncomeExpCoccesionaire;
