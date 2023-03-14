import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OperationCode } from '@models/operation-code.model';
import { OperationCodeService } from '@services/operation-code/operation-code.service';
import { ValidationService } from '@services/validation/validation.service';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-operation-code-update',
  templateUrl: './operation-code-update.component.html',
})
export class OperationCodeUpdateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public validationService: ValidationService,
    private messageService: MessageService,
    private operationCodeService: OperationCodeService,
    private location: Location,
    public route: ActivatedRoute,
  ) {}

  submited: boolean = false;
  id!: number;

  operationCodeForm = this.fb.group({
    id: [],
    code: ['', [Validators.required, Validators.maxLength(10),  ],
    ],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    serviceTypes: [[], [Validators.required]]
  });

  ngOnInit(): void {
    const operationCodeEdit: OperationCode = this.route.snapshot.data["data"]["operationCode"];
    if (operationCodeEdit) {
      this.id = operationCodeEdit.id!;
      this.operationCodeForm.reset(operationCodeEdit);
      this.operationCodeForm.markAllAsTouched();
    }
    this.validationService.form = this.operationCodeForm;
  }

  submit() {
    this.submited = true;
    if (isNaN(this.id)) {
      this.operationCodeService
        .addOperationCode(this.operationCodeForm.value)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operation code saved successfully',
          });
          this.location.back();
        });
    } else {
      this.operationCodeService
        .updateOperationCode(this.operationCodeForm.value)
        .pipe(catchError(()=>{
          this.submited = false;
          return of();
        }))
        .subscribe(() => {
          this.submited = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Operation code updated successfully',
          });
          this.location.back();
        });
    }
  }
}
