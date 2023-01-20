import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paginated } from '@models/common.model';
import { castToDealerFacilityTable, DealerFacility, DealerFacilityTable } from '@models/dealer-facility.model';
import { DealerFacilitiesService } from '@services/dealer-facilities/dealer-facilities.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-dealer-facilities-list',
  templateUrl: './dealer-facilities-list.component.html',
  providers: [ConfirmationService],
})
export class DealerFacilitiesListComponent implements OnInit, OnChanges {
  @Output() dealerFacilityEdit = new EventEmitter<DealerFacility | null>();
  @Input() formSubmited!: {value: boolean} | null;

  private dealerId!: number;
  public idEdit!: number | undefined;

  private term: string = '';

  public paginatedDealerFacilities: Paginated<DealerFacility> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private dealerFacilityService: DealerFacilitiesService,
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
      this.getDealerFacilities();
    } else{
      this.dealerFacilityEdit.emit(null);
      this.idEdit = undefined;
    }
  }

  public setTerm(term: string) {
    this.term = term;
    this.getDealerFacilities();
  }

  public setDealerFacilityEdit(dealerFacility: DealerFacility){
    this.dealerFacilityEdit.emit({...dealerFacility});
    this.idEdit = dealerFacility.facility.id;
  }

  public showRemoveDialog(dealerFacility: DealerFacilityTable): void {
    this.confirmationService.confirm({
      header: 'Remove Dealer Facility',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.dealerFacilityService.removeDealerFacility(dealerFacility).subscribe(() => {
          if (dealerFacility.facility.id === this.idEdit) {
            this.dealerFacilityEdit.emit(null);
          }
          this.paginatedDealerFacilities.result = this.paginatedDealerFacilities.result.filter(
            (dealerFacilityResult) => dealerFacilityResult.facility.id !== dealerFacility.facility.id
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Dealer Facility Deleted Successfully',
          });
        });
      },
    });
  }

  public loadDealerFacilities(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getDealerFacilities(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getDealerFacilities(
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

    const success = (paginatedDealerFacilities: Paginated<DealerFacility>) => {
      this.paginatedDealerFacilities = {
        ...paginatedDealerFacilities,
        result: paginatedDealerFacilities.result.map(castToDealerFacilityTable)
      };
      if (sortField && sortOrder) {
        this.paginatedDealerFacilities.result = sortDataTable(
          this.paginatedDealerFacilities.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.dealerFacilityService
        .filterDealerFacility(this.dealerId, this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.dealerFacilityService
        .getDealerFacilities(this.dealerId, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }

}
