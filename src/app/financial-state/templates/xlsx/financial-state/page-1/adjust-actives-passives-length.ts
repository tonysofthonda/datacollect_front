import { Border, Style, Worksheet } from "exceljs";
import { ContinuousIteration } from "../model/continuous-iteration.model";

const fullBorder: Partial<Border> = {style: 'thin', color: {argb: 'FF000000'}};
const accountStyle: Partial<Style> = {
  font: {name: 'Arial', size: 8},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle'}
};
const accountStyleDisabled: Partial<Style> = {
  font: {name: 'Arial', size: 7},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
  fill: { type: 'pattern', pattern:'solid', fgColor: {argb: 'FF000000'}}
};

const AdjustActivesPassivesLength = (worksheet: Worksheet, accountType: 'actives' | 'passives', {nextRow, numberLine}: ContinuousIteration, missingLength: number): ContinuousIteration =>{
  if(accountType === "actives"){
    worksheet.getCell(`A${nextRow}`).style = accountStyleDisabled;
    worksheet.mergeCells(`A${nextRow}`,`F${nextRow + (missingLength - 1)}`)
  }else if (accountType === "passives"){
    worksheet.getCell(`H${nextRow}`).style = accountStyleDisabled;
    worksheet.mergeCells(`H${nextRow}`,`N${nextRow + (missingLength - 1)}`)
  }

  let rowNumber = numberLine!;
  for (; rowNumber <= (numberLine! + missingLength) - 1; rowNumber++, nextRow++) {
    const row = worksheet.getRow(nextRow);
    row.getCell('G').value = rowNumber;
    row.getCell('G').style = accountStyle;
  }

  return {nextRow, numberLine: rowNumber};
}

export default AdjustActivesPassivesLength;
