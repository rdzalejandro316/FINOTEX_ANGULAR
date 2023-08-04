export interface Permisos {
  design?: Design[];
  sales?: Design[];
  control?: Design[];
}

export interface Design {
  'identification-data'?: Identificationdatum[];
  'image-settings'?: Identificationdatum[];
  'inventory-tweaks'?: Identificationdatum[];
}

export interface Identificationdatum {
  components: string;
  status: boolean;
}