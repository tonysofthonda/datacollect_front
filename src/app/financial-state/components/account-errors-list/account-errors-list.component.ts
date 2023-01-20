import { Component, Input, OnInit } from '@angular/core';
import { AccountError } from '@models/account.model';

@Component({
  selector: 'app-account-errors-list',
  templateUrl: './account-errors-list.component.html',
})
export class AccountErrorsListComponent implements OnInit {

  @Input()
  accountErrors: AccountError[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
