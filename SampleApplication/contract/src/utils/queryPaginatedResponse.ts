import { State } from '../ledger-api/state';
// Query Response as container for Query result with Pagination option
/*
The container define attributes for fetched rocord count and bookmark
*/

export class QueryPaginationResponse  <T extends State> {
    public value: T[];
    public fetched_records_count: number;
    public bookmark: string;

    constructor(fetched_records_count: number, bookmark: string) {
        this.fetched_records_count = fetched_records_count;
        this.bookmark = bookmark;

    }

}
