import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../assets/order';
import { OrderList } from '../lists/orderList';
import { PolicyList } from '../lists/policyList';
import { Policy } from '../assets/policy';

export class VehicleContext extends Context {
    private orderList: OrderList<Order>;
    private policyList: PolicyList<Policy>;
    constructor() {
        super();

        this.orderList = new OrderList(this, [Order]);
        this.policyList = new PolicyList(this, [Policy])
    }
    getOrderList() {
        return this.orderList;
    }
    getPolicyList() {
        return this.policyList;
    }
}