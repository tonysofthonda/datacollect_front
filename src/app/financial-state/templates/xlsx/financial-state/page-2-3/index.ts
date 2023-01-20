import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship } from "@models/account.model";
import { Worksheet } from "exceljs";
import { flatAccountRelationship } from "src/app/helpers/util";
import Header from "./header";
import IncomeDeduction from "./income-deduction/income-deduction";
import IncomeExpCoccesionaire from "./income-exp-cocessionaire/income-exp-coccesionaire";
import JobLevels from "./job-levels/job-levels";
import OtherIncome from "./other-income/other-income";

const Page2And3 = (worksheet: Worksheet, mainAccounts: Account[], accounts: {[key: string]:AccountRelationship[]}) => {
  const startRow = Header(worksheet) + 2;

  const incomeExp = mainAccounts.find(account => account.name === StaticAccountEnum.INCOME_EXP_CONESSIONAIRE)!;
  incomeExp.children = accounts[incomeExp.id!];
  const incomeExpChildren = flatAccountRelationship(incomeExp).filter(account => account.name !== "Cuentas" && account.name !== "Ingresos y egresos de la concesionaria");

  let nextRow = IncomeExpCoccesionaire(worksheet, incomeExpChildren, startRow) + 1;

  const jobLevelsAccount = mainAccounts.find(account => account.name === StaticAccountEnum.JOB_LEVELS)!;
  jobLevelsAccount.children = accounts[jobLevelsAccount.id!];
  const jobLevelsChildren = flatAccountRelationship(jobLevelsAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.JOB_LEVELS);

  JobLevels(worksheet, jobLevelsChildren, nextRow);

  const otherIncomesAccount = mainAccounts.find(account => account.name === StaticAccountEnum.OTHER_INCOME)!;
  otherIncomesAccount.children = accounts[otherIncomesAccount.id!];
  const otherIncomesChildren = flatAccountRelationship(otherIncomesAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.OTHER_INCOME);;

  OtherIncome(worksheet, otherIncomesChildren, nextRow)

  const incomesDeductionAccount = mainAccounts.find(account => account.name === StaticAccountEnum.INCOME_DEDUCTION)!;
  incomesDeductionAccount.children = accounts[incomesDeductionAccount.id!];
  const incomesDeductionChildren = flatAccountRelationship(incomesDeductionAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.INCOME_DEDUCTION);;

  IncomeDeduction(worksheet, incomesDeductionChildren, nextRow);
};

export default Page2And3;
