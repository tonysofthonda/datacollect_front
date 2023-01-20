import { StaticAccountEnum } from "@enums/static-account.enum";
import { Account, AccountRelationship } from "@models/account.model";
import { Worksheet } from "exceljs";
import { flatAccountRelationship } from "src/app/helpers/util";
import AccountsReceivableAnalysis from "./accounts-receivable-analysis/accounts-receivable-analysis";
import { ActivesDefaultPart1, ActivesDefaultPart2 } from "./actives/actives-default";
import TotalFixedActives from "./actives/total-fixed-actives";
import AdjustActivesPassivesLength from "./adjust-actives-passives-length";
import { PassivesDefaultPart1, PassivesDefaultPart2, PassivesDefaultPart3, PassivesDefaultPart4, PassivesDefaultPart5, PassivesDefaultPart6 } from "./passives/passives-default";
import { TotalUnitsPassives } from "./passives/total-units-passives";

const Page1 = (worksheet: Worksheet, startRow: number, mainAccounts: Account[], accounts: {[key: string]:AccountRelationship[]}) => {
  const actives = mainAccounts.find(account => account.name === StaticAccountEnum.ASSETS)!;
  actives.children = accounts[actives.id!];
  const activesChildren = flatAccountRelationship(actives);

  let continuousIteration = ActivesDefaultPart1(worksheet, activesChildren, {nextRow: startRow, numberLine: 1});
  continuousIteration = TotalFixedActives(worksheet, activesChildren, continuousIteration);
  const continuousIterationActives = ActivesDefaultPart2(worksheet, activesChildren, continuousIteration);

  const pasives = mainAccounts.find(account => account.name === StaticAccountEnum.PASSIVES)!;
  pasives.children = accounts[pasives.id!];
  const pasivesChildren = flatAccountRelationship(pasives);

  continuousIteration = PassivesDefaultPart1(worksheet, pasivesChildren, {nextRow: startRow});
  continuousIteration = PassivesDefaultPart2(worksheet, pasivesChildren, continuousIteration);
  continuousIteration = PassivesDefaultPart3(worksheet, pasivesChildren, continuousIteration);
  continuousIteration = PassivesDefaultPart4(worksheet, pasivesChildren, continuousIteration);
  continuousIteration = PassivesDefaultPart5(worksheet, pasivesChildren, continuousIteration);
  continuousIteration = TotalUnitsPassives(worksheet, pasivesChildren, continuousIteration);
  const continuousIterationPassives = PassivesDefaultPart6(worksheet, pasivesChildren, continuousIteration);

  if(continuousIterationActives.nextRow > continuousIterationPassives.nextRow){
    //ADJUST PASSIVES LENGTH
    const missingLength = continuousIterationActives.nextRow - continuousIterationPassives.nextRow;
    continuousIteration = AdjustActivesPassivesLength(worksheet, 'passives', {...continuousIterationPassives, numberLine: continuousIterationActives.numberLine}, missingLength);
  } else if (continuousIterationActives.nextRow < continuousIterationPassives.nextRow){
    //ADJUST ACTIVES LENGTH
    const missingLength = continuousIterationPassives.nextRow - continuousIterationActives.nextRow;
    continuousIteration = AdjustActivesPassivesLength(worksheet, 'actives', {...continuousIterationActives, numberLine: continuousIterationActives.numberLine}, missingLength);
  }else{
    continuousIteration = {
      nextRow: continuousIterationPassives.nextRow,
      numberLine: continuousIterationActives.numberLine
    }
  }

  const accountsReceivableAnalysis = mainAccounts.find(account => account.name === StaticAccountEnum.ACCOUNTS_RECEIVABLE_ANALYSIS)!;
  accountsReceivableAnalysis.children = accounts[accountsReceivableAnalysis.id!];
  const accountsReceivableAnalysisChildren = flatAccountRelationship(accountsReceivableAnalysis).filter(account => account.name !== "Analisis de cuentas por cobrar");

  continuousIteration = AccountsReceivableAnalysis(worksheet, accountsReceivableAnalysisChildren, continuousIteration);
};


export default Page1;
