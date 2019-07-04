import { Object as ContractObject, Property } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

export class QueryPaginationResponse  <T extends State>
{

 
    
    public value: T[];
    fetched_records_count :number;
    bookmark:string;
   
    constructor(fetched_records_count: number, bookmark: string) {
        this.fetched_records_count = fetched_records_count;
        this.bookmark = bookmark;
       
    }

    // public serialize(): Buffer {
    //     const obj = Object.assign(this, {value: JSON.parse(this.value.serialize().toString())});

    //     return Buffer.from(JSON.stringify(obj));
    // }
}