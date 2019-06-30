import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from "../utils/vehicleContext";
import { IState } from '../ledger-api/state';
import { Vehicle } from '../assets/vehicle';

export class VehicleList <T extends Vehicle> extends StateList<T>{

     
    constructor(ctx:VehicleContext, validTypes: Array<IState<T>>) {
       
        super(ctx,"org.vehiclelifecycle.vehicle");
        this.use(...validTypes);
       
    }
    async addVehilce(vehicle:T) {
        return this.add(vehicle)
    }

  async getVehicle(vehicle) {
   return this.get(vehicle);
   }

  async updateVehicle(vehicle) {
      return this.update(vehicle);
    }
}