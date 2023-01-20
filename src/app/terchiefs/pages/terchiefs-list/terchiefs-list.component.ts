import { Component, OnInit } from '@angular/core';

import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import { Terchief } from '@models/terchief.model';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import { catchError, of } from 'rxjs';
import { Paginated } from '@models/common.model';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-terchiefs-list',
  templateUrl: './terchiefs-list.component.html',
  providers: [ConfirmationService],
})
export class TerchiefsListComponent implements OnInit {
  private term: string = '';
  public paginatedTerchiefs: Paginated<Terchief> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  constructor(
    private terchiefsService: TerchiefsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getTerchiefs();
  }

  public showRemoveDialog(id: number): void {
    this.confirmationService.confirm({
      header: 'Remove Terchief',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.terchiefsService.removeTerchief(id).subscribe(() => {
          this.paginatedTerchiefs.result =
            this.paginatedTerchiefs.result.filter(
              (terchief) => terchief.id !== id
            );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Head Of Territory Deleted Successfully',
          });
        });
      },
    });
  }

  public loadTerchiefs(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getTerchiefs(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getTerchiefs(
    page: number = 0,
    elementsByPage: number = 10,
    sortField: string | undefined = undefined,
    sortOrder: number | undefined = undefined
  ) {
    this.loading = true;

    const error = () => {
      this.loading = false;
      return of();
    };

    const success = (paginatedTerchiefs: Paginated<Terchief> | Terchief[]) => {
      this.paginatedTerchiefs = (paginatedTerchiefs as Paginated<Terchief>);
      if (sortField && sortOrder) {
        this.paginatedTerchiefs.result = sortDataTable(
          this.paginatedTerchiefs.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.terchiefsService
        .filterTerchiefs(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.terchiefsService
        .getTerchiefs(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
