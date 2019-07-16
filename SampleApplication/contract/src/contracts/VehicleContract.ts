
// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle Manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Vehicle, VinStatus } from '../assets/vehicle';
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

    // // Return All order with Specific Status  Example to explain how to use index on JSON ... Index defined in META-INF folder
    // public async getPriceByRange(ctx: VehicleContext, min: string, max: string) {
    //     logger.info('============= START : Get Orders by Status ===========');

    //     // check if role === 'Manufacturer' / 'Regulator'
    //     await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

    //     const minNumber = parseInt(min, 10);
    //     const maxNumber = parseInt(max, 10);
    //     const queryString = {
    //         selector: {
    //             price: {
    //                 $gte: minNumber,
    //                 $lte: maxNumber,
    //             },
    //         },
    //         use_index: ['_design/priceDoc', 'priceIndex'],
    //     };
    //     return await this.queryWithQueryString(ctx, JSON.stringify(queryString), 'collectionVehiclePriceDetails');
    // }

    // // get all History for Vehicle ID return , all transaction over aspecific vehicle
    // public async getHistoryForVehicle(ctx: VehicleContext, vehicleNumber: string) {
    //     return await ctx.getVehicleList().getVehicleHistory(vehicleNumber);
    // }

    // ############################################################### Order Functions #################################################
    // end user palce order function
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,
        make: string, model: string, color: string,
    ) {
        logger.info('============= START : place order ===========');

        // check if role === 'Manufacturer'
        // await this.hasRole(ctx, ['Manufacturer']);

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
        // await this.hasRole(ctx, ['Manufacturer']);

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
        // await this.hasRole(ctx, ['Manufacturer']);
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
        // await this.hasRole(ctx, ['Manufacturer']);

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
        // await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        logger.info('============= END : Get Orders ===========');
        return await ctx.getOrderList().getAll();
    }

    // Return All order with Specific Status  Example to explain how to use index on JSON ... Index defined in META-INF folder
    // public async getOrdersByStatus(ctx: VehicleContext, orderStatus: string) {
    //     logger.info('============= START : Get Orders by Status ===========');

    //     // check if role === 'Manufacturer' / 'Regulator'
    //     await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

    //     const queryString = {
    //         selector: {
    //             orderStatus,
    //         },
    //         use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
    //     };

    //     return await this.queryWithQueryString(ctx, JSON.stringify(queryString), '');
    // }
    // // get all History for Order ID return , all transaction over aspecific Order
    // public async getHistoryForOrder(ctx: VehicleContext, orderID: string) {
    //     return await ctx.getOrderList().getOrderHistory(orderID);
    // }

    // // Get Order By status and use pagination to return the result
    // public async getOrdersByStatusPaginated(ctx: VehicleContext, orderStatus: string, pagesize: string, bookmark: string) {
    //     // check if role === 'Manufacturer' / 'Regulator'
    //     await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
    //     // Build Query String
    //     const queryString = {
    //         selector: {
    //             orderStatus,
    //         },
    //         use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
    //     };

    //     const pagesizeInt = parseInt(pagesize, 10);
    //     return await ctx.getOrderList().queryStatusPaginated(JSON.stringify(queryString), pagesizeInt, bookmark);
    // }

    // ############################################################### Policy Functions #################################################


    // ############################################################### Utility Functions #################################################
    // // Function to check if the user has right toperform the role bases on his role
    // public async hasRole(ctx: VehicleContext, roleName: string[]) {
    //     const clientId = ctx.clientIdentity;
    //     for (let i = 0; i < roleName.length; i++) {
    //         if (clientId.assertAttributeValue('role', roleName[i])) {
    //             return true;
    //         }
    //     }
    //     throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit this transaction`);
    // }

    /**
     * Evaluate a queryString
     *
     * @param {VehicleContext } ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     */
    // public async queryWithQueryString(ctx: VehicleContext, queryString: string, collection: string) {

    //     logger.info('query String');
    //     logger.info(JSON.stringify(queryString));

    //     let resultsIterator: import('fabric-shim').Iterators.StateQueryIterator;
    //     if (collection === '') {
    //         resultsIterator = await ctx.stub.getQueryResult(queryString);
    //     } else {
    //         // workaround for tracked issue: https://jira.hyperledger.org/browse/FAB-14216
    //         const result: any = await ctx.stub.getPrivateDataQueryResult(collection, queryString);
    //         resultsIterator = result.iterator;
    //     }

    //     console.log(typeof resultsIterator);

    //     const allResults = [];

    //     while (true) {
    //         const res = await resultsIterator.next();

    //         if (res.value && res.value.value.toString()) {
    //             const jsonRes = new QueryResponse();

    //             logger.info(res.value.value.toString('utf8'));

    //             jsonRes.key = res.value.key;

    //             try {
    //                 jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 logger.info(err);
    //                 jsonRes.record = res.value.value.toString('utf8');
    //             }

    //             allResults.push(jsonRes);
    //         }
    //         if (res.done) {
    //             logger.info('end of data');
    //             await resultsIterator.close();
    //             logger.info(allResults);
    //             logger.info(JSON.stringify(allResults));
    //             return JSON.stringify(allResults);
    //         }
    //     }

    // }
    // Regulator Can get nmber of vehicles 
    public async getVehicleCount(ctx: VehicleContext) {
        // await this.hasRole(ctx, ['Regulator']);

        return await ctx.getVehicleList().count();
    }
    //'unknownTransaction' will be called if the required transaction function requested does not exist
    public async unknownTransaction(ctx: VehicleContext) {
        throw new Error(`The transaction function ${ctx.stub.getFunctionAndParameters().fcn} doesn't exists, provide a valid transaction function `)
    }
    // 'beforeTransaction' will be called before any of the transaction functions within  contract
    // Examples of what you may wish to code are Logging, Event Publishing or Permissions checks 
    //If an error is thrown, the whole transaction will be rejected

    public async beforeTransaction(ctx: VehicleContext) {
        logger.info(`Before Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
    // 'afterTransaction' will be called after any of the transaction functions within  contract
    // Examples of what you may wish to code are Logging, Event Publishing or Permissions checks 
    //If an error is thrown, the whole transaction will be rejected
    public async afterTransaction(ctx: VehicleContext, result: any) {

        logger.info(`After Calling Transaction function ${ctx.stub.getFunctionAndParameters().fcn}`);
    }
}
