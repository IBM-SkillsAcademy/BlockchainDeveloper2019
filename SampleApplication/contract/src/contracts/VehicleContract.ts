// Fabric smart contract classes
import { Context, Contract } from 'fabric-contract-api';
// Vehicle Manufacure classes
import { Order, OrderStatus } from '../assets/order';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { VehicleContext } from '../utils/vehicleContext';
import { VehicleDetails } from '../utils/vehicleDetails';
import { newLogger } from 'fabric-shim';
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
        // Check if role === manufacturer
        // await this.hasRole(ctx, ['Manufacturer']);

        // Check if order exists in ledger
        // if (await ctx.getOrderList().exists(orderId)) {
            // Retrieve order asset from ledger
            // const order = await ctx.getOrderList().getOrder(orderId);
            // If order status is not equal to 'DELIVERED', throw error
            // if (order.orderStatus !== OrderStatus.DELIVERED) {
                // throw new Error(`Order  with ID : ${orderId} Should be with Status Delivered to be able to create Vehicle`);
            // }
            // Creates a new vehicle asset
            // const vehicle: Vehicle = Vehicle.createInstance('', orderId, owner, model, make, color);
            // Append vehicle asset to ledger
            // await ctx.getVehicleList().add(vehicle);
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
        // return await ctx.getVehicleList().get(vehicleNumber);
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

        // Check if role === regulator
        // await this.hasRole(ctx, ['Regulator']);

        // Return all vehicles asset from ledger
        // return await ctx.getVehicleList().getAll();
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
        // Check if role === regulator
        // await this.hasRole(ctx, ['Regulator']);

        // Check if the vehicle exists
        // if (!await ctx.getVehicleList().exists(vehicleNumber)) {
            // throw new Error(`vehicle with ID : ${vehicleNumber} doesn't exists`);
        // }
        // Delete vehicle asset from ledger
        // await ctx.getVehicleList().delete(vehicleNumber);
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
        // Check if role === manufacturer
        // await this.hasRole(ctx, ['Manufacturer']);

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
        // vehicle.vinStatus = VinStatus.REQUESTED;
        // Update state in ledger
        // await ctx.getVehicleList().updateVehicle(vehicle);

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
        // Check if role === regulator
        // await this.hasRole(ctx, ['Regulator']);

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
        // vehicle.vinStatus = VinStatus.ISSUED;
        // Update state in ledger
        // await ctx.getVehicleList().updateVehicle(vehicle);

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
        // Check if role === regulator
        // await this.hasRole(ctx, ['Regulator']);

        // Get vehicle by vehicle number
        // const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        // Change vehicle owner
        // vehicle.owner = newOwner;
        // Update state in ledger
        // await ctx.getVehicleList().updateVehicle(vehicle);
        // logger.info('============= END : changevehicleOwner ===========');
    // }

    // ############################################################### Order Functions #################################################
    // End user place order function
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,
        make: string, model: string, color: string,
    ) {
        logger.info('============= START : place order ===========');

        // check if role === manufacturer
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
        // check if role === manufacturer
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
        // check if role === manufacturer
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
        // check if role === manufacturer
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

        // check if role === manufacturer' / 'regulator'
        // await this.hasRole(ctx, ['Manufacturer', 'Regulator']);

        logger.info('============= END : Get Orders ===========');
        return await ctx.getOrderList().getAll();
    }

    // ############################################################### Policy Functions #################################################
    /**
     * *** Exercise 2 > Part 4 > Step 7 ***
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

        // check if role === manufacturer
        // await this.hasRole(ctx, ['Manufacturer']);

        // Check if vehicle exist
        // await ctx.getVehicleList().getVehicle(vehicleNumber);

        // Create new policy asset.
        // const policy = Policy.createInstance(id, vehicleNumber, insurerId, holderId, policyType, startDate, endDate);
        // Add policy asset to the ledger.
        // await ctx.getPolicyList().add(policy);

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        // logger.info('============= END : request insurance policy ===========');
    // }

    /**
     * *** Exercise 2 > Part 4 > Step 9 ***
     *
     * @param { ctx } the smart contract transaction context
     * @param { policyId } the insurance policy id
     */
    // public async getPolicy(ctx: VehicleContext, policyId: string) {
        // This transaction will query for a specific policy according to the supplied policy ID parameter.
        // return await ctx.getPolicyList().get(policyId);
    // }

    /**
     * *** Exercise 2 > Part 4 > Step 8 ***
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
        // Check if role === insurer
        // await this.hasRole(ctx, ['Insurer']);

        // Get policy by ID from policy list
        // const policy = await ctx.getPolicyList().get(id);

        // Set policy status to "ISSUED"
        // policy.status = PolicyStatus.ISSUED;

        // Update policy asset in the ledger
        // await ctx.getPolicyList().update(policy);

        /*
        Fire an event after the transaction is successfully committed to the ledger,
        applications that acts as event listeners can listen for this event trigger and respond accordingly.
        */
        // ctx.stub.setEvent('POLICY_ISSUED', policy.toBuffer());
    // }

    /**
     * *** Exercise 2 > Part 4 > Step 10 ***
     *
     * @param { ctx } the smart contract transaction context
     */
    // public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        // This transaction will return a list of all the available insurance policies in the ledger.
        // return await ctx.getPolicyList().getAll();
    // }

    // ############################################################### Utility Functions #################################################

    // Regulator Can get number of vehicles
    public async getVehicleCount(ctx: VehicleContext) {
        // await this.hasRole(ctx, ['Regulator']);

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
