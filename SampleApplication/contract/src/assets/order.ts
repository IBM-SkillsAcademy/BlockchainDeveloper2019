import { Object as ContractObject, Property } from 'fabric-contract-api';
import { State } from '../ledger-api/state';
import { Vehicle } from './vehicle';
// Order Status
export enum  OrderStatus {
    ISSUED ="0", 
    PENDING ="1", 
    INPROGRESS ="2", 
    DELIVERED="3"
}

@ContractObject()
// Order Asset
export class Order extends State {

    public orderId: string;
    public owner: string;
    public orderStatus: OrderStatus;
    public vehicleDetails: Vehicle;
    
    public static fromBuffer(buffer) {
        return Order.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    public static deserialize(data) {
        return State.deserializeClass(data, Order);
    }
    public static getClass() {
        return 'org.vehiclelifecycle.order';
    }

    public static createInstance(orderId, owner, orderStatus, vehicleDetails) {
        return new Order({ orderId, owner, orderStatus, vehicleDetails});
    }

 

    constructor(obj) {
        super(Order.getClass(), [obj.orderId]);
        Object.assign(this, obj);
    }

    public toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    public setIssued() {
        this.orderStatus = OrderStatus.ISSUED;
    }
    public isOrderStatus(orderStatus: OrderStatus) {
        console.log(this.orderStatus + ' order status ' + orderStatus + ' ' + (this.orderStatus === orderStatus));
        return this.orderStatus === orderStatus;
    }
}
