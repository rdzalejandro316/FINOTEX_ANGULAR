import { SampleDataDto } from "src/app/shared/models/sample-data-dto";

export class SampleState{
    sample: Readonly<SampleDataDto>;
    constructor(){
        this.sample = null;
    }
}
