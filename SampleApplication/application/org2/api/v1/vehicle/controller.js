'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const utils = require('../utils');

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.getVehicle = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    let result, rawResult;

    if (req.query.id) {
    // if vehicle id specified queryVehicle transaction - requires 1 argument, ex: ('queryVehicle', 'vehicle4')
      result = await contract.evaluateTransaction('queryVehicle', req.query.id);
      rawResult = result.toString();
    } else {
      // queryAllVehicles transaction - requires no arguments, ex: ('queryAllVehicless')
      result = await contract.evaluateTransaction('queryAllVehicles');
      rawResult = result.toString();
    }
    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.changeOwner = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Submit the specified transaction.
    // changeVehicleOwner transaction - requires 2 args , ex: ('changeVehicleOwner', 'vehicle4', 'Dave')
    await contract.submitTransaction(
      'changeVehicleOwner',
      req.body.vehicleID,
      req.body.owner);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Vehicle with ID ${req.body.vehicleID} ownership has been changed to ${req.body.owner}`
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Submit the specified transaction.
    // deleteVehicle transaction - requires 1 args , ex: ('changeVehicleOwner', 'vehicle4')
    await contract.submitTransaction(
      'deleteVehicle',
      req.body.vehicleID);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Vehicle with ID ${req.body.vehicleID} has been deleted}`
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPrice = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getPriceDetails', req.query.id);
    const rawResult = result.toString();

    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPolicy = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    let result, rawResult;

    if (req.query.id) {
    // if policy id specified getPolicy transaction - requires 1 argument, ex: ('getPolicy', 'policy123')
      result = await contract.evaluateTransaction('getPolicy', req.query.id);
      rawResult = result.toString();
    } else {
    throw new Error('Not Policy found');
    }
    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getPolicies = async (req, res, next) => {
  try {
    const enrollmentID = req.headers['enrollment-id'];

    // get connection profile
    const ccp = await utils.getCCP();

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
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    let result, rawResult;

      // getPolicies transaction - requires no arguments, ex: ('getPolicies')
      result = await contract.evaluateTransaction('getPolicies');
      rawResult = result.toString();
    
    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

