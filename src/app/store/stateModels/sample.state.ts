import { Sample } from "src/app/models/sample.interfaces";

export class SampleState{
    sample: Readonly<Sample>;
    constructor(){
        this.sample = null;
    }
}