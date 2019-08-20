import { Vehicle } from '../assets/vehicle';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class VehicleList <T extends Vehicle> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.vehicle');
        this.use(...validTypes);

    }
    public async addVehilce(vehicle: T) {
        return this.add(vehicle);
    }

  public async getVehicle(vehicle) {
   return this.get(vehicle);
   }

  public async updateVehicle(vehicle) {
      return this.update(vehicle);
  }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {string} vehicleNumber vehicle number to return history for
     * get history for vehicle as provenance of changes over vehicle
     */
    public async getVehicleHistory(vehicleNumber) {
        // call function defined in statelist.ts
        return this.getHistory(vehicleNumber);
    }
}
