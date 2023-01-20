import { Component, OnInit } from '@angular/core';
import { Paginated } from '@models/common.model';
import { Role } from '@models/role.model';
import { RolesService } from '@services/roles/roles.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { sortDataTable } from 'src/app/helpers/util';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  providers: [ConfirmationService],
})
export class RolesListComponent implements OnInit {
  private term: string = '';

  public paginatedRoles: Paginated<Role> = {
    result: [],
    currentPage: 0,
    totalPages: 0,
    elementsByPage: 10,
    totalElements: 0,
  };
  public loading: boolean = true;

  constructor(
    private roleService: RolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) { }

  ngOnInit(): void {
  }

  public setTerm(term: string) {
    this.term = term;
    this.getRoles();
  }

  public showRemoveDialog(id: number): void {
    this.confirmationService.confirm({
      header: 'Remove Role',
      message: 'Are you sure you want to delete the record?',
      accept: () => {
        this.roleService.removeRole(id).subscribe(() => {
          this.paginatedRoles.result =
            this.paginatedRoles.result.filter(
              (role) => role.id !== id
            );
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Role Deleted Successfully',
          });
        });
      },
    });
  }

  public loadRoles(event: LazyLoadEvent) {
    const currentPage = event.first! / event.rows!;
    this.getRoles(
      currentPage,
      event.rows,
      event.sortField,
      event.sortOrder
    );
  }

  private getRoles(
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

    const success = (paginatedRoles: Paginated<Role> | Role[]) => {
      this.paginatedRoles = paginatedRoles as Paginated<Role>;
      if (sortField && sortOrder) {
        this.paginatedRoles.result = sortDataTable(
          this.paginatedRoles.result,
          sortField,
          sortOrder
        );
      }
      this.loading = false;
    };

    if (this.term) {
      this.roleService
        .filterRole(this.term, page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    } else {
      this.roleService
        .getRoles(page, elementsByPage)
        .pipe(catchError(error))
        .subscribe(success);
    }
  }
}
