import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship, FinancialStateAccountValue } from "@models/account.model";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { flatAccountRelationship } from "src/app/helpers/util";
import GrossProfitAnalysis from "./gross-profit-analysis/gross-profit-analysis";

const Page4 = (doc: jsPDF, mainAccounts: Account[], values: FinancialStateAccountValue[], accounts: {[key: string]:AccountRelationship[]})=>{
  const grossProfitAnalysisAccount = mainAccounts.find(account => account.name === StaticAccountEnum.GROSS_PROFIT_ANALYSIS)!;
  grossProfitAnalysisAccount.children = accounts[grossProfitAnalysisAccount.id!];
  const grossProfitAnalysisChildren = flatAccountRelationship(grossProfitAnalysisAccount).filter(account=>account.name!==StaticAccountEnum.MODELS && account.name !== StaticAccountEnum.GROSS_PROFIT_ANALYSIS);

  const grossProfitAnalysis = GrossProfitAnalysis(grossProfitAnalysisChildren, values);
  autoTable(doc,{
    body: [...grossProfitAnalysis],
    margin: {horizontal: 130},
    startY: 10,
    tableWidth: 600
  });
}

export default Page4;
