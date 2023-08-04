import { ActionReducer, ActionReducerMap } from "@ngrx/store";
import { Material } from "../models/material.interfaces";
import { MaterialReducer } from "./reducers/materials.reducer";
import { SampleReducer } from "./reducers/sample.reducer";
import { MaterialState } from "./stateModels/materials.state";
import { SampleState } from "./stateModels/sample.state";

export interface AppState{
    listmaterials : MaterialState;
    listsample:SampleState
}

export const ROOT_REDUCERS:ActionReducerMap<AppState>={
    listmaterials: MaterialReducer,
    listsample:SampleReducer
}