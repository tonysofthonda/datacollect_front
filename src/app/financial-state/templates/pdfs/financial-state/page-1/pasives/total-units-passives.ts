import { AccountComponentEnum } from "@enums/account-component.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const TotalUnitsPassives = (passivesChildren: Account[], values: FinancialStateAccountValue[]): RowInput[]=> {
  const totalUnitsPassives = passivesChildren.filter(account => account.component?.name === AccountComponentEnum.TOTAL_UNITS_PASIVES && account.accountNumber?.startsWith("M"));
  const totalAccount = passivesChildren.find(account => account.name === "Total" && account.accountNumber === "399");
  return [
    [
      {content: "MES", colSpan: 1,rowSpan: 2, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "UNIDADES HONDA", colSpan: 1, rowSpan: 2, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "NUEVAS OTRAS", colSpan: 1, rowSpan: 2, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "UNIDADES USADAS", colSpan: 2, rowSpan: 1, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "UTILIDAD O PERDIDA", colSpan: 1, rowSpan: 2, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "", colSpan: 1, rowSpan: 2, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fillColor: [0,0,0]}},
    ],
    [
      {content: "MENUDEO", colSpan: 1, rowSpan: 1, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content: "MAYOREO", colSpan: 1, rowSpan: 1, styles: {halign: 'center',valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}}
    ],
    ...totalUnitsPassives.map((account):CellDef[]  => [
      {content: account.name, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.HONDA_UNITS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.NEW_OTHERS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.RETAIL))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.WHOLESALE))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.PROFIT_OR_LOSS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content: "", styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fillColor: [0,0,0]}},
    ]),
    [
      {content: totalAccount!.name + " - " + totalAccount?.accountNumber, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40}},
      {content:  getValue(values, getAccountValue(totalAccount!, TypeAccountValueEnum.HONDA_UNITS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(totalAccount!, TypeAccountValueEnum.NEW_OTHERS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(totalAccount!, TypeAccountValueEnum.RETAIL))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(totalAccount!, TypeAccountValueEnum.WHOLESALE))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content:  getValue(values, getAccountValue(totalAccount!, TypeAccountValueEnum.PROFIT_OR_LOSS))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}},
      {content: "", styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fillColor: [0,0,0]}},
    ]
  ];
}

const getMonthName = (accountNumber: string) => {
  switch (accountNumber) {
    case "M1":
      return "Enero";
    case "M2":
        return "Febrero";
    case "M3":
        return "Marzo";
    case "M4":
      return "Abril";
    case "M5":
      return "Mayo";
    case "M6":
      return "Junio";
    case "M7":
      return "Julio";
    case "M8":
      return "Agosto";
    case "M9":
      return "Septiembre";
    case "M10":
      return "Octubre";
    case "M11":
      return "Noviembre";
    case "M12":
      return "Diciembre";
    default:
      return "";
  }
}

export default TotalUnitsPassives;
