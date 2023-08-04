//id: '66202 ', positionMaterial: 'Color  2', positionMaterialId: '66202 ', category: 'COLCC ', material: '50101047
import { createAction, props } from '@ngrx/store';
import { Material } from 'src/app/models/material.interfaces';


export const loadtest = createAction(
    '[Material List] Cargando',
);

export const addMAterial = createAction(
  '[Material Add List] Add Material',
  props<{ materials: Material[] }>()
);
 
export const deteleMaterial = createAction(
  '[Material Delete] Delete Material',
  props<{ ID: number }>()
);