import { Object as ContractObject } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

export enum PolicyType {
    THIRD_PARTY = 'THIRD_PARTY',
    FIRE_AND_THEFT = 'FIRE_AND_THEFT',
    FULLY_COMPREHENSIVE = 'FULLY_COMPREHENSIVE',
}

export enum PolicyStatus {
    REQUESTED = 'REQUESTED',
    ISSUED = 'ISSUED',
}

@ContractObject()
export class Policy extends State {
    // public  static createInstance( id: string,
    //                                vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
    //                                startDate: number, endDate: number) {
    //     const status = PolicyStatus.REQUESTED;
    //     return new Policy({id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate, status});
    // }

    public static getClass() {
        return 'org.vehiclelifecycle.Policy';
    }

    public readonly vehicleNumber: string;

    public readonly startDate: number;

    public readonly endDate: number;

    public readonly insurerId: string;

    public readonly holderId: string;

    public status: PolicyStatus;

    private policyType: PolicyType;

    // constructor(obj) {
    //     super(Policy.getClass(), [obj.id]);
    //     Object.assign(this, obj);

    // }
    // public toBuffer() {
    //     return Buffer.from(JSON.stringify(this));
    // }
}