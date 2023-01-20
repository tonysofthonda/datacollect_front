import { Component, OnInit } from '@angular/core';
import { Status } from '@enums/status.enum';
import { Paginated } from '@models/common.model';
import { castToDealerTable, Dealer, DealerTable } from '@models/dealer.model';
import { DealersService } from '@services/dealers/dealers.service';
import { ConfirmationService, LazyLoadEvent,  MessageService } from 'primeng/api';
import { InputSwitch } from 'primeng/inputswitch';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-dealers-list',
  templateUrl: './dealers-list.component.html',
  providers: [ConfirmationService],
})
export class DealersListComponent implements OnInit {
  private term: string = '';

  public paginatedDealers: Paginated<DealerTable> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  switchStatus(dealerStatus: string): boolean {
    return dealerStatus === Status.ENABLED;
  }

  constructor(
    private dealersService: DealersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getDealers();
  }

  public showChangeStatusDialog(
    switchRef: InputSwitch,
    event: any,
    id: number
  ) {
    const previousValue = !event.checked;
    const selectedValue = event.checked;
    const accept = () => {
      this.dealersService
        .editDealerStatus(selectedValue, id)
        .subscribe((dealerEdited) => {
          this.paginatedDealers.result = this.paginatedDealers.result.map(
            (dealer) => {
              if (dealer.id === dealerEdited.id) {
                dealer = castToDealerTable(dealerEdited);
              }
              return dealer;
            }
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Dealer Status Updated Successfully',
          });
        });
    };

    const reject = () => {
      switchRef.writeValue(previousValue);
    };

    if (selectedValue) {
      this.confirmationService.confirm({
        header: 'Enable dealer',
        message: 'Are you sure you want to enable the record?',
        accept,
        reject,
      });
    } else {
      this.confirmationService.confirm({
        header: 'Disable dealer',
        message: 'Are you sure you want to disable the record?',
        accept,
        reject,
      });
    }
  }

  public loadDealers(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getDealers(currentPage, event.rows, event.sortField, event.sortOrder);
  }

  private getDealers(
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

    const success = (paginatedDealers: Paginated<Dealer> | Dealer[]) => {
      const response = paginatedDealers as Paginated<Dealer>;
      this.paginatedDealers = {
        ...response,
        result: response.result.map(castToDealerTable),
      };
      if (sortField && sortOrder) {
        this.paginatedDealers.result = sortDataTable(
          this.paginatedDealers.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.dealersService
        .filterDealer(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.dealersService
        .getDealers(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
