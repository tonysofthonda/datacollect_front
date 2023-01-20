import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialStateStatusEnum } from '@enums/financial-state-status.enum';
import { Account, AccountValue, FinancialStateAccountValue } from '@models/account.model';
import { FinancialState } from '@models/financial-state.model';
import { AccountService } from '@services/accounts/account.service';
import { FinancialStateFormService } from '@services/financial-state/financial-state-form.service';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, Observable, of } from 'rxjs';
import { getLastFinancialStateStatus } from 'src/app/helpers/util';
import { FinancialStateFormGroup } from '../../models/filter-financial-state-form.model';

@Component({
  templateUrl: './financial-state-form.component.html',
  providers: [ConfirmationService],
  styleUrls: ['./financial-state-form.component.scss']
})
export class FinancialStateFormComponent implements OnInit, OnDestroy{

  financialState!: FinancialState;
  pages!: string[];
  loadingMainAccounts: boolean = true;
  forms: (FinancialStateFormGroup | null)[] = [];
  mainAccountsOfPageSelected: Account[] = [];
  mainAccounts: Account[] = [];
  ignoreUnsavedChanges: boolean = false;
  totalFields: number = 0;

  showRejectForm: boolean = false;
  showObservationsForm: boolean = false;

  get lastStatus(){
    return getLastFinancialStateStatus(this.financialState);
  }

  get areUnsavedChanges(){
    let areUnsavedChanges = false;
    const newValues = new Map(this.castFormsValues(true).map(value=>[value.accountValue.id!, value]));
    const currentValues =  this.financialState.accountValues;
    areUnsavedChanges = currentValues.some(currentValue=>{
      const newValue = newValues.get(currentValue.accountValue.id!);
      if(newValue){
        return newValue.value !== currentValue.value;
      }else{
        return false;
      }
    });
    if(!areUnsavedChanges && newValues.size > currentValues.length){
      areUnsavedChanges = true;
    }
    return areUnsavedChanges;
  }

  get invalidFinancialState(){
    const notAllFieldsRendered = this.forms.map(form=>form?.accountValues || []).flat(1).length < this.totalFields;
    const notAllValuesSaved = this.financialState.accountValues.length < this.totalFields;
    const anyFormInvalid = this.forms.some(form=>form?.form.invalid);
    return anyFormInvalid || (notAllFieldsRendered && notAllValuesSaved) || this.areUnsavedChanges;
  }

  get limitDate(){
    return new Date(new Date(this.financialState.limitDate).getTime() + 86400000);
  }

  constructor(
    private route: ActivatedRoute,
    private financialStateService: FinancialStateService,
    private accountService: AccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private location: Location,
    private fb: FormBuilder,
    public financialStateFormService: FinancialStateFormService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    }

  ngOnInit(): void {
    this.financialState = this.route.snapshot.data["data"]["financialState"];
    this.pages = this.route.snapshot.data["data"]["pages"];
    this.totalFields = this.route.snapshot.data["data"]["totalFields"];
    this.forms = Array(this.pages).map(()=>null);
    this.financialStateFormService.savedValues = this.financialState.accountValues;
    this.financialStateFormService.statuses = this.financialState.statuses;
    this.financialStateFormService.accountErrorsPreviousSelected = this.route.snapshot.data["data"]["accountErrors"];
    this.financialStateFormService.accountErrorsPreviousSelected.forEach((acError)=>{
      this.financialStateFormService.addAccountWithError(acError.accountValue, acError.valueError);
    })
    this.financialStateFormService.clearMainAccountsByPage();
    this.financialStateFormService.clearAccountError();
    this.financialStateFormService.clearsChildrensByAccount();
    this.fetchMainAccounts();
  }

  ngOnDestroy(): void {
    this.financialStateFormService.clearMainAccountsByPage();
    this.financialStateFormService.clearsChildrensByAccount();
    this.financialStateFormService.clearAccountError();
  }

  onFinancialStateChange(financialStateForm: FinancialStateFormGroup){
    const form = this.forms[financialStateForm.indexTab];
    if(form){
      form.form = financialStateForm.form;
      form.accountValues = [...form.accountValues, ...financialStateForm.accountValues].filter((value,index,self)=>index === self.findIndex(val=>value.id === val.id));
      this.forms[financialStateForm.indexTab] = form;
    }else{     
      this.forms[financialStateForm.indexTab] = financialStateForm;
    }
    this.financialStateFormService.forms = this.forms;
    
  }

