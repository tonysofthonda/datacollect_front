import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paginated } from '@models/common.model';
import { Contact } from '@models/contact.model';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  providers: [ConfirmationService],
})
export class ContactListComponent implements OnInit, OnChanges {
  @Output() contactEdit = new EventEmitter<Contact | null>();
  @Input() formSubmited!: {value: boolean} | null;

  private term: string = '';

  public terchiefId!: number;
  public idEdit!: number | undefined;
  public paginatedContacts: Paginated<Contact> = {
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
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.terchiefId = parseInt(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnChanges() {
    if (this.formSubmited?.value) {
      this.getContacts();
    } else{
      this.contactEdit.emit(null);
      this.idEdit = undefined;
    }
  }

  public setTerm(term: string) {
    this.term = term;
    this.getContacts();
  }

  public setContactEdit(contact: Contact) {
    this.contactEdit.emit({...contact});
    this.idEdit = contact.id;
  }

  public showRemoveDialog(id: number): void {
    this.confirmationService.confirm({
      header: 'Remove Terchief Contact',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.terchiefsService.removeContact(id).subscribe(() => {
          if (id === this.idEdit) {
            this.contactEdit.emit(null);
          }
          this.paginatedContacts.result = this.paginatedContacts.result.filter(
            (contact) => contact.id !== id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Terchief Contact Deleted Successfully',
          });
        });
      },
    });
  }

  public loadContacts(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getContacts(currentPage, event.rows, event.sortField, event.sortOrder);
  }

  private getContacts(
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

    const success = (paginatedContacts: Paginated<Contact>) => {
      this.paginatedContacts = paginatedContacts;
      if (sortField && sortOrder) {
        this.paginatedContacts.result = sortDataTable(
          this.paginatedContacts.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.terchiefsService
        .filterContacts(this.terchiefId, this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.terchiefsService
        .getContacts(this.terchiefId, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
