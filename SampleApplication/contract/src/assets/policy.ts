/**
 * *** Exercise 2 > Part 4 > Step 2 ***
 */

/*
The following import statements imports the contract object module
from the fabric-contract-api node sdk and the state class from the
state definition file.
The state object contains the set of function to allow the smart
contract application to interact with the policy asset within the
ledger application
*/
// import { Object as ContractObject } from 'fabric-contract-api';
// import { State } from '../ledger-api/state';
/*
Policy type and policy status enum objects. The first will enumerate
the insurance policy type, and the latter will enumerate the insurance
policy status for the policy asset.
*/
// export enum PolicyType {
//     THIRD_PARTY = 'THIRD_PARTY',
//     FIRE_AND_THEFT = 'FIRE_AND_THEFT',
//     FULLY_COMPREHENSIVE = 'FULLY_COMPREHENSIVE',
// }

// export enum PolicyStatus {
//     REQUESTED = 'REQUESTED',
//     ISSUED = 'ISSUED',
// }

/*
The "@ContractObject" modifier flags the policy class as an "object",
or an asset within the smart contract applications. The policy class
extends the state class, allowing the policy class to have access to
the set of business object functions and properties, such as the
generation of a composite key, the serialization or deserialization of
object into buffers, etc.
*/
// @ContractObject()
// export class Policy extends State {
    /**
     * 
     * @param { id } policy ID
     * @param { vehicleNumber } vehicle number
     * @param { insurerId } insurer ID
     * @param { holderId } insurance holder ID
     * @param { policyType } insurance policy enum type
     * @param { startDate } insurance policy start date
     * @param { endDate } insurance policy end date
     */
    // public  static createInstance( id: string,
    //                                vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
    //                                startDate: number, endDate: number) {
        /*
        The function accepts the supplied parameters, sets status to "REQUESTED", and returns a new in-
        memory representation of a Policy state.
        */
    //     const status = PolicyStatus.REQUESTED;
    //     return new Policy({id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate, status});
    // }

    // Helper function to get the namespace of the policy asset.
    // public static getClass() {
    //     return 'org.vehiclelifecycle.Policy';
    // }

    // Datatypes and access properties for each of the parameters that the policy asset has.
    // public readonly vehicleNumber: string;

    // public readonly startDate: number;

    // public readonly endDate: number;

    // public readonly insurerId: string;

    // public readonly holderId: string;

    // public status: PolicyStatus;

    // private policyType: PolicyType;
    /*
    Within the constructor function, the policy class creates a key (which is the policy id) when
    the policy object is created, this key will be used when accessing the ledger.
    */
    // constructor(obj) {
    //     super(Policy.getClass(), [obj.id]);
    //     Object.assign(this, obj);
    // }
    // Returns a buffer representation of the policy JSON object.
    // public toBuffer() {
    //     return Buffer.from(JSON.stringify(this));
    // }
// }