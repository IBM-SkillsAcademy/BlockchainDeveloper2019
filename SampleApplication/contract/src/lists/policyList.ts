import { Order } from '../assets/order';
import { Policy } from '../assets/policies';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class PolicyList <T extends Policy> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.policy');
        this.use(...validTypes);

    }
    public async addPolicy(order: T) {
        return this.add(order);
    }

  public async getPolicy(orderKey) {
   return this.get(orderKey);
   }

}
