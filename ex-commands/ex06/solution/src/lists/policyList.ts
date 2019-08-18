/**
 * *** Exercise 02 > Part 4 ***
 */
// Import policy asset class definition.
import { Policy } from '../assets/policy';
// Import ledger state interface.
import { IState } from '../ledger-api/state';
// Import state list container for the collection of asset's states.
import { StateList } from '../ledger-api/statelist';
// Import the vehicle chaincode context defined in the utils folder.
import {  VehicleContext } from '../utils/vehicleContext';

/*
The policy list class extends an application defined state list class, which
is an abstraction of all list of states that the asset can have.
*/
export class PolicyList <T extends Policy> extends StateList<T> {
    /*
    The constructor function sets the namespace to the policy asset's namespace
    within the smart contract application and is passed the set of functions
    that are defined in the state interface to allow it to access the functions as its own.
    */
    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.policy');
        this.use(...validTypes);

    }

    // Utilitity functions to add policy assets to ledger
    public async addPolicy(order: T) {
        return this.add(order);
    }

    // Utility functions to retrieve policy assets from ledger
    public async getPolicy(orderKey) {
        return this.get(orderKey);
    }
}
