
// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle Manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Policy, PolicyStatus, PolicyType } from '../assets/policies';
import { Price } from '../assets/price';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { QueryResponse } from '../utils/queryResponse';
import { VehicleContext } from '../utils/vehicleContext';
import { VehicleDetails } from '../utils/vehicleDetails';

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
        console.info('============= START : Initialize Ledger ===========');
        const vehicles: Vehicle[] = new Array<Vehicle>();
        vehicles[0] = Vehicle.createInstance('CD58911', '4567788', 'Tomoko', 'Prius', 'Toyota', 'blue');
        vehicles[1] = Vehicle.createInstance('CD57271', '1230819', 'Jin soon', 'Tucson', 'Hyundai', 'green');
        vehicles[2] = Vehicle.createInstance('CD57291', '3456777', 'Max', 'Passat', 'Volklswagen', 'red');

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.getVehicleList().add(vehicles[i]);
            console.info('Added <--> ', vehicles[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
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
        console.info('============= START : Create vehicle ===========');

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

        console.info('============= END : Create vehicle ===========');
    }
    // Issue VIN for Vehcile the this action performed by Regulator
    public async issueVehicleVIN(ctx: VehicleContext, vehicleNumber: string, vin: string) {
        console.info('============= START : issueVehicleVIN ===========');
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
        console.info('============= END : issueVehicleVIN ===========');

    }
    // Issue VIN for Vehcile the this action performed by Manufacturer
    public async requestVehicleVIN(ctx: VehicleContext, vehicleNumber: string) {
        console.info('============= START : requestVehicleVIN ===========');

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
        console.info('============= END : requestVehicleVIN ===========');
    }

    // Regulator retrieve all vehciles in system with details
    public async queryAllVehicles(ctx: VehicleContext): Promise<Vehicle[]> {
        return await ctx.getVehicleList().getAll();

    }

    // regulator can update vehicle owner
    public async changeVehicleOwner(ctx: VehicleContext, vehicleNumber: string, newOwner: string) {
        console.info('============= START : Change Vehicle Owner ===========');

        // check if role === 'Regulator' / 'Insurer'
        await this.hasRole(ctx, ['Regulator', 'Insurer']);

        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        vehicle.owner = newOwner;
        await ctx.getVehicleList().updateVehicle(vehicle);

        console.info('============= END : changevehicleOwner ===========');
    }

    // regulator can delete vehicle after lifecycle ended
    public async deleteVehicle(ctx: VehicleContext, vehicleNumber: string) {
        console.info('============= START : delete vehicle ===========');

        // check if role === 'Regulator' / 'Insurer'
        await this.hasRole(ctx, ['Regulator', 'Insurer']);

         // Check if the Vehicle exists
        if (!await ctx.getVehicleList().exists(vehicleNumber)) {
         throw new Error(`vehicle with ID : ${vehicleNumber} doesn't exists`);
         }

        await ctx.getVehicleList().delete(vehicleNumber);

        console.info('============= END : delete vehicle ===========');
    }
    // manufacture can add or change vehicle price details
    public async updatePriceDetails(ctx: VehicleContext, vehicleNumber: string, price: string) {

        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        // check if vehicle exist
        await ctx.getVehicleList().get(vehicleNumber);

        const priceObject = Price.createInstance(vehicleNumber, parseInt(price, 10));
        await ctx.getPriceList().updatePrice(priceObject);
    }

    // manufacture can get vehicle price details
    public async getPriceDetails(ctx: VehicleContext, vehicleNumber: string) {

        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        return await ctx.getPriceList().getPrice(vehicleNumber);
    }
        // Return All order with Specific Status  Example to explain how to use index on JSON ... Index defined in META-INF folder
        public async getPriceByRange(ctx: VehicleContext, min: string, max: string) {
            console.info('============= START : Get Orders by Status ===========');

            // check if role === 'Manufacturer' / 'Regulator'
            await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

            const minNumber = parseInt(min, 10);
            const maxNumber = parseInt(max, 10);
            const queryString = {
                selector: {
                    price: {
                        $gte: minNumber,
                        $lte: maxNumber,
                    },
                },
                use_index: ['_design/priceDoc', 'priceIndex'],
            };
            return await this.queryWithQueryString(ctx, JSON.stringify(queryString), 'collectionVehiclePriceDetails');
        }

           // get all History for Vehicle ID return , all transaction over aspecific vehicle
    public async getHistoryForVehicle(ctx: VehicleContext, vehicleNumber: string) {
        return await ctx.getVehicleList().getVehicleHistory(vehicleNumber);
    }

// ############################################################### Order Functions #################################################
    // end user palce order function
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,
                            make: string, model: string, color: string,
    ) {
        console.info('============= START : place order ===========');

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

        console.info('============= END : place order ===========');
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
    console.info('============= START : Get Orders ===========');

    // check if role === 'Manufacturer' / 'Regulator'
    await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

    console.info('============= END : Get Orders ===========');
    return await ctx.getOrderList().getAll();
     }

     // Return All order with Specific Status  Example to explain how to use index on JSON ... Index defined in META-INF folder
    public async getOrdersByStatus(ctx: VehicleContext, orderStatus: string) {
        console.info('============= START : Get Orders by Status ===========');

        // check if role === 'Manufacturer' / 'Regulator'
        await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };

        return await this.queryWithQueryString(ctx, JSON.stringify(queryString), '');
    }
     // get all History for Order ID return , all transaction over aspecific Order
     public async getHistoryForOrder(ctx: VehicleContext, orderID: string) {
        return await ctx.getOrderList().getOrderHistory(orderID);
    }

    // Get Order By status and use pagination to return the result
    public async getOrdersByStatusPaginated(ctx: VehicleContext, orderStatus: string, pagesize: string, bookmark: string) {
         // check if role === 'Manufacturer' / 'Regulator'
         await this.hasRole(ctx, ['Manufacturer', 'Regulator']);
        // Build Query String
         const queryString = {
            selector: {
                orderStatus,
            },
            use_index: ['_design/orderStatusDoc', 'orderStatusIndex'],
        };

         const pagesizeInt = parseInt(pagesize, 10);
         return await ctx.getOrderList().queryStatusPaginated(JSON.stringify(queryString), pagesizeInt, bookmark);
    }

    // ############################################################### Policy Functions #################################################
    // Request Policy , user request the insurance policy
    public async requestPolicy(ctx: VehicleContext, id: string,
                               vehicleNumber: string, insurerId: string, holderId: string, policyType: PolicyType,
                               startDate: number, endDate: number) {
        console.info('============= START : request insurance policy ===========');

        // check if role === 'Manufacturer'
        await this.hasRole(ctx, ['Manufacturer']);

        // check if vehicle exist
        await ctx.getVehicleList().getVehicle(vehicleNumber);

        //
        const policy = Policy.createInstance(id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate);
        await ctx.getPolicyList().add(policy);

        ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        console.info('============= END : request insurance policy ===========');
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
     * Evaluate a queryString
     *
     * @param {VehicleContext } ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     */
    public async queryWithQueryString(ctx: VehicleContext, queryString: string, collection: string) {

        console.info('query String');
        console.info(JSON.stringify(queryString));

        let resultsIterator: import('fabric-shim').Iterators.StateQueryIterator;
        if (collection === '') {
            resultsIterator = await ctx.stub.getQueryResult(queryString);
        } else {
            // workaround for tracked issue: https://jira.hyperledger.org/browse/FAB-14216
            const result: any = await ctx.stub.getPrivateDataQueryResult(collection, queryString);
            resultsIterator = result.iterator;
        }

        console.log(typeof resultsIterator);

        const allResults = [];

        while (true) {
            const res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                const jsonRes = new QueryResponse();

                console.info(res.value.value.toString('utf8'));

                jsonRes.key = res.value.key;

                try {
                    jsonRes.record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.info(err);
                    jsonRes.record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.info('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.info(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }

    }

}
