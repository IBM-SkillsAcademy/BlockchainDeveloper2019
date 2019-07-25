import { Price } from '../assets/price';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class PriceList <T extends Price> extends StateList<T> {

    /**
     * Create a new price list object
     * @param {VehicleContext} ctx: Fabric context for vehicle chaincode
     * @param {Array<IState<T>>} validTypes: Array of valid types of objects
     */
    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {
        // Create a statelist with price object class name
        super(ctx, 'org.vehiclelifecycle.price');
        // Put price class as supported class
        this.use(...validTypes);
    }

    /**
     * *** Exercise 06 > Part 3 > Step 5 ***
     * Add or update price object to the ledger and private data collection
     * @param {T} price: The price object
     */
    public async updatePrice(price: T) {
        // Call the updatePrivate function of the statelist class with collection name and object as input
        return this.updatePrivate(price, 'collectionVehiclePriceDetails');
    }

    /**
     * *** Exercise 06 > Part 3 > Step 5 ***
     * Get price object
     * @param {string} vehicleNumber: The vehicle key number
     */
    public async getPrice(vehicleNumber) {
        // Call the getPrivate function of the statelist class with collection name and object as input
        return this.getPrivate(vehicleNumber, 'collectionVehiclePriceDetails');
    }
}
