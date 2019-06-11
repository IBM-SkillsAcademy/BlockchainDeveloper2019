'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'gateway', 'basicConnection.json'); // TODO: make it modular
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.createVehicle = async (req, res) => {
  try {
    const enrollmentID = req.headers['id'];

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(enrollmentID);
    if (!userExists) {
      return res.status(401).send({
        message: `An identity for the user ${enrollmentID} does not exist in the wallet`
      });
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: enrollmentID, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('SampleApplicationBlockchain');

    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createVehicle', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    await contract.submitTransaction(
      'createVehicle',
      req.body.carID,
      req.body.manufacturer,
      req.body.model,
      req.body.color,
      req.body.owner);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Vehicle with ID ${req.body.carID} has been created`,
      details: req.body
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.message);
  }
};

exports.getAllVehicles = async (req, res) => {
  try {
    const enrollmentID = req.headers['id'];

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(enrollmentID);
    if (!userExists) {
      return res.status(401).send({
        message: `An identity for the user ${enrollmentID} does not exist in the wallet`
      });
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: enrollmentID, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('SampleApplicationBlockchain');

    // Evaluate the specified transaction.
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryAllVehicles');
    const rawResult = result.toString();
    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode).send(err.message);
  }
};
