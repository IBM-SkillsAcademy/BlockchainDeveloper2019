'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const utils = require('../utils');

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.placeOrder = async (req, res, next) => {
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
    // placeOrder transaction - requires 5 argument, ex: ('placeOrder', 'order12', 'Tom' ', Honda', 'Accord', 'Black')
    await contract.submitTransaction(
      'placeOrder',
      req.body.orderID,
      req.body.owner,
      req.body.manufacturer,
      req.body.model,
      req.body.color);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Order with ID ${req.body.orderID} has been created`,
      details: req.body
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
      rawResult = JSON.parse(result);
    } else if (req.query.id) {
      result = await contract.evaluateTransaction('getOrder', req.query.id);
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

exports.updateOrder = async (req, res, next) => {
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

    switch (req.body.status) {
      case 'PENDING':
        await contract.submitTransaction('updateOrderStatusPending', req.body.orderID);
        break;
      case 'INPROGRESS':
        await contract.submitTransaction('updateOrderStatusInProgress', req.body.orderID);
        break;
      case 'DELIVERED':
        await contract.submitTransaction('updateOrderDelivered', req.body.orderID);
        break;
      default:
        return res.status(400).send({
          message: `Status invalid: ${req.body.status}. Should be PENDING, INPROGRESS, or DELIVERED`
        });
    }
    return res.send({
      message: `Order with number ${req.body.orderID} has been updated`,
      details: req.body
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createVehicle = async (req, res, next) => {
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
    // createVehicle transaction - requires 5 argument, ex: ('createVehicle', 'Vehicle12', 'Honda', 'Accord', 'Black', 'Tom')
    await contract.submitTransaction(
      'createVehicle',
      req.body.orderID,
      req.body.manufacturer,
      req.body.model,
      req.body.color,
      req.body.owner);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Vehicle with ID ${req.body.orderID}:${req.body.model} has been created`,
      details: req.body
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
    let result;
    if (req.query.id) {
    // if vehicle id specified queryVehicle transaction - requires 1 argument, ex: ('queryVehicle', 'vehicle4')
      result = await contract.evaluateTransaction('queryVehicle', req.query.id);
    } else {
      // queryAllVehicles transaction - requires no arguments, ex: ('queryAllVehicless')
      result = await contract.evaluateTransaction('queryAllVehicles');
    }
    const rawResult = result.toString();
    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    res.status(500);
    res.send('Error handling transaction.' + err);
    //console.log(err);
    //next(err);
  }
};

exports.updatePrice = async (req, res, next) => {
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
    // createVehicle transaction - requires 5 argument, ex: ('createVehicle', 'Vehicle12', 'Honda', 'Accord', 'Black', 'Tom')
    await contract.submitTransaction(
      'updatePriceDetails',
      req.body.vehicleID,
      req.body.price
    );

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `The price for vehicle with ID ${req.body.vehicleID} has been updated`,
      details: req.body
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

exports.getPriceByRange = async (req, res, next) => {
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
    const result = await contract.evaluateTransaction('getPriceByRange', req.query.min, req.query.max);
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

exports.requestPolicy = async (req, res, next) => {
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
    // requestPolicy transaction - requires 8 argument, ex: ('requestPolicy', 'policy1', 'insurer12', 'holder12', 'THIRD_PARTY', 12122019 , 31122020)
    await contract.submitTransaction(
      'requestPolicy',
      req.body.id,
      req.body.vehicleNumber,
      req.body.insurerId,
      req.body.holderId,
      req.body.policyType,
      req.body.startDate,
      req.body.endDate);

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Policy with ID ${req.body.id} has been requested`,
      details: req.body
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.requestVIN = async (req, res, next) => {
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
    // requestVIN transaction - requires 8 argument, ex: ('requestVIN', 'vehicle13:Accord')
    await contract.submitTransaction(
      'requestVehicleVIN',
      req.body.vehicleID
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

exports.getHistoryForVehicle = async (req, res, next) => {
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
    const result = await contract.evaluateTransaction('getHistoryForVehicle', req.query.id);
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

exports.getHistoryForOrder = async (req, res, next) => {
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
    const result = await contract.evaluateTransaction('getHistoryForOrder', req.query.id);
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

exports.getOrdersByStatusPaginated = async (req, res, next) => {
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
    if(!req.query.bookmark) {
      req.query.bookmark = "";
    }
    const result = await contract.evaluateTransaction('getOrdersByStatusPaginated', req.query.orderStatus , req.query.pageSize , req.query.bookmark);

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

