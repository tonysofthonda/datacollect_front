import { Component, OnInit } from '@angular/core';
import { Paginated } from '@models/common.model';
import { Facility } from '@models/facility.model';
import { FacilitiesService } from '@services/facilities/facilities.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-facilities-list',
  templateUrl: './facilities-list.component.html',
  providers: [ConfirmationService],
})
export class FacilitiesListComponent implements OnInit {
  private term: string = '';

  public paginatedFacilities: Paginated<Facility> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  constructor(
    private facilitiesService: FacilitiesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getFacilities();
  }

  public showRemoveDialog(id: number): void {
    this.confirmationService.confirm({
      header: 'Remove Facility',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.facilitiesService.removeFacility(id).subscribe(() => {
          this.paginatedFacilities.result =
            this.paginatedFacilities.result.filter(
              (facility) => facility.id !== id
            );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Facility Deleted Successfully',
          });
        });
      },
    });
  }

  public loadFacilities(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getFacilities(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getFacilities(
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

    const success = (paginatedFacilities: Paginated<Facility> | Facility[]) => {
      this.paginatedFacilities = paginatedFacilities as Paginated<Facility>;
      if (sortField && sortOrder) {
        this.paginatedFacilities.result = sortDataTable(
          this.paginatedFacilities.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.facilitiesService
        .filterFacility(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.facilitiesService
        .getFacilities(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
