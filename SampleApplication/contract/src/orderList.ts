import { StateList } from './ledger-api/statelist';
import { Order } from './order';
import {  VehicleContext } from "./utils/vehicleContext";

export class OrderList <T extends Order> extends StateList<T>{

     
    constructor(ctx:VehicleContext) {
       
        super(ctx,"org.vehiclelifecycle.orderlist");
       
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