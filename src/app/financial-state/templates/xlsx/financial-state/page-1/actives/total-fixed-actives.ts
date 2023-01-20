import { AccountComponentEnum } from "@enums/account-component.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account } from "@models/account.model";
import { Border, Style, Worksheet } from "exceljs";
import { ContinuousIteration } from "../../model/continuous-iteration.model";
import { getAccountValueByTypeValueName } from "../../util";

const fullBorder: Partial<Border> = {style: 'thin', color: {argb: 'FF000000'}};
const accountStyle: Partial<Style> = {
  font: {name: 'Arial', size: 7},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true}
};

const accountStyleDisabled: Partial<Style> = {
  font: {name: 'Arial', size: 7},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
  fill: { type: 'pattern', pattern:'solid', fgColor: {argb: 'FF000000'}}
};

const HeaderValues = (worksheet: Worksheet, {nextRow, numberLine=1}: ContinuousIteration): ContinuousIteration => {
  const row = worksheet.getRow(nextRow);
  let headers = [row.getCell(1),row.getCell(2),row.getCell(3),row.getCell(4),row.getCell(6),row.getCell(7)];
  headers[0].value = "NOMBRE DE LA CUENTA";
  headers[0].style = accountStyle;
  worksheet.mergeCells(`A${nextRow}:A${nextRow + 1}`);
  headers[1].value = "No. DE LA CUENTA";
  headers[1].style = accountStyle;
  worksheet.mergeCells(`B${nextRow}:B${nextRow + 1}`);
  headers[2].value = "COSTO";
  headers[2].style = accountStyle;
  worksheet.mergeCells(`C${nextRow}:C${nextRow + 1}`);
  headers[3].value = "DEPRECIACION ACUMULADA";
  headers[3].style = accountStyle;
  worksheet.mergeCells(`D${nextRow}:E${nextRow + 1}`);
  headers[4].style = accountStyleDisabled;
  worksheet.mergeCells(`F${nextRow}:F${nextRow + 1}`);
  headers[5].value = numberLine++;
  headers[5].style = {...accountStyle, font: {...accountStyle.font, size: 8}};
  worksheet.mergeCells(`G${nextRow}:G${nextRow + 1}`);
  nextRow += 2;

  return {nextRow, numberLine};
};

const TotalFixedActives = (worksheet: Worksheet, activesChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration => {
  let {nextRow, numberLine=1} = HeaderValues(worksheet, continuousIteration);

  const totalFixedActives = activesChildren.filter(account => account.component?.name === AccountComponentEnum.TOTAL_FIXED_ASSETS);
  totalFixedActives.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let headers = [row.getCell(1),row.getCell(2),row.getCell(3),row.getCell(4),row.getCell(6),row.getCell(7)];
    headers[0].value = account.name || '';
    headers[0].style = accountStyle;

    headers[1].value = account.accountNumber || '';
    headers[1].style = accountStyle;

    headers[2].value = "";
    const cost = getAccountValueByTypeValueName(account, TypeAccountValueEnum.COST)
    if(cost){
      headers[2].addName(`account${cost.id}`);
    }
    headers[2].style = cost ? accountStyle : accountStyleDisabled;

    headers[3].value = "";
    const accumulatedDepreciation = getAccountValueByTypeValueName(account, TypeAccountValueEnum.ACCUMULATED_DEPRECIATION)
    if(accumulatedDepreciation){
      headers[3].addName(`account${accumulatedDepreciation.id}`);
    }
    headers[3].style = accumulatedDepreciation ? accountStyle : accountStyleDisabled;
    worksheet.mergeCells(`D${nextRow}:E${nextRow}`);

    headers[4].value = "";
    const amount = getAccountValueByTypeValueName(account, TypeAccountValueEnum.AMOUNT)
    if(amount){
      headers[4].addName(`account${amount.id}`);
    }
    headers[4].style = amount ? accountStyle : accountStyleDisabled;

    headers[5].value = numberLine;
    headers[5].style = {...accountStyle, font: {...accountStyle.font, size: 8}};

    nextRow++;
    numberLine++;
  });

  return {nextRow, numberLine};
};

export default TotalFixedActives;
