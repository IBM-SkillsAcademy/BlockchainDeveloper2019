'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const utils = require('../utils');

// Create a new file system-based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

exports.placeOrder = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Submit the specified transaction.
    // placeOrder transaction - requires 5 argument, ex: ('placeOrder', 'order12', 'Tom' ', Honda', 'Accord', 'Black')
    await contract.submitTransaction(
      'placeOrder',
      req.body.orderID,
      req.body.owner,
      req.body.manufacturer,
      req.body.model,
      req.body.color
    );

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `Order with ID ${req.body.orderID} has been created`,
      details: req.body
    });
  } catch (err) {
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};
/**
*** Exercise 7 part 2 ***
*This function creates a new vehicle from the application by using the Fabric SDK.
* @param {Object} req: Express request object
* @param {Object} res: Express response object
* @param {function} next: Express next middleware function
*/
exports.createVehicle = async (req, res, next) => {
  try {
    /**
    This function checks if the user is enrolled on the blockchain network and
    if the user is authorized to perform this transaction.
    * @param {Object} req: Express request object
    * @param {Object} res: Express response object
    */
    await checkAuthorization(req, res);
    /**
    *This function opens a gateway to the peer node with the user
    *enrolled and the wallets.
    *@param {String} enrollment-id user enrollment ID
    **/
    const gateway = await setupGateway(req.headers['enrollment-id']);
    /**
     * This function gets the contract on which the transaction is performed.
     * @param {Gateway} gateway: The opened gateway to peer node
     */
    const contract = await getContract(gateway);
    /**
     * This function submits the specified transaction
     * @property {function} submitTransaction to submit the specified transaction from the contract
     */

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
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.updatePrice = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // price object
    const price = {
      vehicleNumber: req.body.vehicleID,
      value: parseInt(req.body.value)
    };
    // private data sent as transient data
    const transientData = {
      price: Buffer.from(JSON.stringify(price))
    };
    // submit the transaction
    await contract.createTransaction('updatePriceDetails')
      .setTransient(transientData)
      .submit();

    // Disconnect from the gateway.
    await gateway.disconnect();
    return res.send({
      message: `The price for vehicle with ID ${req.body.vehicleID} has been updated`,
      details: req.body
    });
  } catch (err) {
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};

exports.getPrice = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getPriceDetails', req.query.id);
    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getPriceByRange = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getPriceByRange', req.query.min, req.query.max);
    const rawResult = result.toString();
    const json = JSON.parse(rawResult);
    const obj = JSON.parse(json);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getPolicy = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    let result;
    if (req.query.id) {
      result = await contract.evaluateTransaction('getPolicy', req.query.id);
    } else {
      result = await contract.evaluateTransaction('getPolicies');
    }
    const rawResult = result.toString();
    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.requestPolicy = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};

exports.requestVIN = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};

exports.getHistoryForVehicle = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getHistoryForVehicle', req.query.id);
    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getHistoryForOrder = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    const result = await contract.evaluateTransaction('getHistoryForOrder', req.query.id);
    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getOrdersByStatusPaginated = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    if (!req.query.bookmark) {
      req.query.bookmark = '';
    }
    const result = await contract.evaluateTransaction('getOrdersByStatusPaginated', req.query.orderStatus, req.query.pageSize, req.query.bookmark);

    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getOrdersByRange = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    const result = await contract.evaluateTransaction('getOrdersByRange', req.query.startKey, req.query.endKey);

    const rawResult = result.toString();

    const obj = JSON.parse(rawResult);
    return res.send({
      result: obj
    });
  } catch (err) {
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

async function checkAuthorization (req, res) {
  try {
    const enrollmentID = req.headers['enrollment-id'];
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(enrollmentID);
    console.log('User Exists ' + userExists);
    if (!userExists) {
      return res.status(401).send({
        message: `An identity for the user ${enrollmentID} does not exist in the wallet`
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function setupGateway (user) {
  try {
    const ccp = await utils.getCCP();
    const gateway = new Gateway();
    const connectionOptions = {
      identity: user,
      wallet: wallet
    };
    // Create a new gateway for connecting to the peer node.
    await gateway.connect(ccp, connectionOptions);
    return gateway;
  } catch (error) {
    throw error;
  }
}

async function getContract (gateway) {
  try {
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    return await network.getContract('vehicle-manufacture');
  } catch (err) {
    throw new Error('Error connecting to channel . ERROR:' + err.message);
  }
}
