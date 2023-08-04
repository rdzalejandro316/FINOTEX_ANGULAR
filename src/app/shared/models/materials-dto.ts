export interface MaterialsDto {
    id: string;
    positionMaterial: string;
    positionMaterialId: string;
    category: string;
    material: string;
    listMaterials: any[];
    nameItem: string;
    pick_hilo: string;
    description: string;
    color: string;
    print_run_by_color: string;
    print: string;
    specialty: string;
    border: string;
    base: string;
    standard_quantity?: any;
    real_quantity?: any;
    unit_code?: any;
    formula: string;
    formula_quantity?: any;
    categorydefault: string;
    isPositionNumberOfColors: string;
    lineId: number;
}