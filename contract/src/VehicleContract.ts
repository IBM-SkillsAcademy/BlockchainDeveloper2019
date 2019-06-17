import { Context, Contract } from 'fabric-contract-api';
import { Vehicle } from './vehicle';
import { OrderList } from './orderList';
import {  VehicleContext } from "./utils/vehicleContext";
import { Order, OrderStatus } from './order';

export class VehicleContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.vehiclelifecycle.vehicle');
    }

    createContext() {
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
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
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

    public async createVehicle(ctx: Context, vehicleNumber: string, make: string, model: string, color: string, owner: string) {
        console.info('============= START : Create vehicle ===========');

        const vehicle: Vehicle = {
            color,
            docType: 'vehicle',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : Create vehicle ===========');
    }

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

    public async changeVehicleOwner(ctx: Context, vehicleNumber: string, newOwner: string) {
        console.info('============= START : changevehicleOwner ===========');

        const vehicleAsBytes = await ctx.stub.getState(vehicleNumber); // get the vehicle from chaincode state
        if (!vehicleAsBytes || vehicleAsBytes.length === 0) {
            throw new Error(`${vehicleNumber} does not exist`);
        }
        const vehicle: Vehicle = JSON.parse(vehicleAsBytes.toString());
        vehicle.owner = newOwner;

        await ctx.stub.putState(vehicleNumber, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : changevehicleOwner ===========');
    }

    public async deleteVehicle(ctx: Context, vehicleNumber: string) {
        console.info('============= START : delete vehicle ===========');

        await ctx.stub.deleteState(vehicleNumber);

        console.info('============= END : delete vehicle ===========');
    }


    public async placeorder(ctx: VehicleContext, orderId: string, owner : string ,
        
         make: string, model: string, color: string
        )
    {

        const vehicleDetails: Vehicle = {
            color,
            docType: 'vehicle',
            make,
            model,
            owner,
        };
        const order = Order.createInstance( orderId, owner, OrderStatus.ISSUED,vehicleDetails);
        console.info("After creatig order instance "+order);
        await ctx.getOrderList().add(order)
    

    }
    public async updateOrderStatusInProgress(ctx :VehicleContext, orderId:string )
    {
      
        const order =await ctx.getOrderList().getOrder(orderId);
        order.orderStatus=OrderStatus.INPROGRESS;
        await ctx.getOrderList().updateOrder(order);
    }
    public async getOrder(ctx :VehicleContext, orderId:string)
     {
     return await ctx.getOrderList().getOrder(orderId)   
      }

}
