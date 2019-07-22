import { Price } from '../assets/price';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class PriceList <T extends Price> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {
        super(ctx, 'org.vehiclelifecycle.price');
        this.use(...validTypes);
    }
    public async updatePrice(price: T) {
        return this.updatePrice('collectionVehiclePriceDetails', price);
    }

    public async getPrice(priceKey) {
        return this.getPrice('collectionVehiclePriceDetails', priceKey);
    }
}
