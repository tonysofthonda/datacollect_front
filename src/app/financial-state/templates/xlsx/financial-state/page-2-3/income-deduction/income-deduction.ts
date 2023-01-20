import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account } from "@models/account.model";
import { Border, Style, Worksheet } from "exceljs";
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

const Header = (worksheet: Worksheet, startRow: number)=> {
  let nextRow = startRow;

  const row1 = worksheet.getRow(nextRow);
  let headers = [row1.getCell(16)];

  headers[0].value = "DEDUCCION A LOS INGRESOS";
  headers[0].style = accountStyle;
  worksheet.getColumn("P").width = 30;
  worksheet.mergeCells(`P${nextRow}`, `R${nextRow}`);
  nextRow++;

  const row2 = worksheet.getRow(nextRow);
  headers = [row2.getCell(16), row2.getCell(17), row2.getCell(18)];

  headers[0].value = "NOMBRE DE LA CUENTA";
  headers[0].style = accountStyle;

  headers[1].value = "No.";
  headers[1].style = accountStyle;

  headers[2].value = "MES";
  headers[2].style = accountStyle;

  nextRow++;
  return nextRow;
}

const IncomeDeduction = (worksheet: Worksheet, incomeDeductionChildren: Account[], startRow: number)=>{
  let nextRow = Header(worksheet, startRow);

  incomeDeductionChildren.forEach(account => {
    let row = worksheet.getRow(nextRow);
    let headers = [row.getCell(16), row.getCell(17), row.getCell(18)];

    headers[0].value = account.name || '';
    headers[0].style = accountStyle;

    headers[1].value = account.accountNumber || '';
    headers[1].style = accountStyle;

    const month = getAccountValueByTypeValueName(account, TypeAccountValueEnum.MONTH_POSITION);
    if(month){
      headers[2].addName(`account${month.id}`);
      headers[2].style = accountStyle;
    }else{
      headers[2].style = accountStyleDisabled;
    }

    nextRow++;
  });
}

export default IncomeDeduction;
