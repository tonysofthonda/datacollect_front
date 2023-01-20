import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contact } from '@models/contact.model';

@Component({
  selector: 'app-terchief-contacts',
  templateUrl: './terchief-contacts.component.html',
})
export class TerchiefContactsComponent implements OnInit, AfterContentChecked {
  public contactEdit!: Contact | null;
  public formSubmited!: {value: boolean} | null;

  constructor(private cdref: ChangeDetectorRef ) {}

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  public setContactEdit(contact: Contact | null) {
    this.contactEdit = contact;
  }

  public setSubmitedForm(isSubmited: {value: boolean} | null) {
    this.formSubmited = isSubmited;
  }
}
