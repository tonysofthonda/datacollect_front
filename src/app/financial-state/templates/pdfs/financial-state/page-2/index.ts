import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship, FinancialStateAccountValue } from "@models/account.model";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { flatAccountRelationship } from "src/app/helpers/util";
import IncomeDeduction from "./income-deduction/income-deduction";
import IncomeExpCoccesionaire from "./income-exp-cocessionaire/income-exp-coccesionaire";
import JobLevels from "./job-levels/job-levels";
import OtherIncome from "./other-income/other-income";

const Page2 = (doc: jsPDF, mainAccounts: Account[], values: FinancialStateAccountValue[], accounts: {[key: string]:AccountRelationship[]})=>{
  //Income and expenses of the concessionaire
  const incomeExp = mainAccounts.find(account => account.name === StaticAccountEnum.INCOME_EXP_CONESSIONAIRE)!;
  incomeExp.children = accounts[incomeExp.id!];
  const incomeExpChildren = flatAccountRelationship(incomeExp);

  const incomeExpCocessionaire = IncomeExpCoccesionaire(incomeExpChildren, values);
  autoTable(doc,{
    body: [...incomeExpCocessionaire],
    margin: {horizontal: 50},
    startY: 10,
    tableWidth: 820
  });

  const jobLevelsAccount = mainAccounts.find(account => account.name === StaticAccountEnum.JOB_LEVELS)!;
  jobLevelsAccount.children = accounts[jobLevelsAccount.id!];
  const jobLevelsChildren = flatAccountRelationship(jobLevelsAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.JOB_LEVELS);

  const joblevels = JobLevels(jobLevelsChildren, values);
  autoTable(doc,{
    body: [...joblevels],
    margin: {left: 60},
    startY: 630,
    tableWidth: 200
  });

  const otherIncomesAccount = mainAccounts.find(account => account.name === StaticAccountEnum.OTHER_INCOME)!;
  otherIncomesAccount.children = accounts[otherIncomesAccount.id!];
  const otherIncomesChildren = flatAccountRelationship(otherIncomesAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.OTHER_INCOME);;

  const otherIncomes = OtherIncome(otherIncomesChildren, values);
  autoTable(doc,{
    body: [...otherIncomes],
    margin: {left: 400},
    startY: 630,
    tableWidth: 200
  });

  const incomesDeductionAccount = mainAccounts.find(account => account.name === StaticAccountEnum.INCOME_DEDUCTION)!;
  incomesDeductionAccount.children = accounts[incomesDeductionAccount.id!];
  const incomesDeductionChildren = flatAccountRelationship(incomesDeductionAccount).filter(account => account.name !== StaticAccountEnum.PARENT && account.name !== StaticAccountEnum.INCOME_DEDUCTION);;

  const incomesDeduction = IncomeDeduction(incomesDeductionChildren, values);
  autoTable(doc,{
    body: [...incomesDeduction],
    margin: {left: 650},
    startY: 630,
    tableWidth: 200
  });
}

export default Page2;


