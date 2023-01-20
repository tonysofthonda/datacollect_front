import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Contact } from '@models/contact.model';
import { TerchiefsService } from '@services/terchiefs/terchiefs.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  providers: [ValidationService]
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Output() isSubmited = new EventEmitter<{value: boolean} | null>();
  @Input() contactEdit!: Contact | null;
  contactId!: number | undefined;
  localSubmited: boolean = false;
  private terchiefId!: number;

  contactForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, this.validatorService.isAlphabetic()],
    ],
    lastName: ['', [Validators.required, this.validatorService.isAlphabetic()]],
    motherLastName: [
      '',
      [Validators.required, this.validatorService.isAlphabetic()],
    ],
    phoneNumber: ['', [Validators.maxLength(20)]],
    email: ['', [Validators.required, this.validatorService.isEmail()]],
    notes: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private terchiefsService: TerchiefsService,
    private validatorService: ValidatorService,
    public validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.validationService.form = this.contactForm;
    this.terchiefId = parseInt(this.route.snapshot.paramMap.get('id')!);
  }

  ngOnChanges(): void {
    if (this.contactEdit) {
      this.contactId = this.contactEdit.id;
      this.contactForm.reset(this.contactEdit);
    } else{
      this.contactId = undefined;
      this.contactForm.reset();
    }
  }

  public cancelEdit() {
    this.stopEdit(false);
  }

  public stopEdit(submited: boolean){
    this.contactId = undefined;
    this.contactForm.reset();
    this.isSubmited.emit({value: submited});
  }

  public submit() {
    this.localSubmited = true;
    if (!this.contactId) {
      this.terchiefsService
        .addContact({
          ...this.contactForm.value,
          terchiefId: this.terchiefId,
        })
        .subscribe(() => {
          this.localSubmited = false;
          this.stopEdit(true);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contact saved successfully',
          });
        });
    } else {
      this.terchiefsService
        .editContact({ ...this.contactForm.value, id: this.contactId })
        .subscribe(() => {
          this.localSubmited = false;
          this.stopEdit(true)
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Contact updated successfully',
          });
        });
    }
  }
}
