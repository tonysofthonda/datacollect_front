import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LdapGroup } from '@models/ldap-group.model';
import { Position } from '@models/position.model';
import { DealerFacilitiesService } from '@services/dealer-facilities/dealer-facilities.service';
import { DealerGroupsService } from '@services/dealer-groups/dealer-groups.service';
import { DealersService } from '@services/dealers/dealers.service';
import { LdapGroupsService } from '@services/ldap-groups/ldap-groups.service';
import { ModelsService } from '@services/model-cars/models.service';
import { PositionService } from '@services/position-service/position.service';
import { RolesService } from '@services/roles/roles.service';
import { catchError, map, Observable, of } from 'rxjs';
import { OrdersTypesService } from '../orders-types/orders-types.service';
import {emailPattern, alphaNumericPattern, alphabeticPattern, rfcPattern, accountValuePattern, alphabeticPattern2, codigoPostall} from "@regex";
@Injectable({
  providedIn: 'root',
})
export class ValidatorService {

  constructor(
    private dealerGroupService: DealerGroupsService,
    private ordersTypesService: OrdersTypesService,
    private modelService: ModelsService,
    private dealersService: DealersService,
    private dealerFacilityService: DealerFacilitiesService,
    private roleService: RolesService,
    private ldapGroupService: LdapGroupsService,
    private positionService: PositionService
  ) {}

  //Custom Validators

  isEmail(required: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      const valid = emailPattern.test(control.value);
      return !valid ? { invalidEmail: { value: control.value } } : null;
    };
  }

  isAlphabetic(required: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      console.log(alphabeticPattern.test(control.value))
      const valid = alphabeticPattern.test(control.value);
      return !valid ? { notAlphabetic: { value: control.value } } : null;
    };
  }

  isAlphabetic2(required: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      console.log(alphabeticPattern2.test(control.value))
      const valid = alphabeticPattern2.test(control.value);
      return !valid ? { notAlphabetic: { value: control.value } } : null;
    };
  }

  
  codigoPostal(required: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      console.log(codigoPostall.test(control.value))
      const valid = codigoPostall.test(control.value);
      return !valid ? { notAlphabetic: { value: control.value } } : null;
    };
  }




  isAlphanumeric(required: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      const valid = alphaNumericPattern.test(control.value);
      return !valid ? { notAlphanumeric: { value: control.value } } : null;
    };
  }

  isRfc(required:boolean = true): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      const valid = rfcPattern.test(control.value);
      return !valid ? { notRfc: { value: control.value } } : null;
    };
  }

  isLdapGroupAlreadySelected(existingLdapGroups: LdapGroup[], except: string | null = null): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const find = (ldapGroup: LdapGroup) => ldapGroup.ldapId === control.value;
      const isSelected = this.roleService.ldapGroupsFormSelected.find(find)
      const alreadyExists = existingLdapGroups.find(find);
      if(except === isSelected?.ldapId){
        return null;
      }
      return isSelected || alreadyExists ? { ldapGroupAlreadySelected: { value: control.value } } : null;
    };
  }

  isPositionAlreadySelected(existingPositions: Position[],except: string | null = null): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const find = (position: Position)=>position.jobId === control.value;
      const isSelected = this.roleService.positionsFormSelected.find(find);
      const alreadyExists = existingPositions.find(find);
      if(except === isSelected?.jobId){
        return null;
      }
      return isSelected || alreadyExists ? { positionAlreadySelected: { value: control.value } } : null;
    };
  }

  isAccountValue(required:boolean = true): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      if (!required && !control.value) {
        return null;
      }
      const valid = accountValuePattern.test(control.value);
      return !valid ? { accountValueInvalid: { value: control.value } } : null;
    };
  }

  //Custom Async Validators

  dealerGroupNameUnique(except: string | null = null): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.dealerGroupService
        .getDealerGroupByName(control.value)
        .pipe(
          map((orderType) => (orderType ? { dealerGroupExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  orderTypeCodeUnique(except: string | null = null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.ordersTypesService
        .getOrderTypeByCode(control.value)
        .pipe(
          map((orderType) => (orderType ? { orderTypeExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  modelUnique(
    except: { code: string; year: number } | null = null
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const codeControl: AbstractControl | null = control.get('code');
      const yearControl: AbstractControl | null = control.get('year');
      if (!codeControl || !yearControl) {
        throw new Error(
          "This control requires fields with names 'code' and 'year' are required in the form"
        );
      }
      const returnValue = this.modelService
        .getModelByCodeAndYear(codeControl?.value, yearControl?.value)
        .pipe(
          map((model) => (model ? { modelExists: true } : null)),
          catchError(() => of(null))
        );
      if (except) {
        const { code, year } = except;
        if (code != codeControl?.value || year != parseInt(yearControl?.value)) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  dealerNumberUnique(except: string | null = null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.dealersService
        .getDealerByNumber(control.value)
        .pipe(
          map((dealer) => (dealer ? { dealerNumberExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  dealerNameUnique(except: string | null = null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.dealersService
        .getDealerByName(control.value)
        .pipe(
          map((dealer) => (dealer ? { dealerNameExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  dealerFacilityUnique(dealerId: number, except: number | null = null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.dealerFacilityService
        .getDealerFacility(dealerId, control.value.id)
        .pipe(
          map((dealerFacility) => (dealerFacility ? { dealerFacilityExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value.id) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  roleNameUnique(except: string | null = null): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.roleService
        .getRoleByName(control.value)
        .pipe(
          map((role) => (role ? { roleNameExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  ldapIdUnique(except: string | null = null): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.ldapGroupService
        .getLdapGroupByLdapId(control.value)
        .pipe(
          map((ldapGroup) => (ldapGroup ? { ldapIdExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }

  positionJobIdUnique(except: string | null = null): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const returnValue = this.positionService
        .getPositionByJobId(control.value)
        .pipe(
          map((position) => (position ? { jobIdExists: true } : null)),
          catchError(() => of(null))
        );

      if (except) {
        if (except != control.value) {
          return returnValue;
        } else {
          return of(null);
        }
      } else {
        return returnValue;
      }
    };
  }
}
