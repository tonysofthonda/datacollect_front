import { Component, OnInit } from '@angular/core';
import { Status } from '@enums/status.enum';
import { Paginated } from '@models/common.model';
import { Model } from '@models/model.model';
import { ModelsService } from '@services/model-cars/models.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { InputSwitch } from 'primeng/inputswitch';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  providers: [ConfirmationService],
})
export class ModelsListComponent implements OnInit {
  private term: string = '';

  public paginatedModels: Paginated<Model> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  switchStatus(modelStatus: string): boolean {
    return modelStatus === Status.ENABLED;
  }

  constructor(
    private modelsService: ModelsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  public setTerm(term: string) {
    this.term = term;
    this.getModels();
  }

  public showChangeStatusDialog(
    switchRef: InputSwitch,
    event: any,
    id: number
  ) {
    const previousValue = !event.checked;
    const selectedValue = event.checked;
    const accept = () => {
      this.modelsService
        .editModelStatus(selectedValue, id)
        .subscribe((modelEdited) => {
          this.paginatedModels.result = this.paginatedModels.result.map(
            (model) => {
              if (model.id === modelEdited.id) {
                model = modelEdited;
              }
              return model;
            }
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Model Status Updated Successfully',
          });
        });
    };

    const reject = () => {
      switchRef.writeValue(previousValue);
    };

    if (selectedValue) {
      this.confirmationService.confirm({
        header: 'Enable model',
        message: 'Are you sure you want to enable the record?',
        accept,
        reject,
      });
    } else {
      this.confirmationService.confirm({
        header: 'Disable model',
        message: 'Are you sure you want to disable the record?',
        accept,
        reject,
      });
    }
  }

  public loadModels(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getModels(currentPage, event.rows, event.sortField, event.sortOrder);
  }

  private getModels(
    page: number = 0,
    elementsByPage: number = 10,
    sortField: string | undefined = undefined,
    sortOrder: number | undefined = undefined
  ) {
    this.loading = true;

    const error = () => {
      this.loading = false;
      return of();
    };

    const success = (paginatedModels: Paginated<Model>) => {
      this.paginatedModels = paginatedModels;
      if (sortField && sortOrder) {
        this.paginatedModels.result = sortDataTable(
          this.paginatedModels.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.modelsService
        .filterModel(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.modelsService
        .getModels(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
