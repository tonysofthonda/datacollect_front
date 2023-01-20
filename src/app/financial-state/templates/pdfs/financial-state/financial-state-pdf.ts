import { Account, AccountRelationship, FinancialStateAccountValue } from "@models/account.model";
import { FinancialState } from "@models/financial-state.model";
import { jsPDF } from "jspdf";
import "src/app/shared/fonts/arial-normal.js"
import "src/app/shared/fonts/arial-bold.js"
import "src/app/shared/fonts/arial-italic.js"
import addHeader from "./header";
import addPage1 from "./page-1";
import addPage2 from "./page-2";
import addPage4 from "./page-4";

const doc = new jsPDF({
  orientation: 'landscape',
  format: [850, 750]
});

export function generate(params:{financialState: FinancialState, values: FinancialStateAccountValue[], pages: string[], mainAccounts: {[key: string]:Account[]}, accounts: {[key: string]:AccountRelationship[]}}) {
  const financialState = params.financialState;
  const values = params.values;
  const mainAccounts = params.mainAccounts;
  const accounts = params.accounts;
  addHeader(doc, financialState);
  addPage1(doc, mainAccounts['1'], values, accounts);
  doc.addPage([950, 850]);
  addPage2(doc, mainAccounts['2 y 3'], values, accounts);
  doc.addPage([850, 750]);
  addPage4(doc, mainAccounts['4'], values, accounts);
  doc.save(`${financialState.dealer.dealerNumber} - ${financialState.dealer.name} ${financialState.month}-${financialState.year}.pdf`);
}
