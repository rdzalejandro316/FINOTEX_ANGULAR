import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { MaterialState } from '../stateModels/materials.state';
import { SampleState } from '../stateModels/sample.state';
 
 
export const selectSample = (state: AppState) => state.listsample;
 
export const selectsample = createSelector(
    selectSample,
    (state: SampleState) => state.sample
);