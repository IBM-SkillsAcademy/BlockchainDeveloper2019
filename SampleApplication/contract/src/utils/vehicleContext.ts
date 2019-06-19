import { Context, Contract } from 'fabric-contract-api';
import { Order } from '../order';
import { OrderList } from '../orderList';
import { PolicyList } from '../policyList';
import { Policy } from '../policy';

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