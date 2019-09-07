// vehicleContext
import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../assets/order';
import { Vehicle } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { VehicleList } from '../lists/vehicleList';
/**
 * *** Exercise 2 > Part 4 ***
 */

/*
Import the policy and policy list class to the vehicle context to allow the
smart contract application to recognize and interact with the policy asset.
*/
// import { Policy } from '../assets/policy';
// import { PolicyList } from '../lists/policyList';

/* Custom Context that extend chain code Context class
 Used to define
A smart contract transaction context allows smart contracts to define and maintain user variables across transaction invocations
https://hyperledger-fabric.readthedocs.io/en/latest/developapps/transactioncontext.html
*/
export class VehicleContext extends Context {
    private orderList: OrderList<Order>;
    private vehicleList: VehicleList<Vehicle>;
    // Define policyList as list of policy objects
    // private policyList: PolicyList<Policy>;
    constructor() {
        super();
        this.orderList = new OrderList(this, [Order]);
        this.vehicleList = new VehicleList(this, [Vehicle]);
        // Create policy list upon context class construction
        // this.policyList = new PolicyList(this, [Policy]);
    }

    public getOrderList() {
        return this.orderList;
    }
    public getVehicleList(): VehicleList<Vehicle> {
        return this.vehicleList;
    }
    /*
    Helper function to allow the vehicle context to
    retrieve policy list class and interact with its functions
    */
    // public getPolicyList(): PolicyList<Policy> {
        // return this.policyList;
    // }
}
