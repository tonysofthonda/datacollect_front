import { Observable } from "rxjs";

export interface OnUnsavedChanges{
  beforeUnload: ()=> boolean | Observable<boolean>;
}
