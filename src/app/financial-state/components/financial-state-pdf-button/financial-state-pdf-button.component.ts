import { Component, Input, OnInit } from '@angular/core';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { Account, AccountRelationship } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { AccountService } from '@services/accounts/account.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { getLastFinancialStateStatus } from 'src/app/helpers/util';
import { generate } from '../../templates/pdfs/financial-state/financial-state-pdf';

@Component({
  selector: 'app-financial-state-pdf-button',
  templateUrl: './financial-state-pdf-button.component.html',
  styles: [
  ]
})
export class FinancialStatePdfButtonComponent implements OnInit {

  @Input()
  financialState!: FinancialState;
  loadingPdf: boolean = false;

  constructor(
    private financialStateService: FinancialStateService,
    private accountService: AccountService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
  }

  isFinancialStateDone(){
    //TODO: Change to DONE status
    return getLastFinancialStateStatus(this.financialState)?.status.name === FinancialStateStatusEnum.APPROVED;
  }

  generatePdf(){
    const { id } = this.financialState;

    this.loadingPdf = true;
    this.messageService.add({
      key: 'load-pdf',
      sticky: true,
      closable: false,
      severity: 'info',
    });

    forkJoin({
      financialState: this.financialStateService.getFinancialState(id!),
      pages: this.accountService.getAllPages(),
    }).pipe(
      switchMap(({financialState,pages}) => {
        let mainAccountsOfPages: {[key: string]:Observable<Account[]>} = {};
        pages.forEach(page => {
          mainAccountsOfPages = {...mainAccountsOfPages, [page]:this.accountService.getMainAccounts(page)};
        })
        return forkJoin({
          financialState: of(financialState),
          pages: of(pages),
          mainAccounts: forkJoin(mainAccountsOfPages)
        })
      }),
      switchMap(({financialState,pages,mainAccounts})=>{
        let childrenAccounts: {[key: string]:Observable<AccountRelationship[]>} = {};
        pages.forEach(page => {
          mainAccounts[page].forEach(mainAccount=>{
            childrenAccounts = {...childrenAccounts, [mainAccount.id!.toString()]: this.accountService.getChildrenAccounts(mainAccount.id!)}
          })
        })
        return forkJoin({
          financialState: of(financialState),
          pages: of(pages),
          mainAccounts: of(mainAccounts),
          accounts: forkJoin(childrenAccounts)
        });
      })
    )
      .subscribe(({financialState,accounts,mainAccounts,pages})=>{
        generate({financialState, values: financialState.accountValues, pages, mainAccounts, accounts});
        this.messageService.clear('load-pdf');
        this.loadingPdf = false;
    });
  }
}
