import { Component, OnInit } from '@angular/core';
import { Account, AccountRelationship } from '@models/account.model';
import { Dealer } from '@models/dealer.model';
import { AccountService } from '@services/accounts/account.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { generate } from '../../templates/xlsx/financial-state/financial-state-xlsx';

@Component({
  selector: 'app-financial-state-xlsx-button',
  templateUrl: './financial-state-xlsx-button.component.html',
  styles: [
  ]
})
export class FinancialStateXlsxButtonComponent implements OnInit {

  dealer!: Dealer;
  loadingXlsx: boolean = false;

  constructor(
    private financialStateService: FinancialStateService,
    private accountService: AccountService,
    private messageService: MessageService

  ) { }

  ngOnInit(): void {
  }

  generateXlsx(){
    this.loadingXlsx = true;
    this.messageService.add({
      key: 'load-xlsx',
      sticky: true,
      closable: false,
      severity: 'info',
    });

    forkJoin({
      pages: this.accountService.getAllPages(),
    }).pipe(
      switchMap(({pages}) => {
        let mainAccountsOfPages: {[key: string]:Observable<Account[]>} = {};
        pages.forEach(page => {
          mainAccountsOfPages = {...mainAccountsOfPages, [page]:this.accountService.getMainAccounts(page)};
        })
        return forkJoin({
          pages: of(pages),
          mainAccounts: forkJoin(mainAccountsOfPages)
        })
      }),
      switchMap(({pages,mainAccounts})=>{
        let childrenAccounts: {[key: string]:Observable<AccountRelationship[]>} = {};
        pages.forEach(page => {
          mainAccounts[page].forEach(mainAccount=>{
            childrenAccounts = {...childrenAccounts, [mainAccount.id!.toString()]: this.accountService.getChildrenAccounts(mainAccount.id!)}
          })
        })
        return forkJoin({
          pages: of(pages),
          mainAccounts: of(mainAccounts),
          accounts: forkJoin(childrenAccounts)
        });
      })
    )
      .subscribe(({accounts,mainAccounts,pages})=>{
        generate({pages, mainAccounts, accounts});
        this.messageService.clear('load-xlsx');
        this.loadingXlsx = false;
    });
  }
}
