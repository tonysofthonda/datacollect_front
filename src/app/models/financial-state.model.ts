import { getLastFinancialStateStatus, getMonthTextByNumber } from "../helpers/util";
import { AccountError, FinancialStateAccountValue } from "./account.model";
import { Dealer } from "./dealer.model";
import { EvaluationArea } from "./evaluation-area.model";
import { UserType } from "./user-type.model";

export interface FinancialState {
  id?: number;
  month: number;
  year: number;
  limitDate: string;
  dealer: Dealer,
  statuses: FinancialStateStatus[];
  accountValues: FinancialStateAccountValue[];
}

export interface FinancialStateTable extends FinancialState{
  dealerText: string;
  lastStatus: FinancialStateStatus | null,
  monthText: string
}

export interface Status{
  id?: number;
  name: string;
  description: string;
}

export interface FinancialStateStatus{
  id?: number;
  dateAssignment: Date;
  finantialState: FinancialState;
  status: Status;
  email?:string;
  username?:string;
  comments?:string;
  userType: UserType;
  area: EvaluationArea;
  errors?: AccountError[]
}

export const castToFinancialStateTable = (financialState: FinancialState): FinancialStateTable => ({
  ...financialState,
  dealerText: `${financialState.dealer.dealerNumber} - ${financialState.dealer.name}`,
  lastStatus: getLastFinancialStateStatus(financialState),
  monthText: getMonthTextByNumber(financialState.month, 'es-MX')
});

export const castToFinancialState = ({dealerText, lastStatus, monthText, ...financialState}: FinancialStateTable): FinancialState =>({
  ...financialState
});

