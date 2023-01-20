import { StaticAccountEnum } from "@enums/static-account.enum";
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

const passivesDefaultPart1Names = [
  "Cuentas por pagar - Proveedores",
  "Obligaciones por vehiculos tomados en canje",
  "Derechos de licencia y registro",
  "Depositos de clientes",
  "Anticipos sobre reclamos de garantia"
];

const passivesDefaultPart2Names = [
  "Vehiculos nuevos y demos",
  "Vehiculos usados",
  "Vehiculos en arrenda. financiero",
  "Otros"
];

const passivesDefaultPart2AccountNumber = [
  "324",
  "325",
  "326",
  "328"
];

const passivesDefaultPart4Names = ["Actual", "Guia"];

const passivesDefaultPart5Names = ["Capital Social", "Aport. Adicionales de Cap.", "Acciones en tesoreria", "Utilidades retenidas", "Dividendos", "Utilidad neta anterior", "Distribuciones - Empresas", "Inversores", "Retiros", "Propietarios o socios"];

const passivesDefaultPart6Names = ["Utilidad de otras operaciones", "Estimacion de impuesto sobre la renta", "Utilidad neta", "Capital contable total", "Pasivo total y Capital Contable"];


const HeaderValues = (worksheet: Worksheet, {nextRow, numberLine}: ContinuousIteration): ContinuousIteration => {
  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 10, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF969696'}},
    border: {top: {style: 'medium', color: {argb: 'FF000000'}}}
  };

  const row = worksheet.getRow(nextRow);
  let headers = [row.getCell(8),row.getCell(13),row.getCell(14)];
  headers[0].value = "PASIVOS";
  headers[0].style = headerStyle;
  headers[1].value = "NO. CUENTA";
  headers[1].style = {...headerStyle,alignment:{...headerStyle.alignment, wrapText: true}, font:{...headerStyle.font, size: 6}};
  headers[2].value = "IMPORTE";
  headers[2].style = headerStyle;
  worksheet.getColumn("M").width = 7;
  worksheet.getColumn("N").width = 20;
  worksheet.mergeCells(`H${nextRow}:L${nextRow}`);

  nextRow++;
  return {nextRow, numberLine}
}

export const PassivesDefaultPart1 = (worksheet: Worksheet, passivesChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration => {
  let {nextRow} = HeaderValues(worksheet, continuousIteration);
  const part1 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart1Names.some(name => name === account.name));

  part1.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    worksheet.mergeCells(`H${nextRow}`,`L${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

export const PassivesDefaultPart2 = (worksheet: Worksheet, passivesChildren: Account[], {nextRow}: ContinuousIteration): ContinuousIteration => {
  const part2 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart2Names.some(name => name === account.name) && passivesDefaultPart2AccountNumber.some(number => number === account?.accountNumber));

  const row = worksheet.getRow(nextRow);
  const mainCell = row.getCell(8);
  mainCell.value = 'CUENTAS POR PAGAR';
  mainCell.style = {...accountStyle, alignment: {...accountStyle.alignment, wrapText: true}, font: {...accountStyle.font, bold: true}, };
  worksheet.mergeCells(`H${nextRow}`,`H${nextRow + (part2.length - 1)}`);
  worksheet.getColumn("H").width = 10;

  part2.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(9),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    worksheet.mergeCells(`I${nextRow}`,`L${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

export const PassivesDefaultPart3 = (worksheet: Worksheet, passivesChildren: Account[], {nextRow}: ContinuousIteration): ContinuousIteration => {
  const passivesSkipNames  = [...passivesDefaultPart1Names, ...passivesDefaultPart2Names,...passivesDefaultPart4Names,...passivesDefaultPart5Names, ...passivesDefaultPart6Names, "Cuentas por pagar", "Capital de trabajo neto", "Valor Total"].filter(name => name !== "Otros");
  const passivesSkipAccountNumbers  = [...passivesDefaultPart2AccountNumber];
  const part3 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && !passivesSkipNames.some(name => name === account.name) && !passivesSkipAccountNumbers.some(number => number === account?.accountNumber));

  part3.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    worksheet.mergeCells(`H${nextRow}`,`L${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

export const PassivesDefaultPart4 = (worksheet: Worksheet, passivesChildren: Account[], {nextRow}: ContinuousIteration): ContinuousIteration => {
  const part4 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart4Names.some(name => name === account.name));

  const row = worksheet.getRow(nextRow);
  const mainCell = row.getCell(8);
  mainCell.value = 'CAPITAL DE TRABAJO NETO';
  mainCell.style = {...accountStyle, alignment: {...accountStyle.alignment, wrapText: true}, font: {...accountStyle.font, bold: true}, };
  worksheet.mergeCells(`H${nextRow}`,`H${nextRow + (part4.length - 1)}`);
  worksheet.getColumn("H").width = 10;

  part4.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(9),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[1].addName(`account${amount.id}`);
    }

    columns[1].style = accountStyle;

    worksheet.mergeCells(`I${nextRow}`,`M${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

export const PassivesDefaultPart5 = (worksheet: Worksheet, passivesChildren: Account[], {nextRow}: ContinuousIteration): ContinuousIteration => {
  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 16, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF969696'}}
  };
  const headerRow = worksheet.getRow(nextRow);
  const headerCell = headerRow.getCell(8);
  headerCell.value = "VALOR TOTAL";
  headerCell.style = headerStyle;
  worksheet.mergeCells(`H${nextRow}`,`N${nextRow + 3}`)

  nextRow += 4;

  const part5 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart5Names.some(name => name === account.name));

  part5.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    worksheet.mergeCells(`H${nextRow}`,`L${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

export const PassivesDefaultPart6 = (worksheet: Worksheet, passivesChildren: Account[], {nextRow}: ContinuousIteration): ContinuousIteration => {
  const part6 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart6Names.some(name => name === account.name));

  part6.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    worksheet.mergeCells(`H${nextRow}`,`L${nextRow}`);
    nextRow++;
  });

  return {nextRow};
}

