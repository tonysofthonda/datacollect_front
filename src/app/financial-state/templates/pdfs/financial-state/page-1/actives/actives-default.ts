import { AccountComponentEnum } from "@enums/account-component.enum";
import { StaticAccountEnum } from "@enums/static-account.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef, RowInput } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const activesDefaultPart1Skip = ["Seguro de vida - Valor en efectivo", "Documentos y Cuentas por Cobrar - funcionarios y empleados", "Otros documentos y cuentas por cobrar", "Otros activos no automotrices", "Inversiones y anticipos - Otras Operaciones", "Inversiones y anticipos - Otras Operaciones", "Total de otros activos", "Activos totales"];

const ActivesDefault = (activesChildren: Account[], values: FinancialStateAccountValue[]): RowInput[][] => {
  return [activesDefaultPart1(activesChildren, values), activesDefaultPart2(activesChildren, values)];
};


const activesDefaultPart1 = (activesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] =>{
  const part1 = activesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.ASSETS && !activesDefaultPart1Skip.some(name => name === account.name));
  return [
    [
      {content: 'Activos',colSpan: 5, styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontSize: 18}},
      {content: 'No. cuenta', styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: 'Importe', styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}}
    ],
    ...part1.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT)!)?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const activesDefaultPart2 = (activesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] => {
  const part2 = activesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.ASSETS && activesDefaultPart1Skip.some(name => name === account.name));
  return [
    ...part2.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT)!)?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ]),
    [{content: '', colSpan: 7, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellHeight: 34.5}}]
  ];
}

export default ActivesDefault;
