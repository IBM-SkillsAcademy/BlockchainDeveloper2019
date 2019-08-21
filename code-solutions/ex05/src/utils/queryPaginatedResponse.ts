mport { State } from '../ledger-api/state';
// Query response as a container for query results with pagination option
/*
The container defines attributes for fetched record count and bookmark
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
