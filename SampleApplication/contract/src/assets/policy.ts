import { Object as ContractObject, Property } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

export enum PolicyType {
    THIRD_PARTY = 0,
    FIRE_AND_THEFT,
    FULLY_COMPREHENSIVE,
}

export enum PolicyStatus {
    REQUESTED,
    ISSUED,
}

@ContractObject()
export class Policy extends State {
    public  static createInstance( id: string,
                                   vin: string, insurerId: string, holderId: string, policyType: PolicyType,
                                   startDate: number, endDate: number) {
        const status = PolicyStatus.REQUESTED;
        return new Policy({vin, insurerId, holderId, policyType, startDate, endDate, status});
    }

    public static getClass() {
        return 'org.vehiclelifecycle.Policy';
    }

    public readonly vin: string;

    public readonly startDate: number;

    public readonly endDate: number;

    public readonly insurerId: string;

    public readonly holderId: string;

    public status: PolicyStatus;

    private policyType: PolicyType;

    constructor(obj) {
        super(Policy.getClass(), [obj.id]);
        Object.assign(this, obj);

    }
        public toBuffer() {
            return Buffer.from(JSON.stringify(this));
        }
}
