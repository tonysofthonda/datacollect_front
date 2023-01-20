import { Component, OnInit } from '@angular/core';
import { Paginated } from '@models/common.model';
import { DealerGroup } from '@models/dealer-group.model';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-dealer-groups-list',
  templateUrl: './dealer-groups-list.component.html',
  providers: [ConfirmationService],
})
export class DealerGroupsListComponent implements OnInit {
  private term: string = '';

  public paginatedGroups: Paginated<DealerGroup> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  constructor(
    private dealerGroupsService: DealerGroupsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getDealerGroups();
  }

  public showRemoveDialog(id: number): void {
    this.confirmationService.confirm({
      header: 'Remove Dealer Group',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.dealerGroupsService.removeDealerGroup(id).subscribe(() => {
          this.paginatedGroups.result = this.paginatedGroups.result.filter(
            (dealerGroup) => dealerGroup.id !== id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Dealer Group Deleted Successfully',
          });
        });
      },
    });
  }

  public loadDealerGroups(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getDealerGroups(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getDealerGroups(
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

    const success = (paginatedGroups: Paginated<DealerGroup> | DealerGroup[]) => {
      this.paginatedGroups = (paginatedGroups as Paginated<DealerGroup>);
      if (sortField && sortOrder) {
        this.paginatedGroups.result = sortDataTable(
          this.paginatedGroups.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.dealerGroupsService
        .filterDealerGroup(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.dealerGroupsService
        .getDealerGroups(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
