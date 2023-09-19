import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { OperatorFunction } from "rxjs";

export interface PaginationArgs {
    pageNumber: number;
    pageSize: number;
} 