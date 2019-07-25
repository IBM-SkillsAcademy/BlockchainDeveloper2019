
// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Price } from '../assets/price';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { QueryResponse } from '../utils/queryResponse';
import { VehicleContext } from '../utils/vehicleContext';
import { VehicleDetails } from '../utils/vehicleDetails';
import { newLogger } from 'fabric-shim';
// Import definitions from the policy asset
import { Policy, PolicyStatus, PolicyType } from '../assets/policy';

const logger = newLogger('VehicleContract');

// The main chaincode class contains all the transactions that users can submit by extending the Fabric Contract class

export class VehicleContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.vehiclelifecycle.vehicle');
    }

    public createContext() {
        return new VehicleContext();
    }
    // init ledger function is executed at the chaincode instantiation
    public async initLedger(ctx: VehicleContext) {
        logger.info('============= START : Initialize ledger ===========');
        const vehicles: Vehicle[] = new Array<Vehicle>();
        vehicles[0] = Vehicle.createInstance('CD58911', '4567788', 'Tomoko', 'Prius', 'Toyota', 'blue');
        vehicles[1] = Vehicle.createInstance('CD57271', '1230819', 'Jin soon', 'Tucson', 'Hyundai', 'green');
        vehicles[2] = Vehicle.createInstance('CD57291', '3456777', 'Max', 'Passat', 'Volklswagen', 'red');

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.getVehicleList().add(vehicles[i]);
            logger.info('Added <--> ', vehicles[i]);
        }
        logger.info('============= END : Initialize ledger ===========');
    }

    // ############################################################### Vehicle functions #################################################
    /**
     * *** Exercise 02 > Part 1 > Step 3 ***
     *
     * @param { ctx } the smart contract transaction context.
     * @param { orderId } vehicle order id.
     * @param { make } vehicle make.
     * @param { model } vehicle model.
     * @param { color } vehicle color.
     * @param { owner } vehicle owner.
     */
    public async createVehicle(ctx: VehicleContext, orderId: string, make: string, model: string, color: string, owner: string) {
        /*
        Create a vehicle from existing vehicle order, this action will be performed by the manufacturer participant.
        The createVehicle transaction will check for an existing order asset for the vehicle before creating a new vehicle asset
        and committing it to the ledger.

        As with the other transactions that you will be adding, and the ones that already exist
        in the smart contract application, it requires a ctx parameter which is the vehicle context definition
        that extends the context class of the fabric-contract-api node sdk.
        */
        logger.info('============= START : Create vehicle ===========');
        // Check if role === manufacturer
        await this.hasRole(ctx, ['Manufacturer']);

        // Check if order exists in ledger
        if (await ctx.getOrderList().exists(orderId)) {
            // Retrieve order asset from ledger
            const order = await ctx.getOrderList().getOrder(orderId);
            // If order status is not equal to 'DELIVERED', throw error
            if (order.orderStatus !== OrderStatus.DELIVERED) {
                throw new Error(`Order  with ID : ${orderId} Should be with Status Delivered to be able to create Vehicle`);
            }
            // Creates a new vehicle asset
            const vehicle: Vehicle = Vehicle.createInstance('', orderId, owner, model, make, color);
            // Append vehicle asset to ledger
            await ctx.getVehicleList().add(vehicle);
        } else {
            throw new Error(`Order  with ID : ${orderId} doesn't exists`);
        }

        logger.info('============= END : Create vehicle ===========');
    }

    /**
     * *** Exercise 06 > Part 3 > Step 7 ***
     * Add or update a vehicle price details
     * @param {VehicleContext} ctx: vehicle context
     * @param {string} vehicleNumber: The vehicle key number
     * @param {string} value: The price of the vehicle
     */
    public async updatePriceDetails(ctx: VehicleContext, vehicleNumber: string, value: string) {
        // check if vehicle exist
        await ctx.getVehicleList().get(vehicleNumber);
        // create a new price object
        const price = Price.createInstance(vehicleNumber, parseInt(value, 10));
        // get the pricelist instance and call its updatePrice function
        await ctx.getPriceList().updatePrice(price);
    }

    /**
     * *** Exercise 02 > Part 1 > Step 4 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to query
     */
    public async queryVehicle(ctx: VehicleContext, vehicleNumber: string): Promise<Vehicle> {
        /*
        Return vehicle details with ID
        The transaction returns a vehicle asset that has the same vehicle number parameter
        */

        // Check if the vehicle exists
        if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Vehicle with ID ${vehicleNumber} doesn't exists`);
        }

        // Return vehicle asset from ledger
        return await ctx.getVehicleList().get(vehicleNumber);
    }

    /**
     * *** Exercise 02 > Part 1 > Step 5 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    public async queryAllVehicles(ctx: VehicleContext): Promise<Vehicle[]> {
        /*
        This transaction will return a list of vehicle assets from the ledger.
        This action can be performed by all participants.
        */

        // Return all vehicles asset from the ledger
        return await ctx.getVehicleList().getAll();
    }

    /**
     * *** Exercise 02 > Part 1 > Step 6 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to delete
     */
    public async deleteVehicle(ctx: VehicleContext, vehicleNumber: string) {
        /*
        The transaction deletes the vehicle asset according to the provided vehicle number parameter.
        This action is performed by the regulator participant.
        */
        logger.info('============= START : delete vehicle ===========');
        // Check if role === regulator
        await this.hasRole(ctx, ['Regulator']);

        // Check whether the vehicle exists
        if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`vehicle with ID : ${vehicleNumber} doesn't exists`);
        }
        // Delete vehicle asset from ledger
        await ctx.getVehicleList().delete(vehicleNumber);
        logger.info('============= END : delete vehicle ===========');
    }

    /**
     * *** Exercise 02 > Part 1 > Step 7 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to request VIN
     */
    public async requestVehicleVIN(ctx: VehicleContext, vehicleNumber: string) {
        /*
        Transaction simulates the request for a vehicle identity number (VIN).
        This action is performed by the manufacturer participant
        The transaction changes the vin status state of the vehicle asset to “REQUESTED”
        to mark that the vehicle is awaiting a VIN that will be issued later by the regulator participant.
        */
        logger.info('============= START : requestVehicleVIN ===========');
        // Check if role === manufacturer
        await this.hasRole(ctx, ['Manufacturer']);

        // Check whether the Vehicle exists
        if (!ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Error  Vehicle ${vehicleNumber} doesn't exists `);
        }

        // Get vehicle by vehicle number
        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // If vin status is equal to "REQUESTED", throw error
        if (vehicle.vinStatus === VinStatus.REQUESTED) {
            throw new Error(`VIN for vehicle  ${vehicleNumber} is already REQUESTED`);
        }
        // Change vin status state to "REQUESTED"
        vehicle.vinStatus = VinStatus.REQUESTED;
        // Update state in ledger
        await ctx.getVehicleList().updateVehicle(vehicle);

        /*
        Fire an event after the transaction is successfully committed to the ledger.
        Applications that act as event listeners can listen for this event trigger and respond accordingly.
        */
        ctx.stub.setEvent('REQUEST_VIN', vehicle.toBuffer());
        logger.info('============= END : requestVehicleVIN ===========');
    }

    /**
     * *** Exercise 02 > Part 1 > Step 8 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to issue VIN
     * @param { vin } vehicle VIN
     */
    public async issueVehicleVIN(ctx: VehicleContext, vehicleNumber: string, vin: string) {
        /*
        Transaction simulates vehicle identity number (VIN) issuance.
        This action is performed by the regulator participant.
        The transaction changes the vin status state of the vehicle asset to “ISSUED”
        to mark that the vehicle has been issued a VIN.
        */
        logger.info('============= START : issueVehicleVIN ===========');
        // Check if role === regulator
        await this.hasRole(ctx, ['Regulator']);

        // Check if the vehicle exists
        if (! await ctx.getVehicleList().exists(vehicleNumber)) {
            throw new Error(`Error  Vehicle  ${vehicleNumber} doesn't exists `);
        }

        // Get vehicle by vehicle number
        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // Set vehicle VIN
        vehicle.vin = vin;
        // If vin status is equal to "ISSUED", throw error
        if (vehicle.vinStatus === VinStatus.ISSUED) {
            throw new Error(`VIN for vehicle  ${vehicleNumber} is already ISSUED`);
        }
        // Set vin status to "ISSUED"
        vehicle.vinStatus = VinStatus.ISSUED;
        // Update state in ledger
        await ctx.getVehicleList().updateVehicle(vehicle);

        /*
        Fire an event after the transaction is successfully committed to the ledger.
        Applications that act as event listeners can listen for this event trigger and respond accordingly.
        */
        ctx.stub.setEvent('VIN_ISSUED', vehicle.toBuffer());
        logger.info('============= END : issueVehicleVIN ===========');
    }

    /**
     * *** Exercise 02 > Part 1 > Step 9 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number
     * @param { newOwner } new vehicle owner name
     */
    public async changeVehicleOwner(ctx: VehicleContext, vehicleNumber: string, newOwner: string) {
        /*
        Transaction simulates the ownership transfer of a vehicle asset by changing the
        vehicle’s owner to the new owner parameter.
        This action is performed by the regulator or insurer participant.
        */
        logger.info('============= START : Change Vehicle Owner ===========');
        // Check if role === Regulator / Insurer
        await this.hasRole(ctx, ['Regulator', 'Insurer']);

        // Get vehicle by vehicle number
        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // Change vehicle owner
        vehicle.owner = newOwner;
        // Update state in ledger
        await ctx.getVehicleList().updateVehicle(vehicle);
        logger.info('============= END : changevehicleOwner ===========');
    }

    /**
     * *** Exercise 06 > Part 3 > Step 7 ***
     * get vehicle price details by vehicle key number
     * @param {VehicleContext} ctx vehicle context
     * @param {string} vehicleNumber the vehicle key number
     */
    public async getPriceDetails(ctx: VehicleContext, vehicleNumber: string) {
        // get the priceList object and call its getPrice function
        return await ctx.getPriceList().getPrice(vehicleNumber);
    }

    /**
     * *** Exercise 06 > Part 8 > Step 1 ***
     * Return all orders with specified query condition.
     * Index defined in META-INF folder.
     * @param {VehicleContext} ctx: Vehicle context.
     * @param {string} min: Minimum price to be queried.
     * @param {string} max: Maximum price to be queried.
     */
    public async getPriceByRange(ctx: VehicleContext, min: string, max: string) {
        const minNumber = parseInt(min, 10);
        const maxNumber = parseInt(max, 10);
        /* Compose a couchdb query string for price with the value
            more than / equal minimum number that is provided and
            less than / equal maximum number that is provided */
        const queryString = {
            selector: {
                value: {
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
       * @param  {VehicleContext} ctx: Vehicle context.
       * @param  {string} vehicleNumber: Vehicle number to return history for
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

    // When the order completed and it is ready to be delivered, update order status. The manufacturer now can create a new vehicle as an asset.
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
    // Return all orders
    public async getOrders(ctx: VehicleContext): Promise<Order[]> {
        logger.info('============= START : Get Orders ===========');

        // Check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        logger.info('============= END : Get Orders ===========');
        return await ctx.getOrderList().getAll();
    }

    /**
     * *** Exercise 03 > Part 2 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderStatus
     * @returns {array} array of orders
     * Return all orders with a specific status. Explain how to use the index defined in JSON format. 
     * All indexes are defined in the META-INF folder.
     */
    public async getOrdersByStatus(ctx: VehicleContext, orderStatus: string) {
        logger.info('============= START : Get Orders by Status ===========');

        // Check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
      // Create query string and use orderStatusIndex and order status design document
        const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };
          // Call queryWithQueryString with a custom function to run the query and return the results. 
        return await this.queryWithQueryString(ctx, JSON.stringify(queryString), '');
    }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderID: orderId to get the history for.
     * Return all transactions history for orders by using orderID.
     */
    public async getHistoryForOrder(ctx: VehicleContext, orderID: string) {
        return await ctx.getOrderList().getOrderHistory(orderID);
    }

    /**
     * *** Exercise 03 > Part 5 ***
     * @param  {VehicleContext} ctx
     * @param  {string} orderStatus
     * @param  {string} pagesize: Number of result per page.
     * @param  {string} bookmark: When the bookmark is not an empty string,
     * The iterator can be used to fetch the first `pageSize` key between the bookmark and the last key in the query results.
     * Get all orders with status paginated by number of results per page and using bookmark 
     */
    public async getOrdersByStatusPaginated(ctx: VehicleContext, orderStatus: string, pagesize: string, bookmark: string) {
        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
        // Build query string
        const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };
       // Convert string to integer by using the JavaScript function parseInt
        const pagesizeInt = parseInt(pagesize, 10);

        return await ctx.getOrderList().queryStatusPaginated(JSON.stringify(queryString), pagesizeInt, bookmark);
    }

    /**
     * *** Exercise 03 > Part 4 ***
     * @param  {VehicleContext} ctx
     * @param  {string} startKey: Start key as starting point for query.
     * @param  {string} endKey: End key as end point for queey.
     */
    public async getOrdersByRange(ctx: VehicleContext, startKey: string, endKey: string) {
        // Use the object that is retuned by getOrderList and call getOrdersByRange.
        return await ctx.getOrderList().getOrdersByRange(startKey, endKey);
    }

    // ############################################################### Policy Functions #################################################
    /**
     * *** Exercise 02 > Part 4 > Step 7 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    public async requestPolicy(ctx: VehicleContext, id: string,
        vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
        startDate: number, endDate: number) {
        /*
        This transaction simulates the process of requesting a vehicle insurance policy for a vehicle.
        This action is performed by the manufacturer participant.
        */
        logger.info('============= START : request insurance policy ===========');

        // Check whether role === manufacturer
        await this.hasRole(ctx, ['Manufacturer']);

        // Check whether the vehicle exists
        await ctx.getVehicleList().getVehicle(vehicleNumber);

        // Create new policy asset.
        const policy = Policy.createInstance(id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate);
        // Add policy asset to the ledger.
        await ctx.getPolicyList().add(policy);

        /*
        Fire an event after the transaction is successfully committed to the ledger.
        Applications that acs as event listeners can listen for this event trigger and respond accordingly.
        */
        ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        logger.info('============= END : request insurance policy ===========');
    }

    /**
     * *** Exercise 02 > Part 4 > Step 9 ***
     *
     * @param { ctx }: The smart contract transaction context
     * @param { policyId }: The insurance policy id
     */
    public async getPolicy(ctx: VehicleContext, policyId: string) {
        // This transaction queries for a specific policy according to the supplied policy ID parameter.
        return await ctx.getPolicyList().get(policyId);
    }

    /**
     * *** Exercise 02 > Part 4 > Step 8 ***
     *
     * @param { ctx }: The smart contract transaction context
     * @param { id }: The insurance policy ID
     */
    public async issuePolicy(ctx: VehicleContext, id: string) {
        /*
        This transaction changes the insurance policy status from "REQUESTED" to "ISSUED" 
        to simulate the process of issuing a vehicle insurance policy.
        This action is performed by the insurer participant.
        */
        // Check if role === insurer
        await this.hasRole(ctx, ['Insurer']);

        // Get policy by ID from policy list
        const policy = await ctx.getPolicyList().get(id);

        // Set policy status to "ISSUED"
        policy.status = PolicyStatus.ISSUED;

        // Update policy asset in the ledger
        await ctx.getPolicyList().update(policy);

        /*
        Fire an event after the transaction is successfully committed to the ledger.
        Applications that act as event listeners can listen for this event trigger and respond accordingly.
        */
        ctx.stub.setEvent('POLICY_ISSUED', policy.toBuffer());
    }

    /**
     * *** Exercise 02 > Part 4 > Step 10 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        // This transaction returns a list of all the available insurance policies in the ledger.
        return await ctx.getPolicyList().getAll();
    }

    // ############################################################### Utility Functions #################################################
    // Function to check whether the users have rights to perform the role based on their role
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
        * @param {VehicleContext } ctx: The transaction context
        * @param {string} queryString: The query string to be evaluated
        * @param {string } collection: Flag to identify this function. It is used in getQueryResult or getPrivateDataQueryResult
        */
    public async queryWithQueryString(ctx: VehicleContext, queryString: string, collection: string) {

        logger.info('query String');
        logger.info(JSON.stringify(queryString));

        let resultsIterator: import('fabric-shim').Iterators.StateQueryIterator;
        if (collection === '') {
            resultsIterator = await ctx.stub.getQueryResult(queryString);
        } else {
            // Workaround for tracked issue: https://jira.hyperledger.org/browse/FAB-14216
            const result: any = await ctx.stub.getPrivateDataQueryResult(collection, queryString);
            resultsIterator = result.iterator;
        }

        console.log(typeof resultsIterator);
        // Array to hold query result
        const allResults = [];
        while (true) {
               // Use iterator to get next element
            const res = await resultsIterator.next();
             // If next element has value
            if (res.value && res.value.value.toString()) {
                // Create object of custom type QueryResponse to hold current element result
                const jsonRes = new QueryResponse();
               // Assign current key value to key of QueryResponse object
                jsonRes.key = res.value.key;

                try {
                    // Assign current record value to value of QueryResponse object
                    jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    logger.info(err);
                    jsonRes.record = res.value.value.toString('utf8');
                }
                 // Push current object to array of result
                allResults.push(jsonRes);
            }
            if (res.done) {
                logger.info('end of data');
                // Close iterator
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
        // Only the regulator can access this function
        await this.hasRole(ctx, ['Regulator']);

        return await ctx.getVehicleList().count();
    }
    // 'unknownTransaction' is called if the transaction function requested does not exist
    public async unknownTransaction(ctx: VehicleContext) {
        throw new Error(`The transaction function ${ctx.stub.getFunctionAndParameters().fcn} doesn't exists, provide a valid transaction function `);
    }
    // 'beforeTransaction' is called before any of the transaction functions within contract.
    // Examples of what you might want to code are Logging, Event Publishing, or Permissions checks.
    // If an error is thrown, the transaction is rejected.

    public async beforeTransaction(ctx: VehicleContext) {
        logger.info(`Before Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
    // 'afterTransaction' is called after any of the transaction functions within contract.
    // Examples of what you might want to code are Logging, Event Publishing, or Permissions checks.
    // If an error is thrown, the transaction is rejected
    public async afterTransaction(ctx: VehicleContext, result: any) {

        logger.info(`After Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
}
