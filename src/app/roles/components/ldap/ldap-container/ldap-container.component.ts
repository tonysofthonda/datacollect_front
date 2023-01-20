import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LdapGroup } from '@models/ldap-group.model';

@Component({
  selector: 'app-ldap-container',
  templateUrl: './ldap-container.component.html',
})
export class LdapContainerComponent implements OnInit, AfterContentChecked {
  public ldapGroupSubmited!: LdapGroup | null;
  public ldapGroupEdit!: LdapGroup | null;

  constructor(private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  setLdapGroupSubmited(ldapGroup: LdapGroup | null){
    this.ldapGroupSubmited = ldapGroup;
    this.ldapGroupEdit = null;
  }

  setLdapGroupEdit(ldapGroup: LdapGroup | null){
    this.ldapGroupEdit = ldapGroup;
    this.ldapGroupSubmited = null;
  }
}
