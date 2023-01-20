import { Status } from '@enums/status.enum';
import { Account } from './account.model';
import { SystemService } from './system-service.model';

export interface Model {
  id?: number;
  code: string;
  brand?: string;
  name?: string;
  year: number;
  assemblyLocation?: string;
  extColorCode?: string;
  extColorName?: string;
  intColorCode?: string;
  description?: string;
  status: Status;
  systemServices: SystemService[];
  account?: Account;
}
