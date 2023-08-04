import { BillOfMaterial } from "./bill-of-material-dto";
import { CustomerReference } from "./customer-reference-dto";
import { ProductOption } from "./product-option-dto";
import { Product } from "./product-sample-dto";
import { Sample } from "./sample-create-dto";
import { TechnicalData } from "./technical-data-dto";

export interface TechnicalSheets {
  businessId: number;
  language: string;
  product: Product;
  sample: Sample;
  customerReference: CustomerReference;
  billOfMaterial: BillOfMaterial[];
  productOption: ProductOption[];
  technicalData: TechnicalData[];
  createdByUser: string;
  creationDate: string;
  modifiedByUser: string;
  modifiedDate: number;
}

export function createTechnicalSheets() {
  return { } as TechnicalSheets;
}
