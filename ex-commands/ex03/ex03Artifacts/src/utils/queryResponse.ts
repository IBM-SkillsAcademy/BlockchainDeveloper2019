import { Object as ContractObject, Property } from 'fabric-contract-api';


// Query Response as container for Query result 
export class QueryResponse 
{
    @Property()
    public timestamp: number;
    @Property()
    public txId: string;
    key : string;
    record : string;
    

}