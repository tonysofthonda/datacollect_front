import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account } from "@models/account.model";
import { Border, Style, Worksheet } from "exceljs";
import { getAccountValue } from "src/app/financial-state/templates/pdfs/financial-state/util";


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

const Header = (worksheet: Worksheet, startRow: number) => {
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
  const row1 = worksheet.getRow(nextRow);
  row1.getCell(2).value = "MES ACTUAL";
  row1.getCell(2).style = {...headerStyle, border: {top: {style: 'thin', color: {argb: 'FF000000'}}}};
  worksheet.mergeCells(`B${nextRow}`,`E${nextRow}`)

  row1.getCell(6).value = "ANALISIS DE UTILIDAD BRUTA";
  row1.getCell(6).style = {font: {name: 'Arial', size: 10, bold: true}, alignment: {horizontal: 'center', vertical: 'middle'}};
  worksheet.mergeCells(`F${nextRow}`,`G${nextRow}`)

  nextRow++;

  const row2 = worksheet.getRow(nextRow);
  row2.getCell(1).value = "Linea";
  row2.getCell(1).style = headerStyleWrapped;
  worksheet.mergeCells(`A${nextRow}`, `A${nextRow + 1}`);

  row2.getCell(2).value = "Unidades";
  row2.getCell(2).style = headerStyleWrapped;
  worksheet.mergeCells(`B${nextRow}`, `B${nextRow + 1}`);

  row2.getCell(3).value = "Ventas";
  row2.getCell(3).style = headerStyleWrapped;
  worksheet.mergeCells(`C${nextRow}`, `C${nextRow + 1}`);

  row2.getCell(4).value = "Utilidad bruta";
  row2.getCell(4).style = headerStyleWrapped;
  worksheet.mergeCells(`D${nextRow}`, `D${nextRow + 1}`);

  row2.getCell(5).value = "% uni vend.";
  row2.getCell(5).style = headerStyleWrapped;
  worksheet.mergeCells(`E${nextRow}`, `E${nextRow + 1}`);

  row2.getCell(6).value = "A.- DEPARTAMENTO DE VEHICULOS NUEVOS";
  row2.getCell(6).style = headerStyleWrapped;
  worksheet.mergeCells(`F${nextRow}`, `F${nextRow + 1}`);

  row2.getCell(7).value = "No: cta.";
  row2.getCell(7).style = headerStyleWrapped;
  worksheet.mergeCells(`G${nextRow}`, `G${nextRow + 1}`);

  worksheet.views = [{state: 'frozen', ySplit: nextRow + 1, showGridLines: false}];

  return nextRow + 2;
}

const GrossProfitAnalysis = (worksheet: Worksheet, grossProfitAnalysis: Account[], startRow: number) => {
  let nextRow = Header(worksheet, startRow);
  let numberLine = 1;

  const modelsAccounts = grossProfitAnalysis.filter(account => account.model);
  const accountsWithoutModels = grossProfitAnalysis.filter(account => !account.model && account.name !== "Tabla utilidad bruta");

  modelsAccounts.forEach(account => {
    const row = worksheet.getRow(nextRow);
    let columns = [
      row.getCell(1), row.getCell(2), row.getCell(3), row.getCell(4),
      row.getCell(5), row.getCell(6), row.getCell(7)];

    columns[0].value = numberLine;
    columns[0].style = accountStyle;

    const unitsCurrentMonth = getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.CURRENT_MONTH);
    if(unitsCurrentMonth){
      columns[1].addName(`account${unitsCurrentMonth.id}`);
      columns[1].style = accountStyle;
    }else{
      columns[1].style = accountStyleDisabled;
    }

    const salesCurrentMonth = getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.CURRENT_MONTH);
    if(salesCurrentMonth){
      columns[2].addName(`account${salesCurrentMonth.id}`);
      columns[2].style = accountStyle;
    }else{
      columns[2].style = accountStyleDisabled;
    }

    const grossProfitCurrentMonth = getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.CURRENT_MONTH);
    if(grossProfitCurrentMonth){
      columns[3].addName(`account${grossProfitCurrentMonth.id}`);
      columns[3].style = accountStyle;
    }else{
      columns[3].style = accountStyleDisabled;
    }

    const percentageSoldUnitsCurrentMonth = getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.CURRENT_MONTH);
    if(percentageSoldUnitsCurrentMonth){
      columns[4].addName(`account${percentageSoldUnitsCurrentMonth.id}`);
      columns[4].style = accountStyle;
    }else{
      columns[4].style = accountStyleDisabled;
    }


    columns[5].value = (account.model?.name || '') + ' - ' + (account.model?.year || '');
    columns[5].style = accountStyle;

    columns[6].value = account.accountNumber || '';
    columns[6].style = accountStyle;

    numberLine++;
    nextRow++;
  });

  accountsWithoutModels.forEach(account => {
    const row = worksheet.getRow(nextRow);
    let columns = [
      row.getCell(1), row.getCell(2), row.getCell(3), row.getCell(4),
      row.getCell(5), row.getCell(6), row.getCell(7)];

    columns[0].value = numberLine;
    columns[0].style = accountStyle;

    const unitsCurrentMonth = getAccountValue(account, TypeAccountValueEnum.UNITS, TypeAccountValueEnum.CURRENT_MONTH);
    if(unitsCurrentMonth){
      columns[1].addName(`account${unitsCurrentMonth.id}`);
      columns[1].style = accountStyle;
    }else{
      columns[1].style = accountStyleDisabled;
    }

    const salesCurrentMonth = getAccountValue(account, TypeAccountValueEnum.SALES, TypeAccountValueEnum.CURRENT_MONTH);
    if(salesCurrentMonth){
      columns[2].addName(`account${salesCurrentMonth.id}`);
      columns[2].style = accountStyle;
    }else{
      columns[2].style = accountStyleDisabled;
    }

    const grossProfitCurrentMonth = getAccountValue(account, TypeAccountValueEnum.GROSS_PROFIT, TypeAccountValueEnum.CURRENT_MONTH);
    if(grossProfitCurrentMonth){
      columns[3].addName(`account${grossProfitCurrentMonth.id}`);
      columns[3].style = accountStyle;
    }else{
      columns[3].style = accountStyleDisabled;
    }

    const percentageSoldUnitsCurrentMonth = getAccountValue(account, TypeAccountValueEnum.PERCENTAGE_SOLD_UNITS, TypeAccountValueEnum.CURRENT_MONTH);
    if(percentageSoldUnitsCurrentMonth){
      columns[4].addName(`account${percentageSoldUnitsCurrentMonth.id}`);
      columns[4].style = accountStyle;
    }else{
      columns[4].style = accountStyleDisabled;
    }


    columns[5].value = account.name || '';
    columns[5].style = {...accountStyle, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}};

    columns[6].value = account.accountNumber || '';
    columns[6].style = accountStyle;

    numberLine++;
    nextRow++;
  });
};

export default GrossProfitAnalysis;
