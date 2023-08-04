export class MaterialPositionDTO {
  message: string;
  status: boolean;
  data: Materials[];
  quantity: number;
}

export class Materials {
  lineId: number;
  materialPositionId: string;
  positionName: string;
  materialTypeId: number;
  calculationMethodId: number;
  materialCategoryIdDefault: string;
  ifirstPositionOfSubstrate?: any;
  materialTypeCode: string;
  materialTypeName: string;
  materialExplosionMethod: string;
  unitMeasureId: string;
  isAutomaticPosition: string;
  isAutomaticPositionFromOptions: string;
  isPositionNumberOfColors: string;
  isPositionNumberOfAdhesives: string;
  isPositionNumberOfAccessories: string;
  isPositionNumberOfPapers: string;
  isPositionNumberOfColorants: string;
  isPositionNumberOfAuxiliaries: string;
  isPositionNumberOfReductive: string;
  isPositionNumberOfOther: string;
  isPositionAddedManually: string;
  
}