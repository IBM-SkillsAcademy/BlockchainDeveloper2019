import { Order } from '../assets/order';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class OrderList <T extends Order> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.order');
        this.use(...validTypes);

    }
    public async addOrder(order: T) {
        return this.add(order);
    }

  public async getOrder(orderKey) {
   return this.get(orderKey);
   }

  public async updateOrder(order) {
      return this.update(order);
    }

    public async getOrderHistory(orderID)
    {
        return this.getHistory(orderID);
    }
}
