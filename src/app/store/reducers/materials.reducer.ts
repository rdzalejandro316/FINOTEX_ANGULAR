import { createReducer, on } from '@ngrx/store';
import { Material } from 'src/app/models/material.interfaces';
import { addMAterial, deteleMaterial, loadtest } from '../actions/materials.actions';
import { MaterialState } from '../stateModels/materials.state';


export const initialState = new MaterialState();


export const MaterialReducer = createReducer(
  initialState,
  on(loadtest, (state) => 
  {return state}
  ),
  on(addMAterial, (state,{materials}) => {
    return {...state ,materials}
  }),
  on(deteleMaterial, (state,{ID}) => { 
    let materialctually = state.materials.filter((material) => material.positionMaterial.includes('Color')== true);
    for (let index = 0; index < ID; index++) {
      materialctually.pop();
    }
    return { ...state,materials : materialctually}
  }),
);