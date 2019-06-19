import { StateList } from './ledger-api/statelist';
import { Order } from './order';
import {  VehicleContext } from "./utils/vehicleContext";
import { IState } from './ledger-api/state';
import { Policy } from './policy';

export class PolicyList <T extends Policy> extends StateList<T>{

     
    constructor(ctx:VehicleContext, validTypes: Array<IState<T>>) {
       
        super(ctx,"org.vehiclelifecycle.policy");
        this.use(...validTypes);
       
    }
    async addPolicy(order:T) {
        return this.add(order)
    }

  async getPolicy(orderKey) {
   return this.get(orderKey);
   }

}