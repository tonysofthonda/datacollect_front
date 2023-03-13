import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialStateRoutingModule } from './financial-state-routing.module';
import { FinancialStateListComponent } from './pages/financial-state-list/financial-state-list.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng.module';
import { FinancialStateFilterComponent } from './components/financial-state-filter/financial-state-filter.component';
import { FinancialStateFormComponent } from './pages/financial-state-form/financial-state-form.component';
import { FinancialStateHeaderComponent } from './components/financial-state-header/financial-state-header.component';
import { AccountsLoadingComponent } from './components/accounts-loading/accounts-loading.component';
import { AccountComponent } from './components/account/account.component';
import { PageComponent } from './components/page/page.component';
import { AccountTotalFixedAssetsComponent } from './components/account-total-fixed-assets/account-total-fixed-assets.component';
import { AccountTotalUnitsPasivesComponent } from './components/account-total-units-pasives/account-total-units-pasives.component';
import { AccountReceivableAnalysisComponent } from './components/account-receivable-analysis/account-receivable-analysis.component';
import { AccountGrossProfitAnalysisComponent } from './components/account-gross-profit-analysis/account-gross-profit-analysis.component';
import { InputAccountComponent } from './components/input-account/input-account.component';
import { FormulaTermsComponent } from './components/formula-terms/formula-terms.component';
import { EvaluationFlowComponent } from './components/evaluation-flow/evaluation-flow.component';
import { AccountErrorsListComponent } from './components/account-errors-list/account-errors-list.component';
import { RejectFormComponent } from './components/reject-form/reject-form.component';
import { ObservationsFormComponent } from './components/observations-form/observations-form.component';
import { LimitDateChangeFormComponent } from './components/limit-date-change-form/limit-date-change-form.component';
import { AccountPageTwoAndThreeComponent } from './components/account-page-two-and-three/account-page-two-and-three.component';
import { AccountJobLevelsComponent } from './components/account-job-levels/account-job-levels.component';
import { AccountOtherIncomeComponent } from './components/account-other-income/account-other-income.component';
import { AccountIncomeDeductionComponent } from './components/account-income-deduction/account-income-deduction.component';
import { FinancialStatePdfButtonComponent } from './components/financial-state-pdf-button/financial-state-pdf-button.component';
import { FinancialStateXlsxButtonComponent } from './components/financial-state-xlsx-button/financial-state-xlsx-button.component';
import { FinancialDetailComponent } from './components/financial-details/financial-details.component';

@NgModule({
  declarations: [
    FinancialStateListComponent,
    FinancialStateFilterComponent,
    FinancialStateFormComponent,
    FinancialStateHeaderComponent,
    AccountsLoadingComponent,
    AccountComponent,
    PageComponent,
    AccountTotalFixedAssetsComponent,
    AccountTotalUnitsPasivesComponent,
    AccountReceivableAnalysisComponent,
    AccountGrossProfitAnalysisComponent,
    InputAccountComponent,
    FormulaTermsComponent,
    EvaluationFlowComponent,
    AccountErrorsListComponent,
    RejectFormComponent,
    ObservationsFormComponent,
    LimitDateChangeFormComponent,
    AccountPageTwoAndThreeComponent,
    AccountJobLevelsComponent,
    AccountOtherIncomeComponent,
    AccountIncomeDeductionComponent,
    FinancialStatePdfButtonComponent,
    FinancialStateXlsxButtonComponent,
    FinancialDetailComponent
  ],
  imports: [
    CommonModule,
    FinancialStateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    PrimeNgModule
  ]
})
export class FinancialStateModule { }
