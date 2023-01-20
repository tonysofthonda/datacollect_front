import { Account, AccountRelationship } from "@models/account.model";
import { Dealer } from "@models/dealer.model";
import { Workbook } from "exceljs";
import Header from "./header";
import Page1 from "./page-1";
import Page2And3 from "./page-2-3";
import Page4 from "./page-4";
import { addFormulas } from "./util";

let doc: Workbook;

export function generate(params:{dealer?: Dealer, pages: string[], mainAccounts: {[key: string]:Account[]}, accounts: {[key: string]:AccountRelationship[]}}){
  doc = new Workbook();
  const dealer = params.dealer;
  const pages = params.pages;
  const mainAccounts = params.mainAccounts;
  const accounts = params.accounts;

  const worksheet1 = doc.addWorksheet('PAGINA 1', {views:[{showGridLines: false}]});
  const worksheet2and3 = doc.addWorksheet('PAGINA 2 Y 3', {views:[{showGridLines: false}]});
  const worksheet4 = doc.addWorksheet('PAGINA 4', {views:[{showGridLines: false}]});

  const page1StartRow = Header(doc,worksheet1);
  Page1(worksheet1, page1StartRow, mainAccounts['1'], accounts);
  Page2And3(worksheet2and3, mainAccounts['2 y 3'], accounts);
  Page4(worksheet4, mainAccounts['4'], accounts);

  addFormulas({'1': worksheet1, '2 y 3': worksheet2and3, '4': worksheet4}, mainAccounts, accounts)
  download();
}

const download = ()=>{
  doc.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
     anchor.href = url;
     anchor.download = `download.xlsx`;
     anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove();
  });
}
