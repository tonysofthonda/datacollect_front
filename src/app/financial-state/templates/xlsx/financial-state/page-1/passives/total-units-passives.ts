import { AccountComponentEnum } from "@enums/account-component.enum";
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
  font: {name: 'Arial', size: 7},
  border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
  fill: { type: 'pattern', pattern:'solid', fgColor: {argb: 'FF000000'}}
};

const Header = (worksheet: Worksheet, {nextRow}: ContinuousIteration): ContinuousIteration => {
  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 8},
    alignment: {horizontal: 'center', vertical: 'middle', wrapText: true},
    border: {top: fullBorder, bottom: fullBorder, right: fullBorder, left: fullBorder},
  };

  let row = worksheet.getRow(nextRow);
  let headers = [row.getCell(8),row.getCell(9),row.getCell(10),row.getCell(11),row.getCell(13), row.getCell(14)]
  headers[0].value = "MES";
  headers[0].style = headerStyle;
  worksheet.mergeCells(`H${nextRow}`,`H${nextRow + 1}`);
  worksheet.getColumn("H").width = 10;

  headers[1].value = "UNIDADES HONDA";
  headers[1].style = headerStyle;
  worksheet.mergeCells(`I${nextRow}`,`I${nextRow + 1}`);
  worksheet.getColumn("I").width = 10;

  headers[2].value = "NUEVAS OTRAS";
  headers[2].style = headerStyle;
  worksheet.mergeCells(`J${nextRow}`,`J${nextRow + 1}`);
  worksheet.getColumn("J").width = 10;

  headers[3].value = "UNIDADES USADAS";
  headers[3].style = headerStyle;
  worksheet.mergeCells(`K${nextRow}`,`L${nextRow}`);
  worksheet.getColumn("K").width = 10;
  worksheet.getColumn("L").width = 10;

  headers[4].value = "UTILIDAD O PERDIDA";
  headers[4].style = headerStyle;
  worksheet.mergeCells(`M${nextRow}`,`M${nextRow + 1}`);
  worksheet.getColumn("M").width = 10;

  headers[5].style = accountStyleDisabled;
  worksheet.mergeCells(`N${nextRow}`,`N${nextRow + 1}`);

  nextRow++;

  row = worksheet.getRow(nextRow);
  headers = [row.getCell(11),row.getCell(12)]
  headers[0].value = "MENUDEO";
  headers[0].style = headerStyle;

  headers[1].value = "MAYOREO";
  headers[1].style = headerStyle;

  nextRow++;
  return {nextRow};
}

export const TotalUnitsPassives = (worksheet: Worksheet, passivesChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration => {
  let {nextRow} = Header(worksheet, continuousIteration);

  const totalUnitsPassives = passivesChildren.filter(account => account.component?.name === AccountComponentEnum.TOTAL_UNITS_PASIVES && account.accountNumber?.startsWith("M"));
  const totalAccount = passivesChildren.find(account => account.name === "Total" && account.accountNumber === "399");

  totalUnitsPassives.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(9),row.getCell(10),row.getCell(11),row.getCell(12),row.getCell(13),row.getCell(14)];
    columns[0].value = account.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}, };

    const hondaUnits = getAccountValueByTypeValueName(account, TypeAccountValueEnum.HONDA_UNITS);
    if(hondaUnits){
      columns[1].addName(`account${hondaUnits.id}`);
    }
    columns[1].style = accountStyle;

    const newOthers = getAccountValueByTypeValueName(account, TypeAccountValueEnum.NEW_OTHERS);
    if(newOthers){
      columns[2].addName(`account${newOthers.id}`);
    }
    columns[2].style = accountStyle;

    const retail = getAccountValueByTypeValueName(account, TypeAccountValueEnum.RETAIL);
    if(retail){
      columns[3].addName(`account${retail.id}`);
    }
    columns[3].style = accountStyle;

    const wholesale = getAccountValueByTypeValueName(account, TypeAccountValueEnum.WHOLESALE);
    if(wholesale){
      columns[4].addName(`account${wholesale.id}`);
    }
    columns[4].style = accountStyle;

    const profitOrLoss = getAccountValueByTypeValueName(account, TypeAccountValueEnum.PROFIT_OR_LOSS);
    if(profitOrLoss){
      columns[5].addName(`account${profitOrLoss.id}`);
    }
    columns[5].style = accountStyle;

    columns[6].style = accountStyleDisabled;

    nextRow++;
  });

  const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(8),row.getCell(9),row.getCell(10),row.getCell(11),row.getCell(12),row.getCell(13),row.getCell(14)];
    columns[0].value = totalAccount?.name || '';
    columns[0].style = {...accountStyle, alignment: {...accountStyle.alignment, horizontal: 'left'}, font: {...accountStyle.font, bold: true}, };

    const hondaUnits = getAccountValueByTypeValueName(totalAccount!, TypeAccountValueEnum.HONDA_UNITS);
    if(hondaUnits){
      columns[1].addName(`account${hondaUnits.id}`);
    }
    columns[1].style = accountStyle;

    const newOthers = getAccountValueByTypeValueName(totalAccount!, TypeAccountValueEnum.NEW_OTHERS);
    if(newOthers){
      columns[2].addName(`account${newOthers.id}`);
    }
    columns[2].style = accountStyle;

    const retail = getAccountValueByTypeValueName(totalAccount!, TypeAccountValueEnum.RETAIL);
    if(retail){
      columns[3].addName(`account${retail.id}`);
    }
    columns[3].style = accountStyle;

    const wholesale = getAccountValueByTypeValueName(totalAccount!, TypeAccountValueEnum.WHOLESALE);
    if(wholesale){
      columns[4].addName(`account${wholesale.id}`);
    }
    columns[4].style = accountStyle;

    columns[5].value = totalAccount?.accountNumber || '';
    columns[5].style = accountStyle;

    const profitOrLoss = getAccountValueByTypeValueName(totalAccount!, TypeAccountValueEnum.PROFIT_OR_LOSS);
    if(profitOrLoss){
      columns[6].addName(`account${profitOrLoss.id}`);
    }
    columns[6].style = accountStyle;

    columns[6].style = accountStyle;

    nextRow++;
  return {nextRow}
}
