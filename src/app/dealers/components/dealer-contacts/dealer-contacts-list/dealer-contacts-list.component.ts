import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paginated } from '@models/common.model';
import { castToDealerContactTable, DealerContact, DealerContactTable } from '@models/dealer-contact';
import { DealerContactsService } from '@services/dealer-contacts/dealer-contacts.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-dealer-contacts-list',
  templateUrl: './dealer-contacts-list.component.html',
  providers: [ConfirmationService],
})
export class DealerContactsListComponent implements OnInit, OnChanges {
  @Output() dealerContactEdit = new EventEmitter<DealerContact | null>();
  @Input() formSubmited!: {value: boolean} | null;

  private dealerId!: number;
  public idEdit!: number | undefined;

  private term: string = '';

  public paginatedDealerContacts: Paginated<DealerContactTable> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private dealerContactService: DealerContactsService,
    private messageService: MessageService,
    private location: Location,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.dealerId = parseInt(this.route.snapshot.paramMap.get('id')!);
    if(this.dealerId == null){
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Dealer Id not found in the path',
      });
      this.location.back();
    }
  }

  ngOnChanges() {
    if (this.formSubmited?.value) {
      this.getDealerContacts();
    } else{
      this.dealerContactEdit.emit(null);
      this.idEdit = undefined;
    }
  }

  public setTerm(term: string) {
    this.term = term;
    this.getDealerContacts();
  }

  public setDealerContactEdit(dealerContact: DealerContact){
    this.dealerContactEdit.emit({...dealerContact});
    this.idEdit = dealerContact.id;
  }

  public showRemoveDialog(dealerContact: DealerContactTable): void {
    this.confirmationService.confirm({
      header: 'Remove Dealer Contact',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.dealerContactService.removeDealerContact(dealerContact.id).subscribe(() => {
          if (dealerContact.id === this.idEdit) {
            this.dealerContactEdit.emit(null);
          }
          this.paginatedDealerContacts.result = this.paginatedDealerContacts.result.filter(
            (dealerContactResult) => dealerContactResult.id !== dealerContact.id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Dealer Contact Deleted Successfully',
          });
        });
      },
    });
  }

  public loadDealerContacts(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getDealerContacts(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getDealerContacts(
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

    const success = (paginatedDealerContacts: Paginated<DealerContact>) => {
      this.paginatedDealerContacts = {
        ...paginatedDealerContacts,
        result: paginatedDealerContacts.result.map(castToDealerContactTable)
      };
      if (sortField && sortOrder) {
        this.paginatedDealerContacts.result = sortDataTable(
          this.paginatedDealerContacts.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.dealerContactService
        .filterDealerContact(this.dealerId, this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.dealerContactService
        .getDealerContacts(this.dealerId, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
