import { Context, Contract } from 'fabric-contract-api';
import { Vehicle } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { VehicleContext } from "../utils/vehicleContext";
import { Order, OrderStatus } from '../assets/order';
import { PolicyType, Policy } from '../assets/policy';

export class VehicleContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.vehiclelifecycle.vehicle');
    }

    public createContext() {
        return new VehicleContext();
    }

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const vehicles: Vehicle[] = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
                orderId: '1'
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
                orderId: '2'
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
                orderId: '3'
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
                orderId: '4'
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
                orderId: '5'
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
                orderId: '5'
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
                orderId: '6'
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
                orderId: '7'
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
                orderId: '8'
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
                orderId: '9'

            },
        ];

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.stub.putState('vehicle' + i, Buffer.from(JSON.stringify(vehicles[i])));
            console.info('Added <--> ', vehicles[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryVehicle(ctx: Context, vehicleNumber: string): Promise<string> {
        const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
        if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }
        console.log(vehicleAsBytes.toString());
        return vehicleAsBytes.toString();
    }

    public async createVehicle(ctx: Context, vehicleNumber: string, make: string, model: string, color: string, owner: string, orderId: string) {
        console.info('============= START : Create vehicle ===========');
        await this.checkIfManufacturer(ctx, 'create vehicle'); // check if role === 'Manufacturer'

        const vehicle: Vehicle = {
            color,
            docType: 'vehicle',
            make,
            model,
            owner,
            orderId
        };

        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : Create vehicle ===========');
    }
    // Regulaor retrieve all vehciles in system with details 
    public async queryAllVehicles(ctx: Context): Promise<string> {
        const startKey = 'vehicle0';
        const endKey = 'vehicle999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    // regulator can update vehicle owner
    public async changeVehicleOwner(ctx: Context, vehicleNumber: string, newOwner: string) {
        console.info('============= START : Change Vehicle Owner ===========');
        
        await this.checkIfRegulatorOrInsurer(ctx, 'Change Vehicle Owner'); // check if role === 'Regulator' / 'Insurer'

        const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
        if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }
        const vehicle: Vehicle = JSON.parse(vehicleAsBytes.toString());
        vehicle.owner = newOwner;

        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : changevehicleOwner ===========');
    }

    // regulator can delete vehicle after lifecycle ended
    public async deleteVehicle(ctx: Context, vehicleNumber: string) {
        console.info('============= START : delete vehicle ===========');
        await this.checkIfRegulatorOrInsurer(ctx, 'Change Vehicle Owner'); // check if role === 'Regulator' / 'Insurer'
        await ctx.stub.deleteState(vehicleNumber);
        console.info('============= END : delete vehicle ===========');
    }

    // end user palce order function 
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,

        make: string, model: string, color: string
    ) {
        console.info('============= START : place order ===========');

        await this.checkIfManufacturer(ctx, 'place order'); // check if role === 'Manufacturer'

        const vehicleDetails: Vehicle = {
            color,
            docType: 'vehicle',
            make,
            model,
            owner,
            orderId,
        };
        const order = Order.createInstance(orderId, owner, OrderStatus.ISSUED, vehicleDetails);
        await ctx.getOrderList().add(order)
    
        // Fire Event 
        ctx.stub.setEvent("ORDER_EVENT",order.toBuffer())

        console.info('============= END : place order ===========');
    }

    // Update order status to be in progress
    public async updateOrderStatusInProgress(ctx: VehicleContext, orderId: string) {
        await this.checkIfManufacturer(ctx, 'update order status in-progress'); // check if role === 'Manufacturer'
        const order = await ctx.getOrderList().getOrder(orderId);
        order.orderStatus = OrderStatus.INPROGRESS;
        await ctx.getOrderList().updateOrder(order);
    }

    public async getOrder(ctx: VehicleContext, orderId: string) {
        return await ctx.getOrderList().getOrder(orderId);
    }

    // Update order status to be pending if vehicle creation process has an issue
    public async updateOrderStatusPending(ctx: VehicleContext, orderId: string) {
        await this.checkIfManufacturer(ctx, 'update order status pending'); // check if role === 'Manufacturer'
        const order = await ctx.getOrderList().getOrder(orderId);
        order.orderStatus = OrderStatus.PENDING;
        await ctx.getOrderList().updateOrder(order);
    }

    // When Order completed and will be ready to be delivered , update order status and create new Vehicle as an asset 
    public async updateOrderDelivered(ctx: VehicleContext, orderId: string, vehicleNumber: string) {
        await this.checkIfManufacturer(ctx, 'update order status delivered'); // check if role === 'Manufacturer'
        const order = await ctx.getOrderList().getOrder(orderId);
        order.orderStatus = OrderStatus.DELIVERED;
        await ctx.getOrderList().updateOrder(order);

        // Create Vehicle as an asset 
        const vehicle = order.vehicleDetails;
        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));

    }

    // Request Policy , user request the insurance policy 
    public async RequestPolicy(ctx: VehicleContext, id: string,
        vin: string, insurerId: string, holderId: string, policyType: PolicyType,
        startDate: number, endDate: number) {
        console.info('============= START : request insurance policy ===========');
        
        await this.checkIfManufacturer(ctx, 'request insurance policy'); // check if role === 'Manufacturer'
        

        const data = await ctx.stub.getState(vin);

        if (data.length === 0) {
            throw new Error(`Cannot get Vehicle . No vehicle exists for VIN:  ${vin} `);
        }
        const policy = Policy.createInstance(id, vin, insurerId, holderId, policyType, startDate, endDate);
        await ctx.getPolicyList().add(policy)

        ctx.stub.setEvent('CREATE_POLICY', policy.toBuffer());
        console.info('============= END : request insurance policy ===========');
    }

    // get Policy with an ID
    public async getPolicy(ctx: VehicleContext, policyId: string) {
        return await ctx.getPolicyList().get(policyId);
    }

    // manufacture can add or change vehicle price details
    public async updatePriceDetails(ctx: VehicleContext, vehicleNumber: string, price: string) {
        console.info('============= START : Update Price Details ===========');

        await this.checkIfManufacturer(ctx, 'update price details'); // check if role === 'Manufacturer'

        // check if vehicle exist
        const vehicleAsBytes = await ctx.stub.getState(vehicleNumber);
        if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }

        await ctx.stub.putPrivateData('collectionVehiclePriceDetails', vehicleNumber, Buffer.from(price));
        console.info('============= END : Update Price Details ===========');
    }

    // manufacture can get vehicle price details
    public async getPriceDetails(ctx: VehicleContext, vehicleNumber: string, price: string) {
        console.info('============= START : Get Price Details ===========');

        await this.checkIfManufacturerOrRegulator(ctx, 'get price details'); // check if role === 'Manufacturer' / 'Regulator'
        const priceAsBytes = await ctx.stub.getPrivateData('collectionVehiclePriceDetails', vehicleNumber);
        if (!priceAsBytes || priceAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }

        console.log(priceAsBytes.toString());
        console.info('============= END : Get Price Details ===========');
        return priceAsBytes.toString();
    }

    // Query Functions 

    // Return All Policies 
    public async getPolicies(ctx: VehicleContext): Promise<Policy[]> {
        return await ctx.getPolicyList().getAll();
    }

    // Return All order
    public async getOrders(ctx: VehicleContext): Promise<Order[]> {
        console.info('============= START : Get Orders ===========');
        await this.checkIfManufacturerOrRegulator(ctx, 'get orders'); // check if role === 'Manufacturer' / 'Regulator'
        console.info('============= END : Get Orders ===========');
        return await ctx.getOrderList().getAll();
    }

    // Return All order with Specific Status 
    public async getOrdersByStatus(ctx: VehicleContext, orderStatus: OrderStatus): Promise<Order[]> {
        console.info('============= START : Get Orders by Status ===========');
        await this.checkIfManufacturerOrRegulator(ctx, 'get price details'); // check if role === 'Manufacturer' / 'Regulator'
        const orders = await ctx.getOrderList().getAll();
        console.info('============= END : Get Orders by Status ===========');
        return orders.filter((order) => {
            return order.isOrderStatus(orderStatus);
        });

    }

    // Check if Manufacturer identity
    async checkIfManufacturer(ctx: Context, trxName: String) {
        let clientId = ctx.clientIdentity;
        if(!clientId.assertAttributeValue('role', 'Manufacturer')){
            throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit the '${trxName}' transaction`);
        }else{
            return true;
        }
    }

    // Check if Regulator identity
    async checkIfRegulator(ctx: Context, trxName: String) {
        let clientId = ctx.clientIdentity;
        if(!clientId.assertAttributeValue('role', 'Regulator')){
            throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit the '${trxName}' transaction`);
        }else{
            return true;
        }
    }

    // Check if Insurer identity
    async checkIfInsurer(ctx: Context, trxName: String) {
        let clientId = ctx.clientIdentity;
        if(!clientId.assertAttributeValue('role', 'Insurer')){
            throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit the '${trxName}' transaction`);
        }else{
            return true;
        }
    }

    // Check if Manufacturer / Regulator identity
    async checkIfManufacturerOrRegulator(ctx: Context, trxName: String) {
        let clientId = ctx.clientIdentity;
        if(!clientId.assertAttributeValue('role', 'Manufacturer') || !clientId.assertAttributeValue('role', 'Regulator')){
            throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit the '${trxName}' transaction`);
        }else{
            return true;
        }
    }

    // Check if Regulator / Insurer identity
    async checkIfRegulatorOrInsurer(ctx: Context, trxName: String) {
        let clientId = ctx.clientIdentity;
        // if(!clientId.assertAttributeValue('role', 'Regulator') || !clientId.assertAttributeValue('role', 'Insurer')){
        if(!clientId.assertAttributeValue('role', 'Regulator') || clientId.assertAttributeValue('role', 'Manufacturer')){
            throw new Error(`${clientId.getAttributeValue('role')} is not allowed to submit the '${trxName}' transaction`);
        }else{
            return true;
        }
    }
}
