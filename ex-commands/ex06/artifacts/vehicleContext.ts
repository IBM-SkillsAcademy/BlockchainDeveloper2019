import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../assets/order;
import { Vehicle } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { PriceList } from '../lists/priceList';
import { VehicleList } from '../lists/vehicleList';
import { Price } from './../assets/price';
/**
 * *** Exercise 02 > Part 4 > Step 6 ***
 */

/*
Import the policy and policy list class into the vehicle context to allow the
smart contract application to recognize and interact with the policy asset.
*/
import { Policy } from '../assets/policy';
import { PolicyList } from '../lists/policyList';

/* Custom Context that extends the chain code Context class
 Used to define a smart contract transaction context that allows smart contracts
 to define and maintain user variables across transaction invocations.
https://hyperledger-fabric.readthedocs.io/en/latest/developapps/transactioncontext.html
*/
export class VehicleContext extends Context {
    private orderList: OrderList<Order>;
    private priceList: PriceList<Price>;
    private vehicleList: VehicleList<Vehicle>;
    // Define policyList as a list of policy objects
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
