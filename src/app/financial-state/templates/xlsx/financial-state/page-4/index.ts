import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship } from "@models/account.model";
import { Worksheet } from "exceljs";
import { flatAccountRelationship } from "src/app/helpers/util";
import GrossProfitAnalysis from "./gross-profit-analysis";
import Header from "./header";

const Page4 = (worksheet: Worksheet, mainAccounts: Account[], accounts: {[key: string]:AccountRelationship[]}) => {
  const startRow = Header(worksheet);

  const grossProfitAnalysisAccount = mainAccounts.find(account => account.name === StaticAccountEnum.GROSS_PROFIT_ANALYSIS)!;
  grossProfitAnalysisAccount.children = accounts[grossProfitAnalysisAccount.id!];
  const grossProfitAnalysisChildren = flatAccountRelationship(grossProfitAnalysisAccount).filter(account=>account.name!==StaticAccountEnum.MODELS && account.name !== StaticAccountEnum.GROSS_PROFIT_ANALYSIS);

  GrossProfitAnalysis(worksheet, grossProfitAnalysisChildren, startRow);
};

export default Page4;
