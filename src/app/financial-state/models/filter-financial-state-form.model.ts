import { FormGroup } from "@angular/forms";
import { AccountValue } from "@models/account.model";

export interface FilterFinancialStateForm {
  dealerGroupId?: number;
  dealerId?: number;
  year?: number;
  month?: number;
  statusId?: number;
}

export interface FinancialStateFormGroup{
  indexTab: number;
  form: FormGroup;
  accountValues: AccountValue[];
}
