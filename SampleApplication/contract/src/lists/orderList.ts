import { Order } from '../assets/order';
import { IState } from '../ledger-api/state';
import { StateList } from '../ledger-api/statelist';
import {  VehicleContext } from '../utils/vehicleContext';

export class OrderList <T extends Order> extends StateList<T> {

    constructor(ctx: VehicleContext, validTypes: Array<IState<T>>) {

        super(ctx, 'org.vehiclelifecycle.order');
        this.use(...validTypes);

    }
    public async addOrder(order: T) {
        return this.add(order);
    }

  public async getOrder(orderKey) {
   return this.get(orderKey);
   }

  public async updateOrder(order) {
      return this.update(order);
    }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {string} orderID
     * return order history 
     */
    public async getOrderHistory(orderID:string)
    {
        // call history function defined in stateList.ts 
        return this.getHistory(orderID);
    }
    
    /**
     * *** Exercise 03 > Part 5 ***
     * @param  {string} queryString
     * @param  {number} pageSize
     * @param  {string} bookmark
     */
    public async queryStatusPaginated(queryString: string, pageSize: number , bookmark :string )
    {
        // call queryWithPagination defined in stateList.ts 
       return this.queryWithPagination(queryString,pageSize,bookmark);
    }
    
    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {string} startkey
     * @param  {string} endkey
     */
    public async getOrdersByRange(startkey:string,endkey:string)
    {
        // call getAssetsByRange from stateList.ts 
        return this.getAssetsByRange(startkey,endkey);
    }
}
