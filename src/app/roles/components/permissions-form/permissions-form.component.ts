import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@models/role.model';
import { View, ViewAction } from '@models/view.model';
import { RolesService } from '@services/roles/roles.service';

@Component({
  selector: 'app-permissions-form',
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss']
})
export class PermissionsFormComponent implements OnInit, OnDestroy {

  permissionsForm = this.fb.group({});

  views: View[] = [];

  constructor(
    private route: ActivatedRoute,
    private roleService: RolesService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.views = this.route.snapshot.data["data"]["views"];
    this.views.forEach(view=>{
      this.permissionsForm.addControl(view.name, this.fb.control([]));
    })
    this.permissionsForm.valueChanges.subscribe((values:{[key: string]: ViewAction[]})=>{
      let viewActionsSelected: ViewAction[] = [];
      Object.values(values).forEach((value: ViewAction[])=>{
        viewActionsSelected = [...viewActionsSelected, ...value];
      })
      this.roleService.permissionsFormSelected = viewActionsSelected;
    });
    const role: Role = this.route.snapshot.data["data"]["role"];
    if(role){
     Object.keys(this.permissionsForm.controls).forEach((controlName: string)=>{
        const viewActions: ViewAction[] = [];
        role.permissions.forEach(permission=> {
          if(permission.view.name===controlName){
            const viewAction = this.views.flatMap(view=>view.viewActions).find(action=>action.id===permission.id);
            viewActions.push(viewAction!);
          }
        });
        this.permissionsForm.get(controlName)?.setValue(viewActions);
     })
    }
  }

  ngOnDestroy(): void {
      this.roleService.permissionsFormSelected = [];
  }

}
