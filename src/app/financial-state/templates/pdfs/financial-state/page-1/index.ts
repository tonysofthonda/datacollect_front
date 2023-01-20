import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship, FinancialStateAccountValue } from "@models/account.model";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { flatAccountRelationship } from "src/app/helpers/util";
import AccountsReceivableAnalysis from "./accounts-receivable-analysis/accounts-receivable-analysis";
import ActivesDefault from "./actives/actives-default";
import TotalFixedActives from "./actives/total-fixed-actives";
import PasivesDefault from "./pasives/pasives-default";
import TotalUnitsPassives from "./pasives/total-units-passives";

const Page1 = (doc: jsPDF, mainAccounts: Account[], values: FinancialStateAccountValue[], accounts: {[key: string]:AccountRelationship[]})=>{

  // Actives
  const actives = mainAccounts.find(account => account.name === StaticAccountEnum.ASSETS)!;
  actives.children = accounts[actives.id!];
  const activesChildren = flatAccountRelationship(actives);

  const [activesPart1, activesPart2] = ActivesDefault(activesChildren, values);
  const totalFixedActives = TotalFixedActives(activesChildren, values);

  autoTable(doc,{
    body:[...activesPart1,...totalFixedActives,...activesPart2],
    margin: {horizontal: 200},
    startY: 100,
    tableWidth: 300
  });

  // Passives
  const pasives = mainAccounts.find(account => account.name === StaticAccountEnum.PASSIVES)!;
  pasives.children = accounts[pasives.id!];
  const pasivesChildren = flatAccountRelationship(pasives);

  const [passivesPart1, passivesPart2, passivesPart3, passivesPart4, passivesPart5, passivesPart6] = PasivesDefault(pasivesChildren, values);
  const totalUnitsPassives = TotalUnitsPassives(pasivesChildren, values);
  autoTable(doc, {
    body: [...passivesPart1, ...passivesPart2, ...passivesPart3, ...passivesPart4, ...passivesPart5, ...totalUnitsPassives, ...passivesPart6],
    margin: {horizontal: 500},
    startY: 100,
    tableWidth: 300,
  });

  // Accounts receivable analysis
  const accountsReceivableAnalysis = mainAccounts.find(account => account.name === StaticAccountEnum.ACCOUNTS_RECEIVABLE_ANALYSIS)!;
  accountsReceivableAnalysis.children = accounts[accountsReceivableAnalysis.id!];
  const accountsReceivableAnalysisChildren = flatAccountRelationship(accountsReceivableAnalysis);

  const accountsReceivableAnalysisDefault = AccountsReceivableAnalysis(accountsReceivableAnalysisChildren, values);
  autoTable(doc, {
    body: [...accountsReceivableAnalysisDefault],
    margin: {horizontal: 200},
    startY: 608,
    tableWidth: 460.3,
  });
}

export default Page1;
