import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../assets/order';
import { Vehicle } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { PriceList } from '../lists/priceList';
import { VehicleList } from '../lists/vehicleList';
import { Price } from './../assets/price';
// Import the policy and policy list class to the vehicle context
import { Policy } from '../assets/policy';
import { PolicyList } from '../lists/policyList';

/* Custom Context that extend chain code Context class
 Used to define
A smart contract transaction context allows smart contracts to define and maintain user variables across transaction invocations
https://hyperledger-fabric.readthedocs.io/en/latest/developapps/transactioncontext.html
*/
export class VehicleContext extends Context {
    private orderList: OrderList<Order>;
    private priceList: PriceList<Price>;
    private vehicleList: VehicleList<Vehicle>;
    // Define policyList as list of policy objects
    private policyList: PolicyList<Policy>; //add
    constructor() {
        super();
        this.orderList = new OrderList(this, [Order]);
        this.vehicleList = new VehicleList(this, [Vehicle]);
        this.priceList = new PriceList(this, [Price]);
        // Create policy
        this.policyList = new PolicyList(this, [Policy]);
    }

    public getOrderList() {
        return this.orderList;
    }
    public getVehicleList() {
        return this.vehicleList;
    }
    public getPriceList() {
        return this.priceList;
    }
    // Define the getPolicyList helper function
    public getPolicyList() {
        return this.policyList;
    }
}
