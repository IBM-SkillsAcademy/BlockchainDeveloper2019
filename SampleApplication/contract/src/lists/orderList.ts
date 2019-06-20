import { StateList } from '../ledger-api/statelist';
import { Order } from '../assets/order';
import {  VehicleContext } from "../utils/vehicleContext";
import { IState } from '../ledger-api/state';

export class OrderList <T extends Order> extends StateList<T>{

     
    constructor(ctx:VehicleContext, validTypes: Array<IState<T>>) {
       
        super(ctx,"org.vehiclelifecycle.order");
        this.use(...validTypes);
       
    }
    async addOrder(order:T) {
        return this.add(order)
    }

  async getOrder(orderKey) {
   return this.get(orderKey);
   }

  async updateOrder(order) {
      return this.update(order);
    }
}