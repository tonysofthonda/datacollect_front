import { StaticAccountEnum } from "@enums/static-account.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account } from "@models/account.model";
import { Border, Style, Worksheet } from "exceljs";
import { ContinuousIteration } from "../../model/continuous-iteration.model";
import { getAccountValueByTypeValueName } from "../../util";

const activesDefaultPart1Skip = ["Seguro de vida - Valor en efectivo", "Documentos y Cuentas por Cobrar - funcionarios y empleados", "Otros documentos y cuentas por cobrar", "Otros activos no automotrices", "Inversiones y anticipos - Otras Operaciones", "Inversiones y anticipos - Otras Operaciones", "Total de otros activos", "Activos totales"];
const fullBorder: Partial<Border> = {style: 'thin', color: {argb: 'FF000000'}};
const accountStyle: Partial<Style> = {
  font: {name: 'Arial', size: 8},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle'}
};

const HeaderValues = (worksheet: Worksheet, {nextRow, numberLine=1}: ContinuousIteration): ContinuousIteration => {
  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 10, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF969696'}},
    border: {top: {style: 'medium', color: {argb: 'FF000000'}}}
  };

  const row = worksheet.getRow(nextRow);
  let headers = [row.getCell(1),row.getCell(5),row.getCell(6),row.getCell(7)];
  headers[0].value = "ACTIVOS";
  headers[0].style = headerStyle;
  headers[1].value = "NO. CUENTA";
  headers[1].style = {...headerStyle,alignment:{...headerStyle.alignment, wrapText: true}, font:{...headerStyle.font, size: 6}};
  headers[2].value = "IMPORTE";
  headers[2].style = headerStyle;
  headers[3].value = "NO LINEA";
  headers[3].style = {...headerStyle,alignment:{...headerStyle.alignment, wrapText: true}, font:{...headerStyle.font, size: 6}};

  worksheet.getColumn("E").width = 7;
  worksheet.getColumn("F").width = 20;
  worksheet.getColumn("G").width = 7;
  worksheet.mergeCells(`A${nextRow}:D${nextRow}`);
  nextRow++;
  return {nextRow}
}

export const ActivesDefaultPart1 = (worksheet: Worksheet, activesChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration => {
  let {nextRow, numberLine=1} = HeaderValues(worksheet, continuousIteration);
  const part1 = activesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.ASSETS && !activesDefaultPart1Skip.some(name => name === account.name));
  part1.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(1),row.getCell(5),row.getCell(6),row.getCell(7)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }
    columns[2].style = accountStyle;

    columns[3].value = numberLine;
    columns[3].style = accountStyle;


    worksheet.mergeCells(`A${nextRow}`,`D${nextRow}`);
    nextRow++;
    numberLine++;
  });

  return {nextRow, numberLine};
}

export const ActivesDefaultPart2 = (worksheet: Worksheet, activesChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration => {
  let nextRow = continuousIteration.nextRow;
  let numberLine = continuousIteration.numberLine || 1;
  const part2 = activesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.ASSETS && activesDefaultPart1Skip.some(name => name === account.name));

  part2.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(1),row.getCell(5),row.getCell(6),row.getCell(7)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };
    columns[1].value = account.accountNumber || '';
    columns[1].style = accountStyle;

    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT);
    if(amount){
      columns[2].addName(`account${amount.id}`);
    }

    columns[2].style = accountStyle;

    columns[3].value = numberLine;
    columns[3].style = accountStyle;


    worksheet.mergeCells(`A${nextRow}`,`D${nextRow}`);
    nextRow++;
    numberLine++;
  });

  return {nextRow, numberLine};
}


