import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '@models/contact.model';
import { DealerContact } from '@models/dealer-contact';
import { Dealer } from '@models/dealer.model';
import { DealerContactsService } from '@services/dealer-contacts/dealer-contacts.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dealer-contacts-form',
  templateUrl: './dealer-contacts-form.component.html',
  providers: [ValidationService]
})
export class DealerContactsFormComponent implements OnInit, OnChanges {
  @Output() isSubmited = new EventEmitter<{value: boolean} | null>();
  @Input() dealerContactEdit!: DealerContact | null;
  contactId!: number | undefined;
  dealer!: Dealer;

  positionControl = this.fb.control(null, Validators.required);
  contactForm = this.fb.group({
    id:[null],
    contactId:[null],
    firstName: ['',[Validators.required, this.validatorService.isAlphabetic()],],
    lastName: ['', [Validators.required, this.validatorService.isAlphabetic()]],
    motherLastName: ['',[Validators.required, this.validatorService.isAlphabetic()]],
    phoneNumber: ['', [Validators.maxLength(20)]],
    email: ['', [Validators.required, this.validatorService.isEmail()]],
    notes: [''],
    position: this.positionControl,
    notifications: [[], Validators.required],
    dealer: [null, Validators.required]
  });


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private dealerContactService: DealerContactsService,
    private validatorService: ValidatorService,
    public validationService: ValidationService,
  ) { }

  ngOnInit(): void {
    const dealer: Dealer = this.route.snapshot.data["data"]["dealer"];
    if(dealer){
      this.dealer = dealer;
      this.contactForm.get('dealer')?.reset(dealer);
    }
    this.validationService.form = this.contactForm;
  }

  ngOnChanges(): void {
    if (this.dealerContactEdit) {
      this.contactId = this.dealerContactEdit.id;
      const {id,firstName,lastName,motherLastName,phoneNumber,email,notes} = this.dealerContactEdit.contact;
      this.contactForm.reset({
        id: this.dealerContactEdit.id,
        contactId: id,
        firstName,
        lastName,
        motherLastName,
        phoneNumber,
        email,
        notes,
        position: this.dealerContactEdit.position,
        notifications: this.dealerContactEdit.notifications,
        dealer: this.dealerContactEdit.dealer
      });
    } else{
      this.contactId = undefined;
      this.resetForm();
    }
  }

  public cancelEdit() {
    this.stopEdit(false);
  }

  public stopEdit(submited: boolean){
    this.contactId = undefined;
    this.resetForm();
    this.isSubmited.emit({value: submited});
  }

  public submit() {
    const contact: Contact = {
      id: this.contactForm.get('contactId')?.value,
      firstName: this.contactForm.get('firstName')?.value,
      lastName: this.contactForm.get('lastName')?.value,
      motherLastName: this.contactForm.get('motherLastName')?.value,
      phoneNumber: this.contactForm.get('phoneNumber')?.value,
      email: this.contactForm.get('email')?.value,
      notes: this.contactForm.get('notes')?.value,
    };

    const dealerContact: DealerContact = {
       id: this.contactForm.get('id')?.value,
       dealer: this.contactForm.get('dealer')?.value,
       contact,
       position: this.contactForm.get('position')?.value,
       notifications: this.contactForm.get('notifications')?.value
      };
    if (!this.contactId) {
      this.dealerContactService
        .addDealerContact(dealerContact)
        .subscribe(() => {
          this.stopEdit(true);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contact saved successfully',
          });
        });
    } else {

      this.dealerContactService
        .editDealerContact(dealerContact, this.contactId)
        .subscribe(() => {
          this.stopEdit(true)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contact updated successfully',
          });
        });
    }
  }

  resetForm(){
    this.contactForm.reset({
      id: null,
      contactId: null,
      firstName: '',
      lastName: '',
      motherLastName: '',
      phoneNumber: '',
      email: '',
      notes: '',
      position: null,
      notifications: [],
      dealer: this.dealer
    });
  }


}
