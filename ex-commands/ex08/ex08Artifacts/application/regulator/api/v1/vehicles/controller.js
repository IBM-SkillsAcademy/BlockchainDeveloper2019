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
    console.log(err);
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    const msg = err.message;
    const msgString = msg.slice(msg.indexOf('Errors:') + 8, msg.length);
    const json = JSON.parse(msgString);
    res.status(500);
    res.send(json);
  }
};

exports.changeOwner = async (req, res, next) => {
  try {
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);

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
    await checkAuthorization(req, res)
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
    await checkAuthorization(req, res)
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
    await checkAuthorization(req, res)
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

exports.issueVIN = async (req, res, next) => {
  try {
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);


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
      message: `VIN for vehicle with ID ${req.body.vehicleID} has been issued`,
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

exports.countVehicle = async (req, res, next) => {

  try {
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const contract = await getContract(gateway);
    const result = await contract.evaluateTransaction('getVehicleCount');

    await gateway.disconnect();
    return res.send({
      message: `Vehicles Count : ${result}`

    });

  }
  catch (err) {
    res.status(500);
    if (err.endorsements) {
      res.send(err.endorsements);
    } else {
      res.send(err.message);
    }
  }
};


async function checkAuthorization(req, res) {
  try {
    const enrollmentID = req.headers['enrollment-id'];
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(enrollmentID);
    console.log("User Exists " + userExists)
    if (!userExists) {
      return res.status(401).send({
        message: `An identity for the user ${enrollmentID} does not exist in the wallet`
      });
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
async function setupGateway(user) {
  try {
    const ccp = await utils.getCCP();
    const gateway = new Gateway();
    const connectionOptions = {
      identity: user,
      wallet: wallet,
    };
    // Create a new gateway for connecting to our peer node
    await gateway.connect(ccp, connectionOptions);
    return gateway;
  } catch (error) {
    throw error;
  }
}

async function getContract(gateway) {
  try {
    const network = await gateway.getNetwork("mychannel");
    // Get the contract from the network.
    return await network.getContract("vehicle-manufacture");
  } catch (err) {
    throw new Error('Error connecting to channel . ERROR:' + err.message);
  }
}

//network query functions 

exports.getChannelHeight = async (req,res ,next) =>{
  try{
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
   /* 
    const network = await gateway.getNetwork("mychannel");
    const   channel = network.getChannel();
    //get Blockchain info 
    let channelHeight =  await channel.queryInfo(null, false);
    */
    let prevHash = JSON.stringify(channelHeight.previousBlockHash);
    let currentHash = JSON.stringify(channelHeight.currentBlockHash);
      let prevHashStr = prevHash.toString();
   
 
   
     return    res.send({
      message: ` Details listed`,
      details:`Blockchain Info :Height : ${channelHeight.height}   currentBlockHash : ${currentHash.toString()} 
      previousBlockHash : ${prevHashStr}`
  
    });
    
  
}catch(err) {
  throw new Error (err);
}

}

exports.queryBlock = async (req,res ,next) =>{
  try{
    await checkAuthorization(req, res)
    const gateway = await setupGateway(req.headers['enrollment-id']);
    const network = await gateway.getNetwork("mychannel");
    const   channel = network.getChannel();
    console.log(parseInt(req.query.blockNumber));
    /*
     let block = await channel.queryBlock(parseInt(req.query.blockNumber));
     */
  return    res.send({
      message: `Block Details listed`,
      details: `Block Info : ${ block.header.number}   Number of Transactions :  ${block.data.data.length}
      ID of the transaction in the block  ${block.data.data[0].payload.header.channel_header.tx_id}`
    });
 
     
 
  
}catch(err) {
  throw new Error (err);
}

}




