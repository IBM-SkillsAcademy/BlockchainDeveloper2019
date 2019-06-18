import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../order';
import { OrderList } from '../orderList';

export class VehicleContext extends Context {
    private orderList: OrderList<Order>;
    constructor() {
        super();
        // All papers are held in a list of vehicle
        this.orderList = new OrderList(this);
    }
getOrderList()

{
    return this.orderList;
}
}