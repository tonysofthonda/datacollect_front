import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private localForm!: FormGroup;

  public set form(form: FormGroup) {
    this.localForm = form;
  }

  public fieldInvalid(field: string | AbstractControl): boolean {
    if (typeof field === 'string') {
      return (
        this.localForm.controls[field as string].invalid &&
        this.localForm.controls[field as string].touched
      );
    } else {
      return (field as AbstractControl).invalid && (field as AbstractControl).touched;
    }
  }

  public invalidMessage(
    field: string | AbstractControl,
    fieldName: string = ''
  ): string {
    let errors: any = {};
    let value: any = '';
    if (typeof field === 'string') {
      errors = this.localForm.controls[field as string].errors || {};
      value = this.localForm.controls[field as string].value;
      fieldName = this.fieldToSentenceCase(field as string);
    } else {
      errors = (field as AbstractControl).errors;
      fieldName = fieldName;
      value = (field as AbstractControl).value;
    }
    let message = 'invalid field';
    if (errors['required']) {
      message = `${fieldName} is required`;
    } else if (errors['notAlphabetic']) {
      message = `${fieldName} requires only alphabetic characters`;
    } else if (errors['notAlphanumeric']) {
      message = `${fieldName} requires only alphanumeric characters`;
    } else if (errors['invalidEmail']) {
      message = `${fieldName} requires a valid email`;
    } else if(errors['notRfc']){
      message = `${value} is not a valid RFC`
    } else if(errors['ldapGroupAlreadySelected']){
      message = `${value} is already added or already exists`
    } else if(errors['positionAlreadySelected']){
      message = `${value} is already added or already exists`
    } else if(errors['min']){
      message = `The ${fieldName} does not meet the minimum value`
    } else if(errors['max']){
      message = `The ${fieldName} exceeds the maximum value`
    } else if(errors['minlength']){
      message = `The ${fieldName} does not meet the minimum length`
    } else if(errors['maxlength']){
      message = `The ${fieldName} exceeds the maximum length`
    } else if(errors['dealerGroupExists']){
      message = `A dealer group with this name already exists`
    }else if (errors['orderTypeExists']) {
      message = `A order type with this code already exists`;
    } else if (errors['modelExists']){
      message = `A model with this code and year already exists`;
    } else if(errors['dealerNumberExists']){
      message = `This dealer number already exists `
    } else if(errors['dealerNameExists']){
      message = `This dealer name already exists`
    } else if(errors['dealerFacilityExists']){
      message = `This dealer already have this facility`;
    }else if(errors['roleNameExists']){
      message = `This role name already exists`
    }else if(errors['ldapIdExists']){
      message = `This ldap id already exists`
    }else if(errors['jobIdExists']){
      message = `This job id already exists`
    }else if(errors['accountValueInvalid']){
      message = `Este valor es invalido`
    }
    return message;
  }

  private fieldToSentenceCase(field: string): string {
    const result = field.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }
}
