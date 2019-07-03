
import { Object as ContractObject, Property } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

export enum VinStatus {
    NOVALUE= 'NOVALUE',
    REQUESTED= 'REQUESTED',
    ISSUED= 'REQUESTED',
}

@ContractObject()
export class Vehicle extends State {

    public static createInstance( vin: string , orderId: string , owner: string , model: string , make: string , color: string) {
            return new Vehicle({vin, orderId, owner, model, make, color , docType: 'vehicle', vinStatus: VinStatus.NOVALUE});
        }

    public static getClass() {
        return 'org.vehiclelifecycle.Vehicle';
     }

    public vin: string;
    public vinStatus: VinStatus;
    public docType?: string;
    public color: string;
    public make: string;
    public model: string;
    public owner: string;
    public orderId: string;

    constructor(obj) {
        super(Vehicle.getClass(), [obj.orderId, obj.model]);
        Object.assign(this, obj);

    }
     public toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }
}
