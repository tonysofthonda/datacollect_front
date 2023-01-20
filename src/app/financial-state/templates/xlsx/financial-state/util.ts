import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, AccountRelationship, Formula, FormulaTerms } from "@models/account.model";
import { Cell, CellFormulaValue, Worksheet } from "exceljs";
import { flatAccountRelationship } from "src/app/helpers/util";

export const getAccountValueByTypeValueName = (account: Account, typeValueName: TypeAccountValueEnum, parentTypeValueName: TypeAccountValueEnum | null = null) => {
  return account.accountValues?.find(acValue => {
    if(parentTypeValueName){
      return acValue.typeValue.parent.parent.name === parentTypeValueName &&
              acValue.typeValue.name === typeValueName;
    }else{
      return acValue.typeValue.name === typeValueName;
    }
  });
}

export const addFormulas = (worksheets: {[key: string]:Worksheet}, mainAccounts: {[key: string]:Account[]}, accounts: {[key: string]:AccountRelationship[]}) => {
  const mainAccountsPage1 = mainAccounts['1'];
  const worksheetPage1 = worksheets['1'];
  mainAccountsPage1.forEach(account => {
    account.children = accounts[account.id!];
    const children = flatAccountRelationship(account);
    children.forEach(child => {
      child.accountValues?.forEach(acValue => {
        if(acValue.formula){
          const cell = getCellByName(worksheetPage1, `account${acValue.id}`);
          if(cell){
            cell.value = buildFormula(acValue.formula);
          }
        }
      });
    });
  });

  const mainAccountsPage2and3 = mainAccounts['2 y 3'];
  const worksheetPage2and3  = worksheets['2 y 3'];
  mainAccountsPage2and3.forEach(account => {
    account.children = accounts[account.id!];
    const children = flatAccountRelationship(account);
    children.forEach(child => {
      child.accountValues?.forEach(acValue => {
        if(acValue.formula){
          const cell = getCellByName(worksheetPage2and3, `account${acValue.id}`);
          if(cell){
            cell.value = buildFormula(acValue.formula);
          }
        }
      });
    });
  });

  const mainAccountsPage4 = mainAccounts['4'];
  const worksheetPage4 = worksheets['4'];
  mainAccountsPage4.forEach(account => {
    account.children = accounts[account.id!];
    const children = flatAccountRelationship(account);
    children.forEach(child => {
      child.accountValues?.forEach(acValue => {
        if(acValue.formula){
          const cell = getCellByName(worksheetPage4, `account${acValue.id}`);
          if(cell){
            cell.value = buildFormula(acValue.formula);
          }
        }
      });
    });
  });
}

const buildFormula = (formula: Formula): CellFormulaValue => {
  let formulaText = formula.formula;
  formula.terms.forEach((term: FormulaTerms) => {
    const termId = `account${term.accountTerm.id!}`;
    formulaText = formulaText.replace("?", termId);
  });
  return {formula: formulaText, date1904: false};
}

export const getCellByName = (worksheet: Worksheet, name: string) => {
  let match: Cell | undefined;
  for (let indexRow = 1; indexRow <= worksheet.rowCount; indexRow++) {
    const row = worksheet.getRow(indexRow);
    for (let indexCell = 1; indexCell <= row.cellCount; indexCell++) {
      const cell = row.getCell(indexCell);
      if(cell.name === name){
        match = cell;
        break;
      }
    }
  }
  return match;
}
