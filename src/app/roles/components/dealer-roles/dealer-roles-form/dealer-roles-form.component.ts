import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Position } from '@models/position.model';
import { RolesService } from '@services/roles/roles.service';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';

@Component({
  selector: 'app-dealer-roles-form',
  templateUrl: './dealer-roles-form.component.html',
  providers: [ ValidationService ]
})
export class DealerRolesFormComponent implements OnInit {
  @Output() positionSubmited = new EventEmitter<Position | null>();
  @Input() positionEdit!: Position | null;

  @ViewChild('viewForm')
  viewForm!: NgForm;

  positionForm = this.fb.group({
    id: [null],
    jobId: ['',Validators.required],
    name: ['',Validators.required],
  });

  positions: Position[] = [];
  filterPositions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RolesService,
    private validatorService: ValidatorService,
    public validationService: ValidationService
  ) { }

  ngOnInit(): void {
    this.positions = this.route.snapshot.data["data"]["positions"];
    this.validationService.form = this.positionForm;
    this.modifyJobIdValidators();
  }

  ngOnChanges(): void {
    if(this.positionEdit){
      this.modifyJobIdValidators(this.positionEdit.jobId);
      this.positionForm.reset(this.positionEdit);
    }else{
      this.positionForm.reset();
      this.modifyJobIdValidators();
    }
  }

  filterItems({query}: any){
    if(this.positionEdit){
      this.filterPositions = [];
      return;
    }
    this.filterPositions = this.positions
      .map(position => position.jobId)
      .filter(jobId=>jobId.toLowerCase().includes(query.toLowerCase())
      && !this.roleService.positionsFormSelected.some(selectedPosition=> selectedPosition.jobId === jobId));
  }

  selectItem(jobId: string){
    if(this.positionEdit){
      return;
    }
    const position = this.positions.find(position=>position.jobId===jobId)!;
    this.positionForm.reset(position);
    this.viewForm.ngSubmit.emit();
  }

  public submitForm(cancel: boolean){
    this.positionSubmited.emit(cancel ? null : {...this.positionForm.value});
    this.positionForm.reset();
    this.positionEdit = null;

  }

  cancelEdit(){
    this.submitForm(true);
  }

  submit(){
    this.submitForm(false);
  }

  modifyJobIdValidators(except: string | null = null){
    this.positionForm.get('jobId')?.clearValidators();
    this.positionForm.get('jobId')?.addValidators([Validators.required,this.validatorService.isPositionAlreadySelected(this.positions,except)]);
    this.positionForm.get('jobId')?.updateValueAndValidity();
  }
}
