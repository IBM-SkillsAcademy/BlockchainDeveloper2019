'use strict';

const {Contract , FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
let eventEmitter = require('events');
let event = new eventEmitter();

const utils = require('../utils');

// Create a file system-based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

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
    // Create a new gateway for connecting to the peer node
    await gateway.connect(ccp, connectionOptions);
    return gateway;
  } catch (error) {
    throw error;
  }
}




async function getContract (gateway) {
  try {
   let network = await gateway.getNetwork('mychannel');
   
   // Adding Block Listener to listen to new Blocks
   
   const blockListener = await network.addBlockListener('my-block-listener', (err, block) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Block Added-----------------: ${JSON.stringify(block)}`);
});

    // Get the contract from the network.
    console.log("get Contract called")
    return await network.getContract('vehicle-manufacture');
  
  } catch (err) {
    throw new Error('Error connecting to channel . ERROR:' + err.message);
  }
}
/**
 *  Exercise 7 > part 3
 * This function gets vehicles with a specific ID
 * or all vehicles if ID is not provided
 * @param {Object} req: Express request object
 * @param {Object} res: Express response object
 * @param {function} next: Express next middleware function
 */
exports.getVehicle = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Evaluate the specified transaction.
    let result, rawResult;

    if (req.query.id) {
      /**
       * This function queries vehicles with a specific ID
       * @property {function} evaluateTransaction gets vehicle with ID
       */
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
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.changeOwner = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Submit the specified transaction.
    // changeVehicleOwner transaction - requires 2 args , ex: ('changeVehicleOwner', 'vehicle4', 'Dave')
    const response = await contract.submitTransaction(
      'changeVehicleOwner',
      req.body.vehicleID,
      req.body.owner);
      

    // Disconnect from the gateway.
    // await gateway.disconnect();
  
    return res.send({
      message: `Vehicle with ID ${req.body.vehicleID} ownership has been changed to ${req.body.owner}`,
      response: response
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

exports.deleteVehicle = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

    // Submit the specified transaction.
    // deleteVehicle transaction - requires 1 args , ex: ('deleteVehicle', 'vehicle13:Accord')
    const response = await contract.submitTransaction(
      'deleteVehicle',
      req.body.vehicleID);

    // Disconnect from the gateway.
    await gateway.disconnect();

    return res.send({
      message: `Vehicle with ID ${req.body.vehicleID} has been deleted}`,
      response: response
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

exports.updatePrice = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
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

exports.issuePolicy = async (req, res, next) => {
  try {
    await checkAuthorization(req, res);
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);
    //add Contract Listener
  
   const listener = await contract.addContractListener('my-contract-listener', 'POLICY_ISSUED', (err, event, blockNumber, transactionId, status) => {
  if (err) {
      console.error(err);
      return;
  }
  
  console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
})

    // Submit the specified transaction.
    // issuePolicy transaction - requires 2 argument, ex: ('issuePolicy', 'policy1')
   await contract.submitTransaction(
      'issuePolicy',
      req.body.id);

    // Disconnect from the gateway.
  //  await gateway.disconnect();

    return res.send({
      message: `Policy with ID ${req.body.id} has been issued`,
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
