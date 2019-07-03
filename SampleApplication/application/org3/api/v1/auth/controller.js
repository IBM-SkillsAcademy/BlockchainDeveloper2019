'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const path = require('path');
const utils = require('../utils');

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);

exports.enrollAdmin = async (req, res, next) => {
  try {
    // update ccp
    const ccp = await utils.getCCP();

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org3.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
      return res.status(409).send({
        message: 'An identity for the admin user "admin" already exists in the wallet'
      });
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity('Org3MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import('admin', identity);

    return res.send({
      message: 'Successfully enrolled admin user "admin" and imported it into the wallet'
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const enrollmentID = req.body.enrollmentID;

    // get connection profile
    const ccp = await utils.getCCP();

    // Check to see if we've already enrolled the user
    const userExists = await wallet.exists(enrollmentID);
    if (userExists) {
      return res.status(409).send({
        message: `An identity for the user ${enrollmentID} already exists in the wallet`
      });
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
      return res.status(401).send({
        message: `An identity for the admin user "admin" does not exist in the wallet. Please run admin enrollment before retrying`
      });
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
      affiliation: 'org3',
      enrollmentID: enrollmentID,
      role: 'client',
      attrs: [{
        name: 'role',
        value: 'Insurer',
        ecert: true
      }] }, adminIdentity);
    const enrollment = await ca.enroll({ enrollmentID: enrollmentID, enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity('Org3MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import(enrollmentID, userIdentity);
    return res.send({
      message: `Successfully registered and enrolled user ${enrollmentID} and imported it into the wallet`
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};