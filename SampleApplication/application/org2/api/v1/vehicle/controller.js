'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const utils = require('../utils');

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.getOrder = async (req, res, next) => {
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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    let result, rawResult;

    if (req.query.status) {
      result = await contract.evaluateTransaction('getOrdersByStatus', req.query.status);
      rawResult = result.toString();
    } else {
      result = await contract.evaluateTransaction('getOrders');
      rawResult = result.toString();
    }
    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

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
    const obj = JSON.parse(rawResult);
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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getPriceDetails', req.query.id);
    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('vehicle-manufacture');

    // Evaluate the specified transaction.
    let result;
    if (req.query.id) {
      result = await contract.submitTransaction('getPolicy', req.query.id);
    } else {
      result = await contract.evaluateTransaction('getPolicies');
    }
    const rawResult = result.toString();
    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.issueVIN = async (req, res, next) => {
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
    await gateway.connect(ccp, { wallet, identity: enrollmentID });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('vehicle-manufacture');

    // Submit the specified transaction.
    // issueVIN transaction - requires 8 argument, ex: ('issueVIN', 'vehicle13:Accord', 'G33KS')
    await contract.submitTransaction(
      'issueVehicleVIN',
      req.body.vehicleID,
      req.body.vin
    );

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `VIN for vehicle with ID ${req.body.vehicleID} has been requested`,
      details: req.body
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
