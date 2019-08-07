import * as chai from 'chai';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import * as mockery from 'mockery';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import { OrderList } from '../lists/orderList';
import { Order, OrderStatus } from '../assets/order';
import { VehicleList } from '../lists/vehicleList';
import { Vehicle } from '../assets/vehicle';

import { VehicleContext } from '../utils/vehicleContext';
import { VehicleContract } from './VehicleContract';
import { VehicleDetails } from '../utils/vehicleDetails';
import { StateList } from '../ledger-api/statelist';
import { State } from '../ledger-api/state';
chai.should();
chai.use(sinonChai);
const expect = chai.expect;

describe('#VehicleContract', () => {
    let sandbox: sinon.SinonSandbox;
    let contract: VehicleContract;
    let clientIdentity: sinon.SinonStubbedInstance<ClientIdentity>;

    let ctx: sinon.SinonStubbedInstance<VehicleContext>;
    let stub: sinon.SinonStubbedInstance<ChaincodeStub>;
    let orderList: sinon.SinonStubbedInstance<OrderList<Order>>;
    let vehicleList: sinon.SinonStubbedInstance<VehicleList<Vehicle>>;
    let stateList: sinon.SinonStubbedInstance<StateList<State>>;

    clientIdentity = sinon.createStubInstance(ClientIdentity);

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
        });
    });
    beforeEach(() => {
        cleanCache();
        sandbox = sinon.createSandbox();
        contract = new VehicleContract();
        ctx = sinon.createStubInstance(VehicleContext);
        stub = sinon.createStubInstance(ChaincodeStub);
        orderList = sinon.createStubInstance(OrderList);
        vehicleList = sinon.createStubInstance(VehicleList);
        stateList = sinon.createStubInstance(StateList);

        ctx.getVehicleList.returns(vehicleList);
        ctx.getOrderList.returns(orderList);

        (ctx as any).orderList = orderList;
        (ctx as any).vehicleList = vehicleList;
        (orderList as any).stateList = stateList;
        (ctx as any).stub = stub;
        (clientIdentity as any).role = 'client';

        (ctx as any).clientIdentity = clientIdentity;
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
    describe('placeOrder', () => {

        it('should be able to place order', async () => {
            const vehicleDetails: VehicleDetails = {
                color: 'Space Grey',
                make: 'Tesla',
                model: 'Model3',
                owner: 'Stark',
                orderId: 'Order909090',
            };
            const order = Order.createInstance('Order909090', 'Stark', OrderStatus.ISSUED, vehicleDetails);
            const returnedOrder = await contract.placeOrder(ctx as any, order.orderId, order.owner, order.vehicleDetails.make, order.vehicleDetails.model, order.vehicleDetails.color);
            console.log(returnedOrder);
            expect(returnedOrder.orderId).to.equal(vehicleDetails.orderId);
            // expect that order status equal to ISSUED
            expect(returnedOrder.orderStatus).to.equal('ISSUED');
            // expect that vehicle details saved equal to current vehicle details
            expect(returnedOrder.vehicleDetails).to.deep.equal(vehicleDetails);
            // assert that function raised event
            ctx.stub.setEvent.should.have.been.calledOnceWithExactly('ORDER_EVENT', order.toBuffer());

        });
    });

    // describe('Create Vehicle', () => {

    //     it('should be able to create Vehicle', async () => {
    //         const vehicleDetails: VehicleDetails = {
    //             color: 'Space Grey',
    //             make: 'Tesla',
    //             model: 'Model3',
    //             owner: 'Stark',
    //             orderId: 'Order123456',
    //         };
    //         const returnedVehicle = await contract.createVehicle(ctx as any, vehicleDetails.orderId, vehicleDetails.make, vehicleDetails.model, vehicleDetails.color, vehicleDetails.owner);
    //         console.log(returnedVehicle);
    //         expect(returnedVehicle.orderId).to.equal(vehicleDetails.orderId);
    //         // expect that order status equal to ISSUED
    //         expect(returnedVehicle.vin).to.equal('');
    //         // expect that vehicle details saved equal to current vehicle details
    //         expect(returnedVehicle.vinStatus).to.deep.equal('NO');
    //         // assert that function raised event

    //     });
    // });

//     describe('getOrders', () => {
//         it('should be able to get Order ', async () => {

//             const fakeOrder = sinon.createStubInstance(Order);

//         //    ctx.getOrderList().stateList.get.withArgs('Order1').resolves(fakeOrder);
//         //    ctx.getOrderList().stateList.exists.withArgs('Order1').resolves(true);
//            orderList.exists.withArgs('Order1').resolves(true);
//           // orderList.get.withArgs('Order1').resolves(fakeOrder);
//           stateList.get.withArgs('Order1').resolves(fakeOrder);
//            const result = await contract.getOrder(ctx as any, 'Order1');
//            console.log(result);

//         });

//     });

 });

function cleanCache() {
    delete require.cache[require.resolve('./VehicleContract.ts')];
}
