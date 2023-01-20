import { LdapGroup } from "./ldap-group.model";
import { Position } from "./position.model";
import { ViewAction } from "./view.model";

export interface Role{
  id?: number;
  name: string;
  description: string;
  positions: Position[];
  ldapGroups: LdapGroup[],
  permissions: ViewAction[]
}
