import { createReducer, on } from '@ngrx/store';
import { Material } from 'src/app/models/material.interfaces';
import { addSample, deteleSamplel } from '../actions/sample.actions';
import { SampleState } from '../stateModels/sample.state';



export const initialState = new SampleState();


export const SampleReducer = createReducer(
  initialState,
  on(addSample, (state,{sample}) => {
    return {...state,sample }
  }),
);