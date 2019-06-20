import { State } from '../ledger-api/state';
import { Object as ContractObject, Property } from 'fabric-contract-api';

export enum PolicyType {
    THIRD_PARTY = 0,
    FIRE_AND_THEFT,
    FULLY_COMPREHENSIVE,
}

@ContractObject()
export class Policy extends State {
    public static getClass() {
        return 'org.vehiclelifecycle.Policy';   
     }

   
    public readonly vin: string;

  
    public readonly startDate: number;

    
    public readonly endDate: number;

    public readonly insurerId: string;

 
    public readonly holderId: string;

   
    private policyType: PolicyType;

    constructor(obj) {
        super(Policy.getClass(), [obj.insurerId, obj.holderId]);
        Object.assign(this, obj);

      
    }
   public  static createInstance( id: string,
        vin: string, insurerId: string, holderId: string, policyType: PolicyType,
        startDate: number, endDate: number)
        {
            return new Policy({vin,insurerId,holderId,policyType,startDate,endDate})
        }
        public toBuffer() {
            return Buffer.from(JSON.stringify(this));
        }
}
