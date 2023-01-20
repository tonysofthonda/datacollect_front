import { ServiceType } from "./service-type.model";

export interface OperationCode {
    id?: number;
    code: string;
    description: string;
    serviceTypes: ServiceType[];
}

export interface OperationCodeTable extends OperationCode {
  serviceTypesNames: string;
}

export const castToOperationCodeTable = (operationCode: OperationCode): OperationCodeTable => ({
  ...operationCode,
  serviceTypesNames: operationCode.serviceTypes.map(serviceType=>serviceType.name).join(", ")
});
