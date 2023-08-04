import { Material } from "src/app/models/material.interfaces";

export class MaterialState{
    materials: ReadonlyArray<Material>;
    constructor(){
        this.materials = null;
    }
}