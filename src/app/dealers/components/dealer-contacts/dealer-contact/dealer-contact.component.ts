import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DealerContact } from '@models/dealer-contact';

@Component({
  selector: 'app-dealer-contact',
  templateUrl: './dealer-contact.component.html',
})
export class DealerContactComponent implements OnInit, AfterContentChecked {
  public dealerContactEdit!: DealerContact | null;
  public formSubmited!: {value: boolean} | null;

  constructor(private cdref: ChangeDetectorRef ) {}

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  public setDealerContactEdit(contact: DealerContact | null) {
    this.dealerContactEdit = contact;
  }

  public setSubmitedForm(isSubmited: {value: boolean} | null) {
    this.formSubmited = isSubmited;
  }

}
