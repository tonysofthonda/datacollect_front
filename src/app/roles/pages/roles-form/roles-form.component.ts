import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@models/role.model';
import { RolesService } from '@services/roles/roles.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
})
export class RolesFormComponent implements OnInit {
  id!: number;
  roleForm!: FormGroup | null;
  role!: Role | null;
  constructor(
    private route: ActivatedRoute,
    private roleService: RolesService,
    private location: Location,
    private messageService: MessageService) { }

  ngOnInit(): void {
    const roleEdit: Role = this.route.snapshot.data["data"]["role"];
    if(roleEdit){
      this.role = roleEdit;
    }
  }

  setRoleForm(roleForm: FormGroup){
    this.roleForm = roleForm;
  }

  submit(){
    if (!this.role) {
      this.roleService
        .addRole(this.roleForm?.value)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role saved successfully',
          });
          this.location.back();
        });
    } else {
      this.roleService
        .editRole(this.roleForm?.value, this.role?.id!)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role updated successfully',
          });
          this.location.back();
        });
    }
  }
}
