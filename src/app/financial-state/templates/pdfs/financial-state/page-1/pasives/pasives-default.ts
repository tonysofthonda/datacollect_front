import { StaticAccountEnum } from "@enums/static-account.enum";
import { TypeAccountValueEnum } from "@enums/type-account-value.enum";
import { Account, FinancialStateAccountValue } from "@models/account.model";
import { CellDef } from "jspdf-autotable";
import { getAccountValue, getValue } from "../../util";

const passivesDefaultPart1Names = [
  "Cuentas por pagar - Proveedores",
  "Obligaciones por vehiculos tomados en canje",
  "Derechos de licencia y registro",
  "Depositos de clientes",
  "Anticipos sobre reclamos de garantia"
];

const passivesDefaultPart2Names = [
  "Vehiculos nuevos y demos",
  "Vehiculos usados",
  "Vehiculos en arrenda. financiero",
  "Otros"
];

const passivesDefaultPart2AccountNumber = [
  "324",
  "325",
  "326",
  "328"
];

const passivesDefaultPart4Names = ["Actual", "Guia"];

const passivesDefaultPart5Names = ["Capital Social", "Aport. Adicionales de Cap.", "Acciones en tesoreria", "Utilidades retenidas", "Dividendos", "Utilidad neta anterior", "Distribuciones - Empresas", "Inversores", "Retiros", "Propietarios o socios"];

const passivesDefaultPart6Names = ["Utilidad de otras operaciones", "Estimacion de impuesto sobre la renta", "Utilidad neta", "Capital contable total", "Pasivo total y Capital Contable"];

const PasivesDefault = (passivesChildren: Account[], values: FinancialStateAccountValue[])=> {
  return [
      passivesDefaultPart1(passivesChildren, values),
      passivesDefaultPart2(passivesChildren, values),
      passivesDefaultPart3(passivesChildren, values),
      passivesDefaultPart4(passivesChildren, values),
      passivesDefaultPart5(passivesChildren, values),
      passivesDefaultPart6(passivesChildren, values)
    ]
}

const passivesDefaultPart1 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] =>{
  const part1 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart1Names.some(name => name === account.name));
  return [
    [
      {content: 'Pasivos',colSpan: 5, styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontSize: 18}},
      {content: 'No. cuenta', styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: 'Importe', styles: {halign: 'center',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}}
    ],
    ...part1.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const passivesDefaultPart2 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] =>{
  const part2 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart2Names.some(name => name === account.name) && passivesDefaultPart2AccountNumber.some(number => number === account?.accountNumber));
  const firstAccount = part2.shift();
  return [
    [
      {content: 'CUENTAS POR PAGAR',colSpan: 1,rowSpan: 4, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0],cellWidth: 40, minCellWidth: 10, fontStyle: "bold"}},
      {content: firstAccount?.name || '',colSpan: 4,rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 10}},
      {content: firstAccount?.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: getValue(values, getAccountValue(firstAccount!, TypeAccountValueEnum.AMOUNT))?.value || '0', rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ],
    ...part2.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 4, rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const passivesDefaultPart3 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] =>{
  const passivesSkipNames  = [...passivesDefaultPart1Names, ...passivesDefaultPart2Names,...passivesDefaultPart4Names,...passivesDefaultPart5Names, ...passivesDefaultPart6Names, "Cuentas por pagar", "Capital de trabajo neto", "Valor Total"].filter(name => name !== "Otros");
  const passivesSkipAccountNumbers  = [...passivesDefaultPart2AccountNumber];
  const part3 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && !passivesSkipNames.some(name => name === account.name) && !passivesSkipAccountNumbers.some(number => number === account?.accountNumber));
  return [
    ...part3.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const passivesDefaultPart4 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] => {
  const part4 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart4Names.some(name => name === account.name));
  const firstAccount = part4.shift();
  return [
    [
      {content: 'CAPITAL DE TRABAJO NETO',colSpan: 1,rowSpan: 2, styles: {halign: 'center', valign: 'middle',lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 40, minCellWidth: 10, fontStyle: 'bold'}},
      {content: firstAccount?.name || '',colSpan: 4,rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 10}},
      {content: firstAccount?.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: getValue(values, getAccountValue(firstAccount!, TypeAccountValueEnum.AMOUNT))?.value || '0', rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ],
    ...part4.map((account): CellDef[] => [
      {content: account?.name || '',colSpan: 4,rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 10}},
      {content: account?.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content: getValue(values, getAccountValue(account!, TypeAccountValueEnum.AMOUNT))?.value || '0', rowSpan: 1, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const passivesDefaultPart5 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] => {
  const part5 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart5Names.some(name => name === account.name));
  return [
    [
      {content: 'VALOR TOTAL',colSpan: 7, rowSpan: 2, styles: {halign: 'center', valign: 'middle',fillColor: [150, 150, 150], textColor: [255, 255, 255], lineWidth: 0.3, lineColor: [0, 0, 0],minCellHeight: 30.3, minCellWidth: 40, fontSize: 16}},
    ],
    ...part5.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}

const passivesDefaultPart6 = (passivesChildren: Account[], values: FinancialStateAccountValue[]): CellDef[][] => {
  const part6 = passivesChildren.filter(account => !account.component && account.name !== StaticAccountEnum.PASSIVES && passivesDefaultPart6Names.some(name => name === account.name));
  return [
    ...part6.map((account): CellDef[] => [
      {content: account.name || '', colSpan: 5, styles: {lineWidth: 0.3, lineColor: [0, 0, 0], minCellWidth: 40, fontStyle: account.relationshipCheck.hasChildren ? "bold" : "normal"}},
      {content: account.accountNumber || '', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], cellWidth: 20}},
      {content:  getValue(values, getAccountValue(account, TypeAccountValueEnum.AMOUNT))?.value || '0', styles: {lineWidth: 0.3, lineColor: [0, 0, 0], halign: 'center', cellWidth: 20}}
    ])
  ];
}


export default PasivesDefault;
