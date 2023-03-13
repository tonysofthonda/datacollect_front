import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerGroup } from '@models/dealer-group.model';
import { Dealer } from '@models/dealer.model';
import { FinancialStateStatus } from '@models/financial-state.model';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { FinancialStateStatusService } from '@services/financial-state-status/financial-state-status.service';
import { Calendar } from 'primeng/calendar';
import { catchError, forkJoin, of } from 'rxjs';
import { FilterFinancialStateForm } from '../../models/filter-financial-state-form.model';
import { Location } from '@angular/common';
import { FetchType } from '@enums/fetch-type.enum';

@Component({
  selector: 'app-financial-state-filter',
  templateUrl: './financial-state-filter.component.html',
  styles: [
  ]
})
export class FinancialStateFilterComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('calendar')
  calendar!: Calendar;

  @Input()
  resetForm!: boolean;

  @Output()
  filterChange = new EventEmitter<FilterFinancialStateForm>();

  filterForm = this.fb.group({
    dealerGroupId: [null],
    dealerId: [null],
    year: [null],
    month: [null],
    statusId: [null],
  });

  dealerGroups: DealerGroup[] = [];
  dealers: Dealer[] = [];
  statuses: FinancialStateStatus[] = [];
  minDate: Date = new Date();

  get selectedDealer(){
    return this.dealers.find(dealer => dealer.id === this.filterForm.get("dealerId")?.value);
  }


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private dealerGroupService: DealerGroupsService,
    private financialStateStatusService: FinancialStateStatusService,
    private location: Location,
    ) { }

  ngOnInit(): void {
    this.minDate.setFullYear(2022, 0);
    this.dealerGroupService.getAllDealersGroup().subscribe(data => {
      this.dealerGroups = data;
    });

    this.financialStateStatusService.getFinancialStateStatuses().subscribe(data => {
      this.statuses = data;
    });
    
    
    //this.dealerGroups = this.route.snapshot.data["data"]["dealerGroups"];
    //this.statuses = this.route.snapshot.data["data"]["statuses"];

    this.filterForm.get("dealerGroupId")?.valueChanges.subscribe(value=>{
      const dealersSelected = this.dealerGroups.find(dealerGroup => dealerGroup.id === value)?.dealers;
      this.dealers = dealersSelected!;
    });

    this.filterForm.valueChanges.subscribe(value=>{
      this.filterChange.emit(value);
    });
  }

  getCombo() {
    const error = ()=>{
      this.location.back();
      return of();
    }

    return forkJoin({
      dealerGroups: this.dealerGroupService.getDealerGroups(0, 0, FetchType.EAGER),
      statuses: this.financialStateStatusService.getFinancialStateStatuses()
    }).pipe(catchError(error))
  }

  ngAfterViewInit(): void {
    this.calendar.registerOnChange((value: Date)=>{
      if(value){
        this.filterForm.get("year")?.setValue(value.getFullYear());
        this.filterForm.get("month")?.setValue(value.getMonth() + 1);
      }
    })
  }

  ngOnChanges(): void {
    if(this.resetForm && this.calendar){
      this.filterForm.reset();
      this.calendar.writeValue(null);
    }
  }
}
