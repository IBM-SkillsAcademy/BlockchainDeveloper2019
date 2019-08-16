import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../assets/order';
import { Vehicle } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { PriceList } from '../lists/priceList';
import { VehicleList } from '../lists/vehicleList';
import { Price } from './../assets/price';
/**
 * *** Exercise 02 > Part 4 ***
 */

/*
Import the policy and policy list class to the vehicle context to allow the
smart contract application to recognize and interact with the policy asset.
*/
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
    private policyList: PolicyList<Policy>;
    constructor() {
        super();

        this.orderList = new OrderList(this, [Order]);
        this.vehicleList = new VehicleList(this, [Vehicle]);
        this.priceList = new PriceList(this, [Price]);
        // Create policy list upon context class construction
        this.policyList = new PolicyList(this, [Policy]);
    }

    public getOrderList(): OrderList<Order> {
        return this.orderList;
    }
    /*
    Helper function to allow the vehicle context to
    retrieve policy list class and interact with its functions
    */
    public getPolicyList(): PolicyList<Policy> {
        return this.policyList;
    }

    public getVehicleList(): VehicleList<Vehicle> {
        return this.vehicleList;
    }
    public getPriceList(): PriceList<Price> {
        return this.priceList;
    }
}
