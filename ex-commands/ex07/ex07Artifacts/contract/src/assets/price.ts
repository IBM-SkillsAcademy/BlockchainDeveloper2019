import { Object as ContractObject } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

@ContractObject()
// Price Asset
export class Price extends State {

    /**
     * Deserialize a state data to price object
     * @param {BUffer} buffer to form back into price object
     */
    public static fromBuffer(buffer) {
        // Calling deserialize function of Price class and return the value
        return Price.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    /**
     * Deserialize a state data to price object
     * @param {Buffer} data to form back into price object
     */
    public static deserialize(data) {
        // Calling deserialize function of state class with price as the class input
        return State.deserializeClass(data, Price);
    }

    /**
     * Unique class name for price object
     */
    public static getClass() {
        return 'org.vehiclelifecycle.price';
    }

    /**
     * *** Exercise 06 > Part 3 > Step 3 ***
     * Create a new price object instance
     * @param vehicleNumber the vehicle key number
     * @param price the price value
     */
    public static createInstance(vehicleNumber, price) {
        return new Price({ vehicleNumber, price});
    }

    public vehicleNumber: string;
    public price: number;

    /**
     * Contructing a price object from JSON object
     * @param obj json object to be contructed to price object
     */
    constructor(obj) {
        super(Price.getClass(), [obj.vehicleNumber]);
        Object.assign(this, obj);
    }

    /**
     * Serialize price object to a buffer array
     */
    public toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }
}
