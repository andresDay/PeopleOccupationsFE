import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { OperatorFunction } from "rxjs";

export interface SortArgs {
    sortBy: string;
    sortCardinality: CardinalityEnum;
}

export enum CardinalityEnum {
    "asc", "desc", "noSort"
}