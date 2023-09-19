import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { OperatorFunction } from "rxjs";
import { Person } from "./person.model";

export interface peopleWithTotalCount {
    peopleModels: Person[];
    totalCount: number;
} 