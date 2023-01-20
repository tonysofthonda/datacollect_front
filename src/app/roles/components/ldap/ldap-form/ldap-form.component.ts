import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from '@services/roles/roles.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';
import { LdapGroup } from "@models/ldap-group.model";

@Component({
  selector: 'app-ldap-form',
  templateUrl: './ldap-form.component.html',
  providers: [ ValidationService ]
})
export class LdapFormComponent implements OnInit, OnChanges {
  @Output() ldapGroupSubmited = new EventEmitter<LdapGroup | null>();
  @Input() ldapGroupEdit!: LdapGroup | null;

  @ViewChild('viewForm')
  viewForm!: NgForm;

  ldapGroupForm = this.fb.group({
    id: [null],
    ldapId: ['',Validators.required],
    name: ['',Validators.required],
  });

  ldapGroups: LdapGroup[] = [];
  filterLdapGroups: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RolesService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
    ) { }

  ngOnInit(): void {
   this.ldapGroups = this.route.snapshot.data["data"]["ldapGroups"];
   this.validationService.form = this.ldapGroupForm;
   this.modifyLdapIdValidators();
  }

  ngOnChanges(): void {
    if(this.ldapGroupEdit){
      this.modifyLdapIdValidators(this.ldapGroupEdit.ldapId);
      this.ldapGroupForm.reset(this.ldapGroupEdit);
    }else{
      this.ldapGroupForm.reset();
      this.modifyLdapIdValidators();
    }
  }

  filterItems({query}: any){
    if(this.ldapGroupEdit){
      this.filterLdapGroups = [];
      return;
    }
    this.filterLdapGroups = this.ldapGroups
      .map(ldapGroup=> ldapGroup.ldapId)
      .filter(ldapId=>ldapId.toLowerCase().includes(query.toLowerCase())
      && !this.roleService.ldapGroupsFormSelected.some(selectedLdap=> selectedLdap.ldapId === ldapId));
  }

  selectItem(ldapId: string){
    if(this.ldapGroupEdit){
      return;
    }
    const ldapGroup = this.ldapGroups.find(ldapGroup=>ldapGroup.ldapId===ldapId)!;
    this.ldapGroupForm.reset(ldapGroup);
    this.viewForm.ngSubmit.emit();
  }

  public submitForm(cancel: boolean){
    this.ldapGroupSubmited.emit(cancel ? null : {...this.ldapGroupForm.value});
    this.ldapGroupForm.reset();
    this.ldapGroupEdit = null;

  }

  cancelEdit(){
    this.submitForm(true);
  }

  submit(){
    this.submitForm(false);
  }

  modifyLdapIdValidators(except: string | null = null){
    this.ldapGroupForm.get('ldapId')?.clearValidators();
    this.ldapGroupForm.get('ldapId')?.addValidators([Validators.required,this.validatorService.isLdapGroupAlreadySelected(this.ldapGroups, except)]);
    this.ldapGroupForm.get('ldapId')?.updateValueAndValidity();
  }
}
