export interface BillOfMaterial {
  productId: string;
  materialPositionId: string;
  materialId: string;
  description: string;
  picksByColor: number;
  runByColor: number;
  transferSpecialtyId: number;
  printout: string;
  border: string;
  baseSource: string;
  standarQuantity: number;
  realQuantity: number;
  unitMeasureId: string;
  standarFormula: string;
  quantityStandarFormula: number;
}
