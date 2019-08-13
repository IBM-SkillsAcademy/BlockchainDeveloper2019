import { Vehicle } from '../assets/vehicle';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class VehicleList <T extends Vehicle> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.vehicle');
        this.use(...validTypes);

    }
    public async addVehicle(vehicle: T) {
        return this.add(vehicle);
    }

    public async getVehicle(vehicle) {
        return this.get(vehicle);
    }

    public async updateVehicle(vehicle) {
        return this.update(vehicle);
    }

}
