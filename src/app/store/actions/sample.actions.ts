//id: '66202 ', positionMaterial: 'Color  2', positionMaterialId: '66202 ', category: 'COLCC ', material: '50101047
import { createAction, props } from '@ngrx/store';
import { Sample } from 'src/app/models/sample.interfaces';


export const addSample = createAction(
  '[Sample Add Sampleid] Add Sample',
  props<{ sample: Sample }>()
);
 
export const deteleSamplel = createAction(
  '[Sample Delete] Delete Sample',
  props<{ ID: number }>()
);