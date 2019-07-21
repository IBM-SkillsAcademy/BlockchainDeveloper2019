import { Price } from '../assets/price';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class PriceList <T extends Price> extends StateList<T> {

    /**
     * create a new price list object
     * @param {VehicleContext} ctx fabric context for vehicle chaincode
     * @param {Array<IState<T>>} validTypes array of valid types of object
     */
    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {
        // create a statelist with price object class name
        super(ctx, 'org.vehiclelifecycle.price');
        // put price class as supported class
        this.use(...validTypes);
    }

    /**
     * *** Exercise 06 > Part 3 > Step 5 ***
     * add or update price object to the ledger and private data collection
     * @param price the price object
     */
    public async updatePrice(price: T) {
        // calling updatePrivate function of the statelist class with collection name and object as input
        return this.updatePrivate(price);
    }

    /**
     * *** Exercise 06 > 3 Part > Step 5 ***
     * get price object
     * @param vehicleNumber the vehicle key number
     */
    public async getPrice(vehicleNumber) {
        // calling getPrivate function of the statelist class with collection name and object as input
        return this.getPrivate(vehicleNumber);
    }
}