  //! Returns true if you want to reload the page and false if not
  @HostListener("window:beforeunload")
  beforeUnload(): boolean | Observable<boolean>{
    if(this.ignoreUnsavedChanges){
      return true;
    }
    const reload = this.areUnsavedChanges ? confirm("Hay cambios sin guardar, ¿Deseas salir de la pagina?") : true;

    if(reload){
      this.financialStateFormService.clearMainAccountsByPage();
      this.financialStateFormService.clearsChildrensByAccount();
      this.financialStateFormService.clearAccountError();
    }
    return reload;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 's' && !this.financialStateFormService.loadingSave && !this.financialStateFormService.lockFinancialState) {
          this.handleSave(event, true);
          event.preventDefault();
      }
  }

  handleSave(e: any, dialog: boolean){
    if(!this.areUnsavedChanges && !this.financialStateFormService.lockFinancialState){
      return;
    }

    const saveSubscription = (financialState: FinancialState)=>{
      this.ignoreUnsavedChanges = true;
      this.financialState = financialState;
      this.route.snapshot.data["data"]["financialState"] = financialState;
      this.financialStateFormService.savedValues = this.financialState.accountValues;
      this.financialStateFormService.statuses = this.financialState.statuses;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Estado financiero guardado con exito',
      });
      this.financialStateFormService.loadingSave = false;
    };

    const error = ()=>{
      this.financialStateFormService.loadingSave = false;
      return of();
    };

    if(this.lastStatus?.status.name === FinancialStateStatusEnum.IN_PROGRESS){
      this.financialStateFormService.loadingSave = true;
      this.financialStateService.saveFinancialStateValues(this.castFormsValues(),this.financialState.id!)
      .pipe(catchError(error))
      .subscribe(saveSubscription);
    }else{
      this.confirmationService.confirm({
        target: e.target,
        key: `save-in-progress-${dialog ? '1' : '2'}`,
        message: '¿Estas seguro que deseas continuar? Esto pondra tu estado financiero en status de \'Progreso\'',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        accept: () => {
          this.financialStateFormService.loadingSave = true;
          this.financialStateService.saveFinancialStateValues(this.castFormsValues(),this.financialState.id!)
          .pipe(catchError(error))
          .subscribe(saveSubscription);
        }
      });
    }
  }

  handleSend(e: any){
    if(this.invalidFinancialState){
      return;
    }
    this.financialStateService.sendFinancialState(this.castFormsValues(),this.financialState.id!).subscribe(()=>{
      this.ignoreUnsavedChanges = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Estado financiero enviado con exito',
      });
      this.location.back();
    });
  }

  handleApprove(e: any){
    this.confirmationService.confirm({
      target: e.target,
      key: 'evaluation',
      message: '¿Confirma que desea aprobar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.financialStateService.approveFinancialState(this.financialState.id!).subscribe(()=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Estado financiero aprobado',
          });
          this.location.back();
        });
      }
    });
  }
  handleReject(e: any){
    const noAccountErrorsSelected = this.financialStateFormService.accountErrors.length === 0;
    this.confirmationService.confirm({
      target: e.target,
      key: 'evaluation',
      message: noAccountErrorsSelected ? 'No ha seleccionado ninguna cuenta con error, ¿Confirma que desea rechazar el Estado Financiero?' : '¿Confirma que desea rechazar?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.showRejectForm = true;
      }
    });
  }

  handleObservations(e: any){
    this.showObservationsForm = true;
  }

  async handleChangeTab({ index }: any){
    const page = this.pages[index];
    if(page){
      await this.fetchMainAccounts(page);
    }
  }

  async fetchMainAccounts(page: string = '1'){
    this.loadingMainAccounts = true;
    const storageMainAccounts = await this.financialStateFormService.getMainAccountsByPage(page);
    
    if(storageMainAccounts){
      this.mainAccountsOfPageSelected = storageMainAccounts;
      this.loadingMainAccounts = false;
    }else{
      this.accountService.getMainAccounts(page).subscribe((accounts)=>{
        this.mainAccountsOfPageSelected = accounts;
        this.financialStateFormService.addPageMainAccounts(page,accounts);
        this.mainAccounts = [...this.mainAccounts,...accounts];
        this.loadingMainAccounts = false;
      });
    }
  }

  castFormsValues(zeroValues: boolean = false): FinancialStateAccountValue[] {
    const accountValuesMap = this.getAccountValuesOfForms();
    const formGroups = this.getFormGroupsOfForms()
    ;
    const values: FinancialStateAccountValue[] = [];

    for (const formGroup of formGroups) {
      if(formGroup){
        const valuesId = Object.keys(formGroup.value || {}).filter(key=> zeroValues || formGroup.value[key]);
        valuesId.forEach(id=>values.push({value: formGroup.value[id], accountValue: accountValuesMap.get(id)!, financialState: this.financialState}));
      }
    }
    return values;
  }

  getAccountValuesOfForms(){
    const map = new Map<string, AccountValue>();
    this.forms.flatMap(form=>form?.accountValues || []).forEach(acValue=>map.set(acValue.id!.toString(), acValue));
    return map;
  }

  getFormGroupsOfForms(){
    return this.forms.map(form=>form?.form  || this.fb.group([]));
  }

}
