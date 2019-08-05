// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle Manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { VehicleContext } from '../utils/vehicleContext';
import { VehicleDetails } from '../utils/vehicleDetails';
import { newLogger } from 'fabric-shim';
/**
 * *** Exercise 2 > Part 4 > Step 7 ***
 *
 */
// Import definitions from the policy asset
// import { Policy, PolicyStatus, PolicyType } from '../assets/policy';

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
    /**
     * *** Exercise 2 > Part 1 > Step 3 ***
     *
     * @param { ctx } the smart contract transaction context.
     * @param { orderId } vehicle order id.
     * @param { make } vehicle make.
     * @param { model } vehicle model.
     * @param { color } vehicle color.
     * @param { owner } vehicle owner.
     */
    // public async createVehicle(ctx: VehicleContext, orderId: string, make: string, model: string, color: string, owner: string) {
        /*
        Create a vehicle from existing vehicle order, this action will be performed by the manufacturer participant.
        The createVehicle transaction will check for an existing order asset for the vehicle before creating a new vehicle asset
        and committing it to the ledger.

        As with the other transactions that you will be adding, and the ones that already exist
        in the smart contract application, it requires a ctx parameter which is the vehicle context definition
        that extends the context class of the fabric-contract-api node sdk.
        */
        // logger.info('============= START : Create vehicle ===========');

        // Check if order exists in ledger
        // if (await ctx.getOrderList().exists(orderId)) {
            // Retrieve order asset from ledger
            // const order = await ctx.getOrderList().getOrder(orderId);
            // If order status is not equal to 'DELIVERED', throw error
            // if (order.orderStatus !== OrderStatus.DELIVERED) {
                // throw new Error(`Order  with ID : ${orderId} Should be with Status Delivered to be able to create Vehicle`);
            // }
            // Creates a new vehicle asset
            // const vehicle: Vehicle = Vehicle.createInstance('');
            // Append vehicle asset to ledger
            // await ctx.getVehicleList().add();
        // } else {
            // throw new Error(`Order  with ID : ${orderId} doesn't exists`);
        // }

        // logger.info('============= END : Create vehicle ===========');
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 4 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to query
     */
    // public async queryVehicle(ctx: VehicleContext, vehicleNumber: string): Promise<Vehicle> {
        /*
        Return vehicle details with ID
        The transaction will return a vehicle asset that has the same vehicle number parameter
        */

        // Check if the vehicle exists
        // if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            // throw new Error(`Vehicle with ID ${vehicleNumber} doesn't exists`);
        // }

        // Return vehicle asset from ledger
        // return await ctx.getVehicleList();
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 5 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    // public async queryAllVehicles(ctx: VehicleContext): Promise<Vehicle[]> {
        /*
        This transaction will return a list of vehicle assets from the ledger.
        This action will be performed by the regulator participant.
        */

        // Return all vehicles asset from ledger
        // return await ctx.getVehicleList();
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 6 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to delete
     */
    // public async deleteVehicle(ctx: VehicleContext, vehicleNumber: string) {
        /*
        The transaction will delete the vehicle asset according to the provided vehicle number parameter.
        This action will be performed by the regulator participant.
        */
        // logger.info('============= START : delete vehicle ===========');

        // Check if the vehicle exists
        // if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            // throw new Error(`vehicle with ID : ${vehicleNumber} doesn't exists`);
        // }
        // Delete vehicle asset from ledger
        // await ;
        // logger.info('============= END : delete vehicle ===========');
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 7 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to request VIN
     */
    // public async requestVehicleVIN(ctx: VehicleContext, vehicleNumber: string) {
        /*
        Transaction simulates the request for a vehicle identity number (VIN).
        This action will be performed by the manufacturer participant
        The transaction will change the vin status state of the vehicle asset to “REQUESTED”
        to mark that the vehicle is awaiting a VIN that will be issued later by the regulator participant.
        */
        // logger.info('============= START : requestVehicleVIN ===========');

        // Check if the Vehicle exists
        // if (!ctx.getVehicleList().exists(vehicleNumber)) {
            // throw new Error(`Error  Vehicle ${vehicleNumber} doesn't exists `);
        // }

        // Get vehicle by vehicle number
        // const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // If vin status is equal to "REQUESTED", throw error
        // if (vehicle.vinStatus === VinStatus.REQUESTED) {
            // throw new Error(`VIN for vehicle  ${vehicleNumber} is already REQUESTED`);
        // }
        // Change vin status state to "REQUESTED"
        // vehicle.vinStatus = ;
        // Update state in ledger
        // await ;

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('REQUEST_VIN', vehicle.toBuffer());
        // logger.info('============= END : requestVehicleVIN ===========');
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 8 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number to issue VIN
     * @param { vin } vehicle VIN
     */
    // public async issueVehicleVIN(ctx: VehicleContext, vehicleNumber: string, vin: string) {
        /*
        Transaction simulates vehicle identity number (VIN) issuance.
        This action will be performed by the regulator participant
        The transaction will change the vin status state of the vehicle asset to “ISSUED”
        to mark that the vehicle has been issued a VIN.
        */
        // logger.info('============= START : issueVehicleVIN ===========');

        // Check if the vehicle exists
        // if (! await ctx.getVehicleList().exists(vehicleNumber)) {
            // throw new Error(`Error  Vehicle  ${vehicleNumber} doesn't exists `);
        // }

        // Get vehicle by vehicle number
        // const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // Set vehicle VIN
        // vehicle.vin = vin;
        // If vin status is equal to "ISSUED", throw error
        // if (vehicle.vinStatus === VinStatus.ISSUED) {
            // throw new Error(`VIN for vehicle  ${vehicleNumber} is already ISSUED`);
        // }
        // Set vin status to "ISSUED"
        // vehicle.vinStatus = ;
        // Update state in ledger
        // await ;

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('VIN_ISSUED', vehicle.toBuffer());
        // logger.info('============= END : issueVehicleVIN ===========');
    // }

    /**
     * *** Exercise 2 > Part 1 > Step 9 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { vehicleNumber } vehicle number
     * @param { newOwner } new vehicle owner name
     */
    // public async changeVehicleOwner(ctx: VehicleContext, vehicleNumber: string, newOwner: string) {
        /*
        Transaction simulates the ownership transfer of a vehicle asset by changing the
        vehicle’s owner to the new owner parameter.
        This action will be performed by the regulator participant
        */
        // logger.info('============= START : Change Vehicle Owner ===========');

        // Get vehicle by vehicle number
        // const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // Change vehicle owner
        // vehicle.owner = ;
        // Update state in ledger
        // await ;
        // logger.info('============= END : changevehicleOwner ===========');
    // }

    // ############################################################### Order Functions #################################################
    // End user place order function
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,
        make: string, model: string, color: string,
    ) {
        logger.info('============= START : place order ===========');

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
<<<<<<< HEAD
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
=======
        await this.hasRole();
>>>>>>> 0a1b49ae305f48555b501dcb36a6044cdde369dd
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

>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b
    // ############################################################### Policy Functions #################################################
    /**
     * *** Exercise 2 > Part 4 > Step 8 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    // public async requestPolicy(ctx: VehicleContext, id: string,
        // vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
        // startDate: number, endDate: number) {
        /*
        This transaction will simulate the process of requesting a vehicle insurance policy for a vehicle.
        This action will be performed by the manufacturer participant.
        */
        // logger.info('============= START : request insurance policy ===========');

<<<<<<< HEAD
        // Check if vehicle exist
        // await ctx.getVehicleList().getVehicle(vehicleNumber);
=======
        // check if role === manufacturer
<<<<<<< HEAD
        await this.hasRole(ctx, ['Manufacturer']);
=======
        await this.hasRole();
>>>>>>> 0a1b49ae305f48555b501dcb36a6044cdde369dd

        // Check if vehicle exist
        await ctx.getVehicleList().getVehicle(vehicleNumber);
>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b

        // Create new policy asset.
        // const policy = ;
        // Add policy asset to the ledger.
        // await ;

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        // logger.info('============= END : request insurance policy ===========');
    // }

    /**
     * *** Exercise 2 > Part 4 > Step 10 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { policyId } the insurance policy id
     */
<<<<<<< HEAD
    // public async getPolicy(ctx: VehicleContext, policyId: string) {
        // This transaction will query for a specific policy according to the supplied policy ID parameter.
        // return await ;
    // }
=======
    public async getPolicy(ctx: VehicleContext, policyId: string) {
        // This transaction will query for a specific policy according to the supplied policy ID parameter.
        return await ctx.getPolicyList().get(policyId);
    }
>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b

    /**
     * *** Exercise 2 > Part 4 > Step 9 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { id } the insurance policy ID
     */
    // public async issuePolicy(ctx: VehicleContext, id: string) {
        /*
        This transaction will change the insurance policy status from "REQUESTED" to "ISSUED",
        to simulate the process of issuing a vehicle insurance policy.
        This action will be performed by the insurer participant.
        */
<<<<<<< HEAD
=======
        // Check if role === insurer
        await this.hasRole();
>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b

        // Get policy by ID from policy list
        // const policy = await ctx.getPolicyList().get(id);

        // Set policy status to "ISSUED"
        // policy.status = ;

        // Update policy asset in the ledger
        // await ;

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('POLICY_ISSUED', policy.toBuffer());
    // }

    /**
     * *** Exercise 2 > Part 4 > Step 11 ***
     *
     * @param { ctx } the smart contract transaction context
     */
<<<<<<< HEAD
    // public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        // This transaction will return a list of all the available insurance policies in the ledger.
        // return await ;
    // }

    // ############################################################### Utility Functions #################################################
=======
    public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        // This transaction will return a list of all the available insurance policies in the ledger.
        return await ctx.getPolicyList().getAll();
    }

    // ############################################################### Utility Functions #################################################
    /**
     * *** Exercise 05 > Part 2 > Step 1***
     * 
     * @param { ctx } the smart contract transaction context
     * @param { roleName } the blockchain user identity
     */
    public async hasRole(ctx: VehicleContext, roleName: string[]) {
        // Function to check if the user has right to perform the role bases on role
<<<<<<< HEAD
        const clientId = ctx.clientIdentity;
=======
        // const clientId = ctx.clientIdentity;
>>>>>>> 0a1b49ae305f48555b501dcb36a6044cdde369dd
        // const clientId = ctx.stub.getChannelID;
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
>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b

    // Regulator Can get number of vehicles
    public async getVehicleCount(ctx: VehicleContext) {
<<<<<<< HEAD
=======
        // only regulator can access this function
        await this.hasRole(ctx, ['Regulator']);

>>>>>>> 08a1c216d888f5ff4089d1b0a42adec33fd7a84b
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
