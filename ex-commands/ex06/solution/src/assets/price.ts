import { Object as ContractObject } from 'fabric-contract-api';
import { State } from '../ledger-api/state';

@ContractObject()
// Price asset
export class Price extends State {

    /**
     * Deserialize a state data to price object
     * @param {BUffer} buffer to form back into price object
     */
    public static fromBuffer(buffer) {
        // Call the deserialize function of Price class and return the value
        return Price.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    /**
     * Deserialize a state data to price object
     * @param {Buffer} data to form back into price object
     */
    public static deserialize(data) {
        // Call the deserialize function of state class with price as the class input
        return State.deserializeClass(data, Price);
    }

    /**
     * Unique class name for price object
     */
    public static getClass() {
        return 'org.vehiclelifecycle.price';
    }

    /**
     * Create a new price object instance
     * @param {string} vehicleNumber: The vehicle key number
     * @param {number} value: The price value
     */
    public static createInstance(vehicleNumber, value) {
        return new Price({ vehicleNumber, value});
    }

    public vehicleNumber: string;
    public value: number;

    /**
     * *** Exercise 06 > Part 3 ***
     * Construct a price object from a JSON object
     * @param obj: JSON object to construct to price object
     */
    constructor(obj) {
        // uncomment one of the following line to be able to create a new price object
        super(Price.getClass(), [obj.vehicleNumber]);    // option A
        // super(Price.getClass());                         // option B
        Object.assign(this, obj);
    }

    /**
     * Serialize price object to a buffer array
     */
    public toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }
}
