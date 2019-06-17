import { Vehicle } from "./vehicle";
import { State } from './ledger-api/state';
import { Object as ContractObject, Property } from 'fabric-contract-api';
// Order Status 
export enum  OrderStatus {ISSUED , PENDING , INPROGRESS , DELIVERED};
@ContractObject()
// Order Asset 
export class Order extends State {
    public orderId: string;
    public owner: string;
    public orderStatus: OrderStatus;
    public vehicleDetails: Vehicle;

    constructor(obj) {
        super(Order.getClass(), [obj.owner, obj.orderId]);
        Object.assign(this, obj);
    }

    static fromBuffer(buffer) {
        return Order.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    setIssued()
    {
        this.orderStatus=OrderStatus.ISSUED
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Order);
    }
    static getClass() {
        return 'org.vehiclelifecycle.order';
    }

    static createInstance(orderId, owner, orderStatus, vehicleDetails) {
        return new Order({ orderId, owner, orderStatus, vehicleDetails});
    }
}