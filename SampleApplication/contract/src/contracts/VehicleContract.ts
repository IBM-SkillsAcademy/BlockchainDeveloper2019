import { Context, Contract } from 'fabric-contract-api';
import { Vehicle, VinStatus } from '../assets/vehicle';
import { OrderList } from '../lists/orderList';
import { VehicleContext } from "../utils/vehicleContext";
import { Order, OrderStatus } from '../assets/order';
import { PolicyType, Policy } from '../assets/policy';
import { VehicleDetails } from '../utils/vehicleDetails';

export class VehicleContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.vehiclelifecycle.vehicle');
    }

    public createContext() {
        return new VehicleContext();
    }

    public async initLedger(ctx: VehicleContext) {
        console.info('============= START : Initialize Ledger ===========');
         let vehicles :  Array <Vehicle> = new Array<Vehicle>();
         vehicles[0] = Vehicle.createInstance("CD58911","4567788","Tomoko","Prius","Toyota","blue");
         vehicles[1] = Vehicle.createInstance("CD57271","1230819","Jin soon","Tucson","Hyundai","green");
         vehicles[2] = Vehicle.createInstance("CD57291","3456777","Max","Passat","Volklswagen","red");
       

        for (let i = 0; i < vehicles.length; i++) {
            vehicles[i].docType = 'vehicle';
            await ctx.getVehicleList().add(vehicles[i]);
            console.info('Added <--> ', vehicles[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryVehicle(ctx: VehicleContext, vehicleNumber: string): Promise<Vehicle> {
        
      return await ctx.getVehicleList().get(vehicleNumber);
    }

    public async createVehicle(ctx: VehicleContext, orderId: string, make: string, model: string, color: string, owner: string ) {
        console.info('============= START : Create vehicle ===========');
        await this.checkIfManufacturer(ctx, 'create vehicle'); // check if role === 'Manufacturer'


        const vehicle :Vehicle =Vehicle.createInstance("",orderId,owner,model,make,color) 

        await ctx.getVehicleList().add(vehicle);

        console.info('============= END : Create vehicle ===========');
    }

     public async issueVehicleVIN(ctx:VehicleContext ,vehicleNumber :string,vin:string)   
      { 
        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        vehicle.vin = vin;
        vehicle.vinStatus=VinStatus.ISSUED;
        await ctx.getVehicleList().updateVehicle(vehicle);
       
         
       }  
       
       public async requestVehicleVIN(ctx:VehicleContext ,vehicleNumber :string)   
       { 
         const vehicle = await ctx.getVehicleList().get(vehicleNumber);
         vehicle.vinStatus = VinStatus.REQUESTED;
         await ctx.getVehicleList().updateVehicle(vehicle);
        
          
        }  

    // Regulaor retrieve all vehciles in system with details 
    public async queryAllVehicles(ctx: VehicleContext): Promise<Vehicle[]> {
        return await ctx.getVehicleList().getAll();
        
    }

    // regulator can update vehicle owner
    public async changeVehicleOwner(ctx: VehicleContext, vehicleNumber: string, newOwner: string) {
        console.info('============= START : Change Vehicle Owner ===========');
        
       await this.checkIfRegulatorOrInsurer(ctx, 'Change Vehicle Owner'); // check if role === 'Regulator' / 'Insurer'
        const vehicle = await ctx.getVehicleList().get(vehicleNumber);
        vehicle.owner = newOwner
        await ctx.getVehicleList().updateVehicle(vehicle);
       
        console.info('============= END : changevehicleOwner ===========');
    }

    // regulator can delete vehicle after lifecycle ended
    public async deleteVehicle(ctx: VehicleContext, vehicleNumber: string) {
        console.info('============= START : delete vehicle ===========');
        await this.checkIfRegulatorOrInsurer(ctx, 'Change Vehicle Owner'); // check if role === 'Regulator' / 'Insurer'
        ctx.getVehicleList().delete(vehicleNumber);
        console.info('============= END : delete vehicle ===========');
    }

    // end user palce order function 
    public async placeOrder(ctx: VehicleContext, orderId: string, owner: string,

        make: string, model: string, color: string
    ) {
        console.info('============= START : place order ===========');

        await this.checkIfManufacturer(ctx, 'place order'); // check if role === 'Manufacturer'

        const vehicleDetails: VehicleDetails = {
            color,
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
    public async requestPolicy(ctx: VehicleContext, id: string,
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
    public async getPriceDetails(ctx: VehicleContext, vehicleNumber: string) {
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
