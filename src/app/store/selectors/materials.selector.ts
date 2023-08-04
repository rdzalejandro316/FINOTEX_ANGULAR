import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { MaterialState } from '../stateModels/materials.state';
 
 
export const selectItemsMaterials = (state: AppState) => state.listmaterials;
 
export const selectListMaterials = createSelector(
    selectItemsMaterials,
    (state: MaterialState) => state.materials
);