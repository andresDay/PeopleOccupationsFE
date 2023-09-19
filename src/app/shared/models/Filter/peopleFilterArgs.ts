
import { PaginationArgs } from "./Generic/paginationArgs";
import { SortArgs } from "./Generic/sortArgs";

export interface PeopleFilterArgs {
    
    sortArgs?: SortArgs;
    paginationArgs?: PaginationArgs;
    
    //filterValues
    nameFilterValue?: string | null;
    ageFilterValue?: number | null;
    hobbyIdFilterValue?: number | null;
    
} 