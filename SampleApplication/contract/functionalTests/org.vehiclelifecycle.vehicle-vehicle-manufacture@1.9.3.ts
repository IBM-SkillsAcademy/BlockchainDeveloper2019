/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/
import * as generate from 'nanoid/generate';
import * as assert from 'assert';
import * as fabricNetwork from 'fabric-network';
import { SmartContractUtil } from './ts-smart-contract-util';
import * as chai from 'chai';
import * as os from 'os';
import * as path from 'path';
const expect = chai.expect;

describe('org.vehiclelifecycle.vehicle-vehicle-manufacture@1.9.3' , () => {

    const homedir: string = os.homedir();
    const walletPath: string = path.join(homedir, '.fabric-vscode', 'local_fabric_wallet');
    const gateway: fabricNetwork.Gateway = new fabricNetwork.Gateway();
    const fabricWallet: fabricNetwork.FileSystemWallet = new fabricNetwork.FileSystemWallet(walletPath);
    const identityName: string = 'admin';
    let connectionProfile: any;

    // before running any test function get connection profile
    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
    });
    // before each function use gatway to create connection to vehicle-network on mychannel
    beforeEach(async () => {
        const discoveryAsLocalhost: boolean = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled: boolean = true;

        const options: fabricNetwork.GatewayOptions = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: identityName,
            wallet: fabricWallet,
        };

        await gateway.connect(connectionProfile, options);
    });
// after each test function disconnect from gatway
    afterEach(async () => {
        gateway.disconnect();
    });
    const orderId: string = `Order${generate('1234567890abcdef', 4)}`;
    const vehicleNumber = orderId + ':Accord';

    // Test place order function using below parameter

    it('placeOrder', async () => {
        const owner: string = 'John';
        const make: string = 'Toyota';
        const model: string = 'Accord';
        const color: string = 'Black';
        const args: string[] = [ orderId, owner, make, model, color];

        const response: any = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'placeOrder', args, gateway);
        const returnedOrder = JSON.parse(response.toString('utf8'));
        // assert that returned order id should be the same order id provided
        assert.equal(returnedOrder.orderId, orderId);
        // assert that returned class  should be the org.vehiclelifecycle.order
        assert.equal(returnedOrder.class, 'org.vehiclelifecycle.order');
        // assert that returned order status  should be ISSUED
        assert.equal(returnedOrder.orderStatus, '');
    }).timeout(10000);

    it('getOrders', async () => {

        const args: string[] = [];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getOrders', args, gateway);
        const jsonarray = JSON.parse(response.toString());

    }).timeout(10000);

    it('getOrdersByStatus', async () => {

        const orderStatus: string = 'ISSUED';
        const args: string[] = [ orderStatus];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getOrdersByStatus', args, gateway);
        console.log(JSON.parse(response.toString()));
    }).timeout(10000);

    it('getHistoryForOrder', async () => {

        const args: string[] = [ orderId];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getHistoryForOrder', args, gateway);
        console.log(JSON.parse(response.toString()));
    }).timeout(10000);

    it('getOrdersByStatusPaginated', async () => {

        const orderStatus: string = 'ISSUED';
        const pagesize: string = '2';
        const bookmark: string = '';
        const args: string[] = [ orderStatus, pagesize, bookmark];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getOrdersByStatusPaginated', args, gateway);
        console.log(JSON.parse(response.toString()));
    }).timeout(10000);

    it('getOrdersByRange', async () => {

        const startKey: string = '1';
        const endKey: string = '2';
        const args: string[] = [ startKey, endKey];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getOrdersByRange', args, gateway);
        console.log(JSON.parse(response.toString()));
    }).timeout(10000);
    it('createVehicle', async () => {
        const owner: string = 'John';
        const make: string = 'Toyota';
        const model: string = 'Accord';
        const color: string = 'Black';
        const args: string[] = [ orderId, make, model, color, owner];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'createVehicle', args, gateway);
        const returnedVehicle = JSON.parse(response.toString('utf8'));
        // assert vehicle order equal to submitted order
        assert.equal(returnedVehicle.orderId, orderId);
        // asset class of object created
        assert.equal(returnedVehicle.class, 'org.vehiclelifecycle.Vehicle');
        // assert color equal to black
        assert.equal(returnedVehicle.color, 'Black');
        // assert VIN is empty when vehicle created
        assert.equal(returnedVehicle.vin, '');
        // assert VIN status to have no value
        assert.equal(returnedVehicle.vinStatus, 'NOVALUE');

    }).timeout(10000);
    it('changeVehicleOwner', async () => {
        const newOwner: string = 'TestUser';
        const args: string[] = [ '1230819:Tucson', newOwner];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'changeVehicleOwner', args, gateway);
        const returnedVehicle = JSON.parse(response.toString('utf8'));
        assert.equal(returnedVehicle.owner, newOwner);

    }).timeout(10000);

    it('queryVehicle', async () => {

        const args: string[] = [ vehicleNumber];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'queryVehicle', args, gateway);
        const returnedVehicle = JSON.parse(response.toString('utf8'));
        // assert vehicle order equal to submitted order
         assert.equal(returnedVehicle.orderId, orderId);
         // assert color equal to black
         assert.equal(returnedVehicle.color, 'Black');
         // assert that owner changed by changeVehicleOwner test
         assert.equal(returnedVehicle.owner, 'TestUser');
    }).timeout(10000);
    it('requestVehicleVIN', async () => {

        const args: string[] = [ vehicleNumber];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'requestVehicleVIN', args, gateway);
    }).timeout(10000);

    it('issueVehicleVIN', async () => {

        const vin: string = 'VIN909878';
        const args: string[] = [ vehicleNumber, vin];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'issueVehicleVIN', args, gateway);

    }).timeout(10000);
    it('queryVehicle', async () => {

        const args: string[] = [ vehicleNumber];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'queryVehicle', args, gateway);
        const returnedVehicle = JSON.parse(response.toString('utf8'));
        // assert vehicle order equal to submitted order
         assert.equal(returnedVehicle.orderId, orderId);
         // assert VIN changed
         assert.equal(returnedVehicle.vin, 'VIN909878');
         // assert VIN STATUS
         assert.equal(returnedVehicle.vinStatus, 'ISSUED');
    }).timeout(10000);
    it('getVehicleCount', async () => {

        const args: string[] = [];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'getVehicleCount', args, gateway);

        assert(JSON.parse(response.toString()) > 1 , 'Vehicle count should be more than 1');

    }).timeout(10000);
    it('deleteVehicle', async () => {
        const args: string[] = [ vehicleNumber];

        const response: Buffer = await SmartContractUtil.submitTransaction('org.vehiclelifecycle.vehicle', 'deleteVehicle', args, gateway);

    }).timeout(10000);
});
