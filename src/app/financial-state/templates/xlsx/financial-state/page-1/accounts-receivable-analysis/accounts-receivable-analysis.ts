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

const HeaderValues = (worksheet: Worksheet, {nextRow, numberLine=1}: ContinuousIteration): ContinuousIteration => {
  const headerStyle: Partial<Style> = {
    font: {name: 'Arial', size: 16, bold: true, color: {argb: 'FFFFFFFF'}},
    alignment: {horizontal: 'center', vertical: 'middle'},
    fill: { type: 'pattern', pattern:'solid', fgColor:{argb:'FF969696'}}
  };
  const headerRow = worksheet.getRow(nextRow);
  const headerCell = headerRow.getCell(1);
  headerCell.value = "ANALISIS DE CUENTAS POR COBRAR";
  headerCell.style = headerStyle;
  worksheet.mergeCells(`A${nextRow}`,`N${nextRow + 1}`)

  nextRow += 2;

  let row = worksheet.getRow(nextRow);
  let headers = [row.getCell(1),row.getCell(2),row.getCell(5),row.getCell(6),row.getCell(7),row.getCell(13)];
  headers[0].value = "LINEA NO.";
  headers[0].style = {...accountStyle};
  worksheet.mergeCells(`A${nextRow}:A${nextRow + 1}`);

  headers[1].value = "TIPO";
  headers[1].style = accountStyle;
  worksheet.mergeCells(`B${nextRow}:D${nextRow + 1}`);

  headers[2].value = "Cuenta No.";
  headers[2].style = accountStyle;
  worksheet.mergeCells(`E${nextRow}:E${nextRow + 1}`);

  headers[3].value = "TOTAL AL CORRIENTE";
  headers[3].style = accountStyle;
  worksheet.mergeCells(`F${nextRow}:F${nextRow + 1}`);

  headers[4].value = "ANALISIS DE CUENTAS VENCIDAS";
  headers[4].style = accountStyle;
  worksheet.mergeCells(`G${nextRow}:L${nextRow}`);

  headers[5].value = "CUENTAS DUDOSAS";
  headers[5].style = accountStyle;
  worksheet.mergeCells(`M${nextRow}:N${nextRow + 1}`);

  nextRow++;

  row = worksheet.getRow(nextRow);
  headers = [row.getCell(7),row.getCell(9),row.getCell(11)];

  headers[0].value = "31-60";
  headers[0].style = accountStyle;
  worksheet.mergeCells(`G${nextRow}:H${nextRow}`);

  headers[1].value = "61-90";
  headers[1].style = accountStyle;
  worksheet.mergeCells(`I${nextRow}:J${nextRow}`);

  headers[2].value = "Sobre 90";
  headers[2].style = accountStyle;
  worksheet.mergeCells(`K${nextRow}:L${nextRow}`);

  nextRow++;

  return {nextRow, numberLine};
};

const AccountsReceivableAnalysis = (worksheet: Worksheet, accountsReceivableAnalysisChildren: Account[], continuousIteration: ContinuousIteration): ContinuousIteration =>{
  let {nextRow, numberLine} = HeaderValues(worksheet, continuousIteration);

  accountsReceivableAnalysisChildren.forEach((account) => {
    const row = worksheet.getRow(nextRow);
    let columns = [row.getCell(1),row.getCell(2),row.getCell(5),row.getCell(6),row.getCell(7),row.getCell(9),row.getCell(11),row.getCell(13)];

    columns[0].value = numberLine!++ || '';
    columns[0].style = accountStyle;

    columns[1].value = account.name || '';
    columns[1].style = {...accountStyle, font: {...accountStyle.font, bold: account.relationshipCheck.hasChildren}};
    worksheet.mergeCells(`B${nextRow}`,`D${nextRow}`)

    columns[2].value = account.accountNumber || '';
    columns[2].style = accountStyle;

    const totalUpToDate = getAccountValueByTypeValueName(account, TypeAccountValueEnum.TOTAL_UP_TO_DATE);
    if(totalUpToDate){
      columns[3].addName(`account${totalUpToDate.id}`);
    }
    columns[3].style = accountStyle;

    const t31_60 = getAccountValueByTypeValueName(account, TypeAccountValueEnum.T31_60);
    if(t31_60){
      columns[4].addName(`account${t31_60.id}`);
    }
    columns[4].style = accountStyle;
    worksheet.mergeCells(`G${nextRow}`,`H${nextRow}`)

    const t61_90 = getAccountValueByTypeValueName(account, TypeAccountValueEnum.T61_90);
    if(t61_90){
      columns[5].addName(`account${t61_90.id}`);
    }
    columns[5].style = accountStyle;
    worksheet.mergeCells(`I${nextRow}`,`J${nextRow}`)

    const tover90 = getAccountValueByTypeValueName(account, TypeAccountValueEnum.TOVER_90);
    if(tover90){
      columns[6].addName(`account${tover90.id}`);
    }
    columns[6].style = accountStyle;
    worksheet.mergeCells(`K${nextRow}`,`L${nextRow}`)

    const doubtfulAccounts = getAccountValueByTypeValueName(account, TypeAccountValueEnum.DOUBTFUL_ACCOUNTS);
    if(doubtfulAccounts){
      columns[7].addName(`account${doubtfulAccounts.id}`);
    }
    columns[7].style = accountStyle;
    worksheet.mergeCells(`M${nextRow}`,`N${nextRow}`)

    nextRow++;
  });

  return {nextRow, numberLine};
}

export default AccountsReceivableAnalysis;
