import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LdapGroup } from '@models/ldap-group.model';
import { Role } from '@models/role.model';
import { RolesService } from '@services/roles/roles.service';

@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
})
export class LdapListComponent implements OnInit, OnChanges {
  @Output() ldapGroupEdit = new EventEmitter<LdapGroup | null>();
  @Input() ldapGroupSubmited!: LdapGroup | null;

  ldapGroupEditEmited!: LdapGroup | null;

  ldapGroupsSelectedUnfiltered: LdapGroup[] = [];

  constructor(private route: ActivatedRoute,public roleService: RolesService) { }

  ngOnInit(): void {
    const role: Role = this.route.snapshot.data["data"]["role"];
    if(role){
      this.roleService.ldapGroupsFormSelected = role.ldapGroups;
    }
  }

  ngOnChanges(): void {
    if(this.ldapGroupSubmited && this.ldapGroupEditEmited) {
      const isSelected = this.roleService.ldapGroupsFormSelected.some(ldapGroup=>ldapGroup.ldapId === this.ldapGroupEditEmited!.ldapId);
      if(isSelected){
        this.roleService.ldapGroupsFormSelected = this.roleService.ldapGroupsFormSelected.map(ldapGroup=>ldapGroup.ldapId === this.ldapGroupEditEmited!.ldapId ? this.ldapGroupSubmited! : ldapGroup);
      }else{
        this.roleService.ldapGroupsFormSelected.push(this.ldapGroupSubmited);
      }
      this.ldapGroupEditEmited = null;
    }else if(this.ldapGroupSubmited){
      this.roleService.ldapGroupsFormSelected.push(this.ldapGroupSubmited);
    }
    this.ldapGroupsSelectedUnfiltered = this.roleService.ldapGroupsFormSelected;
  }

  setTerm(term:string){
    if(term){
      this.roleService.ldapGroupsFormSelected = this.roleService.ldapGroupsFormSelected.filter(ldapGroup=>ldapGroup.ldapId.includes(term)|| ldapGroup.name.includes(term));
    }else{
      this.roleService.ldapGroupsFormSelected = this.ldapGroupsSelectedUnfiltered;
    }
  }

  setLdapGroupEdit(ldapGroup: LdapGroup){
    this.ldapGroupEdit.emit({...ldapGroup});
    this.ldapGroupEditEmited = {...ldapGroup};
  }

  removeLdapGroup(ldapId: string){
    this.roleService.ldapGroupsFormSelected = this.roleService.ldapGroupsFormSelected.filter(ldapGroup=>ldapGroup.ldapId !== ldapId);
  }
}
