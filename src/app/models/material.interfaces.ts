export class Material {
  id?: string;
  positionMaterial?: string;
  positionMaterialId?: string;
  category?: string;
  material?: string;
  listMaterials?: ListMaterial[];
  nameItem?: string;
  pick_hilo?: string;
  description?: string;
  color?: string;
  print_run_by_color?: string;
  print?: string;
  specialty?: string;
  border?: string;
  base?: string;
  formula?: string;
  categorydefault?: string;
  isPositionNumberOfColors?: string;
  lineId?: number;
}

export class ListMaterial {
  materialId: string;
  productName: string;
  colourName: string;
  unitMeasureId: string;
  materialName: string;
}