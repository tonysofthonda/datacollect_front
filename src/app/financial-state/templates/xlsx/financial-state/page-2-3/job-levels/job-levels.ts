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

  const row = worksheet.getRow(nextRow);
  let headers = [row.getCell(2), row.getCell(3), row.getCell(4), row.getCell(5), row.getCell(6), row.getCell(7), row.getCell(8), row.getCell(9)];

  headers[0].value = "POSICION";
  headers[0].style = accountStyle;

  headers[1].value = "A";
  headers[1].style = accountStyle;

  headers[2].value = "B";
  headers[2].style = accountStyle;

  headers[3].value = "C";
  headers[3].style = accountStyle;

  headers[4].value = "D";
  headers[4].style = accountStyle;

  headers[5].value = "E";
  headers[5].style = accountStyle;

  headers[6].value = "F";
  headers[6].style = accountStyle;

  headers[7].value = "TOTAL";
  headers[7].style = accountStyle;
  nextRow++;
  return nextRow;
}

const JobLevels = (worksheet: Worksheet, jobLevelsChildren: Account[], startRow: number) => {
  let nextRow = Header(worksheet, startRow);
  jobLevelsChildren.forEach(account => {
    let row = worksheet.getRow(nextRow);
    let columns = [row.getCell(2), row.getCell(3), row.getCell(4), row.getCell(5), row.getCell(6), row.getCell(7), row.getCell(8), row.getCell(9)];

    columns[0].value = account.name || '';
    columns[0].style = accountStyle;

    const aDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.A_POSITION);
    if(aDept){
      columns[1].addName(`account${aDept.id}`);
      columns[1].style = accountStyle;
    }else{
      columns[1].style = accountStyleDisabled;
    }

    const bDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.B_POSITION);
    if(bDept){
      columns[2].addName(`account${bDept.id}`);
      columns[2].style = accountStyle;
    }else{
      columns[2].style = accountStyleDisabled;
    }

    const cDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.C_POSITION);
    if(cDept){
      columns[3].addName(`account${cDept.id}`);
      columns[3].style = accountStyle;
    }else{
      columns[3].style = accountStyleDisabled;
    }

    const dDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.D_POSITION);
    if(dDept){
      columns[4].addName(`account${dDept.id}`);
      columns[4].style = accountStyle;
    }else{
      columns[4].style = accountStyleDisabled;
    }

    const eDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.E_POSITION);
    if(eDept){
      columns[5].addName(`account${eDept.id}`);
      columns[5].style = accountStyle;
    }else{
      columns[5].style = accountStyleDisabled;
    }

    const fDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.F_POSITION);
    if(fDept){
      columns[6].addName(`account${fDept.id}`);
      columns[6].style = accountStyle;
    }else{
      columns[6].style = accountStyleDisabled;
    }

    const totalDept = getAccountValueByTypeValueName(account, TypeAccountValueEnum.TOTAL_POSITION);
    if(totalDept){
      columns[7].addName(`account${totalDept.id}`);
      columns[7].style = accountStyle;
    }else{
      columns[7].style = accountStyleDisabled;
    }

    nextRow++;
  });
}

export default JobLevels;
;
