export interface Sample {
  companyId: number;
  sampleId: number;
  formNumber: number;
  purchaseNumber: string;
  plantId: number;
  customerId: number;
  storeHouseId: number;
  productId: string;
  sampleQuantity: number;
  placementDate: Date;
  requestDate: Date;
  sampleModifiedDate: Date;
  sampleApprovalTypeId: number;
  samplePendingToPrint: string;
  samplesNotes: string;
  fulfilledBy: string;
}
