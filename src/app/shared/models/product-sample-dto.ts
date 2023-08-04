export interface Product {
  productId: string;
  sourceProductId: string;
  technicalProductId: string;
  barCode: string;
  productName: string;
  widthId: number;
  numberOfColors: number;
  numberOfAdhesives: number;
  numberOfAccessories: number;
  numberOfPapers: number;
  numberOfColorants: number;
  numberOfAuxiliaries: number;
  numberOfReductive: number;
  commercialLenght: number;
  productionLenght: number;
  warpId: string;
  shapeTypeId: string;
  sizes: string;
  cutId: number;
  adhesiveId: number;
  finishId: number;
  unitMeasureId: string;
  salesUnit: string;
  purchaseUnit: string;
  linealUnit: string;
  storageUnit: string;
  sequenceType: string;
  onlyUsedByCustomer: string;
  abcClassification: string;
  origin: string;
  customerId: number;
  approvedDate: string;
  drawedBy: number;
  drawedDate: string;
  designerId: number;
  designedDate: string;
  rewindingId: number;
  packUnit: string;
  packQuantity: number;
  isCustomerProperty: string;
  locationUpdateDate: string;
  isKit: string;
  isServices: string;
  isFixedAsset: string;
  inspectionMethodId: number;
  inspectionQuantity: number;
  baseQuantityWeight: number;
  weight: number;
  weightUnit: string;
  inventoryStatusId: number;
}
