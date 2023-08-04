export class RequestDto {
  constructor(
    public documentId: number = 0,
    public requestStatusId: number = 0,
    public requestStatusName: string = "",
    public requestDate: string = "",
    public closedDate: string = "",
    public answer: string = "",
    public thirdPartyId: string = "",
    public customerName: string = "",
    public countryId: string = "",
    public countryName: string = "",
    public address: string = "",
    public phone1: string = "",
    public phone2: string = "",
    public email: string = "",
    public businessName: string = "",
    public CreationDate: string = "",
    public requestTypeId: string = "",
    public requestTypeName: string = "",
    public purchaseOrderId: string = "",
    public billDocumentId: string = "",
    public notes: string = "",
    public fileName: string = "",
    public fileUrl: string = "",
  ) { }
}


export class PlanActionDto {
  constructor(
    public documentId: number = 0,
    public description: string = "",
    public nameAttachment: string = "",
    public actionDate: string = "",
    public closingDate: string = "",
    
  ) { }
}