
// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle Manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Policy, PolicyStatus, PolicyType } from '../assets/policy';
import { Price } from '../assets/price';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { QueryResponse } from '../utils/queryResponse';
import { VehicleContext } from '../utils/vehicleContext';
import { VehicleDetails } from '../utils/vehicleDetails';
import { newLogger } from 'fabric-shim';

const logger = newLogger('VehicleContract');

// Main Chaincode class contains all transactions that users can submit by extending Fabric Contract class

export class VehicleContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.vehiclelifecycle.vehicle');
    }

    public createContext() {
        return new VehicleContext();
    }
    // init Ledger fucntion to be executed at the chaincode inistantiation
    public async initLedger(ctx: VehicleContext) {
        logger.info('============= START : Initialize Ledger ===========');
        const vehicles: Vehicle[] = new Array<Vehicle>();
        vehicles[0] = Vehicle.createInstance('CD58911', '4567788', 'Tomoko', 'Prius', 'Toyota', 'blue');
        vehicles[1] = Vehicle.createInstance('CD57271', '1230819', 'Jin soon', 'Tucson', 'Hyundai', 'green');
        vehicles[2] = Vehicle.createInstance('CD57291', '3456777', 'Max', 'Passat', 'Volklswagen', 'red');

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.getVehicleList().add(vehicles[i]);
            logger.info('Added <--> ', vehicles[i]);
        }
        logger.info('============= END : Initialize Ledger ===========');
    }

    // ############################################################### Vehicle Functions #################################################
    // return vehicle details with ID
    public async queryVehicle(ctx: VehicleContext, vehicleNumber: string): Promise<Vehicle> {

        if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Vehicle with ID ${vehicleNumber} doesn't exists`);
        }

        return await ctx.getVehicleList().get(vehicleNumber);
    }

    public async createVehicle(ctx: VehicleContext, orderId: string, make: string, model: string, color: string, owner: string) {
        logger.info('============= START : Create vehicle ===========');

        await this.hasRole(ctx, ['Manufacturer']);

        if (await ctx.getOrderList().exists(orderId)) {
            const order = await ctx.getOrderList().getOrder(orderId);
            if (order.orderStatus !== OrderStatus.DELIVERED) {
                throw new Error(`Order  with ID : ${orderId} Should be with Status Delivered to be able to create Vehicle`);

            }
            const vehicle: Vehicle = Vehicle.createInstance('', orderId, owner, model, make, color);

            await ctx.getVehicleList().add(vehicle);
        } else {
            throw new Error(`Order  with ID : ${orderId} doesn't exists`);
        }

        logger.info('============= END : Create vehicle ===========');
    }
    // Issue VIN for Vehcile the this action performed by Regulator
    public async issueVehicleVIN(ctx: VehicleContext, vehicleNumber: string, vin: string) {
        logger.info('============= START : issueVehicleVIN ===========');
        await this.hasRole(ctx, ['Regulator']);
        if (! await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Error  Vehicle  ${vehicleNumber} doesn't exists `);
        }

        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        vehicle.vin = vin;
        if (vehicle.vinStatus === VinStatus.ISSUED) {
            throw new Error(`VIN for vehicle  ${vehicleNumber} is already ISSUED`);
        }

        vehicle.vinStatus = VinStatus.ISSUED;
        await ctx.getVehicleList().updateVehicle(vehicle);

        // Fire Event
        ctx.stub.setEvent('VIN_ISSUED', vehicle.toBuffer());
        logger.info('============= END : issueVehicleVIN ===========');

    }
    // Issue VIN for Vehcile the this action performed by Manufacturer
    public async requestVehicleVIN(ctx: VehicleContext, vehicleNumber: string) {
        logger.info('============= START : requestVehicleVIN ===========');

        await this.hasRole(ctx, ['Manufacturer']);
        if (!ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Error  Vehicle ${vehicleNumber} doesn't exists `);
        }

        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        if (vehicle.vinStatus === VinStatus.REQUESTED) {
            throw new Error(`VIN for vehicle  ${vehicleNumber} is already REQUESTED`);
        }
        vehicle.vinStatus = VinStatus.REQUESTED;
        await ctx.getVehicleList().updateVehicle(vehicle);

        // Fire Event
        ctx.stub.setEvent('REQUEST_VIN', vehicle.toBuffer());
        logger.info('============= END : requestVehicleVIN ===========');
    }

    // Regulator retrieve all vehciles in system with details
    public async queryAllVehicles(ctx: VehicleContext): Promise<Vehicle[]> {
        return await ctx.getVehicleList().getAll();

    }

    // regulator can update vehicle owner
    public async changeVehicleOwner(ctx: VehicleContext, vehicleNumber: string, newOwner: string) {
        logger.info('============= START : Change Vehicle Owner ===========');

        // check if role === 'Regulator' / 'Insurer'
        await this.hasRole(ctx, ['Regulator', 'Insurer']);

        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        vehicle.owner = newOwner;
        await ctx.getVehicleList().updateVehicle(vehicle);

        logger.info('============= END : changevehicleOwner ===========');
    }

    // regulator can delete vehicle after lifecycle ended
    public async deleteVehicle(ctx: VehicleContext, vehicleNumber: string) {
        logger.info('============= START : delete vehicle ===========');

        // check if role === 'Regulator' / 'Insurer'
        await this.hasRole(ctx, ['Regulator', 'Insurer']);

        // Check if the Vehicle exists
        if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`vehicle with ID : ${vehicleNumber} doesn't exists`);
        }

        await ctx.getVehicleList().delete(vehicleNumber);

        logger.info('============= END : delete vehicle ===========');
    }

    /**
     * *** Exercise 06 > Part 3 > Step 7 ***
     * add or update a vehicle price details
     * @param {VehicleContext} ctx vehicle context
     * @param {string} vehicleNumber the vehicle key number
     * @param {string} priceString the price value of the vehicle
     */
    public async updatePriceDetails(ctx: VehicleContext, vehicleNumber: string, priceString: string) {
        // check if vehicle exist
        await ctx.getVehicleList().get(vehicleNumber);
        // create a new price object
        const price = Price.createInstance(vehicleNumber, parseInt(priceString, 10));
        // get the pricelist instance and call its updatePrice function
        await ctx.getPriceList().updatePrice();
    }

    /**
     * *** Exercise 06 > Part 3 > Step 7 ***
     * get vehicle price details by vahicle key number
     * @param {VehicleContext} ctx vehicle context
     * @param {string} vehicleNumber the vehicle key number
     */
    public async getPriceDetails(ctx: VehicleContext, vehicleNumber: string) {
        // get the priceList object and call its getPrice function
        return await ctx.getPriceList().getPrice();
    }

    /**
     * *** Exercise 06 > Part 8 > Step 1 ***
     * Return all orders with specified query condition
     * Index defined in META-INF folder
     * @param {VehicleContext} ctx Vehicle Context
     * @param {string} min minimum price to be queeied
     * @param {string} max maximum price to be queried
     */
    public async getPriceByRange(ctx: VehicleContext, min: string, max: string) {
        const minNumber = parseInt(min, 10);
        const maxNumber = parseInt(max, 10);
        /* compose a couchdb query string for price with the value
            more than / equal minimum number provided and
            less than / equal maximum number provided */
        const queryString = {
            selector: {
                price: {
                    $gte: minNumber,
                    $lte: maxNumber,
                },
            },
            // use index defined in META-INF/statedb/couchdb/collections/collectionVehiclePriceDetails/indexes
            use_index: ['_design/priceDoc', 'priceIndex'],
        };
        // call queryWithQueryString function with collection name to trigger getPrivateDataQueryResult instead of getQueryResult
        return await this.queryWithQueryString(ctx, JSON.stringify(queryString), 'collectionVehiclePriceDetails');
    }

      /**
       * *** Exercise 03 > Part 4 ***
       * @param  {VehicleContext} ctx vehicle context
       * @param  {string} vehicleNumber vehicle number to return history for
       * get history for vehicle as provenance of changes over vehicle
       */
    public async getHistoryForVehicle(ctx: VehicleContext, vehicleNumber: string) {
        // get vehicle history using vehiclelist and function getVehicleHistory
        return await ctx.getVehicleList().getVehicleHistory(vehicleNumber);
    }

    // ############################################################### Order Functions #################################################
    // end user palce order function
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,
        make: string, model: string, color: string,
    ) {
        logger.info('============= START : place order ===========');

        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        const vehicleDetails: VehicleDetails = {
            color,
            make,
            model,
            owner,
            orderId,
        };
        const order = Order.createInstance(orderId, owner, OrderStatus.ISSUED, vehicleDetails);
        await ctx.getOrderList().add(order);

        // Fire Event
        ctx.stub.setEvent('ORDER_EVENT', order.toBuffer());

        logger.info('============= END : place order ===========');
    }

    // Update order status to be in progress
    public async updateOrderStatusInProgress(ctx: VehicleContext, orderId: string) {
        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        const order = await ctx.getOrderList().getOrder(orderId);
        // If The order status is already IN progress then throw error
        if (order.orderStatus === OrderStatus.INPROGRESS) {
            throw new Error(`Error while updating order ${orderId} order is already INPROGRESS`);
        }

        order.orderStatus = OrderStatus.INPROGRESS;
        await ctx.getOrderList().updateOrder(order);
    }
    // Return order with ID
    public async getOrder(ctx: VehicleContext, orderId: string) {
        if (! await ctx.getOrderList().exists(orderId)) {
            throw new Error(`Error  order ${orderId} doesn't exists `);
        }
        return await ctx.getOrderList().getOrder(orderId);
    }

    // Update order status to be pending if vehicle creation process has an issue
    public async updateOrderStatusPending(ctx: VehicleContext, orderId: string) {
        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);
        if (! await ctx.getOrderList().exists(orderId)) {
            throw new Error(`Error  order ${orderId} doesn't exists `);
        }

        const order = await ctx.getOrderList().getOrder(orderId);
        if (order.orderStatus === OrderStatus.PENDING) {
            throw new Error(`Error while updating order ${orderId} order is already PENDING`);
        }

        order.orderStatus = OrderStatus.PENDING;
        await ctx.getOrderList().updateOrder(order);
    }

    // When Order completed and will be ready to be delivered , update order status and Manufacture now can create new Vehicle as an asset
    public async updateOrderDelivered(ctx: VehicleContext, orderId: string, vehicleNumber: string) {
        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        if (!await ctx.getOrderList().exists(orderId)) {
            throw new Error(`Error  order ${orderId} doesn't exists `);
        }
        const order = await ctx.getOrderList().getOrder(orderId);

        if (order.orderStatus === OrderStatus.DELIVERED) {
            throw new Error(`Error while updating order ${orderId} order is already DELIVERED`);
        }

        order.orderStatus = OrderStatus.DELIVERED;
        await ctx.getOrderList().updateOrder(order);

    }
    // Return All order
    public async getOrders(ctx: VehicleContext): Promise<Order[]> {
        logger.info('============= START : Get Orders ===========');

        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        logger.info('============= END : Get Orders ===========');
        return await ctx.getOrderList().getAll();
    }

    /**
     * *** Exercise 03 > Part 2 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderStatus
     * @returns {array} array of orders
     * return all orders with specific status,  explain how to use index defined as JSON format, all  indexes defined in META-INF folder
     */
    public async getOrdersByStatus(ctx: VehicleContext, orderStatus: string) {
        logger.info('============= START : Get Orders by Status ===========');

        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
      // create query string and use orderStatusIndex and order status design document
        const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };
          // call queryWithQueryString which custom function to execute query and return result
        return await this.queryWithQueryString(ctx, JSON.stringify(queryString), '');
    }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderID orderId to get history for
     * return all transaction history for order  using orderID
     */
    public async getHistoryForOrder(ctx: VehicleContext, orderID: string) {
        return await ctx.getOrderList().getOrderHistory(orderID);
    }

    /**
     * *** Exercise 03 > Part 5 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderStatus
     * @param  {string} pagesize number of result per page
     * @param  {string} bookmark When the bookmark is a non-emptry string,
     * the iterator can be used to fetch the first `pageSize` keys between the bookmark and the last key in the query result
     * get all orders with status paginated by number of result per page and using bookmark
     */
    public async getOrdersByStatusPaginated(ctx: VehicleContext, orderStatus: string, pagesize: string, bookmark: string) {
        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
        // build query string
        const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };
       // convert string to integer using javascript function parseInt
        const pagesizeInt = parseInt(pagesize, 10);

        return await ctx.getOrderList().queryStatusPaginated(JSON.stringify(queryString), pagesizeInt, bookmark);
    }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {VehicleContext} ctx
     * @param  {string} startKey  start key as starting point for query
     * @param  {string} endKey    end key as end point for queey
     */
    public async getOrdersByRange(ctx: VehicleContext, startKey: string, endKey: string) {
        // use objec retuned from getOrderList and call getOrdersByRange
        return await ctx.getOrderList().getOrdersByRange(startKey, endKey);
    }

    // ############################################################### Policy Functions #################################################
    // Request Policy , user request the insurance policy
    public async requestPolicy(ctx: VehicleContext, id: string,
        vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
        startDate: number, endDate: number) {
        logger.info('============= START : request insurance policy ===========');

        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        // check if vehicle exist
        await ctx.getVehicleList().getVehicle(vehicleNumber);

        //
        const policy = Policy.createInstance(id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate);
        await ctx.getPolicyList().add(policy);

        ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        logger.info('============= END : request insurance policy ===========');
    }

    // get Policy with an ID
    public async getPolicy(ctx: VehicleContext, policyId: string) {

        return await ctx.getPolicyList().get(policyId);
    }

    // Update requested policy to be issued
    public async issuePolicy(ctx: VehicleContext, id: string) {
        await this.hasRole(ctx, ['Insurer']);

        const policy = await ctx.getPolicyList().get(id);

        policy.status = PolicyStatus.ISSUED;
        await ctx.getPolicyList().update(policy);

        ctx.stub.setEvent('POLICY_ISSUED', policy.toBuffer());
    }

    // Return All Policies
    public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        return await ctx.getPolicyList().getAll();
    }

    // ############################################################### Utility Functions #################################################
    // Function to check if the user has right toperform the role bases on his role
    public async hasRole(ctx: VehicleContext, roleName: string[]) {
        const clientId = ctx.clientIdentity;
        for (let i = 0; i < roleName.length; i++) {
            if (clientId.assertAttributeValue('role', roleName[i])) {
                return true;
            }
        }
        throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit this transaction`);
    }
       /**
        * *** Exercise 03 > Part 2 ***
        * @param {VehicleContext } ctx the transaction context
        * @param {string} queryString the query string to be evaluated
        * @param {string } collection flag to identify this function will be used for getQueryResult or  getPrivateDataQueryResult
        */
    public async queryWithQueryString(ctx: VehicleContext, queryString: string, collection: string) {

        logger.info('query String');
        logger.info(JSON.stringify(queryString));

        let resultsIterator: import('fabric-shim').Iterators.StateQueryIterator;
        if (collection === '') {
            resultsIterator = await ctx.stub.getQueryResult(queryString);
        } else {
            // workaround for tracked issue: https://jira.hyperledger.org/browse/FAB-14216
            const result: any = await ctx.stub.getPrivateDataQueryResult(collection, queryString);
            resultsIterator = result.iterator;
        }

        console.log(typeof resultsIterator);
        // array to hold query result
        const allResults = [];
        while (true) {
               // use iterator to get next element
            const res = await resultsIterator.next();
             // if next element has value
            if (res.value && res.value.value.toString()) {
                // create object of custom type QueryResponse to hold current element result
                const jsonRes = new QueryResponse();
               // assign current key value to key of QueryResponse object
                jsonRes.key = res.value.key;

                try {
                    // assign current record value to value of QueryResponse object
                    jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    logger.info(err);
                    jsonRes.record = res.value.value.toString('utf8');
                }
                 // push current object to array of result
                allResults.push(jsonRes);
            }
            if (res.done) {
                logger.info('end of data');
                // close iterator
                await resultsIterator.close();

                return JSON.stringify(allResults);
            }
        }

    }

    /**
     * *** Exercise 03 > Part 3 ***
     * @param  {VehicleContext} ctx
     */
    public async getVehicleCount(ctx: VehicleContext) {
        // only regulator can access this function
        await this.hasRole(ctx, ['Regulator']);

        return await ctx.getVehicleList().count();
    }
    // 'unknownTransaction' will be called if the required transaction function requested does not exist
    public async unknownTransaction(ctx: VehicleContext) {
        throw new Error(`The transaction function ${ctx.stub.getFunctionAndParameters().fcn} doesn't exists, provide a valid transaction function `);
    }
    // 'beforeTransaction' will be called before any of the transaction functions within  contract
    // Examples of what you may wish to code are Logging, Event Publishing or Permissions checks
    // If an error is thrown, the whole transaction will be rejected

    public async beforeTransaction(ctx: VehicleContext) {
        logger.info(`Before Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
    // 'afterTransaction' will be called after any of the transaction functions within  contract
    // Examples of what you may wish to code are Logging, Event Publishing or Permissions checks
    // If an error is thrown, the whole transaction will be rejected
    public async afterTransaction(ctx: VehicleContext, result: any) {

        logger.info(`After Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
}
