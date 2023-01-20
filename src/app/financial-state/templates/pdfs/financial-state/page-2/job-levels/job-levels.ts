import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput, Styles } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const JobLevels = (jobLevelsChildren: Account[], values: FinancialStateAccountValue[]): RowInput[] => {
  const headerStyle: Partial<Styles> = {halign: 'center', valign: 'middle', fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], fontSize: 18};
  return [
    [
      {content: 'POSICION', styles: headerStyle},
      {content: 'A', styles: headerStyle},
      {content: 'B', styles: headerStyle},
      {content: 'C', styles: headerStyle},
      {content: 'D', styles: headerStyle},
      {content: 'E', styles: headerStyle},
      {content: 'F', styles: headerStyle},
      {content: 'TOTAL', styles: headerStyle},
    ],
    ...jobLevelsChildren.map((account): CellDef[] =>(
      [
        {content: account.name || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.A_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.B_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.C_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.D_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.E_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.F_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
        {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.TOTAL_POSITION))?.value || '0', styles: {halign: 'center',lineWidth: 0.3, lineColor: [0, 0, 0]}},
    ]))
  ];
}

export default JobLevels;
