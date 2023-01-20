import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@models/role.model';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
  providers: [ ValidationService ]
})
export class GeneralFormComponent implements OnInit {

  @Output()
  roleFormChange = new EventEmitter<FormGroup>();

  roleForm = this.fb.group({
    id: [],
    name: ['', [Validators.required], [this.validatorService.roleNameUnique()]],
    description: ['']
  })

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.validationService.form = this.roleForm;
    this.roleFormChange.emit(this.roleForm);
    this.roleForm.valueChanges.subscribe(()=>{
      this.roleFormChange.emit(this.roleForm);
    })
    const roleEdit: Role = this.route.snapshot.data["data"]["role"];
    if(roleEdit){
      this.roleForm.get('name')?.clearAsyncValidators();
      this.roleForm.get('name')?.addAsyncValidators(this.validatorService.roleNameUnique(roleEdit.name));
      this.roleForm.updateValueAndValidity();
      this.roleForm.reset(roleEdit);
    }
  }
}
