import { Object as ContractObject } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

@ContractObject()
// Price Asset
export class Price extends State {

    public static fromBuffer(buffer) {
        return Price.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    public static deserialize(data) {
        return State.deserializeClass(data, Price);
    }
    public static getClass() {
        return 'org.vehiclelifecycle.price';
    }

    public static createInstance(vehicleNumber, price) {
        return new Price({ vehicleNumber, price});
    }

    public vehicleNumber: string;
    public price: number;

    constructor(obj) {
        super(Price.getClass(), [obj.vehicleNumber]);
        Object.assign(this, obj);
    }

    public toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }
}