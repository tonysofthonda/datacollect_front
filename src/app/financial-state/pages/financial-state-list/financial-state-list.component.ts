import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginated } from '@models/common.model';
import { castToFinancialStateTable, FinancialState, FinancialStateTable } from '@models/financial-state.model';
import { FinancialStateService } from '@services/financial-state/financial-state.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';
import { FilterFinancialStateForm } from '../../models/filter-financial-state-form.model';

@Component({
  selector: 'app-financial-state-list',
  templateUrl: './financial-state-list.component.html',
  providers: [ConfirmationService],
  styleUrls: ['./financial-state-list.component.scss']
})
export class FinancialStateListComponent implements OnInit {

  filterFormValues: FilterFinancialStateForm = {};
  paginatedFinancialStates: Paginated<FinancialStateTable> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  btnExcelDisabled: boolean = false;
  financialStateSelected: FinancialState[] = [];
  loadingPdf: boolean = false;
  public loading: boolean = true;
  public filter: boolean = false;
  public allFinancialStatesSelected: boolean = false;
  public showChangeLimitDateForm: boolean = false;
  file: File;
  @ViewChild('fileUpload') fileUpload: any;

  constructor(
    private financialStateService: FinancialStateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  isSelected(financialState: FinancialState){
    return this.financialStateSelected.some(financialStateSelected => financialStateSelected.id === financialState.id)
  }

  setPageFinancialStatesSelected(event:any){
    if(event.checked){
     this.financialStateSelected = [
       ...this.financialStateSelected,
       ...this.paginatedFinancialStates.result.filter(finState=> !this.isSelected(finState))
     ];
     this.allFinancialStatesSelected = true;
    }else{
     this.financialStateSelected = this.financialStateSelected.filter(finState=> !this.paginatedFinancialStates.result.some(financialState=>financialState.id === finState.id))
     this.allFinancialStatesSelected = false;
    }
   }

  selectFinancialState(newValue: FinancialState[]){
    this.financialStateSelected = newValue;
    this.allFinancialStatesSelected = this.paginatedFinancialStates.result.every(finState=>this.financialStateSelected.some(financialState=>financialState.id === finState.id));
  }

  changeFilterFormValues(values: FilterFinancialStateForm){
    this.filterFormValues = values;
  }

  onFilter(value: boolean){
    this.filter = value;
    this.financialStateSelected = [];
    this.allFinancialStatesSelected = false;
    this.showChangeLimitDateForm = false;
    if(this.filter){
      this.getFinancialStates(0, 10, this.filterFormValues);
    }else{
      this.getFinancialStates();
    }
  }

  onChangeLimitDates(){
    if(this.financialStateSelected.length > 0){
      this.confirmationService.confirm({
        message: '¿Confirmas actualizar fecha limite para los distribuidores seleccionados?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => this.showChangeLimitDateForm = true
      });
    }else {
      this.confirmationService.confirm({
        message: 'No puedes cambiar las fechas si no hay estados financieros marcados',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ok',
        rejectVisible: false
      });
    }
  }

  getFinancialStates(
    page: number = 0,
    elementsByPage: number = 10,
    {dealerGroupId, dealerId, month, year, statusId}: FilterFinancialStateForm = {},
    sortField: string | undefined = undefined,
    sortOrder: number | undefined = undefined,
  ) {
    this.loading = true;

    const error = () => {
      this.loading = false;
      return of();
    };

    const success = (paginatedFinancialStates: Paginated<FinancialState>) => {
      this.paginatedFinancialStates = {
        ...paginatedFinancialStates,
        result: paginatedFinancialStates.result.map(castToFinancialStateTable)
      };
      if (sortField && sortOrder) {
        this.paginatedFinancialStates.result = sortDataTable(
          this.paginatedFinancialStates.result,
          sortField,
          sortOrder
        );
      }
      this.allFinancialStatesSelected = this.paginatedFinancialStates.result.every(finState=>this.financialStateSelected.some(financialState=>financialState.id === finState.id));
      this.loading = false;
    };

    this.financialStateService
        .getFinancialStates(page, elementsByPage, dealerGroupId, dealerId, year, month, statusId)
        .pipe(catchError(error))
        .subscribe(success);
  }


  public loadFinancialStates(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    if(this.filter){
      this.getFinancialStates(currentPage, event.rows, this.filterFormValues, event.sortField, event.sortOrder);
    }else{
      this.getFinancialStates(currentPage, event.rows, {}, event.sortField, event.sortOrder);
    }

  }

  resstartStatusProgress(id: number) {
    const error = () => {
      this.loading = false;
      return of();
    };
    this.financialStateService.restartProgressStatus(id).pipe(catchError(error))
    .subscribe(data => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Se actualizo correctamente el estado',
      });
      this.onFilter(false);
    });
  }


  onFileUploadClicked(event: any, id: any) {
    this.btnExcelDisabled = true;
    this.messageService.add({ severity: 'success', summary: 'Archivo procesando...', detail: 'Success' });
    if (event.files && event.files.length > 0) {
      this.file = event.files[0];
    } else {
      this.btnExcelDisabled = false; 
    }

    if (null != this.file && this.file.size > 0) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('id', id);

      this.financialStateService.uploadFile(formData).subscribe((response) => {
        this.fileUpload.clear();
        this.btnExcelDisabled = false;
        this.messageService.add({ severity: 'success', summary: 'Archivo procesado correctamente', detail: 'Success' });
      });
    } else {
      this.btnExcelDisabled = false; 
      this.messageService.add({ severity: 'error', summary: 'File not exist', detail: 'Error' });
    }
    
  }
 
 onSelectFile(event: any, fileUpload: FileUpload) {
  /**
  if(!(fileUpload.files[0].type === 'xlsx' || fileUpload.files[0].type === 'application/vnd.ms-excel')) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Archivo invalido',
    }); 
    fileUpload.clear();
  }*/
  
  //accept=".xlsx,.csv,.xls"
  //
 }
}
