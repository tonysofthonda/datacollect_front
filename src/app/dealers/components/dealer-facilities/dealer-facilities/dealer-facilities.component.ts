import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DealerFacility } from '@models/dealer-facility.model';

@Component({
  selector: 'app-dealer-facilities',
  templateUrl: './dealer-facilities.component.html',
})
export class DealerFacilitiesComponent implements OnInit, AfterContentChecked {
  public dealerFacilityEdit!: DealerFacility | null;
  public formSubmited!: {value: boolean} | null;

  constructor(private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  public setDealerFacilityEdit(dealerFacilityEdit: DealerFacility | null) {
    this.dealerFacilityEdit = dealerFacilityEdit;
  }

  public setSubmitedForm(isSubmited: {value: boolean} | null) {
    this.formSubmited = isSubmited;
  }
}
