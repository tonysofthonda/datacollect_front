import { Status } from "@enums/status.enum";
import { Dealer } from "./dealer.model";

export interface DealerGroup {
  id?: number;
  name: string;
  status?: Status;
  dealers: Dealer[]
}
