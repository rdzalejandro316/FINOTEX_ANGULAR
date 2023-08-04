import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class SortService {
    constructor() { }
    private columnSortedSource = new Subject<ColumnSortedEvent>();
    columnSorted$ = this.columnSortedSource.asObservable();
    columnSorted(event: ColumnSortedEvent) {
        this.columnSortedSource.next(event);
    }

    sortList(criteria: ColumnSortedEvent, listOrder: Array<Object>): any {
        return listOrder.sort((a, b) => {
            if (this.validateIsString(a[criteria.sortColumn]))
            {
                if (criteria.sortDirection === 'desc') {
                    return a[criteria.sortColumn].toLowerCase() < b[criteria.sortColumn].toLowerCase() ? 1 :
                        (a[criteria.sortColumn].toLowerCase() === b[criteria.sortColumn].toLowerCase()) ? 0 : -1;
                }
                else {
                    return a[criteria.sortColumn].toLowerCase() > b[criteria.sortColumn].toLowerCase() ? 1 :
                        (a[criteria.sortColumn].toLowerCase() === b[criteria.sortColumn].toLowerCase()) ? 0 : -1;
                }             
            }
            else{
                if (criteria.sortDirection === 'desc') {
                    return a[criteria.sortColumn] < b[criteria.sortColumn] ? 1 :
                        (a[criteria.sortColumn] === b[criteria.sortColumn]) ? 0 : -1;
                }
                else {
                    return a[criteria.sortColumn] > b[criteria.sortColumn] ? 1 :
                        (a[criteria.sortColumn] === b[criteria.sortColumn]) ? 0 : -1;
                }
            }
        });
    }

    validateIsString(myVar : any) : boolean{
        return (typeof myVar === 'string');
    }
}

export interface ColumnSortedEvent {
    sortColumn: string;
    sortDirection: string;
}