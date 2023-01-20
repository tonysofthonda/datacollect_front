import { Role } from "./role.model";

export interface LdapGroup{
  id?: number;
  name: string;
  ldapId: string;
  roles: Role[];
}
